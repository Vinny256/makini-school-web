import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const DeanOfStudents = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  const [loading, setLoading] = useState(false); // Vinnie: For the loading bars
  
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState('');

  // Registry State
  const [registryFilters, setRegistryFilters] = useState({ grade: '', streamId: '' });
  const [studentList, setStudentList] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    curriculum: 'CBC', 
    gradeLevel: '',
    streamId: '',
    gender: 'Male',
    parentPhone: ''
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

  useEffect(() => {
    const fetchRegistry = async () => {
      if (activeTab === 'Registry' && registryFilters.grade && registryFilters.streamId) {
        try {
          const res = await API.get(`/dean/registry/${user.schoolId}`, { params: registryFilters });
          setStudentList(res.data);
        } catch (err) { console.error("Registry fetch error", err); }
      }
    };
    fetchRegistry();
  }, [registryFilters, activeTab, user.schoolId]);

  const handleAdmission = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await API.post('/dean/register-student', { ...formData, schoolId: user.schoolId });
      toast.success(`${formData.fullName} enrolled successfully!`);
      setFormData({ fullName: '', admissionNumber: '', curriculum: 'CBC', gradeLevel: '', streamId: '', gender: 'Male', parentPhone: '' });
      setActiveTab('Registry'); // Move to registry to see the new student
    } catch (err) { 
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg); 
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const deleteStudent = async (id) => {
    try {
      await API.delete(`/dean/student/${id}`);
      setStudentList(studentList.filter(s => s.id !== id));
      toast.success("Student removed");
      setConfirmDelete(null);
    } catch (err) { toast.error("Action failed"); }
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
      
      {/* VINNIE BOUNCE CSS */}
      <style>
        {`
          .loading-bars { display: flex; justify-content: center; align-items: center; gap: 4px; height: 18px; }
          .v-bar { width: 3px; height: 100%; background: white; animation: v-bounce 0.8s infinite ease-in-out; border-radius: 10px; }
          .v-bar:nth-child(2) { animation-delay: 0.1s; }
          .v-bar:nth-child(3) { animation-delay: 0.2s; }
          @keyframes v-bounce { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1.2); } }
        `}
      </style>

      {/* MOBILE NAV */}
      <div className="md:hidden bg-blue-950 text-white p-4 flex justify-between items-center sticky top-0 z-[100] shadow-lg">
        <h2 className="font-black italic uppercase tracking-tighter">Vinnie <span className="text-blue-400">Dean</span></h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 flex items-center justify-center bg-blue-900 rounded-lg active:scale-90 transition-all">
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl text-white`}></i>
        </button>
      </div>

      {/* SIDEBAR - UPDATED WITH REGISTRY */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:relative w-72 bg-blue-950 text-white flex-col p-6 h-screen z-50 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`}>
        <div className="mb-10 text-center hidden md:block">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"><i className="fas fa-user-shield text-2xl text-white"></i></div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Dean <span className="text-blue-400">Hub</span></h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => {setActiveTab('Overview'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Overview' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-chart-line"></i> Overview</button>
          
          {/* REGISTRY MOVED TO SIDEBAR */}
          <button onClick={() => {setActiveTab('Registry'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Registry' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-id-card"></i> Student Registry</button>
          
          <button onClick={() => {setActiveTab('Admissions'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Admissions' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-user-plus"></i> Enroll Student</button>
          <button onClick={() => {setActiveTab('Config'); setIsSidebarOpen(false);}} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Config' ? 'bg-blue-600 shadow-lg' : 'text-blue-200 hover:bg-blue-900'}`}><i className="fas fa-cog"></i> Setup Streams</button>
        </nav>
        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-400 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-sign-out-alt"></i> Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{activeTab}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1 italic tracking-tighter">Dean: {user.name} | {user.schoolName}</p>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-users text-blue-500"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enrolled Students</p><h2 className="text-2xl font-black text-slate-800">{stats.students}</h2></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-medal text-yellow-500"></i></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean</p><h2 className="text-2xl font-black text-slate-800">{stats.meanGrade}</h2></div>
              </div>
            </div>
            {/* REMOVED REGISTRY CARD FROM OVERVIEW */}
          </div>
        )}

        {activeTab === 'Registry' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4">
              <div className="flex-1"><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Grade/Form</label><input type="text" placeholder="e.g. Form 4 or Grade 8" value={registryFilters.grade} onChange={(e) => setRegistryFilters({...registryFilters, grade: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 focus:ring-blue-600" /></div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Stream</label>
                <select value={registryFilters.streamId} onChange={(e) => setRegistryFilters({...registryFilters, streamId: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border-none focus:ring-2 focus:ring-blue-600"><option value="">Select Stream</option>{streams.map(s => <option key={s.id} value={s.id}>{s.stream_name}</option>)}</select>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-blue-950 text-white text-[10px] uppercase font-black tracking-widest">
                  <tr><th className="p-5">Adm No</th><th className="p-5">Name</th><th className="p-5">D.O.B</th><th className="p-5 text-center">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentList.map(student => (
                    <tr key={student.id} className="hover:bg-blue-50/50 transition-all group font-bold text-slate-700">
                      <td className="p-5 text-blue-600">{student.admission_number}</td><td className="p-5">{student.full_name}</td>
                      <td className="p-5">{student.dob ? student.dob : <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full italic">Pending Update</span>}</td>
                      <td className="p-5 flex justify-center gap-2">
                        {confirmDelete === student.id ? (
                           <div className="flex items-center gap-2 animate-in zoom-in"><button onClick={() => deleteStudent(student.id)} className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-lg uppercase">Yes</button><button onClick={() => setConfirmDelete(null)} className="bg-slate-200 text-slate-600 text-[10px] px-3 py-1 rounded-lg uppercase">No</button></div>
                        ) : (
                          <button onClick={() => setConfirmDelete(student.id)} className="text-red-400 hover:text-red-600 transition-colors p-2"><i className="fas fa-user-minus"></i></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {studentList.length === 0 && <div className="p-20 text-center text-slate-400 font-bold italic">Select Filters to view students.</div>}
            </div>
          </div>
        )}

        {activeTab === 'Admissions' && (
          <form onSubmit={handleAdmission} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl space-y-6">
            <h2 className="text-xl font-black uppercase italic text-blue-950 mb-4 border-b pb-4">New Student Enrollment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Full Name</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Admission No</label><input type="text" required value={formData.admissionNumber} onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Curriculum</label><select value={formData.curriculum} onChange={(e) => setFormData({...formData, curriculum: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"><option value="CBC">CBC</option><option value="8-4-4">8-4-4</option></select></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">{formData.curriculum === '8-4-4' ? 'Form Level' : 'Grade Level'}</label><input type="text" required value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" placeholder={formData.curriculum === '8-4-4' ? "Form 4" : "Grade 8"} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Parent Phone (Login)</label><input type="tel" required value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-blue-50 focus:border-blue-500 transition-all" /></div>
              <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"><option value="Male">Male</option><option value="Female">Female</option></select></div>
            </div>
            <div><label className="block text-xs font-black uppercase mb-2 text-slate-400 tracking-widest">Assign Stream</label><select required value={formData.streamId} onChange={(e) => setFormData({...formData, streamId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"><option value="">Select Stream</option>{streams.map(s => (<option key={s.id} value={s.id}>{s.stream_name}</option>))}</select></div>
            
            <button type="submit" disabled={loading} className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center h-16">
              {loading ? (
                <div className="loading-bars"><div className="v-bar"></div><div className="v-bar"></div><div className="v-bar"></div></div>
              ) : (
                "Enroll Student"
              )}
            </button>
          </form>
        )}
        {/* Config Tab remains same... */}
      </main>
    </div>
  );
};

export default DeanOfStudents;