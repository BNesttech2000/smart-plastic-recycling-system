import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/contributions/statistics');
    return response.data;
  },

  getUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}`, { isActive });
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getContributions: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/contributions?${params}`);
    return response.data;
  },

  updateContributionStatus: async (id, status, rejectionReason = '') => {
    const response = await api.put(`/contributions/${id}/status`, { status, rejectionReason });
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  generateReport: async (type, startDate, endDate) => {
    const response = await api.post('/reports/generate', { type, startDate, endDate });
    return response.data;
  },
};