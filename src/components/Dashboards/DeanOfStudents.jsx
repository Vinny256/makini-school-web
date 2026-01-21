import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const DeanOfStudents = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    curriculum: 'CBC', 
    gradeLevel: '',
    streamId: '',
    gender: 'Male',
    parentPhone: '' // Vinnie: Added parent phone for login logic
  });

  useEffect(() => {
    const fetchStatsAndStreams = async () => {
      try {
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
      await API.post('/dean/register-student', { ...formData, schoolId: user.schoolId });
      toast.success(`${formData.fullName} enrolled successfully!`);
      // Reset form including phone number
      setFormData({ fullName: '', admissionNumber: '', curriculum: 'CBC', gradeLevel: '', streamId: '', gender: 'Male', parentPhone: '' });
      setActiveTab('Overview');
    } catch (err) { 
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg); 
    }
  };

  const addStream = async () => {
    if (!newStream) return;
    try {
      await API.post('/dean/add-stream', { schoolId: user.schoolId, streamName: newStream });
      setNewStream('');
      toast.success("Stream added!");
      const res = await API.get(`/dean/streams/${user.schoolId}`);
      setStreams(res.data);
    } catch (err) { toast.error("Stream error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      
      {/* MOBILE HAMBURGER NAV - FIXED Z-INDEX */}
      <div className="md:hidden bg-blue-950 text-white p-4 flex justify-between items-center sticky top-0 z-[100] shadow-lg">
        <h2 className="font-black italic uppercase tracking-tighter">Vinnie <span className="text-blue-400">Dean</span></h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="w-12 h-12 flex items-center justify-center bg-blue-900 rounded-xl active:scale-90 transition-all border border-blue-800"
        >
          {/* Ensure FontAwesome CDN is in your index.html */}
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-2xl text-white`}></i>
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:relative w-72 bg-blue-950 text-white flex-col p-6 h-screen z-50
        ${isSidebarOpen ? 'flex' : 'hidden md:flex'}
      `}>
        <div className="mb-10 text-center hidden md:block">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <i className="fas fa-user-shield text-2xl text-white"></i>
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Dean <span className="text-blue-400">Portal</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => {setActiveTab('Overview'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-blue-200 hover:bg-blue-900'}`}>
            <i className="fas fa-chart-line"></i> Overview
          </button>
          <button onClick={() => {setActiveTab('Admissions'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Admissions' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-blue-200 hover:bg-blue-900'}`}>
            <i className="fas fa-user-plus"></i> Enroll Student
          </button>
          <button onClick={() => {setActiveTab('Config'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Config' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-blue-200 hover:bg-blue-900'}`}>
            <i className="fas fa-cog"></i> Setup Streams
          </button>
        </nav>

        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-400 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-slate-50">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{activeTab}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1 italic">Dean: {user.name} | {user.schoolName}</p>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-users"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enrolled Students</p><h2 className="text-2xl font-black text-slate-800">{stats.students}</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-exchange-alt"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transferred</p><h2 className="text-2xl font-black text-slate-800">0</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-medal"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean</p><h2 className="text-2xl font-black text-slate-800">{stats.meanGrade}</h2></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Admissions' && (
          <form onSubmit={handleAdmission} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl space-y-6">
            <h2 className="text-xl font-black uppercase italic text-blue-950 mb-4 border-b pb-4">New Student Enrollment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Full Name</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enter Full Name" /></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Admission No</label><input type="text" required value={formData.admissionNumber} onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="ADM/2026/001" /></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Curriculum</label><select value={formData.curriculum} onChange={(e) => setFormData({...formData, curriculum: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"><option value="CBC">CBC (Grade)</option><option value="8-4-4">8-4-4 (Class)</option></select></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Grade / Class</label><input type="text" required value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. Grade 4" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Parent Phone (Username)</label><input type="tel" required value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-blue-50 focus:border-blue-500 transition-all" placeholder="0712345678" /></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"><option value="Male">Male</option><option value="Female">Female</option></select></div>
            </div>

            <div><label className="block text-xs font-black uppercase mb-2 text-slate-400">Assign Stream</label><select required value={formData.streamId} onChange={(e) => setFormData({...formData, streamId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"><option value="">Select Stream</option>{streams.map(s => (<option key={s.id} value={s.id}>{s.stream_name}</option>))}</select></div>

            <button type="submit" className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">Submit Enrollment</button>
          </form>
        )}

        {activeTab === 'Config' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md">
            <h2 className="text-xl font-black uppercase mb-6 italic text-blue-950">Setup School Streams</h2>
            <div className="flex gap-4 mb-8">
              <input type="text" value={newStream} onChange={(e) => setNewStream(e.target.value)} placeholder="e.g. North, Red, West" className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addStream} className="p-4 bg-blue-600 text-white rounded-2xl px-6 hover:bg-blue-700 transition-all"><i className="fas fa-plus"></i></button>
            </div>
            <div className="space-y-3">
              {streams.map(s => (<div key={s.id} className="p-4 bg-slate-50 rounded-xl font-bold flex justify-between items-center border border-slate-100"><span>{s.stream_name}</span><i className="fas fa-check-circle text-blue-500"></i></div>))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeanOfStudents;