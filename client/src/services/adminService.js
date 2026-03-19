import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/contributions/statistics');
    return response.data;
  },

  getUsers: async (page = 1, limit = 10) => {
    // This endpoint would need to be implemented in backend
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
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