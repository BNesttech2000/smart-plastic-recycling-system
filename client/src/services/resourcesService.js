import api from './api';

export const resourcesService = {
  // Get all educational resources
  getResources: async () => {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Get resource by type (article, video, infographic)
  getResourcesByType: async (type) => {
    try {
      const response = await api.get(`/resources?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resources by type:', error);
      throw error;
    }
  },

  // Get single resource by ID
  getResourceById: async (resourceId) => {
    try {
      const response = await api.get(`/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  // Increment view count for a resource
  incrementViewCount: async (resourceId) => {
    try {
      const response = await api.post(`/resources/${resourceId}/view`);
      return response.data;
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }
};