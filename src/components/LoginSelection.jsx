import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full grid grid-cols-1 gap-6">
        <h2 className="text-3xl font-black text-center mb-8 italic tracking-tighter uppercase">
          Vinnie Tech <span className="text-blue-500">Portals</span>
        </h2>
        
        {/* STAFF PORTAL BUTTON */}
        <button 
          onClick={() => navigate('/staff-login')} 
          className="bg-blue-600 hover:bg-blue-500 p-8 rounded-3xl shadow-2xl transition-all flex flex-col items-center gap-4 group border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
        >
          <i className="fas fa-chalkboard-teacher text-5xl group-hover:scale-110 transition-transform"></i>
          <span className="text-xl font-bold uppercase tracking-widest">Staff Portal</span>
        </button>

        {/* PARENT PORTAL BUTTON */}
        <button 
          onClick={() => navigate('/parent-login')} 
          className="bg-slate-800 hover:bg-slate-700 border-2 border-blue-600 p-8 rounded-3xl shadow-xl transition-all flex flex-col items-center gap-4 group active:scale-95"
        >
          <i className="fas fa-user-graduate text-5xl group-hover:scale-110 transition-transform text-blue-400"></i>
          <span className="text-xl font-bold uppercase tracking-widest">Parent Portal</span>
        </button>

        {/* BACK TO HOME */}
        <button 
          onClick={() => navigate('/')}
          className="mt-4 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Back to Website
        </button>
      </div>
    </div>
  );
};

export default LoginSelection;