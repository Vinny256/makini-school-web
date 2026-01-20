import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import StaffManagement from './StaffManagement';

const Principal = ({ user }) => {
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/stats/${user.schoolId}`);
        // Ensure numbers are handled correctly if returned as strings from PostgreSQL
        setStats({
          staff: parseInt(res.data.staff) || 0,
          students: parseInt(res.data.students) || 0,
          meanGrade: res.data.meanGrade || '0.0'
        });
      } catch (err) {
        console.error("Stats error:", err);
      }
    };
    fetchStats();
  }, [user.schoolId, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* MOBILE MENU */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="font-black italic uppercase">Vinnie <span className="text-blue-500">ERP</span></h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
        </button>
      </div>

      {/* COMMAND CENTER SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-slate-900 text-white flex-col p-6 sticky top-0 h-screen z-40`}>
        <div className="hidden md:block mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <i className="fas fa-university text-2xl"></i>
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Executive <span className="text-blue-500">Portal</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-4 ml-2 tracking-widest">Main Menu</p>
          
          <button 
            onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-chart-pie"></i> <span>Overview</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Staff Management'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Staff Management' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-users-cog"></i> <span>Staff Control</span>
          </button>

          <button className="flex items-center gap-4 w-full p-4 text-slate-400 hover:bg-slate-800 rounded-2xl font-bold transition-all">
            <i className="fas fa-bullhorn"></i> <span>Bulk SMS Hub</span>
          </button>
        </nav>

        <button 
          onClick={() => { localStorage.clear(); window.location.href='/'; }}
          className="mt-6 flex items-center gap-4 w-full p-4 bg-red-600/10 text-red-500 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
        >
          <i className="fas fa-sign-out-alt"></i> Exit Portal
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
              {activeTab}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
              Principal: {user.name} | {user.schoolName}
            </p>
          </div>
          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-all">
              <i className="fas fa-user-graduate"></i> Registered Students
            </button>
          </div>
        </header>

        {/* TAB RENDERING */}
        {activeTab === 'Overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* STAFF METRIC */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Staff</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.staff}</h2>
                </div>
              </div>

              {/* STUDENT METRIC */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Students</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.students}</h2>
                </div>
              </div>

              {/* ACADEMIC METRIC */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-medal"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.meanGrade}</h2>
                </div>
              </div>
            </div>

            {/* INSTITUTIONAL BANNER */}
            <div className="bg-blue-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Institutional Oversight</h2>
                 <p className="max-w-md text-blue-200 font-medium leading-relaxed">
                    All administrative departments are active. You are currently overseeing {stats.staff} staff members and {stats.students} students in {user.schoolName}.
                 </p>
               </div>
               <i className="fas fa-shield-alt absolute -bottom-10 -right-10 text-[15rem] text-white/5 rotate-12"></i>
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