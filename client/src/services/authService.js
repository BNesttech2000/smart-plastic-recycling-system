import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};