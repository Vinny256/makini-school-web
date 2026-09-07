import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';

const VinnieMasterDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    schoolName: '',
    principalName: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch all schools
  const fetchSchools = async () => {
    try {
      const res = await API.get("/superadmin/schools");
      setSchools(res.data);
    } catch (err) {
      toast.error("Error fetching schools");
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/superadmin/add-school", formData);

      toast.success(
        `Deployed! Code: ${res.data.schoolCode} | Key: ${res.data.accessKey}`,
        { duration: 7000 }
      );

      setFormData({ schoolName: '', principalName: '' });
      fetchSchools();
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black tracking-tighter text-blue-500">
          VINNIE TECH <span className="text-white">MASTER</span>
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            window.location.href = '/vinnie-portal-auth';
          }}
          className="bg-red-600/10 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-600/20 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Registration Form */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl mb-12">
          <h2 className="text-xl font-bold mb-6">Register New School Client</h2>
          <form onSubmit={handleAddSchool} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              className="p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-blue-500 text-white"
              placeholder="School Name (e.g. Mutus Senior School)"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              required
            />
            <input
              className="p-4 bg-slate-800 rounded-xl border border-slate-700 outline-none focus:border-blue-500 text-white"
              placeholder="Principal Name (e.g. Njeru Njiru)"
              value={formData.principalName}
              onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? 'Deploying System...' : 'Deploy School System'}
            </button>
          </form>
        </div>

        {/* Schools Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-500 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-5">Client School</th>
                <th className="p-5">Principal</th>
                <th className="p-5">Initials</th>
                <th className="p-5">School Code</th>
                <th className="p-5">Access Key</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-5 font-bold text-lg text-blue-400">{s.school_name}</td>
                  <td className="p-5 text-slate-300">{s.principal_name}</td>
                  <td className="p-5 font-mono text-cyan-400 font-bold">{s.school_initials || '—'}</td>
                  <td className="p-5 font-mono text-yellow-500 font-bold">{s.vinnie_digital_code}</td>
                  <td className="p-5 font-mono text-emerald-400 font-bold">{s.access_key || '—'}</td>
                  <td className="p-5">
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                      Active
                    </span>
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
