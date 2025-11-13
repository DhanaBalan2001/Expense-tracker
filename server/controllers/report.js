import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import Expense from '../models/Expense.js';
import { catchAsync, AppError } from '../middleware/error.js';

const generatePDFReport = async (data, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=expense-report.pdf');
  
  doc.pipe(res);
  doc.fontSize(20).text('Expense Report', { align: 'center' });
  
  data.forEach(item => {
    doc.fontSize(12).text(`${item.category}: $${item.total}`);
  });
  
  doc.end();
};

const generateExcelReport = async (data, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Expenses');
  
  worksheet.columns = [
    { header: 'Category', key: 'category' },
    { header: 'Amount', key: 'amount' },
    { header: 'Date', key: 'date' }
  ];
  
  data.forEach(item => {
    worksheet.addRow(item);
  });
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=expense-report.xlsx');
  
  await workbook.xlsx.write(res);
};

export const generateReport = catchAsync(async (req, res) => {
  const { format, startDate, endDate, categories } = req.query;
  
  const query = {
    userId: req.user._id,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };
  
  if (categories) {
    query.category = { $in: categories.split(',') };
  }
  
  const data = await Expense.find(query);
  
  if (format === 'pdf') {
    return generatePDFReport(data, res);
  }
  return generateExcelReport(data, res);
});
