import React from 'react';
import { useNavigate } from 'react-router-dom';

const ParentLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center">
        <i className="fas fa-user-graduate text-5xl text-blue-400 mb-4"></i>
        <h2 className="text-2xl font-bold uppercase italic mb-6 text-blue-400">Parent Portal</h2>
        <p className="text-slate-400 mb-8">Login with Student Admission Number to check results and fees.</p>
        
        <input type="text" placeholder="Admission Number" className="w-full p-4 bg-slate-800 rounded-xl mb-4 border border-slate-700 outline-none focus:border-blue-400" />
        <button className="w-full bg-slate-800 border-2 border-blue-500 text-blue-400 font-bold py-4 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
          Access Results
        </button>
        
        <button onClick={() => navigate('/')} className="mt-6 text-sm text-slate-500 hover:text-white block w-full text-center">
          <i className="fas fa-arrow-left mr-2"></i> Back to Home
        </button>
      </div>
    </div>
  );
};

export default ParentLogin;