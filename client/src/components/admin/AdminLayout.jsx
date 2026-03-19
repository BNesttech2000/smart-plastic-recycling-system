import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaRecycle,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FaTachometerAlt },
    { name: 'Manage Users', href: '/admin/users', icon: FaUsers },
    { name: 'Contributions', href: '/admin/contributions', icon: FaRecycle },
    { name: 'Reports', href: '/admin/reports', icon: FaFileAlt },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-30 lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="text-xl font-bold text-primary-600">Admin Panel</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <nav className="p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-xl transition-all duration-300 hidden lg:block ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className={`flex items-center h-16 px-4 border-b ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen ? (
            <>
              <span className="text-xl font-bold text-primary-600">Admin</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaBars className="text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FaBars className="text-gray-600" />
            </button>
          )}
        </div>

        <nav className="p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center'} py-3 rounded-lg mb-1 transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              title={!sidebarOpen ? item.name : ''}
            >
              <item.icon className="text-lg" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
          <button
            onClick={logout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center'} py-3 rounded-lg text-red-600 hover:bg-red-50 mt-4`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 z-10 lg:static">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <FaBars className="text-gray-600" />
            </button>

            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;