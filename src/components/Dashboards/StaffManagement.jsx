import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StaffManagement = ({ user }) => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    idNumber: '', 
    tscNumber: '', // Added back for full teacher records
    role: 'Teacher' 
  });

  const roles = ['Deputy Principal', 'Dean of Students', 'Bursar', 'Teacher', 'Secretary', 'Librarian'];

  const fetchStaff = async () => {
    try {
      const res = await API.get(`http://localhost:5000/api/staff/school/${user.schoolId}`);
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load staff list");
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("http://localhost:5000/api/staff/add", { ...formData, schoolId: user.schoolId });
      toast.success("Staff Registered");
      setFormData({ fullName: '', idNumber: '', tscNumber: '', role: 'Teacher' }); // Reset form
      fetchStaff();
    } catch (err) { toast.error("Error adding staff"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await API.delete(`http://localhost:5000/api/staff/${id}`);
        toast.success("Staff Removed");
        fetchStaff();
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  return (
    <div className="space-y-6">
      {/* COMPLETE REGISTRATION FORM */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black mb-4 uppercase italic text-slate-500">Add New Personnel</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input type="text" placeholder="Full Name" required className="p-4 bg-slate-50 border rounded-2xl text-sm" 
            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          
          <input type="text" placeholder="ID Number" required className="p-4 bg-slate-50 border rounded-2xl text-sm" 
            value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
          
          {/* TSC NUMBER FIELD RESTORED */}
          <input type="text" placeholder="TSC No. (Optional)" className="p-4 bg-slate-50 border rounded-2xl text-sm" 
            value={formData.tscNumber} onChange={e => setFormData({...formData, tscNumber: e.target.value})} />
          
          <select className="p-4 bg-slate-50 border rounded-2xl text-sm font-bold"
            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <button type="submit" className="bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Register Staff
          </button>
        </form>
      </div>

      {/* STAFF DIRECTORY WITH VISIBLE DELETE BUTTONS */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-5">Member Name</th>
              <th className="p-5">Designation</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="p-5 font-bold text-slate-700">{s.full_name}</td>
                <td className="p-5">
                  {s.role === 'Principal' ? (
                    <span className="text-slate-400 font-bold italic text-xs bg-slate-100 px-3 py-1 rounded-lg">Principal (Fixed)</span>
                  ) : (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{s.role}</span>
                  )}
                </td>
                <td className="p-5 text-center">
                  {s.role !== 'Principal' && (
                    <button 
                      onClick={() => handleDelete(s.id)} 
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto"
                      title="Remove Staff"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement;