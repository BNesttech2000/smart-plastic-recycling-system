import api from './api';

export const userService = {
  getDashboard: async () => {
    const response = await api.get('/users/statistics');
    return response.data;
  },

  getContributions: async (page = 1, limit = 10) => {
    const response = await api.get(`/users/contributions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getIncentives: async () => {
    const response = await api.get('/users/incentives');
    return response.data;
  },

  createContribution: async (contributionData) => {
    const response = await api.post('/contributions', contributionData);
    return response.data;
  },

  // New function to upload images for a specific contribution
  uploadContributionImages: async (contributionId, formData) => {
    const response = await api.post(`/contributions/${contributionId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // You can use this to show upload progress if needed
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    return response.data;
  },

  // New function to delete a specific image
  deleteContributionImage: async (contributionId, imageId) => {
    const response = await api.delete(`/contributions/${contributionId}/images/${imageId}`);
    return response.data;
  },

  // New function to get contribution by ID with images
  getContributionById: async (contributionId) => {
    const response = await api.get(`/contributions/${contributionId}`);
    return response.data;
  },
};