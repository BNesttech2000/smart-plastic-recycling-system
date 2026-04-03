// import React, { useState } from 'react';
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
  FaBell,
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
    { name: 'Notifications', href: '/admin/notifications', icon: FaBell },
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