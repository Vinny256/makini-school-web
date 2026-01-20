import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminLogin = ({ setIsAdmin }) => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Connects to your backend to check .env credentials
      const response = await axios.post("http://localhost:5000/api/superadmin/login", creds);
      
      if (response.data.success) {
        setIsAdmin(true); // Grant access to the protected route
        toast.success("Identity Verified, Vinnie.");
        navigate('/vinnie-tech-master-dashboard'); // Your hidden dashboard URL
      }
    } catch (error) {
      // If backend returns 401, it means the .env check failed
      toast.error("Access Denied: Master credentials only.");
      console.error("Login error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-purple-400 italic">Vinnie Tech</h2>
          <p className="text-slate-400 mt-2">Master Administrator Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">Master Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="Enter master email"
              value={creds.email}
              onChange={(e) => setCreds({...creds, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">Security Key</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="••••••••"
              value={creds.password}
              onChange={(e) => setCreds({...creds, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-500 transform active:scale-95 transition-all shadow-lg"
          >
            Verify Identity
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;