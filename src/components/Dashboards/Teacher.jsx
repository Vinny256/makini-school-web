import React, { useState } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';
import EnterMarks from '../Admin/EnterMarks';
import Overview from '../Admin/Overview';

const Teacher = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
            <i className="fas fa-chalkboard text-white"></i>
          </div>
          <div>
            <h2 className="text-sm font-black italic uppercase tracking-tight leading-none">
              Teacher <span className="text-blue-500">Portal</span>
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

      {/* TEACHER SIDEBAR */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-72 bg-slate-900 text-white flex flex-col p-6 h-screen z-50 transition-transform duration-300 ease-in-out shadow-2xl
        md:sticky md:top-0 md:translate-x-0 md:shadow-none md:shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:block mb-8 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <i className="fas fa-chalkboard text-2xl"></i>
          </div>
          <h2 className="text-base font-black uppercase italic tracking-wider">
            Teacher <span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {user?.schoolName}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-2 ml-2 tracking-widest">Active Workspace</p>
          
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
            onClick={() => switchTab('Enter Marks')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Enter Marks' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-marker w-5"></i> <span>Marks & CBC Grading</span>
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
              Teacher: {user?.fullName || user?.name} | {user?.schoolName}
            </p>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <Overview user={user} />
        )}

        {/* TAB 2: MARKS & GRADING */}
        {activeTab === 'Enter Marks' && (
          <EnterMarks user={user} />
        )}
      </main>
    </div>
  );
};

export default Teacher;
