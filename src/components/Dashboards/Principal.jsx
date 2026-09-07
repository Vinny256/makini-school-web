import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

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

  // Stream Management State
  const [streams, setStreams] = useState(['East', 'West', 'North', 'South']);
  const [newStreamInput, setNewStreamInput] = useState('');

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
    curriculum: 'CBC (Junior/Senior)',
    gradeLevel: 'Grade 9',
    stream: 'East',
    upiNumber: '',
    guardianName: '',
    guardianPhone: '',
    boardingStatus: 'Boarding'
  });
  const [loadingStudent, setLoadingStudent] = useState(false);

  // Marks Entry State (Supports numeric & CBC Rubrics)
  const [markForm, setMarkForm] = useState({
    admissionNumber: '',
    curriculumSystem: 'CBC',
    subject: 'Integrated Science',
    assessmentSeries: 'End Term',
    score: '',
    cbcRubric: 'ME - Meeting Expectation'
  });
  const [loadingMark, setLoadingMark] = useState(false);

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
      console.error(err);
    }
  };

  // Fetch Staff List
  const fetchStaff = async () => {
    try {
      setFetchingStaff(true);
      const res = await API.get(`/staff/school/${user.schoolId}`);
      setStaffList(res.data);
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
      if (res.data.success) setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchStats();
      fetchStaff();
      fetchStudents();
    }
  }, [user?.schoolId]);

  // Handler: Add Custom Stream
  const handleAddStream = (e) => {
    e.preventDefault();
    const trimmed = newStreamInput.trim();
    if (!trimmed) return;
    if (streams.includes(trimmed)) return toast.error("Stream already registered!");
    setStreams([...streams, trimmed]);
    setNewStreamInput('');
    toast.success(`Stream "${trimmed}" activated.`);
  };

  // Handler: Register Staff Member
  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.fullName.trim()) return toast.error("Enter staff member's full name");

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
        curriculum: studentForm.curriculum,
        gradeLevel: studentForm.gradeLevel,
        stream: streams[0] || 'East',
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

  // Handler: Commit Assessment / Exam Marks
  const handleRecordMark = async (e) => {
    e.preventDefault();
    setLoadingMark(true);
    try {
      await API.post('/admin/academics/record-mark', {
        schoolId: user.schoolId,
        ...markForm
      });
      toast.success(`Assessment score saved for Adm: ${markForm.admissionNumber}`);
      setMarkForm({ ...markForm, admissionNumber: '', score: '' });
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to commit assessment");
    } finally {
      setLoadingMark(false);
    }
  };

  const copyCredentials = (code, pass, name) => {
    navigator.clipboard.writeText(`Staff: ${name}\nLogin Code: ${code}\nAccess Key: ${pass}`);
    toast.success(`Copied login details for ${name}`);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

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

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-3 ml-2 tracking-widest">Master Menu</p>
          
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
            <i className="fas fa-user-plus w-5"></i> <span>Admissions (CBC & 844)</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Enter Marks')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Enter Marks' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-marker w-5"></i> <span>Marks & CBC Rubrics</span>
          </button>
        </nav>

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

      {/* WORKSPACE AREA */}
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

        {/* 1. OVERVIEW TAB */}
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
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">School Stream Configurator</h3>
              <p className="text-xs text-slate-500 mb-6">
                Register customized class stream labels (e.g., East, Simba, Gold) used across both Junior School and 8-4-4 classes.
              </p>

              <form onSubmit={handleAddStream} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="New Stream Name (e.g. Simba, Green, North)"
                  value={newStreamInput}
                  onChange={(e) => setNewStreamInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition"
                >
                  Add Stream
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {streams.map((st, idx) => (
                  <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <i className="fas fa-tag text-blue-500 text-[10px]"></i> Stream {st}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. STAFF MANAGEMENT TAB (ALL ROLES) */}
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
                  <option value="Deputy Principal">Deputy Principal (Administration)</option>
                  <option value="Dean of Studies">Dean of Studies / Exams Officer</option>
                  <option value="Senior Teacher">Senior Master / Mistress (HOD)</option>
                  <option value="Class Teacher">Class / CBC Pathway Teacher</option>
                  <option value="Teacher">Subject Teacher</option>
                  <option value="Bursar">Bursar / Accounts Officer</option>
                  <option value="Secretary">School Secretary / Registrar</option>
                  <option value="Boarding Master">Boarding Master / Matron</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Storekeeper">Storekeeper / Procurement</option>
                </select>

                <button
                  type="submit"
                  disabled={loadingStaff}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition"
                >
                  {loadingStaff ? 'Registering...' : 'Register Staff'}
                </button>
              </form>
            </div>

            {/* Staff List Table */}
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

        {/* 4. STUDENT ADMISSIONS (CBC & 8-4-4 HYBRID) */}
        {activeTab === 'Student Admissions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Admit Learner: CBC & 8-4-4 Supported</h3>
              <p className="text-xs text-slate-500 mb-6">Enroll students into either Junior / Senior CBC or Form 3 / Form 4 cohorts.</p>

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
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Curriculum Framework</label>
                  <select
                    value={studentForm.curriculum}
                    onChange={(e) => {
                      const cur = e.target.value;
                      setStudentForm({ 
                        ...studentForm, 
                        curriculum: cur,
                        gradeLevel: cur.includes('CBC') ? 'Grade 9' : 'Form 3'
                      });
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="CBC (Junior/Senior)">CBC (Junior & Senior School)</option>
                    <option value="8-4-4 Secondary">8-4-4 Secondary</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Class / Grade Level</label>
                  <select
                    value={studentForm.gradeLevel}
                    onChange={(e) => setStudentForm({ ...studentForm, gradeLevel: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  >
                    {studentForm.curriculum.includes('CBC') ? (
                      <>
                        <option value="Grade 7">Grade 7 (Junior School)</option>
                        <option value="Grade 8">Grade 8 (Junior School)</option>
                        <option value="Grade 9">Grade 9 (Junior School)</option>
                        <option value="Grade 10">Grade 10 (Senior School)</option>
                      </>
                    ) : (
                      <>
                        <option value="Form 3">Form 3 (8-4-4)</option>
                        <option value="Form 4">Form 4 (8-4-4)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Stream Allocation</label>
                  <select
                    value={studentForm.stream}
                    onChange={(e) => setStudentForm({ ...studentForm, stream: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  >
                    {streams.map((st, i) => (
                      <option key={i} value={st}>{st}</option>
                    ))}
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
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20"
                  >
                    {loadingStudent ? 'Enrolling...' : 'Admit Learner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. ENTER MARKS (CBC RUBRICS & 8-4-4 PERCENTAGES) */}
        {activeTab === 'Enter Marks' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-xl animate-in fade-in duration-300">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Examination & Assessment Entry</h3>
            <p className="text-xs text-slate-500 mb-6">Input numeric percentages or CBC expectation levels.</p>

            <form onSubmit={handleRecordMark} className="space-y-4">
              <input
                type="text"
                placeholder="Learner Admission Number"
                value={markForm.admissionNumber}
                onChange={(e) => setMarkForm({ ...markForm, admissionNumber: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={markForm.curriculumSystem}
                  onChange={(e) => setMarkForm({ ...markForm, curriculumSystem: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                >
                  <option value="CBC">CBC Assessment</option>
                  <option value="844">8-4-4 Traditional Exam</option>
                </select>

                <select
                  value={markForm.assessmentSeries}
                  onChange={(e) => setMarkForm({ ...markForm, assessmentSeries: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                >
                  <option value="Opener">Opener Exam</option>
                  <option value="Mid Term">Mid Term Assessment</option>
                  <option value="End Term">End Term Exam</option>
                </select>
              </div>

              {markForm.curriculumSystem === 'CBC' ? (
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Performance Level</label>
                  <select
                    value={markForm.cbcRubric}
                    onChange={(e) => setMarkForm({ ...markForm, cbcRubric: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="EE - Exceeding Expectation">Level 4: EE (Exceeding Expectation)</option>
                    <option value="ME - Meeting Expectation">Level 3: ME (Meeting Expectation)</option>
                    <option value="AE - Approaching Expectation">Level 2: AE (Approaching Expectation)</option>
                    <option value="BE - Below Expectation">Level 1: BE (Below Expectation)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Percentage Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score (0 - 100)"
                    value={markForm.score}
                    onChange={(e) => setMarkForm({ ...markForm, score: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loadingMark}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                {loadingMark ? 'Saving...' : 'Commit Evaluation'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Principal;
