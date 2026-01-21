import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const TeacherDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ students: 0, meanGrade: '0.0' });
  
  // Marks Entry State
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Teachers see the same high-level school stats
        const statsRes = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({ 
          students: statsRes.data.students, 
          meanGrade: statsRes.data.meanGrade || '0.0' 
        });

        // Fetch classes that the Dean has registered
        const classRes = await API.get(`/staff/active-classes/${user.schoolId}`);
        setAvailableClasses(classRes.data);
      } catch (err) { console.error("Error loading teacher portal", err); }
    };
    if (user.schoolId) fetchTeacherData();
  }, [user.schoolId, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      
      {/* MOBILE NAV - IDENTICAL TO DEAN/PRINCIPAL */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-[100] shadow-lg">
        <h2 className="font-black italic uppercase tracking-tighter text-sm">Vinnie <span className="text-blue-400">Staff</span></h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 flex items-center justify-center bg-blue-800 rounded-lg active:scale-90 transition-all">
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl text-white`}></i>
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
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"><i className="fas fa-chalkboard-teacher text-2xl"></i></div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Staff <span className="text-blue-400">Portal</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => {setActiveTab('Overview'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fas fa-th-large"></i> School Overview</button>
          <button onClick={() => {setActiveTab('My Classes'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'My Classes' ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fas fa-book-reader"></i> Mark Entry</button>
        </nav>

        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-500 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-sign-out-alt"></i> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{activeTab}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1 italic">Teacher: {user.name} | {user.schoolName}</p>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SCHOOL STATS FOR TEACHER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-users"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Population</p><h2 className="text-2xl font-black">{stats.students}</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-star"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean Grade</p><h2 className="text-2xl font-black">{stats.meanGrade}</h2></div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black italic uppercase mb-2">Teacher Workspace</h2>
                <p className="max-w-md text-slate-400 font-medium leading-relaxed">Access your assigned classes to manage student performance and attendance.</p>
                <i className="fas fa-graduation-cap absolute -bottom-10 -right-10 text-[15rem] text-white/5 rotate-12"></i>
            </div>
          </div>
        )}

        {activeTab === 'My Classes' && (
          <div className="space-y-6">
             {/* CLASS SELECTOR DROPDOWN */}
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md">
                <label className="block text-xs font-black uppercase mb-3 text-slate-400 tracking-widest">Select Class to Manage</label>
                <select 
                  onChange={(e) => setSelectedClass(JSON.parse(e.target.value))}
                  className="w-full p-4 bg-slate-50 rounded-2xl font-black border-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Choose Class (e.g. Grade 10 West)</option>
                  {availableClasses.map(cls => (
                    <option key={cls.id} value={JSON.stringify(cls)}>{cls.label}</option>
                  ))}
                </select>
             </div>

             {/* VINNIE: This is where the student table will list names! */}
             {selectedClass && (
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <h3 className="font-black italic uppercase">{selectedClass.label} Registry</h3>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Class List</span>
                  </div>
                  {/* Table logic goes here... */}
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;