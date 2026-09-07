import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StaffManagement = ({ user }) => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ fullName: '', role: 'Teacher' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Fetch all staff members belonging to this specific school
  const fetchStaff = async () => {
    try {
      setFetching(true);
      const res = await API.get(`/staff/school/${user.schoolId}`);
      setStaffList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load staff directory");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchStaff();
  }, [user?.schoolId]);

  // 2. Register new staff member (No ID/TSC needed)
  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      return toast.error("Please enter the staff member's full name");
    }

    setLoading(true);
    try {
      const res = await API.post('/staff/register', {
        schoolId: user.schoolId,
        fullName: formData.fullName.trim(),
        role: formData.role
      });

      toast.success(
        `Staff Registered!\nCode: ${res.data.staff.staff_code} | Key: ${res.data.staff.password}`,
        { duration: 8000 }
      );

      setFormData({ fullName: '', role: 'Teacher' });
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper to copy credentials to clipboard
  const copyCredentials = (code, pass, name) => {
    navigator.clipboard.writeText(`Staff: ${name}\nLogin Code: ${code}\nAccess Key: ${pass}`);
    toast.success(`Copied login credentials for ${name}`);
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* ADD NEW PERSONNEL FORM */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black tracking-wider uppercase text-slate-400 mb-6">
          Add New Personnel
        </h3>

        <form onSubmit={handleRegisterStaff} className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <input
            type="text"
            placeholder="Full Name (e.g. Mary Wanjiku)"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="flex-1 px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800 text-sm font-semibold outline-none focus:border-blue-600 focus:bg-white transition"
            required
          />

          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full md:w-56 px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-700 text-sm font-semibold outline-none focus:border-blue-600 focus:bg-white transition"
          >
            <option value="Teacher">Teacher</option>
            <option value="Deputy Principal">Deputy Principal</option>
            <option value="Dean of Studies">Dean of Studies</option>
            <option value="Senior Teacher">Senior Teacher</option>
            <option value="Secretary">School Secretary</option>
            <option value="Bursar">Bursar / Accounts</option>
            <option value="Librarian">Librarian</option>
            <option value="Support Staff">Support Staff</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 min-w-[170px]"
          >
            {loading ? 'Generating...' : 'Register Staff'}
          </button>
        </form>
      </div>

      {/* STAFF DIRECTORY TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h4 className="font-black text-slate-800 uppercase tracking-tight">Active Faculty & Staff</h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Access credentials auto-generated using school initials
            </p>
          </div>
          <span className="text-xs font-black bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-xl border border-blue-100">
            {staffList.length} Personnel
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-5">Member Name</th>
                <th className="p-5">Designation</th>
                <th className="p-5">Staff Login Code</th>
                <th className="p-5">Access Key</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {fetching ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Loading Staff Directory...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                    No staff members registered yet.
                  </td>
                </tr>
              ) : (
                staffList.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-5 font-bold text-slate-900">{member.full_name}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        member.role === 'Principal' 
                          ? 'bg-purple-100 text-purple-700'
                          : member.role === 'Secretary'
                          ? 'bg-pink-100 text-pink-700'
                          : member.role === 'Bursar'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-5 font-mono font-bold text-blue-600">
                      {member.staff_code || member.id_number || '—'}
                    </td>
                    <td className="p-5 font-mono font-bold text-emerald-600">
                      {member.password || '••••••••'}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        type="button"
                        onClick={() => copyCredentials(member.staff_code || member.id_number, member.password, member.full_name)}
                        className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition border border-slate-200"
                      >
                        <i className="fas fa-copy mr-1.5"></i> Copy Credentials
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StaffManagement;
