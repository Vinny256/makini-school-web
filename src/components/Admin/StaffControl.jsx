import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StaffControl = ({ user, onStaffUpdated }) => {
  const [staffList, setStaffList] = useState([]);
  const [staffForm, setStaffForm] = useState({ fullName: '', role: 'Teacher' });
  const [loadingStaff, setLoadingStaff] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await API.get(`/staff/school/${user.schoolId}`);
      setStaffList(res.data || []);
    } catch (err) {
      toast.error("Failed to load staff directory");
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchStaff();
  }, [user?.schoolId]);

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.fullName.trim()) return toast.error("Enter staff full name");

    setLoadingStaff(true);
    try {
      const res = await API.post('/staff/register', {
        schoolId: user.schoolId,
        fullName: staffForm.fullName.trim(),
        role: staffForm.role
      });

      toast.success(
        `Staff Created: ${res.data.staff.staff_code} | Key: ${res.data.staff.password}`,
        { duration: 8000 }
      );
      setStaffForm({ fullName: '', role: 'Teacher' });
      fetchStaff();
      if (onStaffUpdated) onStaffUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoadingStaff(false);
    }
  };

  const copyCredentials = (code, pass, name) => {
    navigator.clipboard.writeText(`Staff: ${name}\nLogin Code: ${code}\nAccess Key: ${pass}`);
    toast.success(`Copied credentials for ${name}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-4">Register Faculty & Operational Staff</h3>
        <form onSubmit={handleRegisterStaff} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Full Name (e.g. Geoffrey Mutua)"
            value={staffForm.fullName}
            onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
            required
          />
          <select
            value={staffForm.role}
            onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
            className="w-full md:w-64 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
          >
            <option value="Deputy Principal">Deputy Principal (Admin)</option>
            <option value="Dean of Studies">Dean of Studies / Exams</option>
            <option value="Senior Teacher">Senior Master / Mistress (HOD)</option>
            <option value="Class Teacher">Class / CBC Pathway Teacher</option>
            <option value="Teacher">Subject Teacher</option>
            <option value="Bursar">Bursar / Accounts Officer</option>
            <option value="Secretary">Secretary / Registrar</option>
            <option value="Boarding Master">Boarding Master / Matron</option>
            <option value="Librarian">Librarian</option>
            <option value="Storekeeper">Storekeeper / Procurement</option>
          </select>
          <button
            type="submit"
            disabled={loadingStaff}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {loadingStaff ? 'Registering...' : 'Register Staff'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Login Code</th>
              <th className="p-4">Access Key</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium">
            {staffList.map((m) => (
              <tr key={m.id}>
                <td className="p-4 font-bold text-slate-900">{m.full_name}</td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                    {m.role}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-blue-600">{m.staff_code || m.vinnie_digital_code}</td>
                <td className="p-4 font-mono font-bold text-emerald-600">{m.password || m.access_key}</td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => copyCredentials(m.staff_code || m.vinnie_digital_code, m.password || m.access_key, m.full_name)}
                    className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffControl;
