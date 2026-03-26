// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// // Layout Components
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';

// // Pages
// import LandingPage from './pages/LandingPage';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import About from './pages/About';

// // User Pages
// import UserDashboard from './pages/user/UserDashboard';
// import SubmitContribution from './pages/user/SubmitContribution';
// import IncentiveHistory from './pages/user/IncentiveHistory';
// import Profile from './pages/user/Profile';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ManageUsers from './pages/admin/ManageUsers';
// import ApproveContributions from './pages/admin/ApproveContributions';
// import Reports from './pages/admin/Reports';

// // Context
// import { AuthProvider } from './context/AuthContext';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="min-h-screen flex flex-col">
//           <Navbar />
//           <main className="flex-grow">
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<LandingPage />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/about" element={<About />} />

//               {/* User Routes */}
//               <Route path="/dashboard" element={<UserDashboard />} />
//               <Route path="/submit-contribution" element={<SubmitContribution />} />
//               <Route path="/incentives" element={<IncentiveHistory />} />
//               <Route path="/profile" element={<Profile />} />

//               {/* Admin Routes */}
//               <Route path="/admin" element={<AdminDashboard />} />
//               <Route path="/admin/users" element={<ManageUsers />} />
//               <Route path="/admin/contributions" element={<ApproveContributions />} />
//               <Route path="/admin/reports" element={<Reports />} />
//             </Routes>
//           </main>
//           <Footer />
//           <Toaster 
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//               success: {
//                 duration: 3000,
//                 iconTheme: {
//                   primary: '#10b981',
//                   secondary: '#fff',
//                 },
//               },
//               error: {
//                 duration: 4000,
//                 iconTheme: {
//                   primary: '#ef4444',
//                   secondary: '#fff',
//                 },
//               },
//             }}
//           />
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;







import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import SubmitContribution from './pages/user/SubmitContribution';
import IncentiveHistory from './pages/user/IncentiveHistory';
import Profile from './pages/user/Profile';
import RewardsStore from './pages/user/RewardsStore';
import EnvironmentalImpact from './pages/user/EnvironmentalImpact';
import RecyclingCenters from './pages/user/RecyclingCenters';
import EducationalResources from './pages/user/EducationalResources';
import Leaderboard from './pages/user/Leaderboard';
import Events from './pages/user/Events';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveContributions from './pages/admin/ApproveContributions';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import ManageRewards from './pages/admin/ManageRewards';
import ManageRecyclingCenters from './pages/admin/ManageRecyclingCenters';
import ManageResources from './pages/admin/ManageResources';
import ManageEvents from './pages/admin/ManageEvents';
import ManageLeaderboard from './pages/admin/ManageLeaderboard';
import ManageEnvironmentalImpact from './pages/admin/ManageEnvironmentalImpact';

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

          {/* New User Feature Routes */}
          <Route path="/rewards" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><RewardsStore /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/environmental-impact" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><EnvironmentalImpact /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/recycling-centers" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><RecyclingCenters /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/resources" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><EducationalResources /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/leaderboard" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><Leaderboard /></main>
              <Footer />
            </div>
          } />
          
          <Route path="/events" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow"><Events /></main>
              <Footer />
            </div>
          } />

          {/* Admin Routes - Using AdminLayout (No Navbar/Footer) */}
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
          
          {/* New Admin Routes for Feature Management */}
          <Route path="/admin/rewards" element={
            <AdminLayout>
              <ManageRewards />
            </AdminLayout>
          } />
          
          <Route path="/admin/recycling-centers" element={
            <AdminLayout>
              <ManageRecyclingCenters />
            </AdminLayout>
          } />
          
          <Route path="/admin/resources" element={
            <AdminLayout>
              <ManageResources />
            </AdminLayout>
          } />
          
          <Route path="/admin/events" element={
            <AdminLayout>
              <ManageEvents />
            </AdminLayout>
          } />
          
          <Route path="/admin/leaderboard" element={
            <AdminLayout>
              <ManageLeaderboard />
            </AdminLayout>
          } />
          
          <Route path="/admin/environmental-impact" element={
            <AdminLayout>
              <ManageEnvironmentalImpact />
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