import api from './api';

export const rewardsService = {
  // Get all available rewards
  getRewards: async () => {
    try {
      const response = await api.get('/rewards');
      return response.data;
    } catch (error) {
      console.error('Error fetching rewards:', error);
      throw error;
    }
  },

  // Get single reward by ID
  getRewardById: async (rewardId) => {
    try {
      const response = await api.get(`/rewards/${rewardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reward:', error);
      throw error;
    }
  },

  // Redeem a reward
  redeemReward: async (rewardId) => {
    try {
      const response = await api.post(`/rewards/${rewardId}/redeem`);
      return response.data;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  },

  // Get user's redemption history
  getUserRedemptions: async () => {
    try {
      const response = await api.get('/rewards/my-redemptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      throw error;
    }
  }
};