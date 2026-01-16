import React from 'react'; // Ensure this is present
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// Components
import Navbar from './components/Navbar';
import GuestHome from './components/Guest/GuestHome';
import AdminDashboard from './components/Admin/AdminDashboard';

const App = () => {
  return (
    <Router>
      {/* Toaster must be inside the Router and inside a functional component like <App /> */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'font-bold',
          style: {
            borderRadius: '15px',
            background: '#1e3a8a',
            color: '#fff',
          },
        }} 
      />

      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<GuestHome />} />
          
          {/* Private Admin Portal */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;