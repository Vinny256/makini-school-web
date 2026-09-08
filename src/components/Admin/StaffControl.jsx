import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StaffControl = ({ user, onStaffUpdated }) => {
  const [staffList, setStaffList] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [staffForm, setStaffForm] = useState({ 
    fullName: '', 
    role: 'Teacher',
    teachingSubjects: [] 
  });
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const fetchData = async () => {
    if (!user?.schoolId) return;
    try {
      const [staffRes, subRes] = await Promise.all([
        API.get(`/staff/school/${user.schoolId}`),
        API.get(`/academics/subjects/${user.schoolId}`)
      ]);
      setStaffList(staffRes.data || []);
      setAvailableSubjects(subRes.data.subjects || []);
    } catch (err) {
      toast.error("Failed to load staff directory or subjects");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.schoolId]);

  const handleSubjectToggle = (subName) => {
    setStaffForm(prev => {
      const exists = prev.teachingSubjects.includes(subName);
      return {
        ...prev,
        teachingSubjects: exists 
          ? prev.teachingSubjects.filter(s => s !== subName)
          : [...prev.teachingSubjects, subName]
      };
    });
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.fullName.trim()) return toast.error("Enter staff full name");

    setLoadingStaff(true);
    try {
      const res = await API.post('/staff/register', {
        schoolId: user.schoolId,
        fullName: staffForm.fullName.trim(),
        role: staffForm.role,
        teachingSubjects: staffForm.role === 'Teacher' ? staffForm.teachingSubjects : []
      });

      toast.success(
        `Staff Created: ${res.data.staff.staff_code} | Key: ${res.data.staff.password}`,
        { duration: 8000 }
      );
      setStaffForm({ fullName: '', role: 'Teacher', teachingSubjects: [] });
      fetchData();
      if (onStaffUpdated) onStaffUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      await API.delete(`/staff/${staffToDelete.id}`);
      toast.success(`Removed ${staffToDelete.full_name} from staff registry.`);
      setStaffToDelete(null);
      fetchData();
      if (onStaffUpdated) onStaffUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete staff member.");
    }
  };

  const copyCredentials = (code, pass, name) => {
    navigator.clipboard.writeText(`Staff: ${name}\nLogin Code: ${code}\nAccess Key: ${pass}`);
    toast.success(`Copied credentials for ${name}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* REGISTRATION CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-4">Register Faculty & Operational Staff</h3>
        
        <form onSubmit={handleRegisterStaff} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
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
          </div>

          {/* TEACHING SUBJECTS DYNAMIC CHECKLIST */}
          {staffForm.role === 'Teacher' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in">
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">
                Authorized Teaching Subjects (Fetched from School Registry)
              </label>
              {availableSubjects.length === 0 ? (
                <p className="text-xs text-rose-500 font-bold">No subjects found. Please add subjects under 'Subjects & Exams' first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map((sub) => {
                    const subName = sub.subject_name;
                    const isSelected = staffForm.teachingSubjects.includes(subName);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSubjectToggle(subName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {subName} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* STAFF DIRECTORY TABLE WITH MOBILE HORIZONTAL SCROLL */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-slate-700">Active Staff Directory</h3>
          <span className="text-[10px] font-bold text-slate-400">Scroll horizontally on mobile →</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role / Subjects</th>
                <th className="p-4">Login Code</th>
                <th className="p-4">Access Key</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 text-xs font-bold">
                    No staff members registered yet.
                  </td>
                </tr>
              ) : (
                staffList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-900">{m.full_name}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {m.role}
                        </span>
                        {m.teaching_subjects && m.teaching_subjects.length > 0 && (
                          <p className="text-[10px] text-blue-600 font-semibold">
                            Teaches: {m.teaching_subjects.join(', ')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-blue-600">{m.staff_code || m.vinnie_digital_code}</td>
                    <td className="p-4 font-mono font-bold text-emerald-600">{m.password || m.access_key}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => copyCredentials(m.staff_code || m.vinnie_digital_code, m.password || m.access_key, m.full_name)}
                        className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setStaffToDelete(m)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STYLED CUSTOM DELETE CONFIRMATION MODAL */}
      {staffToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 uppercase">Revoke Staff Access?</h3>
              <p className="text-xs text-slate-500 font-medium">
                Are you sure you want to delete <span className="font-bold text-slate-800">{staffToDelete.full_name}</span> ({staffToDelete.role})? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStaff}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-red-600/20 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffControl;
