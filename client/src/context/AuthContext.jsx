import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Set axios default header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const loadUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email,
        password
      });

      const { token, ...userData } = response.data.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Login successful!');
      return { success: true, data: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);
      
      const { token, ...user } = response.data.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Registration successful!');
      return { success: true, data: user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, profileData);
      
      setUser(response.data.data);
      toast.success('Profile updated successfully');
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};