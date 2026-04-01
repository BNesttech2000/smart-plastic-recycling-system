import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
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

          {/* User Routes - with Navbar and Footer */}
          <Route path="/dashboard" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><UserDashboard /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/submit-contribution" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><SubmitContribution /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/incentives" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><IncentiveHistory /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/profile" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><Profile /></main>
              <Footer />
            </div>
          } />

          {/* ADMIN ROUTES - NO NAVBAR, NO FOOTER */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          
          <Route path="/admin/users" element={
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          } />
          
          <Route path="/admin/contributions" element={
            <AdminLayout>
              <ApproveContributions />
            </AdminLayout>
          } />
          
          <Route path="/admin/reports" element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          } />
          
          <Route path="/admin/settings" element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          } />
        </Routes>
        
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