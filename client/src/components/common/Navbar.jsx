// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaRecycle, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <FaRecycle className="text-primary-600 text-3xl" />
//             <span className="font-bold text-xl text-gray-800">
//               Smart<span className="text-primary-600">Recycle</span>
//             </span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
//               Home
//             </Link>
//             <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
//               About
//             </Link>
//             <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
//               Dashboard
//             </Link>
//           </div>

//           {/* Auth Buttons */}
//           <div className="flex items-center space-x-4">
//             <Link 
//               to="/login" 
//               className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
//             >
//               <FaSignInAlt />
//               <span>Login</span>
//             </Link>
//             <Link 
//               to="/register" 
//               className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               <FaUserPlus />
//               <span>Register</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




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
  FaCog
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    navigate('/');
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
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
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
                      {user?.role === 'admin' ? 'Administrator' : 
                       user?.role === 'collector' ? 'Collector' : 'Recycler'}
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
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          {user?.totalPoints || 0} pts
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {user?.rewardTier || 'Bronze'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleDashboard}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaTachometerAlt className="text-gray-400" />
                        <span>Dashboard</span>
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
                    </div>

                    {/* Admin Section (only visible for admin users) */}
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                      <>
                        <div className="border-t border-gray-100">
                          <div className="px-4 py-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</p>
                          </div>
                          <button
                            onClick={handleAdmin}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <FaCog className="text-purple-400" />
                            <span>Admin Panel</span>
                          </button>
                        </div>
                      </>
                    )}

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

