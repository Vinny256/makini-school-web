import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';
import StaffManagement from './StaffManagement';

const Principal = ({ user }) => {
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  const [activeTab, setActiveTab] = useState('Staff Management');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({
          staff: parseInt(res.data.staff) || 0,
          students: parseInt(res.data.students) || 0,
          meanGrade: res.data.meanGrade || '0.0'
        });
      } catch (err) {
        console.error("Stats error:", err);
      }
    };
    if (user.schoolId) fetchStats();
  }, [user.schoolId, activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href='/';
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR: Statically pinned to the left, no responsive hiding */}
      <aside className="w-72 min-w-[18rem] bg-slate-900 text-white flex flex-col p-6 h-screen sticky top-0 shrink-0 shadow-2xl z-30">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <i className="fas fa-university text-2xl"></i>
          </div>
          <h2 className="text-base font-black uppercase italic tracking-wider">
            Executive <span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {user?.schoolName || 'School Dashboard'}
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-3 ml-2 tracking-widest">Main Menu</p>
          
          <button 
            type="button"
            onClick={() => setActiveTab('Overview')}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-chart-pie w-5"></i> <span>Overview</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('Staff Management')}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Staff Management' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-users-cog w-5"></i> <span>Staff Control</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('Bulk SMS Hub')}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Bulk SMS Hub' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-bullhorn w-5"></i> <span>Bulk SMS Hub</span>
          </button>
        </nav>

        {/* LOGOUT */}
        <div className="pt-4 border-t border-slate-800">
          {!showExitConfirm ? (
            <button 
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-3 w-full p-3.5 bg-red-600/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
            >
              <i className="fas fa-sign-out-alt w-5"></i> Exit Portal
            </button>
          ) : (
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <p className="text-[10px] font-black uppercase text-center mb-2 text-slate-400">Confirm Exit?</p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black uppercase hover:bg-red-700"
                >
                  Yes
                </button>
                <button 
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-black uppercase hover:bg-slate-600"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 min-w-0 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
              {activeTab}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
              Principal: {user.name} | {user.schoolName}
            </p>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">Total Staff</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.staff}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">Total Students</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.students}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">School Mean</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.meanGrade}</h2>
            </div>
          </div>
        )}

        {activeTab === 'Staff Management' && (
          <StaffManagement user={user} />
        )}
      </main>
    </div>
  );
};

export default Principal;
