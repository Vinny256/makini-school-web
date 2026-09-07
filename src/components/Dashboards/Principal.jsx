import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';
import EnterMarks from '../Admin/EnterMarks';

const Principal = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Executive Overview State
  const [stats, setStats] = useState({ 
    staff: 0, 
    students: 0, 
    meanGrade: 'N/A', 
    distribution: { boarding: 0, day: 0 } 
  });

  // Stream Management State (Loaded Dynamically)
  const [streams, setStreams] = useState([]);
  const [newStreamInput, setNewStreamInput] = useState('');
  const [loadingStream, setLoadingStream] = useState(false);

  // Class Levels State (Grades 1-12 & Form 1-4)
  const [classes, setClasses] = useState([]);
  const [newClassForm, setNewClassForm] = useState({
    className: '',
    curriculum: 'CBC',
    tier: 'Junior School'
  });
  const [loadingClass, setLoadingClass] = useState(false);

  // Staff Management State
  const [staffList, setStaffList] = useState([]);
  const [staffForm, setStaffForm] = useState({ fullName: '', role: 'Teacher' });
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(false);

  // Student Admissions State (CBC + 8-4-4 Hybrid)
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    admissionNumber: '',
    fullName: '',
    curriculum: 'CBC',
    gradeLevel: '',
    stream: '',
    upiNumber: '',
    guardianName: '',
    guardianPhone: '',
    boardingStatus: 'Boarding'
  });
  const [loadingStudent, setLoadingStudent] = useState(false);

  // Bulk SMS State
  const [smsData, setSmsData] = useState({ targetGroup: 'All Parents', message: '' });
  const [isSendingSms, setIsSendingSms] = useState(false);

  // Fetch Institutional Metrics
  const fetchStats = async () => {
    try {
      const res = await API.get(`/admin/stats/${user.schoolId}`);
      if (res.data.success) {
        setStats({
          staff: res.data.staff,
          students: res.data.students,
          meanGrade: res.data.meanGrade,
          distribution: res.data.distribution || { boarding: 0, day: 0 }
        });
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  // Fetch Dynamic Streams from Database
  const fetchStreams = async () => {
    try {
      const res = await API.get(`/academics/streams/${user.schoolId}`);
      if (res.data.success) {
        setStreams(res.data.streams || []);
        if (res.data.streams.length > 0 && !studentForm.stream) {
          setStudentForm(prev => ({ ...prev, stream: res.data.streams[0].stream_name }));
        }
      }
    } catch (err) {
      console.error("Streams fetch error:", err);
    }
  };

  // Fetch Dynamic Classes from Database
  const fetchClasses = async () => {
    try {
      const res = await API.get(`/academics/classes/${user.schoolId}`);
      if (res.data.success) {
        setClasses(res.data.classes || []);
        if (res.data.classes.length > 0 && !studentForm.gradeLevel) {
          setStudentForm(prev => ({ 
            ...prev, 
            gradeLevel: res.data.classes[0].class_name,
            curriculum: res.data.classes[0].curriculum 
          }));
        }
      }
    } catch (err) {
      console.error("Classes fetch error:", err);
    }
  };

  // Fetch Staff List
  const fetchStaff = async () => {
    try {
      setFetchingStaff(true);
      const res = await API.get(`/staff/school/${user.schoolId}`);
      setStaffList(res.data || []);
    } catch (err) {
      toast.error("Failed to load staff directory");
    } finally {
      setFetchingStaff(false);
    }
  };

  // Fetch Students List
  const fetchStudents = async () => {
    try {
      const res = await API.get(`/students/school/${user.schoolId}`);
      if (res.data.success) setStudents(res.data.students || []);
    } catch (err) {
      console.error("Students fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchStats();
      fetchStreams();
      fetchClasses();
      fetchStaff();
      fetchStudents();
    }
  }, [user?.schoolId]);

  // Handler: Add Stream to Database
  const handleAddStream = async (e) => {
    e.preventDefault();
    const cleanStream = newStreamInput.trim();
    if (!cleanStream) return;

    setLoadingStream(true);
    try {
      const res = await API.post('/academics/streams', {
        schoolId: user.schoolId,
        streamName: cleanStream
      });
      toast.success(res.data.message || `Stream "${cleanStream}" registered!`);
      setNewStreamInput('');
      fetchStreams();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create stream");
    } finally {
      setLoadingStream(false);
    }
  };

  // Handler: Delete Stream
  const handleDeleteStream = async (streamId, streamName) => {
    if (!window.confirm(`Delete stream "${streamName}"?`)) return;
    try {
      await API.delete(`/academics/streams/${streamId}`);
      toast.success(`Stream "${streamName}" deleted`);
      fetchStreams();
    } catch (err) {
      toast.error("Failed to delete stream");
    }
  };

  // Handler: Add Class Level to Database
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassForm.className.trim()) return;

    setLoadingClass(true);
    try {
      const res = await API.post('/academics/classes', {
        schoolId: user.schoolId,
        className: newClassForm.className.trim(),
        curriculum: newClassForm.curriculum,
        tier: newClassForm.tier
      });
      toast.success(res.data.message || `Class "${newClassForm.className}" added!`);
      setNewClassForm({ className: '', curriculum: 'CBC', tier: 'Junior School' });
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add class");
    } finally {
      setLoadingClass(false);
    }
  };

  // Handler: Delete Class Level
  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Delete class "${className}"?`)) return;
    try {
      await API.delete(`/academics/classes/${classId}`);
      toast.success(`Class "${className}" removed`);
      fetchClasses();
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  // Handler: Register Staff Member
  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.fullName.trim()) return toast.error("Enter staff full name");

    setLoadingStaff(true);
    try {
      const res = await API.post('/staff/register', {
        schoolId: user.schoolId,
        fullName: staffForm.fullName.trim(),
        role: staffForm.role
      });

      toast.success(
        `Staff Created: ${res.data.staff.staff_code} | Key: ${res.data.staff.password}`, 
        { duration: 8000 }
      );
      setStaffForm({ fullName: '', role: 'Teacher' });
      fetchStaff();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoadingStaff(false);
    }
  };

  // Handler: Admit Student
  const handleAdmitStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.stream) {
      return toast.error("Please add and select a stream first.");
    }
    if (!studentForm.gradeLevel) {
      return toast.error("Please add and select a class first.");
    }

    setLoadingStudent(true);
    try {
      const res = await API.post('/students/register', {
        schoolId: user.schoolId,
        ...studentForm
      });
      toast.success(`Learner Admitted: ${res.data.student.full_name} (${res.data.student.admission_number})`);
      setStudentForm({
        admissionNumber: '',
        fullName: '',
        curriculum: classes[0]?.curriculum || 'CBC',
        gradeLevel: classes[0]?.class_name || '',
        stream: streams[0]?.stream_name || '',
        upiNumber: '',
        guardianName: '',
        guardianPhone: '',
        boardingStatus: 'Boarding'
      });
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Student admission failed");
    } finally {
      setLoadingStudent(false);
    }
  };

  // Handler: Send Bulk SMS
  const handleSendSMS = async (e) => {
    e.preventDefault();
    if (!smsData.message.trim()) return toast.error("Please enter a notice message.");

    setIsSendingSms(true);
    try {
      await API.post('/admin/communications/bulk-sms', {
        schoolId: user.schoolId,
        ...smsData
      });
      toast.success("Broadcast dispatched successfully!");
      setSmsData({ ...smsData, message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dispatch SMS.");
    } finally {
      setIsSendingSms(false);
    }
  };

  const copyCredentials = (code, pass, name) => {
    navigator.clipboard.writeText(`Staff: ${name}\nLogin Code: ${code}\nAccess Key: ${pass}`);
    toast.success(`Copied credentials for ${name}`);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Helper renderer for placeholder modules
  const renderComingSoon = (title, description, icon) => (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 border border-blue-100">
        <i className={`fas ${icon}`}></i>
      </div>
      <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-full tracking-wider mb-2">
        Updating Soon
      </span>
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
      <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row w-full overflow-x-hidden">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-slate-900 text-white px-5 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm shadow-md">
            <i className="fas fa-university text-white"></i>
          </div>
          <div>
            <h2 className="text-sm font-black italic uppercase tracking-tight leading-none">
              Executive <span className="text-blue-500">Portal</span>
            </h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {user?.schoolName || 'School Workspace'}
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-blue-400 active:scale-95 transition"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* COMMAND CENTER SIDEBAR */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-72 bg-slate-900 text-white flex flex-col p-6 h-screen z-50 transition-transform duration-300 ease-in-out shadow-2xl
        md:sticky md:top-0 md:translate-x-0 md:shadow-none md:shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:block mb-8 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <i className="fas fa-university text-2xl"></i>
          </div>
          <h2 className="text-base font-black uppercase italic tracking-wider">
            Executive <span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {user?.schoolName}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-2 ml-2 tracking-widest">Active Modules</p>
          
          <button 
            type="button"
            onClick={() => switchTab('Overview')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-chart-pie w-5"></i> <span>Overview</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Staff Management')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Staff Management' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-users-cog w-5"></i> <span>Staff Control</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Stream Management')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Stream Management' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-layer-group w-5"></i> <span>Streams & Classes</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Student Admissions')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Student Admissions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-user-plus w-5"></i> <span>Admissions (CBC/844)</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Students')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-user-graduate w-5"></i> <span>Learners Directory</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Enter Marks')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Enter Marks' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-marker w-5"></i> <span>Marks & CBC Grading</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Bulk SMS Hub')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Bulk SMS Hub' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-bullhorn w-5"></i> <span>Bulk SMS Hub</span>
          </button>

          <p className="text-slate-500 text-[10px] font-black uppercase pt-4 mb-2 ml-2 tracking-widest">Institutional Desks</p>

          <button 
            type="button"
            onClick={() => switchTab('Exam Analysis')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Exam Analysis' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-file-alt w-5"></i> <span>Exam Analysis</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Fee Operations')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Fee Operations' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-receipt w-5"></i> <span>Fee Ledger</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Attendance')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Attendance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-clipboard-check w-5"></i> <span>Roll Call & Attendance</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Discipline')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Discipline' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-gavel w-5"></i> <span>Discipline Desk</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('School Timetable')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'School Timetable' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-calendar-alt w-5"></i> <span>Master Timetable</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Hostels')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Hostels' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-bed w-5"></i> <span>Boarding & Hostels</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Library')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Library' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-book w-5"></i> <span>Library Registry</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Inventory')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Inventory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-boxes w-5"></i> <span>Stores & Assets</span>
          </button>
        </nav>

        {/* LOGOUT */}
        <div className="pt-4 border-t border-slate-800 mt-auto">
          {!showExitConfirm ? (
            <button 
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-3 w-full p-3.5 bg-red-600/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
            >
              <i className="fas fa-sign-out-alt w-5"></i> Exit Portal
            </button>
          ) : (
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 animate-in fade-in">
              <p className="text-[10px] font-black uppercase text-center mb-2 text-slate-400">Confirm Exit?</p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => { localStorage.clear(); window.location.href = '/'; }}
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

      {/* WORKSPACE CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight italic uppercase">
              {activeTab}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-wider mt-0.5">
              Principal: {user?.fullName || user?.name} | {user?.schoolName}
            </p>
          </div>
        </header>

        {/* 1. OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Staff</p>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.staff}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Learners</p>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.students}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">School Mean</p>
                <h2 className="text-2xl font-black text-blue-600 mt-1">{stats.meanGrade}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Boarding / Day</p>
                <h2 className="text-xl font-black text-slate-800 mt-1">
                  {stats.distribution.boarding} / {stats.distribution.day}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* 2. STREAM & CLASS MANAGEMENT */}
        {activeTab === 'Stream Management' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* STREAM CONFIGURATOR */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">School Stream Configurator</h3>
              <p className="text-xs text-slate-500 mb-6">
                Active streams saved directly to the database. These dynamically populate all student admissions and teacher allocations.
              </p>

              <form onSubmit={handleAddStream} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="New Stream Name (e.g. Simba, Red, East)"
                  value={newStreamInput}
                  onChange={(e) => setNewStreamInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                  required
                />
                <button
                  type="submit"
                  disabled={loadingStream}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition disabled:opacity-50"
                >
                  {loadingStream ? 'Saving...' : 'Add Stream'}
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {streams.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold">No streams created yet. Add one above.</p>
                ) : (
                  streams.map((st) => (
                    <span 
                      key={st.id} 
                      className="bg-slate-100 border border-slate-200 text-slate-700 pl-4 pr-2 py-2 rounded-xl text-xs font-bold flex items-center gap-3"
                    >
                      <span>Stream {st.stream_name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteStream(st.id, st.stream_name)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* CLASS LEVELS CONFIGURATOR */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">School Class Levels (CBC & 8-4-4)</h3>
              <p className="text-xs text-slate-500 mb-6">
                Manage Grade 1 through Grade 12 (CBC) and Form 1 through Form 4. Remove any levels this institution does not host.
              </p>

              <form onSubmit={handleAddClass} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Class Name (e.g. Grade 10)"
                  value={newClassForm.className}
                  onChange={(e) => setNewClassForm({ ...newClassForm, className: e.target.value })}
                  className="sm:col-span-2 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                  required
                />
                <select
                  value={newClassForm.curriculum}
                  onChange={(e) => setNewClassForm({ ...newClassForm, curriculum: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                >
                  <option value="CBC">CBC Framework</option>
                  <option value="8-4-4">8-4-4 System</option>
                </select>
                <button
                  type="submit"
                  disabled={loadingClass}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl transition disabled:opacity-50"
                >
                  {loadingClass ? 'Saving...' : 'Add Class'}
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {classes.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold">No classes registered yet. Add one above.</p>
                ) : (
                  classes.map((c) => (
                    <span 
                      key={c.id} 
                      className="bg-slate-100 border border-slate-200 text-slate-800 pl-3 pr-2 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      <span>{c.class_name}</span>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-black">{c.curriculum}</span>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteClass(c.id, c.class_name)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                      >
                        <i className="fas fa-times text-[10px]"></i>
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* 3. STAFF MANAGEMENT */}
        {activeTab === 'Staff Management' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-4">Register Faculty & Operational Staff</h3>
              
              <form onSubmit={handleRegisterStaff} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Geoffrey Mutua)"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                  required
                />
                
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full md:w-64 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                >
                  <option value="Deputy Principal">Deputy Principal (Admin)</option>
                  <option value="Dean of Studies">Dean of Studies / Exams</option>
                  <option value="Senior Teacher">Senior Master / Mistress (HOD)</option>
                  <option value="Class Teacher">Class / CBC Pathway Teacher</option>
                  <option value="Teacher">Subject Teacher</option>
                  <option value="Bursar">Bursar / Accounts Officer</option>
                  <option value="Secretary">Secretary / Registrar</option>
                  <option value="Boarding Master">Boarding Master / Matron</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Storekeeper">Storekeeper / Procurement</option>
                </select>

                <button
                  type="submit"
                  disabled={loadingStaff}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition disabled:opacity-50"
                >
                  {loadingStaff ? 'Registering...' : 'Register Staff'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Login Code</th>
                    <th className="p-4">Access Key</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                  {staffList.map((m) => (
                    <tr key={m.id}>
                      <td className="p-4 font-bold text-slate-900">{m.full_name}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {m.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-blue-600">{m.staff_code || m.vinnie_digital_code}</td>
                      <td className="p-4 font-mono font-bold text-emerald-600">{m.password || m.access_key}</td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => copyCredentials(m.staff_code || m.vinnie_digital_code, m.password || m.access_key, m.full_name)}
                          className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. STUDENT ADMISSIONS */}
        {activeTab === 'Student Admissions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Admit Learner: Dynamic Classes & Streams</h3>
              <p className="text-xs text-slate-500 mb-6">Enroll students into any configured grade level (Grade 1-12 or Form 1-4) with assigned stream.</p>

              <form onSubmit={handleAdmitStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Admission Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 1084"
                    value={studentForm.admissionNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, admissionNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Learner's Full Name"
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Class / Grade Level</label>
                  <select
                    value={studentForm.gradeLevel}
                    onChange={(e) => {
                      const selectedClassName = e.target.value;
                      const matchedClass = classes.find(c => c.class_name === selectedClassName);
                      setStudentForm({ 
                        ...studentForm, 
                        gradeLevel: selectedClassName,
                        curriculum: matchedClass?.curriculum || 'CBC'
                      });
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                    required
                  >
                    {classes.length === 0 ? (
                      <option value="">No classes found - configure in Streams & Classes</option>
                    ) : (
                      classes.map((c) => (
                        <option key={c.id} value={c.class_name}>
                          {c.class_name} ({c.tier} — {c.curriculum})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Stream Allocation</label>
                  <select
                    value={studentForm.stream}
                    onChange={(e) => setStudentForm({ ...studentForm, stream: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                    required
                  >
                    {streams.length === 0 ? (
                      <option value="">No streams found - configure in Streams & Classes</option>
                    ) : (
                      streams.map((st) => (
                        <option key={st.id} value={st.stream_name}>{st.stream_name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">NEMIS / UPI Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC123XYZ"
                    value={studentForm.upiNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, upiNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Guardian Phone (SMS)</label>
                  <input
                    type="text"
                    placeholder="07XXXXXXXX"
                    value={studentForm.guardianPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Accommodation Status</label>
                  <select
                    value={studentForm.boardingStatus}
                    onChange={(e) => setStudentForm({ ...studentForm, boardingStatus: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="Boarding">Boarding Scholar</option>
                    <option value="Day">Day Scholar</option>
                  </select>
                </div>

                <div className="sm:col-span-3 mt-2">
                  <button
                    type="submit"
                    disabled={loadingStudent}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {loadingStudent ? 'Enrolling...' : 'Admit Learner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. STUDENTS DIRECTORY */}
        {activeTab === 'Students' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black uppercase text-slate-800 tracking-tight">Active Learners Roster</h3>
                <p className="text-xs text-slate-400 font-semibold">{students.length} Learners Enrolled</p>
              </div>
              <button
                type="button"
                onClick={() => switchTab('Student Admissions')}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-xl"
              >
                + New Admission
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-4">Adm No.</th>
                    <th className="p-4">Learner Name</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Stream</th>
                    <th className="p-4">Guardian Phone</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-mono font-bold text-blue-600">{st.admission_number}</td>
                      <td className="p-4 font-bold text-slate-900">{st.full_name}</td>
                      <td className="p-4">{st.grade_level}</td>
                      <td className="p-4">{st.stream}</td>
                      <td className="p-4 font-mono text-slate-600">{st.guardian_phone}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">
                          {st.boarding_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. ENTER MARKS (MODULAR) */}
        {activeTab === 'Enter Marks' && (
          <EnterMarks user={user} />
        )}

        {/* 7. BULK SMS HUB */}
        {activeTab === 'Bulk SMS Hub' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl animate-in fade-in duration-300">
            <h2 className="text-base sm:text-lg font-black uppercase text-slate-800 tracking-tight mb-1">
              Broadcast Communications Engine
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Dispatch official SMS announcements directly to guardians or staff.
            </p>

            <form onSubmit={handleSendSMS} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Recipient Group
                </label>
                <select
                  value={smsData.targetGroup}
                  onChange={(e) => setSmsData({ ...smsData, targetGroup: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                >
                  <option value="All Parents">All Parents & Guardians</option>
                  <option value="All Staff">School Staff & Faculty</option>
                  <option value="Fee Defaulters">Fee Defaulters Only</option>
                  <option value="Board of Management">Board of Management (B.O.M)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Message Content
                </label>
                <textarea
                  rows="4"
                  placeholder="Type official notification message..."
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-blue-600 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSendingSms}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isSendingSms ? 'Transmitting SMS...' : 'Dispatch Broadcast SMS'}
              </button>
            </form>
          </div>
        )}

        {/* 8. PLACEHOLDER / SOON MODULES */}
        {activeTab === 'Exam Analysis' && renderComingSoon(
          'Academic Merit & Exam Analysis',
          'Dean of Studies analytical reports, subject performance breakdowns, and report card generation will appear here.',
          'fa-file-alt'
        )}

        {activeTab === 'Fee Operations' && renderComingSoon(
          'Fee Ledger & Receipts',
          'Bursar payment recording, votehead allocations, fee balances, and M-Pesa reconciliations will appear here.',
          'fa-receipt'
        )}

        {activeTab === 'Attendance' && renderComingSoon(
          'Roll Call & Biometrics',
          'Class attendance registers, morning roll call sync, and absenteeism alerts will appear here.',
          'fa-clipboard-check'
        )}

        {activeTab === 'Discipline' && renderComingSoon(
          'Discipline & Conduct Records',
          'Deputy Principal conduct logs, summons letters, incident tracking, and disciplinary actions will appear here.',
          'fa-gavel'
        )}

        {activeTab === 'School Timetable' && renderComingSoon(
          'Master Timetable & Lesson Scheduler',
          'Lesson distribution tables, room allocations, and individual teacher teaching timetables will appear here.',
          'fa-calendar-alt'
        )}

        {activeTab === 'Hostels' && renderComingSoon(
          'Hostels & Boarding Desks',
          'Dormitory bed assignments, boarding inventory, and night roll call management will appear here.',
          'fa-bed'
        )}

        {activeTab === 'Library' && renderComingSoon(
          'Library Resource Center',
          'Textbook circulation, book cataloging, borrower tracking, and overdue recovery will appear here.',
          'fa-book'
        )}

        {activeTab === 'Inventory' && renderComingSoon(
          'Stores & School Supplies',
          'Laboratory equipment logs, kitchen rations, stationery stock, and asset registers will appear here.',
          'fa-boxes'
        )}

      </main>
    </div>
  );
};

export default Principal;
