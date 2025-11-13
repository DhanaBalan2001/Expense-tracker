import api from './api';

export const getRecurringExpenses = async () => {
  const response = await api.get('/recurring');
  return response.data;
};

export const scheduleRecurringExpense = async (recurringData) => {
  const response = await api.post('/recurring', recurringData);
  return response.data;
};

export const updateRecurring = async (id, recurringData) => {
  const response = await api.put(`/recurring/${id}`, recurringData);
  return response.data;
};

export const deleteRecurring = async (id) => {
  const response = await api.delete(`/recurring/${id}`);
  return response.data;
};
