import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const DeanOfStudents = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  
  // Configuration State
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState('');

  // Admission Form State
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    curriculum: 'CBC', 
    gradeLevel: '',
    streamId: '',
    gender: 'Male'
  });

  useEffect(() => {
    const fetchStatsAndStreams = async () => {
      try {
        // Updated to use the professional routes we built
        const statsRes = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({ 
          staff: statsRes.data.staff, 
          students: statsRes.data.students,
          meanGrade: statsRes.data.meanGrade || '0.0' 
        });
        
        const streamsRes = await API.get(`/dean/streams/${user.schoolId}`);
        setStreams(streamsRes.data);
      } catch (err) { console.error("Data fetch error", err); }
    };
    if (user.schoolId) fetchStatsAndStreams();
  }, [user.schoolId, activeTab]);

  const handleAdmission = async (e) => {
    e.preventDefault();
    try {
      // Updated to point to deanRoutes
      await API.post('/dean/register-student', { ...formData, schoolId: user.schoolId });
      toast.success(`${formData.fullName} enrolled successfully!`);
      setFormData({ fullName: '', admissionNumber: '', curriculum: 'CBC', gradeLevel: '', streamId: '', gender: 'Male' });
      setActiveTab('Overview');
    } catch (err) { 
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg); 
    }
  };

  const addStream = async () => {
    if (!newStream) return;
    try {
      // Updated to point to deanRoutes
      await API.post('/dean/add-stream', { schoolId: user.schoolId, streamName: newStream });
      setNewStream('');
      toast.success("Stream added!");
      // Refresh stream list immediately
      const res = await API.get(`/dean/streams/${user.schoolId}`);
      setStreams(res.data);
    } catch (err) { toast.error("Stream error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      
      {/* MOBILE HAMBURGER NAV - FIXED Z-INDEX & ICON */}
      <div className="md:hidden bg-blue-950 text-white p-4 flex justify-between items-center sticky top-0 z-[60] shadow-lg">
        <h2 className="font-black italic uppercase tracking-tighter">Vinnie <span className="text-blue-400">Dean</span></h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="w-10 h-10 flex items-center justify-center bg-blue-900 rounded-lg active:scale-90 transition-all"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl text-blue-400`}></i>
        </button>
      </div>

      {/* DESKTOP/MOBILE SIDEBAR - FIXED MOBILE OVERLAY */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:relative w-72 bg-blue-950 text-white flex-col p-6 h-screen z-50
        ${isSidebarOpen ? 'flex' : 'hidden md:flex'}
      `}>
        <div className="mb-10 text-center hidden md:block">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <i className="fas fa-user-shield text-2xl"></i>
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Dean <span className="text-blue-400">Hub</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-blue-400/30 text-[10px] font-black uppercase mb-4 ml-2 tracking-widest">Navigation</p>
          <button onClick={() => {setActiveTab('Overview'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-th-large"></i> Overview</button>
          <button onClick={() => {setActiveTab('Admissions'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Admissions' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-user-plus"></i> Enroll Student</button>
          <button onClick={() => {setActiveTab('Config'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Config' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-cog"></i> Setup Streams</button>
        </nav>

        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-400 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-power-off"></i> Logout</button>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-slate-50">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{activeTab}</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1 italic">Dean of Students: {user.name} | {user.schoolName}</p>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* UPDATED METRICS INCLUDING SCHOOL MEAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-user-graduate"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enrolled Students</p><h2 className="text-2xl font-black text-slate-800">{stats.students}</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-exchange-alt"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transferred</p><h2 className="text-2xl font-black text-slate-800">0</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-medal"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean</p><h2 className="text-2xl font-black text-slate-800">{stats.meanGrade}</h2></div>
              </div>
            </div>
            
            <div className="bg-blue-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black italic uppercase mb-2">Student Oversight</h2>
                  <p className="max-w-md text-blue-200 font-medium leading-relaxed">Currently managing {stats.students} students in {user.schoolName}. You have {streams.length} active streams for enrollment.</p>
                </div>
                <i className="fas fa-id-card absolute -bottom-10 -right-10 text-[15rem] text-white/5 rotate-12"></i>
            </div>
          </div>
        )}

        {activeTab === 'Admissions' && (
          <form onSubmit={handleAdmission} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl space-y-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black uppercase italic text-blue-900 mb-4">Admission Form</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Full Name</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="Student Name" /></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Admission No</label><input type="text" required value={formData.admissionNumber} onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" placeholder="ADM-2024-001" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Curriculum</label><select value={formData.curriculum} onChange={(e) => setFormData({...formData, curriculum: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none"><option value="CBC">CBC (Grade-based)</option><option value="8-4-4">8-4-4 (Class-based)</option></select></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Grade / Class</label><input type="text" required value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none" placeholder="e.g. Grade 4 or Class 7" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Stream</label><select required value={formData.streamId} onChange={(e) => setFormData({...formData, streamId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none"><option value="">Select Stream</option>{streams.map(s => (<option key={s.id} value={s.id}>{s.stream_name}</option>))}</select></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none"><option value="Male">Male</option><option value="Female">Female</option></select></div>
            </div>
            <button type="submit" className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all">Register Student</button>
          </form>
        )}

        {activeTab === 'Config' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-black uppercase mb-6 italic text-blue-900">Configure Streams</h2>
            <div className="flex gap-4 mb-8">
              <input type="text" value={newStream} onChange={(e) => setNewStream(e.target.value)} placeholder="North, West, Red..." className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addStream} className="p-4 bg-blue-600 text-white rounded-2xl px-6 shadow-md hover:bg-blue-700 transition-all"><i className="fas fa-plus"></i></button>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Available Streams</p>
              {streams.map(s => (<div key={s.id} className="p-4 bg-slate-50 rounded-xl font-bold flex justify-between border border-slate-100"><span>{s.stream_name}</span><i className="fas fa-check-circle text-blue-500"></i></div>))}
              {streams.length === 0 && <p className="text-slate-400 italic text-sm">No streams added yet.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeanOfStudents;