import React, { useState, useEffect } from 'react';
import API from '../../api';

const LearnersDirectory = ({ user, onNavigateToAdmit }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/students/school/${user.schoolId}`);
      if (res.data.success) setStudents(res.data.students || []);
    } catch (err) {
      console.error("Students fetch error:", err);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchStudents();
  }, [user?.schoolId]);

  const filteredStudents = students.filter(st => 
    st.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    st.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
    st.grade_level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black uppercase text-slate-800 tracking-tight">Active Learners Roster</h3>
          <p className="text-xs text-slate-400 font-semibold">{students.length} Learners Enrolled</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input 
            type="text"
            placeholder="Search name, adm, class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none flex-1 sm:w-48"
          />
          {onNavigateToAdmit && (
            <button
              type="button"
              onClick={onNavigateToAdmit}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-xl"
            >
              + New Admission
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
            <tr>
              <th className="p-4">Adm No.</th>
              <th className="p-4">Learner Name</th>
              <th className="p-4">Class</th>
              <th className="p-4">Stream</th>
              <th className="p-4">Guardian Phone</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium">
            {filteredStudents.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50/70">
                <td className="p-4 font-mono font-bold text-blue-600">{st.admission_number}</td>
                <td className="p-4 font-bold text-slate-900">{st.full_name}</td>
                <td className="p-4">{st.grade_level}</td>
                <td className="p-4">{st.stream}</td>
                <td className="p-4 font-mono text-slate-600">{st.guardian_phone}</td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">
                    {st.boarding_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LearnersDirectory;
