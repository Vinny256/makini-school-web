import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';

const VinnieMasterDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    schoolName: '',
    principalName: '',
    tscNumber: '',
    idNumber: '',
    vinnieDigitalCode: '' // The unique 6-digit code you issue
  });

  // Fetch all schools from your DB
  const fetchSchools = async () => {
    try {
      const res = await API.get("http://localhost:5000/api/superadmin/schools");
      setSchools(res.data);
    } catch (err) { toast.error("Error fetching schools"); }
  };

  useEffect(() => { fetchSchools(); }, []);

  const handleAddSchool = async (e) => {
    e.preventDefault();
    try {
      await API.post("http://localhost:5000/api/superadmin/add-school", formData);
      toast.success(`${formData.schoolName} is now LIVE!`);
      setFormData({ schoolName: '', principalName: '', tscNumber: '', idNumber: '', vinnieDigitalCode: '' });
      fetchSchools();
    } catch (err) { toast.error("Registration failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      {/* Header without standard navbars */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black tracking-tighter text-blue-500">VINNIE TECH <span className="text-white">MASTER</span></h1>
        <button onClick={() => window.location.href = '/'} className="bg-red-600/10 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-600/20">Logout</button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Registration Form */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl mb-12">
          <h2 className="text-xl font-bold mb-6">Register New School Client</h2>
          <form onSubmit={handleAddSchool} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input className="p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-blue-500" placeholder="School Name" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} required />
            <input className="p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-blue-500" placeholder="Principal Name" value={formData.principalName} onChange={e => setFormData({...formData, principalName: e.target.value})} required />
            <input className="p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-blue-500" placeholder="TSC Number" value={formData.tscNumber} onChange={e => setFormData({...formData, tscNumber: e.target.value})} required />
            <input className="p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-blue-500" placeholder="National ID" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} required />
            <input className="p-4 bg-slate-800 rounded-xl border border-blue-900 outline-none focus:border-blue-500 text-blue-400 font-mono font-bold" placeholder="Vinnie Digital Code (6 Digits)" maxLength="6" value={formData.vinnieDigitalCode} onChange={e => setFormData({...formData, vinnieDigitalCode: e.target.value})} required />
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">Deploy School System</button>
          </form>
        </div>

        {/* Schools Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-500 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-5">Client School</th>
                <th className="p-5">Principal</th>
                <th className="p-5">Vinnie Digital Code</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(s => (
                <tr key={s.id} className="border-t border-slate-800">
                  <td className="p-5 font-bold text-lg text-blue-400">{s.school_name}</td>
                  <td className="p-5 text-slate-300">{s.principal_name}</td>
                  <td className="p-5 font-mono text-yellow-500 font-bold">{s.vinnie_digital_code}</td>
                  <td className="p-5">
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VinnieMasterDashboard;