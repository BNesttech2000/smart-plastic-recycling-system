import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Notifications from './pages/user/Notifications';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import SubmitContribution from './pages/user/SubmitContribution';
import IncentiveHistory from './pages/user/IncentiveHistory';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveContributions from './pages/admin/ApproveContributions';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import ManageNotifications from './pages/admin/ManageNotifications';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If admin tries to access user pages, redirect to admin
  if (user?.role === 'admin' && !requireAdmin && window.location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Public Routes - with Navbar and Footer */}
      <Route path="/" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow"><LandingPage /></main>
          <Footer />
        </div>
      } />
      
      <Route path="/login" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow"><Login /></main>
          <Footer />
        </div>
      } />
      
      <Route path="/register" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow"><Register /></main>
          <Footer />
        </div>
      } />
      
      <Route path="/about" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow"><About /></main>
          <Footer />
        </div>
      } />
      
      <Route path="/contact" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow"><Contact /></main>
          <Footer />
        </div>
      } />

      {/* User Routes - Only for non-admin users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow"><UserDashboard /></main>
            <Footer />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/submit-contribution" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow"><SubmitContribution /></main>
            <Footer />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/incentives" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow"><IncentiveHistory /></main>
            <Footer />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow"><Profile /></main>
            <Footer />
          </div>
        </ProtectedRoute>
      } />

      {/* Notifications Route - Only for regular users */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow"><Notifications /></main>
            <Footer />
          </div>
        </ProtectedRoute>
      } />

      {/* ADMIN ROUTES - Only for admin users */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>
            <ManageUsers />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/contributions" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>
            <ApproveContributions />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>
            <Reports />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/settings" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/notifications" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout>
            <ManageNotifications />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;