import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const DeanOfStudents = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ staff: 0, students: 0 });
  
  // Configuration State
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState('');

  // Admission Form State
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    curriculum: 'CBC', // Default to CBC
    gradeLevel: '',
    streamId: '',
    gender: 'Male'
  });

  useEffect(() => {
    const fetchStatsAndStreams = async () => {
      try {
        const statsRes = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({ staff: statsRes.data.staff, students: statsRes.data.students });
        
        const streamsRes = await API.get(`/admin/streams/${user.schoolId}`);
        setStreams(streamsRes.data);
      } catch (err) { console.error("Data fetch error", err); }
    };
    if (user.schoolId) fetchStatsAndStreams();
  }, [user.schoolId, activeTab]);

  const handleAdmission = async (e) => {
    e.preventDefault();
    try {
      await API.post('/students/register', { ...formData, schoolId: user.schoolId });
      toast.success(`${formData.fullName} enrolled successfully!`);
      setActiveTab('Overview');
    } catch (err) { toast.error("Registration failed"); }
  };

  const addStream = async () => {
    if (!newStream) return;
    try {
      await API.post('/admin/add-stream', { schoolId: user.schoolId, streamName: newStream });
      setNewStream('');
      toast.success("Stream added!");
      setActiveTab('Overview');
    } catch (err) { toast.error("Stream error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* MOBILE HAMBURGER NAV */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="font-black italic uppercase">Vinnie <span className="text-blue-400">Dean</span></h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl">
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'fixed inset-0 translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 md:relative w-72 bg-blue-950 text-white flex-col p-6 z-40 h-screen flex`}>
        <div className="mb-10 text-center hidden md:block">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"><i className="fas fa-user-shield text-2xl"></i></div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Dean <span className="text-blue-400">Portal</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => {setActiveTab('Overview'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold ${activeTab === 'Overview' ? 'bg-blue-600' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-th-large"></i> Overview</button>
          <button onClick={() => {setActiveTab('Admissions'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold ${activeTab === 'Admissions' ? 'bg-blue-600' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-user-plus"></i> Enroll Student</button>
          <button onClick={() => {setActiveTab('Config'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold ${activeTab === 'Config' ? 'bg-blue-600' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-cog"></i> Setup Streams</button>
        </nav>

        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-400 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-power-off"></i> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{activeTab}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Dean: {user.name} | {user.schoolName}</p>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl"><i className="fas fa-user-graduate"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enrolled Students</p><h2 className="text-2xl font-black">{stats.students}</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl"><i className="fas fa-exchange-alt"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transferred</p><h2 className="text-2xl font-black">0</h2></div>
              </div>
            </div>
            
            <div className="bg-blue-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black italic uppercase mb-2">Admissions Active</h2>
                <p className="max-w-md text-blue-200 font-medium">Currently managing {stats.students} students across {streams.length} configured streams.</p>
                <i className="fas fa-id-card absolute -bottom-10 -right-10 text-[15rem] text-white/5 rotate-12"></i>
            </div>
          </div>
        )}

        {activeTab === 'Admissions' && (
          <form onSubmit={handleAdmission} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Full Name</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-blue-500" placeholder="Student Name" /></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Admission No</label><input type="text" required value={formData.admissionNumber} onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none" placeholder="ADM-001" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Curriculum</label><select value={formData.curriculum} onChange={(e) => setFormData({...formData, curriculum: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none"><option value="CBC">CBC (Grade)</option><option value="8-4-4">8-4-4 (Class)</option></select></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Grade / Class</label><input type="text" required value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none" placeholder="e.g. Grade 4 or Class 7" /></div>
            </div>
            <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Stream</label><select required value={formData.streamId} onChange={(e) => setFormData({...formData, streamId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none"><option value="">Select Stream</option>{streams.map(s => (<option key={s.id} value={s.id}>{s.stream_name}</option>))}</select></div>
            <button type="submit" className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">Submit Admission</button>
          </form>
        )}

        {activeTab === 'Config' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md">
            <h2 className="text-xl font-black uppercase mb-6 italic">School Streams</h2>
            <div className="flex gap-4 mb-8"><input type="text" value={newStream} onChange={(e) => setNewStream(e.target.value)} placeholder="e.g. North, Blue, Red" className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold border-none" /><button onClick={addStream} className="p-4 bg-blue-600 text-white rounded-2xl px-6"><i className="fas fa-plus"></i></button></div>
            <div className="space-y-3">{streams.map(s => (<div key={s.id} className="p-4 bg-slate-50 rounded-xl font-bold flex justify-between"><span>{s.stream_name}</span><i className="fas fa-check text-green-500"></i></div>))}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeanOfStudents;