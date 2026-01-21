import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StaffLogin = () => {
  const [formData, setFormData] = useState({ idNumber: '', vinnieCode: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Connects to your backend on Port 5000
      const res = await API.post("http://localhost:5000/api/staff/login", formData);
      
      if (res.data.success) {
        // SAVING SESSION: This allows the AdminDashboard to load school data
        localStorage.setItem('vinnie_user', JSON.stringify(res.data.user));
        
        toast.success(`Welcome back, ${res.data.user.name}`);
        navigate('/admin'); // Redirects to the Principal's Dashboard
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid Credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-10 relative">
          <i className="fas fa-chalkboard-teacher text-5xl text-blue-500 mb-4"></i>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            Staff <span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-2">Vinnie Tech Solutions</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Identity Number</label>
            <div className="relative">
              <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="text" 
                placeholder="National ID or TSC Number" 
                required
                className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white"
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Vinnie Digital Code</label>
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="password" 
                placeholder="1121XX" 
                required
                className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white font-mono"
                onChange={(e) => setFormData({...formData, vinnieCode: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-widest mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {loading ? (
              <i className="fas fa-circle-notch animate-spin mr-2"></i>
            ) : (
              <i className="fas fa-sign-in-alt mr-2"></i>
            )}
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/login-selection')}
          className="w-full mt-8 text-slate-500 hover:text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-chevron-left"></i> Change Portal
        </button>
      </div>
    </div>
  );
};

export default StaffLogin;