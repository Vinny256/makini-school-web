import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import StudentManagement from './StudentManagement';
import TeacherManagement from './TeacherManagement';
import ParentManagement from './ParentManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      {/* 1. Permanent Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Dynamic Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-black text-blue-900 dark:text-white uppercase">
            Admin Portal: {activeTab}
          </h1>
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <span className="text-sm font-bold text-gray-500">Logged in as:</span>
            <span className="ml-2 text-sm font-black text-blue-600">Principal</span>
          </div>
        </header>

        {/* Content Switches based on the sidebar click */}
        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'teachers' && <TeacherManagement />}
        {activeTab === 'parents' && <ParentManagement />}
      </main>
    </div>
  );
};

export default AdminDashboard;