import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    resetPassword,
    verifyEmail,
    refreshToken,
    isAuthenticated,
    isAdmin,
    hasPermission,
    getUserPermissions
  } = context;

  // Helper function to check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Helper function to check if user is verified
  const isVerified = () => {
    return user?.isVerified || false;
  };

  // Helper function to get user's full name
  const getFullName = () => {
    return user?.name || 'User';
  };

  // Helper function to get user's initials
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to check if token is expiring soon
  const isTokenExpiringSoon = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = exp - now;
      
      // Return true if token expires in less than 5 minutes
      return timeUntilExpiry < 5 * 60 * 1000;
    } catch {
      return true;
    }
  };

  // Helper function to get token expiry time
  const getTokenExpiry = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  };

  return {
    // Core auth functions
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    resetPassword,
    verifyEmail,
    refreshToken,
    
    // State checks
    isAuthenticated,
    isAdmin,
    
    // Helper functions
    hasRole,
    isVerified,
    getFullName,
    getInitials,
    hasPermission,
    getUserPermissions,
    isTokenExpiringSoon,
    getTokenExpiry,
    
    // User data shortcuts
    userId: user?._id,
    userEmail: user?.email,
    userName: user?.name,
    userAvatar: user?.avatar,
    userPoints: user?.totalPoints || 0,
    userTier: user?.rewardTier || 'Bronze',
    userJoined: user?.joinedDate,
  };
};