import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const StudentManagement = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNumber: '',
    parentName: '',
    parentPhone: ''
  });
  const [loading, setLoading] = useState(false);

  // Manual reset to "forget" the current entry session
  const resetForm = () => {
    setFormData({ studentName: '', admissionNumber: '', parentName: '', parentPhone: '' });
    toast("Form cleared for new entry", { icon: '🧹' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const firstName = formData.studentName.split(' ')[0];

    try {
      const response = await fetch('http://localhost:8080/students/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': 'vinnie-tech-2026' 
        },
        body: JSON.stringify({ 
          full_name: formData.studentName, 
          first_name: firstName,
          reg_number: formData.admissionNumber,
          parent_name: formData.parentName,
          parent_phone: formData.parentPhone
        })
      });

      if (response.ok) {
        toast.success(`Success! ${firstName} registered.`, {
          style: { borderRadius: '15px', background: '#1e3a8a', color: '#fff' }
        });
        // AUTO-RESET: Forgets the session after successful save
        setFormData({ studentName: '', admissionNumber: '', parentName: '', parentPhone: '' });
      } else {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Registration failed");
      }
    } catch (error) {
      toast.error(error.message || "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-blue-50 dark:border-slate-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-blue-900 dark:text-yellow-400 uppercase flex items-center gap-3">
            <FontAwesomeIcon icon={faUserPlus} /> Manual Registration
          </h2>
          {/* Manual Session Reset Button */}
          <button 
            onClick={resetForm}
            className="text-gray-400 hover:text-blue-900 transition-colors p-2"
            title="Clear current session"
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        </div>

        <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Student Details</label>
            <input 
              type="text" required value={formData.studentName}
              placeholder="Full Student Name"
              className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900"
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            />
            <input 
              type="text" required value={formData.admissionNumber}
              placeholder="Admission Number (e.g., MAK/001)"
              className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900"
              onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Parent Details</label>
            <input 
              type="text" required value={formData.parentName}
              placeholder="Parent/Guardian Name"
              className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900"
              onChange={(e) => setFormData({...formData, parentName: e.target.value})}
            />
            <input 
              type="text" required value={formData.parentPhone}
              placeholder="Parent Phone Number"
              className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900"
              onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className={`md:col-span-2 py-6 rounded-[2rem] font-black uppercase tracking-tighter transition-all shadow-xl ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-800'
            }`}
          >
            {loading ? 'Processing...' : 'Finalize Official Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentManagement;