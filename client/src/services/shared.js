import api from './api';

export const getSharedExpenses = async () => {
  const response = await api.get('/shared');
  return response.data;
};

export const createSharedExpense = async (sharedData) => {
  const response = await api.post('/shared', sharedData);
  return response.data;
};

export const updateSharedExpense = async (id, sharedData) => {
  const response = await api.put(`/shared/${id}`, sharedData);
  return response.data;
};

export const deleteSharedExpense = async (id) => {
  const response = await api.delete(`/shared/${id}`);
  return response.data;
};

export const settleExpense = async (id) => {
  const response = await api.post(`/shared/${id}/settle`);
  return response.data;
};
