// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   FaRecycle, 
//   FaUser, 
//   FaSignInAlt, 
//   FaUserPlus,
//   FaSignOutAlt,
//   FaUserCircle,
//   FaTachometerAlt,
//   FaHistory,
//   FaCog
// } from 'react-icons/fa';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Helper function to get initials
//   const getInitials = () => {
//     if (!user?.name) return 'U';
//     return user.name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setDropdownOpen(false);
//   };

//   const handleProfile = () => {
//     navigate('/profile');
//     setDropdownOpen(false);
//   };

//   const handleDashboard = () => {
//     navigate('/dashboard');
//     setDropdownOpen(false);
//   };

//   const handleIncentives = () => {
//     navigate('/incentives');
//     setDropdownOpen(false);
//   };

//   const handleAdmin = () => {
//     navigate('/admin');
//     setDropdownOpen(false);
//   };

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
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
//             {isAuthenticated && (
//               <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
//                 Dashboard
//               </Link>
//             )}
//           </div>

//           {/* Auth Section */}
//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               // User is logged in - show dropdown
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center space-x-3 focus:outline-none group"
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
//                     {getInitials()}
//                   </div>
//                   <div className="hidden sm:block text-left">
//                     <p className="text-sm font-medium text-gray-700">{user?.name}</p>
//                     <p className="text-xs text-gray-500">
//                       {user?.role === 'admin' ? 'Administrator' : 
//                        user?.role === 'collector' ? 'Collector' : 'Recycler'}
//                     </p>
//                   </div>
//                   <FaUserCircle className="text-gray-400 group-hover:text-gray-600 transition-colors" />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
//                     {/* User Info Header */}
//                     <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
//                       <p className="font-medium text-gray-800">{user?.name}</p>
//                       <p className="text-sm text-gray-500 truncate">{user?.email}</p>
//                       <div className="mt-2 flex items-center space-x-2">
//                         <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
//                           {user?.totalPoints || 0} pts
//                         </span>
//                         <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
//                           {user?.rewardTier || 'Bronze'}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div className="py-2">
//                       <button
//                         onClick={handleDashboard}
//                         className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         <FaTachometerAlt className="text-gray-400" />
//                         <span>Dashboard</span>
//                       </button>
//                       <button
//                         onClick={handleProfile}
//                         className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         <FaUser className="text-gray-400" />
//                         <span>My Profile</span>
//                       </button>
//                       <button
//                         onClick={handleIncentives}
//                         className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         <FaHistory className="text-gray-400" />
//                         <span>My Incentives</span>
//                       </button>
//                     </div>

//                     {/* Admin Section (only visible for admin users) */}
//                     {(user?.role === 'admin' || user?.role === 'super_admin') && (
//                       <>
//                         <div className="border-t border-gray-100">
//                           <div className="px-4 py-2">
//                             <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</p>
//                           </div>
//                           <button
//                             onClick={handleAdmin}
//                             className="w-full flex items-center space-x-3 px-4 py-2 text-purple-700 hover:bg-purple-50 transition-colors"
//                           >
//                             <FaCog className="text-purple-400" />
//                             <span>Admin Panel</span>
//                           </button>
//                         </div>
//                       </>
//                     )}

//                     {/* Divider */}
//                     <div className="border-t border-gray-100"></div>

//                     {/* Logout Button */}
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                       <FaSignOutAlt />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // User is not logged in - show login/register buttons
//               <>
//                 <Link 
//                   to="/login" 
//                   className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
//                 >
//                   <FaSignInAlt />
//                   <span>Login</span>
//                 </Link>
//                 <Link 
//                   to="/register" 
//                   className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   <FaUserPlus />
//                   <span>Register</span>
//                 </Link>
//               </>
//             )}
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
  FaCog,
  FaGift,
  FaLeaf,
  FaMapMarkerAlt,
  FaBookOpen,
  FaTrophy,
  FaCalendarAlt,
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const resourcesDropdownRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setResourcesDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleIncentives = () => {
    navigate('/incentives');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleAdmin = () => {
    navigate('/admin');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleRewards = () => {
    navigate('/rewards');
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleEvents = () => {
    navigate('/events');
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleEnvironmentalImpact = () => {
    navigate('/environmental-impact');
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleRecyclingCenters = () => {
    navigate('/recycling-centers');
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleResources = () => {
    navigate('/resources');
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'About', path: '/about', icon: null },
  ];

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt },
    { name: 'Rewards', path: '/rewards', icon: FaGift },
    { name: 'Leaderboard', path: '/leaderboard', icon: FaTrophy },
    { name: 'Events', path: '/events', icon: FaCalendarAlt },
  ];

  const resourcesLinks = [
    { name: 'Environmental Impact', path: '/environmental-impact', icon: FaLeaf },
    { name: 'Recycling Centers', path: '/recycling-centers', icon: FaMapMarkerAlt },
    { name: 'Educational Resources', path: '/resources', icon: FaBookOpen },
  ];

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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && userLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Resources Dropdown */}
            {isAuthenticated && (
              <div className="relative" ref={resourcesDropdownRef}>
                <button
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <span>Resources</span>
                  <FaChevronDown className={`text-xs transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {resourcesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    {resourcesLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <link.icon className="text-gray-400" />
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

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
                        onClick={handleRewards}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaGift className="text-gray-400" />
                        <span>Rewards Store</span>
                      </button>
                      <button
                        onClick={handleLeaderboard}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaTrophy className="text-gray-400" />
                        <span>Leaderboard</span>
                      </button>
                      <button
                        onClick={handleEvents}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Events</span>
                      </button>
                      <button
                        onClick={handleEnvironmentalImpact}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaLeaf className="text-gray-400" />
                        <span>Environmental Impact</span>
                      </button>
                      <button
                        onClick={handleRecyclingCenters}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>Recycling Centers</span>
                      </button>
                      <button
                        onClick={handleResources}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaBookOpen className="text-gray-400" />
                        <span>Educational Resources</span>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  {userLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {link.icon && <link.icon className="text-gray-400" />}
                        <span>{link.name}</span>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Resources Section in Mobile Menu */}
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Resources</p>
                    {resourcesLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 pl-4 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {link.icon && <link.icon className="text-gray-400" />}
                          <span>{link.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;