import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const DeanOfStudents = ({ user }) => {
  const [stats, setStats] = useState({ totalStudents: 0, newThisMonth: 0, classes: 0 });
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDeanStats = async () => {
      try {
        // Vinnie: This hits your new stats route for the specific school
        const res = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({
          totalStudents: parseInt(res.data.students) || 0,
          newThisMonth: 0, // Logic for new admissions can be added later
          classes: 8 // Placeholder for grades/classes
        });
      } catch (err) {
        console.error("Dean stats error:", err);
      }
    };
    if (user.schoolId) fetchDeanStats();
  }, [user.schoolId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* MOBILE NAV */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="font-black italic uppercase">Dean <span className="text-blue-400">Portal</span></h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
        </button>
      </div>

      {/* DEAN SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-blue-950 text-white flex-col p-6 sticky top-0 h-screen z-40`}>
        <div className="hidden md:block mb-10 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <i className="fas fa-user-shield text-2xl"></i>
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Dean <span className="text-blue-400">Hub</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-blue-400/50 text-[10px] font-black uppercase mb-4 ml-2 tracking-widest">Admissions Desk</p>
          
          <button 
            onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-900/50 text-blue-200'}`}
          >
            <i className="fas fa-home"></i> <span>Overview</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Admissions'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Admissions' ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-900/50 text-blue-200'}`}
          >
            <i className="fas fa-user-plus"></i> <span>New Admission</span>
          </button>

          <button 
             onClick={() => { setActiveTab('Students'); setIsSidebarOpen(false); }}
             className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Students' ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-900/50 text-blue-200'}`}
          >
            <i className="fas fa-list-ul"></i> <span>Student Registry</span>
          </button>
        </nav>

        <button 
          onClick={() => { localStorage.clear(); window.location.href='/'; }}
          className="mt-6 flex items-center gap-4 w-full p-4 bg-red-500/10 text-red-400 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
        >
          <i className="fas fa-power-off"></i> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            {activeTab}
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
            Dean of Students: {user.name} | {user.schoolName}
          </p>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Enrolled</p>
                  <h2 className="text-2xl font-black text-slate-800">{stats.totalStudents}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">New Admissions</p>
                  <h2 className="text-2xl font-black text-slate-800">{stats.newThisMonth}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fas fa-door-open"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Classes</p>
                  <h2 className="text-2xl font-black text-slate-800">{stats.classes}</h2>
                </div>
              </div>
            </div>

            {/* ACTION BANNER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Student Onboarding</h2>
                 <p className="max-w-md text-blue-100 font-medium opacity-80 mb-6">
                   Ready to admit new learners to {user.schoolName}? Start the digital enrollment process now.
                 </p>
                 <button 
                    onClick={() => setActiveTab('Admissions')}
                    className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all"
                 >
                   Launch Admission Form
                 </button>
               </div>
               <i className="fas fa-id-card absolute -bottom-10 -right-10 text-[15rem] text-white/10 rotate-12"></i>
            </div>
          </div>
        )}

        {activeTab === 'Admissions' && (
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black uppercase mb-6">New Student Admission</h2>
              <p className="text-slate-500 mb-4">Form logic for adding students to the database will go here.</p>
              {/* Vinnie: We will build the actual form next! */}
           </div>
        )}
      </main>
    </div>
  );
};

export default DeanOfStudents;