import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getMonthlyExpenses,
  getFilteredExpenses,
  getBudgetOverview,
  getSpendingTrends,
  getCategoryInsights,
  getRecentActivity,
  getForecast,
  generateReport,
  setBudgetAlert,
  compareExpenses,
  trackSavingsGoal,
  setBillReminder,
  getUpcomingBills,
  markBillAsPaid
} from '../controllers/expense.js';

const router = express.Router();

router.use(protect);

router.get('/stats/summary', getExpenseStats);
router.get('/stats/monthly', getMonthlyExpenses);
router.get('/filter', getFilteredExpenses);
router.get('/budget-overview', getBudgetOverview);
router.get('/spending-trends', getSpendingTrends);
router.get('/category-insights', getCategoryInsights);
router.get('/recent-activity', getRecentActivity);
router.get('/forecast', getForecast);
router.get('/report', generateReport);
router.post('/budget-alert', setBudgetAlert);
router.get('/compare', compareExpenses);
router.post('/savings-goal', trackSavingsGoal);
router.post('/bills', setBillReminder);
router.get('/bills/upcoming', getUpcomingBills);
router.patch('/bills/:billId/paid', markBillAsPaid);



router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
