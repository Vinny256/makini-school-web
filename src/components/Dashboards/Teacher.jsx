import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const Teacher = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ students: 0, meanGrade: '0.0' });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Teachers see the high-level school metrics too
        const statsRes = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({ 
          students: statsRes.data.students, 
          meanGrade: statsRes.data.meanGrade || '0.0' 
        });

        // Fetch classes configured by the Dean
        const classRes = await API.get(`/dean/active-classes/${user.schoolId}`);
        setAvailableClasses(classRes.data);
      } catch (err) { console.error("Portal error", err); }
    };
    if (user.schoolId) fetchTeacherData();
  }, [user.schoolId, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      
      {/* MOBILE HAMBURGER - IDENTICAL TO PRINCIPAL */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-[100] shadow-xl">
        <h2 className="font-black italic uppercase tracking-tighter">Vinnie <span className="text-blue-500">Teacher</span></h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg active:scale-90 transition-all"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl text-blue-400`}></i>
        </button>
      </div>

      {/* RESPONSIVE SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:relative w-72 bg-slate-900 text-white flex-col p-6 h-screen z-50
        ${isSidebarOpen ? 'flex' : 'hidden md:flex'}
      `}>
        <div className="mb-10 text-center hidden md:block">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <i className="fas fa-chalkboard-teacher text-2xl"></i>
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-sm">Staff <span className="text-blue-500">Portal</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => {setActiveTab('Overview'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fas fa-chart-pie"></i> School Overview</button>
          <button onClick={() => {setActiveTab('Mark Entry'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Mark Entry' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fas fa-pen-fancy"></i> Mark Entry</button>
        </nav>

        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-500 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-sign-out-alt"></i> Exit Portal</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{activeTab}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1 italic">Staff Member: {user.name} | {user.schoolName}</p>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-users text-blue-500"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enrolled Students</p><h2 className="text-2xl font-black text-slate-800">{stats.students}</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-medal text-yellow-500"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean</p><h2 className="text-2xl font-black text-slate-800">{stats.meanGrade}</h2></div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black italic uppercase mb-2">Classroom Control</h2>
                <p className="max-w-md text-slate-400 font-medium">Use the Mark Entry tab to manage performance for your specific Grade and Stream.</p>
                <i className="fas fa-book-open absolute -bottom-10 -right-10 text-[15rem] text-white/5 rotate-12"></i>
            </div>
          </div>
        )}

        {activeTab === 'Mark Entry' && (
          <div className="space-y-6">
             {/* DROPDOWN SELECTOR */}
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md">
                <label className="block text-xs font-black uppercase mb-3 text-slate-400 tracking-widest">Target Class</label>
                <select 
                  onChange={(e) => e.target.value && setSelectedClass(JSON.parse(e.target.value))}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-black border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Assigned Class --</option>
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={JSON.stringify(cls)}>{cls.label}</option>
                  ))}
                </select>
             </div>
             
             {selectedClass && (
               <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <h3 className="font-black italic uppercase text-sm">Registry: {selectedClass.label}</h3>
                  </div>
                  {/* Table will load here */}
                  <div className="p-10 text-center text-slate-400 italic font-medium">
                    Fetching student data for {selectedClass.label}...
                  </div>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Teacher;