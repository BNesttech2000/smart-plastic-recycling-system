import api from './api';

export const leaderboardService = {
  // Get leaderboard data
  getLeaderboard: async (period = 'all') => {
    try {
      const response = await api.get(`/leaderboard?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Get user's rank
  getUserRank: async () => {
    try {
      const response = await api.get('/leaderboard/my-rank');
      return response.data;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  }
};