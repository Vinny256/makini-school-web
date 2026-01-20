import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// Components
import Navbar from './components/Navbar';
import VinnieMasterDashboard from './components/VinnieMasterDashboard';
import GuestHome from './components/Guest/GuestHome';
import LoginSelection from './components/LoginSelection'; 
import AdminLogin from './components/Admin/AdminLogin';
import StaffLogin from './components/StaffLogin'; 
import ParentLogin from './components/ParentLogin'; 
import AdminDashboard from './components/Admin/AdminDashboard'; // Import kept as is

const ProtectedRoute = ({ children, isAdmin }) => {
  if (!isAdmin) return <Navigate to="/vinnie-portal-auth" replace />;
  return children;
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<><Navbar /><GuestHome /></>} />
          
          {/* Portal Selection */}
          <Route path="/login-selection" element={<LoginSelection />} />
          
          {/* Specific Portals */}
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/parent-login" element={<ParentLogin />} />

          {/* Principal/Admin Dashboard 
              This fixes the "No routes matched location /admin" error 
          */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Master Admin Auth */}
          <Route path="/vinnie-portal-auth" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
          
          <Route path="/vinnie-tech-master-dashboard" element={
            <ProtectedRoute isAdmin={isAdmin}>
              <VinnieMasterDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;