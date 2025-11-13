import api from './api';

export const getExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

export const getExpenseStats = async () => {
  const response = await api.get('/expenses/stats/summary');
  return response.data;
};

export const getMonthlyExpenses = async () => {
  const response = await api.get('/expenses/stats/monthly');
  return response.data;
};

export const getFilteredExpenses = async (filters) => {
  const response = await api.get('/expenses/filter', { params: filters });
  return response.data;
};

export const getBudgetOverview = async () => {
  const response = await api.get('/expenses/budget-overview');
  return response.data;
};

export const getSpendingTrends = async () => {
  const response = await api.get('/expenses/spending-trends');
  return response.data;
};

export const getCategoryInsights = async () => {
  const response = await api.get('/expenses/category-insights');
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get('/expenses/recent-activity');
  return response.data;
};

export const getForecast = async () => {
  const response = await api.get('/expenses/forecast');
  return response.data;
};

export const generateReport = async (reportParams) => {
  const response = await api.get('/expenses/generate-report', { params: reportParams });
  return response.data;
};

export const setBudgetAlert = async (alertData) => {
  const response = await api.post('/expenses/set-budget-alert', alertData);
  return response.data;
};

export const compareExpenses = async (comparisonParams) => {
  const response = await api.get('/expenses/compare', { params: comparisonParams });
  return response.data;
};

export const trackSavingsGoal = async (goalData) => {
  const response = await api.post('/expenses/track-savings-goal', goalData);
  return response.data;
};

export const setBillReminder = async (reminderData) => {
  const response = await api.post('/expenses/set-bill-reminder', reminderData);
  return response.data;
};

export const getUpcomingBills = async () => {
  const response = await api.get('/expenses/upcoming-bills');
  return response.data;
};

export const markBillAsPaid = async (billId) => {
  const response = await api.post(`/expenses/mark-bill-paid/${billId}`);
  return response.data;
};