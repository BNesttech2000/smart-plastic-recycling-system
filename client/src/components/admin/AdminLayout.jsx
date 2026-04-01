// import React, { useState } from 'react';
// import { Link, useLocation, Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import {
//   FaTachometerAlt,
//   FaUsers,
//   FaRecycle,
//   FaFileAlt,
//   FaCog,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
// } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// const AdminLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const navigation = [
//     { name: 'Dashboard', href: '/admin', icon: FaTachometerAlt },
//     { name: 'Manage Users', href: '/admin/users', icon: FaUsers },
//     { name: 'Contributions', href: '/admin/contributions', icon: FaRecycle },
//     { name: 'Reports', href: '/admin/reports', icon: FaFileAlt },
//     { name: 'Settings', href: '/admin/settings', icon: FaCog },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Desktop Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 z-20 ${
//           sidebarOpen ? 'w-64' : 'w-20'
//         }`}
//       >
//         <div className="flex items-center justify-between h-16 px-4 border-b">
//           {sidebarOpen && <h1 className="text-xl font-bold text-primary-600">Admin</h1>}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             <FaBars />
//           </button>
//         </div>

//         <nav className="p-4">
//           {navigation.map((item) => (
//             <Link
//               key={item.name}
//               to={item.href}
//               className={`flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center'} py-3 rounded-lg mb-1 transition-colors ${
//                 isActive(item.href)
//                   ? 'bg-primary-50 text-primary-600'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//               title={!sidebarOpen ? item.name : ''}
//             >
//               <item.icon />
//               {sidebarOpen && <span>{item.name}</span>}
//             </Link>
//           ))}
//           <button
//             onClick={logout}
//             className={`flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center'} py-3 mt-4 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
//             title={!sidebarOpen ? 'Logout' : ''}
//           >
//             <FaSignOutAlt />
//             {sidebarOpen && <span>Logout</span>}
//           </button>
//         </nav>
//       </aside>

//       {/* MAIN CONTENT - ADD margin-left to push it right */}
//       <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Mobile Menu Button */}
//         <div className="lg:hidden fixed top-4 left-4 z-30">
//           <button
//             onClick={() => setMobileSidebarOpen(true)}
//             className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
//           >
//             <FaBars className="text-gray-600" />
//           </button>
//         </div>

//         {/* Mobile Sidebar (Overlay) */}
//         <AnimatePresence>
//           {mobileSidebarOpen && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setMobileSidebarOpen(false)}
//                 className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//               />
//               <motion.aside
//                 initial={{ x: -300 }}
//                 animate={{ x: 0 }}
//                 exit={{ x: -300 }}
//                 transition={{ type: 'tween' }}
//                 className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden"
//               >
//                 <div className="flex items-center justify-between p-4 border-b">
//                   <span className="text-xl font-bold text-primary-600">Admin</span>
//                   <button
//                     onClick={() => setMobileSidebarOpen(false)}
//                     className="p-2 rounded-lg hover:bg-gray-100"
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//                 <nav className="p-4">
//                   {navigation.map((item) => (
//                     <Link
//                       key={item.name}
//                       to={item.href}
//                       onClick={() => setMobileSidebarOpen(false)}
//                       className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
//                         isActive(item.href)
//                           ? 'bg-primary-50 text-primary-600'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       <item.icon />
//                       <span>{item.name}</span>
//                     </Link>
//                   ))}
//                   <button
//                     onClick={() => {
//                       logout();
//                       setMobileSidebarOpen(false);
//                     }}
//                     className="w-full flex items-center space-x-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <FaSignOutAlt />
//                     <span>Logout</span>
//                   </button>
//                 </nav>
//               </motion.aside>
//             </>
//           )}
//         </AnimatePresence>

//         {/* Page Content */}
//         <main className="p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


import React, { useState } from 'react';
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
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: sidebarOpen ? 250 : 70,
          backgroundColor: '#1e293b',
          color: 'white',
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #334155' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            <FaBars />
          </button>
          {sidebarOpen && <h2 style={{ marginTop: '10px', fontSize: '18px' }}>Admin Panel</h2>}
        </div>

        <nav style={{ flex: 1, padding: '10px 0' }}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: '12px 16px',
                margin: '4px 8px',
                borderRadius: '8px',
                backgroundColor: isActive(item.href) ? '#3b82f6' : 'transparent',
                color: isActive(item.href) ? 'white' : '#94a3b8',
                textDecoration: 'none',
                gap: sidebarOpen ? '12px' : '0',
              }}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #334155' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: sidebarOpen ? '12px' : '0',
              padding: '10px',
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
          >
            <FaSignOutAlt size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: sidebarOpen ? 250 : 70,
          flex: 1,
          backgroundColor: '#f1f5f9',
          minHeight: '100vh',
          transition: 'margin-left 0.3s',
        }}
      >
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;