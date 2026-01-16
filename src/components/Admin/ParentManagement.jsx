import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserShield, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

const ParentManagement = () => {
  const [parentName, setParentName] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Parent account for ${parentName} created. Ready for student linking.`);
    setParentName("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-yellow-100 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-yellow-500 p-4 rounded-2xl text-white">
            <FontAwesomeIcon icon={faUsers} size="lg" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase dark:text-white">Parent/Guardian Portal</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Registry & Communication Setup</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Guardian Full Name</label>
              <input 
                type="text" 
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Parent Name" 
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2">Primary Mobile Number</label>
              <input 
                type="text" 
                placeholder="For SMS Alerts" 
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
              />
            </div>
          </div>
          <button className="w-full bg-yellow-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={faUserShield} /> Create Parent Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParentManagement;