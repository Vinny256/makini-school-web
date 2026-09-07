import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';
import StaffManagement from './StaffManagement';

const Principal = ({ user }) => {
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Vinnie: This replaces the annoying alerts
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // States for Principal Academic & Examination module
  const [marksForm, setMarksForm] = useState({
    studentAdmission: '',
    subject: 'Mathematics',
    examType: 'Mid Term',
    score: ''
  });
  const [isSubmittingMarks, setIsSubmittingMarks] = useState(false);
  const [recentMarks, setRecentMarks] = useState([]);

  // States for SMS & Institutional Notices
  const [smsData, setSmsData] = useState({ targetGroup: 'All Parents', message: '' });
  const [isSendingSms, setIsSendingSms] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/admin/stats/${user.schoolId}`);
        setStats({
          staff: parseInt(res.data.staff) || 0,
          students: parseInt(res.data.students) || 0,
          meanGrade: res.data.meanGrade || '0.0'
        });
      } catch (err) {
        console.error("Stats error:", err);
      }
    };
    if (user.schoolId) fetchStats();
  }, [user.schoolId, activeTab]);

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (!marksForm.studentAdmission || !marksForm.score) {
      return toast.error("Please enter student admission and score.");
    }
    setIsSubmittingMarks(true);
    try {
      await API.post('/admin/academics/record-mark', {
        schoolId: user.schoolId,
        ...marksForm
      });
      toast.success(`Score for ${marksForm.studentAdmission} recorded!`);
      setRecentMarks([{ ...marksForm, id: Date.now() }, ...recentMarks]);
      setMarksForm({ ...marksForm, studentAdmission: '', score: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record mark.");
    } finally {
      setIsSubmittingMarks(false);
    }
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    if (!smsData.message.trim()) return toast.error("Please type a message.");
    setIsSendingSms(true);
    try {
      await API.post('/admin/communications/bulk-sms', {
        schoolId: user.schoolId,
        ...smsData
      });
      toast.success("Broadcast queued successfully!");
      setSmsData({ ...smsData, message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dispatch SMS.");
    } finally {
      setIsSendingSms(false);
    }
  };

  // Vinnie: Logic for the Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href='/';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 w-full">
      
      {/* MOBILE MENU - FIXED HAMBURGER */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <h2 className="font-black italic uppercase tracking-tighter">Vinnie <span className="text-blue-500">ERP</span></h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg active:scale-90 transition-all"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-xl text-blue-400`}></i>
        </button>
      </div>

      {/* COMMAND CENTER SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        fixed md:sticky top-0 left-0 w-72 min-w-[18rem] bg-slate-900 text-white flex flex-col p-6 h-screen z-40 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none shrink-0
      `}>
        <div className="hidden md:block mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <i className="fas fa-university text-2xl"></i>
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">Executive <span className="text-blue-500">Portal</span></h2>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
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

          <button 
            onClick={() => { setActiveTab('Enter Marks'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Enter Marks' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-marker"></i> <span>Enter Marks</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Students'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-user-graduate"></i> <span>Students Directory</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Fee Registry'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Fee Registry' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-receipt"></i> <span>Fee Operations</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Attendance'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Attendance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-clipboard-check"></i> <span>Attendance</span>
          </button>

          <button 
            onClick={() => { setActiveTab('School Timetable'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'School Timetable' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-calendar-alt"></i> <span>Master Timetable</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Bulk SMS Hub'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'Bulk SMS Hub' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <i className="fas fa-bullhorn"></i> <span>Bulk SMS Hub</span>
          </button>
        </nav>

        {/* VINNIE: CUSTOM EXIT CONFIRMATION (NO MORE ALERTS) */}
        {!showExitConfirm ? (
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="mt-6 flex items-center gap-4 w-full p-4 bg-red-600/10 text-red-500 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            <i className="fas fa-sign-out-alt"></i> Exit Portal
          </button>
        ) : (
          <div className="mt-6 p-4 bg-slate-800 rounded-2xl border border-slate-700 animate-in fade-in zoom-in duration-300">
            <p className="text-[10px] font-black uppercase text-center mb-3 tracking-tighter text-slate-400">Confirm Portal Exit?</p>
            <div className="flex gap-2">
              <button 
                onClick={handleLogout}
                className="flex-1 p-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase hover:bg-red-700 transition-all"
              >
                Yes
              </button>
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 p-2 bg-slate-700 text-white rounded-xl text-xs font-black uppercase hover:bg-slate-600 transition-all"
              >
                No
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 md:p-10 bg-slate-50 overflow-y-auto min-h-screen">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
              {activeTab}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
              Principal: {user.name} | {user.schoolName}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('Students')}
              className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-all shadow-md"
            >
              <i className="fas fa-user-graduate"></i> Registered Students
            </button>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Staff</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.staff}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Students</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.students}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  <i className="fas fa-medal"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">School Mean</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{stats.meanGrade}</h2>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-4">Institutional Oversight</h2>
                 <p className="max-w-md text-blue-200 font-medium leading-relaxed text-sm md:text-base">
                    All administrative departments are active. You are currently overseeing {stats.staff} staff members and {stats.students} students in {user.schoolName}.
                 </p>
               </div>
               <i className="fas fa-shield-alt absolute -bottom-10 -right-10 text-[12rem] md:text-[20rem] text-white/5 rotate-12"></i>
            </div>
          </div>
        )}

        {activeTab === 'Staff Management' && (
            <StaffManagement user={user} />
        )}

        {activeTab === 'Enter Marks' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
              <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight mb-2">
                Teacher-Principal Marks Entry Portal
              </h2>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Submit terminal scores, assessments, and continuous evaluations for your designated subjects.
              </p>

              <form onSubmit={handleSaveMarks} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Student Admission No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1042"
                      value={marksForm.studentAdmission}
                      onChange={(e) => setMarksForm({ ...marksForm, studentAdmission: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Subject
                    </label>
                    <select
                      value={marksForm.subject}
                      onChange={(e) => setMarksForm({ ...marksForm, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600 transition"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Kiswahili">Kiswahili</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="Biology">Biology</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="CRE">CRE</option>
                      <option value="Business Studies">Business Studies</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Computer Studies">Computer Studies</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Assessment Series
                    </label>
                    <select
                      value={marksForm.examType}
                      onChange={(e) => setMarksForm({ ...marksForm, examType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600 transition"
                    >
                      <option value="Opener Exam">Opener Exam</option>
                      <option value="Mid Term">Mid Term</option>
                      <option value="End Term">End Term</option>
                      <option value="Mock Evaluation">Mock Evaluation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Score / Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 84"
                      value={marksForm.score}
                      onChange={(e) => setMarksForm({ ...marksForm, score: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600 transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingMarks}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-2"
                >
                  {isSubmittingMarks ? 'Recording Assessment...' : 'Commit Student Mark'}
                </button>
              </form>
            </div>

            {/* Recents Table */}
            {recentMarks.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-wider">
                  Session Submissions
                </h3>
                <div className="divide-y divide-slate-100">
                  {recentMarks.map((m) => (
                    <div key={m.id} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-slate-800">Adm: {m.studentAdmission}</span>
                        <span className="text-slate-400 text-xs ml-3 font-semibold">{m.subject} ({m.examType})</span>
                      </div>
                      <span className="font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                        {m.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Students' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight">
                  Student Enrollment & Records
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Active roster count: {stats.students} Registered Learners
                </p>
              </div>
              <button 
                onClick={() => toast.success("Student admission workflow initiated.")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-blue-600/20"
              >
                <i className="fas fa-user-plus mr-2"></i> Enroll Student
              </button>
            </div>
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <i className="fas fa-graduation-cap text-4xl text-slate-400 mb-3"></i>
              <p className="text-sm font-bold text-slate-600">Student Directory Synchronized</p>
              <p className="text-xs text-slate-400 mt-1">Use class filters or the student roster to review enrollment files.</p>
            </div>
          </div>
        )}

        {activeTab === 'Fee Registry' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight">
                Institutional Financials & Fees
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Real-time collection reports, fee arrears, and payment reconciliations.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Term Invoices Issued</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">KES --</h3>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Collected Revenue</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-2">Active</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Attendance' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight">
                Daily School Attendance Logs
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Monitor teacher roll calls, staff biometric/daily check-ins, and learner status.
              </p>
            </div>
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <i className="fas fa-calendar-check text-4xl text-slate-400 mb-3"></i>
              <p className="text-sm font-bold text-slate-600">Daily Register In Session</p>
              <p className="text-xs text-slate-400 mt-1">Class registers auto-sync once finalized by respective class teachers.</p>
            </div>
          </div>
        )}

        {activeTab === 'School Timetable' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight">
                Master Schedule & Lesson Planner
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                View institutional schedules, class assignments, and teaching rotations.
              </p>
            </div>
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <i className="fas fa-clock text-4xl text-slate-400 mb-3"></i>
              <p className="text-sm font-bold text-slate-600">Timetable Structure Online</p>
              <p className="text-xs text-slate-400 mt-1">Curriculum load distribution is managed across active teaching staff.</p>
            </div>
          </div>
        )}

        {activeTab === 'Bulk SMS Hub' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl animate-in fade-in duration-300">
            <h2 className="text-lg font-black uppercase text-slate-800 tracking-tight mb-2">
              Broadcast Communications Engine
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Dispatch official SMS announcements directly to guardians, staff, or sponsors.
            </p>

            <form onSubmit={handleSendSMS} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Recipient Channel
                </label>
                <select
                  value={smsData.targetGroup}
                  onChange={(e) => setSmsData({ ...smsData, targetGroup: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600 transition"
                >
                  <option value="All Parents">All Parents & Guardians</option>
                  <option value="All Staff">School Staff & Faculty</option>
                  <option value="Fee Defaulters">Fee Defaulters Only</option>
                  <option value="Board of Management">Board of Management (B.O.M)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Notice Body
                </label>
                <textarea
                  rows="4"
                  placeholder="Enter official institutional dispatch message..."
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition resize-none"
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
      </main>
    </div>
  );
};

export default Principal;
