import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaRecycle, 
  FaUser, 
  FaSignInAlt, 
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
  FaHistory,
  FaCog,
  FaBell,
  FaEnvelope,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  
  const isAdmin = user?.role === 'admin';

  // Helper function to get initials
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    if (!isAuthenticated || isAdmin) return;
    try {
      const response = await api.get('/notifications/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isAdmin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setDropdownOpen(false);
  };

  const handleIncentives = () => {
    navigate('/incentives');
    setDropdownOpen(false);
  };

  const handleAdmin = () => {
    navigate('/admin');
    setDropdownOpen(false);
  };

  const handleNotifications = () => {
    navigate('/notifications');
    setDropdownOpen(false);
  };

  const handleContact = () => {
    navigate('/contact');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <FaRecycle className="text-primary-600 text-3xl" />
            <span className="font-bold text-xl text-gray-800">
              Smart<span className="text-primary-600">Recycle</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
              Contact
            </Link>
            {isAuthenticated && !isAdmin && (
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell - Only show for regular users */}
            {isAuthenticated && !isAdmin && (
              <Link 
                to="/notifications" 
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={handleNotifications}
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              // User is logged in - show dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                    {getInitials()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500">
                      {isAdmin ? 'Administrator' : 'Recycler'}
                    </p>
                  </div>
                  <FaUserCircle className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      {!isAdmin && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                            {user?.totalPoints || 0} pts
                          </span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {user?.rewardTier || 'Bronze'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Menu Items - Different for admin vs user */}
                    <div className="py-2">
                      {!isAdmin ? (
                        // Regular user menu
                        <>
                          <button
                            onClick={handleDashboard}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaTachometerAlt className="text-gray-400" />
                            <span>Dashboard</span>
                          </button>
                          <button
                            onClick={handleNotifications}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaBell className="text-gray-400" />
                            <div className="flex-1 text-left">Notifications</div>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={handleProfile}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaUser className="text-gray-400" />
                            <span>My Profile</span>
                          </button>
                          <button
                            onClick={handleIncentives}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaHistory className="text-gray-400" />
                            <span>My Incentives</span>
                          </button>
                          <button
                            onClick={handleContact}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaEnvelope className="text-gray-400" />
                            <span>Contact Us</span>
                          </button>
                        </>
                      ) : (
                        // Admin menu
                        <>
                          <button
                            onClick={handleAdmin}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaCog className="text-gray-400" />
                            <span>Admin Panel</span>
                          </button>
                          <button
                            onClick={handleContact}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaEnvelope className="text-gray-400" />
                            <span>Contact Us</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login/register buttons
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;