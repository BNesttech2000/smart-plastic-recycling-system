// import api from './api';

// export const adminService = {
//   getDashboard: async (range = 'month') => {
//     try {
//       // Try the new admin endpoint first
//       const response = await api.get(`/admin/dashboard-stats?range=${range}`);
//       return response.data;
//     } catch (error) {
//       console.log('Falling back to statistics endpoint');
//       // Fall back to old endpoint
//       const response = await api.get(`/contributions/statistics?range=${range}`);
//       return response.data;
//     }
//   },

//   getUsers: async (page = 1, limit = 10) => {
//     const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
//     return response.data;
//   },

//   updateUserStatus: async (userId, isActive) => {
//     const response = await api.put(`/admin/users/${userId}`, { isActive });
//     return response.data;
//   },

//   updateUser: async (userId, userData) => {
//     const response = await api.put(`/admin/users/${userId}`, userData);
//     return response.data;
//   },

//   deleteUser: async (userId) => {
//     const response = await api.delete(`/admin/users/${userId}`);
//     return response.data;
//   },

//   getContributions: async (filters = {}) => {
//     const params = new URLSearchParams(filters).toString();
//     const response = await api.get(`/contributions?${params}`);
//     return response.data;
//   },

//   updateContributionStatus: async (id, status, rejectionReason = '') => {
//     const response = await api.put(`/contributions/${id}/status`, { status, rejectionReason });
//     return response.data;
//   },

//   getReports: async () => {
//     const response = await api.get('/reports');
//     return response.data;
//   },

//   generateReport: async (type, startDate, endDate) => {
//     const response = await api.post('/reports/generate', { type, startDate, endDate });
//     return response.data;
//   },
// };



import api from './api';

export const adminService = {
  getDashboard: async (range = 'month') => {
    try {
      // Try the new admin endpoint first
      const response = await api.get(`/admin/dashboard-stats?range=${range}`);
      return response.data;
    } catch (error) {
      console.log('Falling back to statistics endpoint');
      // Fall back to old endpoint
      const response = await api.get(`/contributions/statistics?range=${range}`);
      return response.data;
    }
  },

  getUsers: async (page = 1, limit = 10, search = '', status = '', tier = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (tier && tier !== 'all') params.append('tier', tier);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  // Add new user
  addUser: async (userData) => {
    const response = await api.post('/users/register', userData);
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

  // Export users to CSV
  exportUsersToCSV: async () => {
    const response = await api.get('/export/users/csv', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export users to Excel
  exportUsersToExcel: async () => {
    const response = await api.get('/export/users/excel', {
      responseType: 'blob'
    });
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