import React from 'react';

const DeanOfStudents = ({ user }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-black text-blue-900 uppercase italic">
          <i className="fas fa-user-shield mr-2 text-blue-600"></i> 
          Dean's Portal: {user?.schoolName}
        </h1>
        <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">
          Student Enrollment System
        </p>
        
        <div className="mt-10 p-20 border-2 border-dashed border-slate-200 rounded-3xl text-center">
          <i className="fas fa-user-plus text-5xl text-slate-200 mb-4"></i>
          <p className="text-slate-400 font-bold">Enrollment form coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default DeanOfStudents;