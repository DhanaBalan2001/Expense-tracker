import api from './api';

export const generateReport = async (reportParams) => {
  const { startDate, endDate, categories, format } = reportParams;
  
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    categories: categories.join(','),
    format
  }).toString();
  
  // For file downloads, we need to handle it differently
  // We'll return the URL that the frontend can use to trigger a download
  return `${api.defaults.baseURL}/reports/generate?${queryParams}`;
};

export const compareExpenses = async (period1Start, period1End, period2Start, period2End) => {
  const response = await api.get('/expenses/compare', {
    params: {
      period1Start,
      period1End,
      period2Start,
      period2End
    }
  });
  return response.data;
};
