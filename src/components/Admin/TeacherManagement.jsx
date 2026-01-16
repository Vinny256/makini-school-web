import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faUserPlus, faIdCard } from '@fortawesome/free-solid-svg-icons';

const TeacherManagement = () => {
  const [teacherName, setTeacherName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    // This will talk to your Go backend later
    alert(`Teacher ${teacherName} has been officially registered at Makini Secondary.`);
    setTeacherName("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-blue-100 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-900 p-4 rounded-2xl text-white">
            <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase dark:text-white">Staff Registry</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Add New Faculty Member</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Full Legal Name</label>
              <input 
                type="text" 
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="e.g. Mr. John Kamau" 
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">TSC / ID Number</label>
              <input 
                type="text" 
                placeholder="Required for payroll" 
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900 dark:text-white"
              />
            </div>
          </div>
          <button className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={faUserPlus} /> Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherManagement;