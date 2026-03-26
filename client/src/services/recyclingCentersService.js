import api from './api';

export const recyclingCentersService = {
  // Get all recycling centers
  getCenters: async () => {
    try {
      const response = await api.get('/recycling-centers');
      return response.data;
    } catch (error) {
      console.error('Error fetching recycling centers:', error);
      throw error;
    }
  },

  // Get nearby recycling centers by location
  getNearbyCenters: async (lat, lng, radius = 10) => {
    try {
      const response = await api.get(`/recycling-centers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby centers:', error);
      throw error;
    }
  },

  // Get single recycling center by ID
  getCenterById: async (centerId) => {
    try {
      const response = await api.get(`/recycling-centers/${centerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recycling center:', error);
      throw error;
    }
  }
};