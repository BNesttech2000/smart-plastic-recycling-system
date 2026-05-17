import api from './api';

export const environmentalImpactService = {
  // Get user's environmental impact
  getUserImpact: async () => {
    try {
      const response = await api.get('/environmental-impact/my-impact');
      return response.data;
    } catch (error) {
      console.error('Error fetching environmental impact:', error);
      throw error;
    }
  },

  // Get global environmental impact stats
  getGlobalImpact: async () => {
    try {
      const response = await api.get('/environmental-impact/global');
      return response.data;
    } catch (error) {
      console.error('Error fetching global impact:', error);
      throw error;
    }
  },

  // Get impact over time (weekly/monthly/yearly)
  getImpactHistory: async (period = 'month') => {
    try {
      const response = await api.get(`/environmental-impact/history?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching impact history:', error);
      throw error;
    }
  }
};