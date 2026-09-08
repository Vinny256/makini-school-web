import React, { useState } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';
import EnterMarks from '../Admin/EnterMarks';
import StreamClassManagement from '../Admin/StreamClassManagement';
import SubjectsAndExamsControl from '../Admin/SubjectsAndExamsControl'; // Added import for subjects & exams control
import StudentAdmissions from '../Admin/StudentAdmissions';
import LearnersDirectory from '../Admin/LearnersDirectory';
import Overview from '../Admin/Overview';

const DeputyPrincipal = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Bulk SMS State
  const [smsData, setSmsData] = useState({ targetGroup: 'All Parents', message: '' });
  const [isSendingSms, setIsSendingSms] = useState(false);

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

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

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
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm shadow-md">
            <i className="fas fa-shield-alt text-white"></i>
          </div>
          <div>
            <h2 className="text-sm font-black italic uppercase tracking-tight leading-none">
              Deputy <span className="text-indigo-400">Portal</span>
            </h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {user?.schoolName || 'School Workspace'}
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-indigo-400 active:scale-95 transition"
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
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
            <i className="fas fa-shield-alt text-2xl"></i>
          </div>
          <h2 className="text-base font-black uppercase italic tracking-wider">
            Deputy <span className="text-indigo-400">Portal</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {user?.schoolName}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-2 ml-2 tracking-widest">Active Operations</p>
          
          <button 
            type="button"
            onClick={() => switchTab('Overview')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-chart-pie w-5"></i> <span>Overview</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Stream Management')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Stream Management' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-layer-group w-5"></i> <span>Streams & Classes</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Subjects & Exams')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Subjects & Exams' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-book-open w-5"></i> <span>Subjects & Exams</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Student Admissions')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Student Admissions' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-user-plus w-5"></i> <span>Admissions (CBC/844)</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Students')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Students' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-user-graduate w-5"></i> <span>Learners Directory</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Enter Marks')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Enter Marks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-marker w-5"></i> <span>Marks & CBC Grading</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Bulk SMS Hub')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Bulk SMS Hub' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-bullhorn w-5"></i> <span>Bulk SMS Hub</span>
          </button>

          <p className="text-slate-500 text-[10px] font-black uppercase pt-4 mb-2 ml-2 tracking-widest">Institutional Desks</p>

          <button 
            type="button"
            onClick={() => switchTab('Attendance')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Attendance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-clipboard-check w-5"></i> <span>Roll Call & Attendance</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Discipline')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Discipline' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-gavel w-5"></i> <span>Discipline Desk</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('School Timetable')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'School Timetable' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-calendar-alt w-5"></i> <span>Master Timetable</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Exam Analysis')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Exam Analysis' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-file-alt w-5"></i> <span>Exam Analysis</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Hostels')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Hostels' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-bed w-5"></i> <span>Boarding & Hostels</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Fee Operations')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Fee Operations' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-receipt w-5"></i> <span>Fee Ledger</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Library')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Library' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-book w-5"></i> <span>Library Registry</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Inventory')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Inventory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'
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
              Deputy Principal: {user?.fullName || user?.name} | {user?.schoolName}
            </p>
          </div>
        </header>

        {/* 1. UNIVERSAL OVERVIEW */}
        {activeTab === 'Overview' && (
          <Overview user={user} />
        )}

        {/* 2. OPERATIONAL MODULES */}
        {activeTab === 'Stream Management' && (
          <StreamClassManagement user={user} />
        )}

        {activeTab === 'Subjects & Exams' && (
          <SubjectsAndExamsControl user={user} />
        )}

        {activeTab === 'Student Admissions' && (
          <StudentAdmissions user={user} />
        )}

        {activeTab === 'Students' && (
          <LearnersDirectory user={user} onNavigateToAdmit={() => switchTab('Student Admissions')} />
        )}

        {activeTab === 'Enter Marks' && (
          <EnterMarks user={user} />
        )}

        {/* 3. BULK SMS HUB */}
        {activeTab === 'Bulk SMS Hub' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl animate-in fade-in duration-300">
            <h2 className="text-base sm:text-lg font-black uppercase text-slate-800 tracking-tight mb-1">
              Broadcast Communications Engine
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Dispatch official notices directly to guardians or staff.
            </p>

            <form onSubmit={handleSendSMS} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Recipient Group
                </label>
                <select
                  value={smsData.targetGroup}
                  onChange={(e) => setSmsData({ ...smsData, targetGroup: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-indigo-600"
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
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSendingSms}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {isSendingSms ? 'Transmitting SMS...' : 'Dispatch Broadcast SMS'}
              </button>
            </form>
          </div>
        )}

        {/* 4. PLACEHOLDER OPERATIONAL DESKS */}
        {activeTab === 'Attendance' && renderComingSoon(
          'Daily Roll Call & Biometrics',
          'Morning registration, period-by-period class attendance, and absence triggers will appear here.',
          'fa-clipboard-check'
        )}

        {activeTab === 'Discipline' && renderComingSoon(
          'Disciplinary Records & Sanctions',
          'Conduct scoring, student warning logs, summons generation, and hearing minutes will appear here.',
          'fa-gavel'
        )}

        {activeTab === 'School Timetable' && renderComingSoon(
          'Master Timetable & Lesson Allocations',
          'Institutional lesson schedules, teacher clash resolvers, and room allocations will appear here.',
          'fa-calendar-alt'
        )}

        {activeTab === 'Exam Analysis' && renderComingSoon(
          'Academic Merit & Exam Analysis',
          'Dean of Studies analytical reports, subject performance breakdowns, and report card generation will appear here.',
          'fa-file-alt'
        )}

        {activeTab === 'Hostels' && renderComingSoon(
          'Hostels & Boarding Desks',
          'Dormitory bed assignments, boarding inventory, and night roll call management will appear here.',
          'fa-bed'
        )}

        {activeTab === 'Fee Operations' && renderComingSoon(
          'Fee Ledger & Receipts',
          'Bursar payment recording, votehead allocations, fee balances, and M-Pesa reconciliations will appear here.',
          'fa-receipt'
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

export default DeputyPrincipal;
