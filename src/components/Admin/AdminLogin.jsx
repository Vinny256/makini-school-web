import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminLogin = ({ setIsAdmin }) => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // New state to track Render wake-up
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the animation
    
    try {
      const response = await API.post("/superadmin/login", creds);
      
      if (response.data.success) {
        setIsAdmin(true);
        toast.success("Identity Verified, Vinnie.");
        navigate('/vinnie-tech-master-dashboard');
      }
    } catch (error) {
      toast.error("Access Denied: Master credentials only.");
      console.error("Login error:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Stop the animation regardless of outcome
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-900 px-4">
      {/* Dynamic Bar CSS Animation */}
      <style>
        {`
          @keyframes barJump {
            0%, 100% { height: 10px; background: #a855f7; }
            50% { height: 30px; background: #3b82f6; }
          }
          .jumping-bar {
            width: 4px;
            border-radius: 2px;
            animation: barJump 0.8s infinite ease-in-out;
          }
          .bar1 { animation-delay: 0s; }
          .bar2 { animation-delay: 0.2s; }
          .bar3 { animation-delay: 0.4s; }
          .bar4 { animation-delay: 0.6s; }
        `}
      </style>

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
              disabled={loading}
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
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="••••••••"
              value={creds.password}
              onChange={(e) => setCreds({...creds, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl transform active:scale-95 transition-all shadow-lg flex flex-col items-center justify-center gap-2 ${
              loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="flex items-end gap-1 h-8">
                  <div className="jumping-bar bar1"></div>
                  <div className="jumping-bar bar2"></div>
                  <div className="jumping-bar bar3"></div>
                  <div className="jumping-bar bar4"></div>
                </div>
                <span className="text-xs text-purple-300 animate-pulse">Please wait as we log you in...</span>
              </>
            ) : (
              "Verify Identity"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;