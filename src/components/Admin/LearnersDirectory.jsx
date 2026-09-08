import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const LearnersDirectory = ({ user, onNavigateToAdmit }) => {
  const [students, setStudents] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // UI & Modal States
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchData = async () => {
    if (!user?.schoolId) return;
    setLoading(true);
    try {
      const [stuRes, subRes] = await Promise.all([
        API.get(`/students/school/${user.schoolId}`),
        API.get(`/academics/subjects/${user.schoolId}`)
      ]);
      if (stuRes.data.success) setStudents(stuRes.data.students || []);
      setAvailableSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.error("Data fetch error:", err);
      toast.error("Failed to load learners directory or subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchData();
  }, [user?.schoolId]);

  // Handle Deleting a Student
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await API.delete(`/students/${studentToDelete.id}`);
      toast.success(`Removed ${studentToDelete.full_name} from registry.`);
      setStudentToDelete(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student.");
    }
  };

  // Handle Updating Enrolled Subjects for a Student
  const handleSaveStudentSubjects = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      await API.patch(`/students/${editingStudent.id}/subjects`, {
        studentSubjects: editingStudent.student_subjects || []
      });
      toast.success("Student subjects updated successfully!");
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update subjects.");
    }
  };

  const toggleSubjectForEditing = (subName) => {
    setEditingStudent(prev => {
      const currentSubs = prev.student_subjects || [];
      const exists = currentSubs.includes(subName);
      return {
        ...prev,
        student_subjects: exists 
          ? currentSubs.filter(s => s !== subName)
          : [...currentSubs, subName]
      };
    });
  };

  const filteredStudents = students.filter(st => 
    st.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    st.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
    st.grade_level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">
      
      {/* HEADER & SEARCH */}
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase rounded-xl transition shadow-sm"
            >
              + New Admission
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
          Loading Learners Roster...
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Adm No.</th>
                <th className="p-4">Learner Name</th>
                <th className="p-4">Class / Stream</th>
                <th className="p-4">Enrolled Subjects</th>
                <th className="p-4">Guardian Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 text-xs font-bold">
                    No learners match your search filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const isExpanded = expandedStudentId === st.id;
                  const subs = st.student_subjects || [];

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-mono font-bold text-blue-600">{st.admission_number}</td>
                      <td className="p-4 font-bold text-slate-900">{st.full_name}</td>
                      <td className="p-4 text-xs font-bold text-slate-600">
                        {st.grade_level} ({st.stream})
                      </td>

                      {/* SUBJECTS EXPANDABLE COLUMN */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => setExpandedStudentId(isExpanded ? null : st.id)}
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                        >
                          <span>{isExpanded ? 'Hide Subjects' : `Show Subjects (${subs.length})`}</span>
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`}></i>
                        </button>
                        
                        {isExpanded && (
                          <div className="flex flex-wrap gap-1 mt-2 animate-in fade-in">
                            {subs.length === 0 ? (
                              <span className="text-[10px] text-slate-400 font-semibold italic">No subjects assigned.</span>
                            ) : (
                              subs.map(s => (
                                <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold">
                                  {s}
                                </span>
                              ))
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-mono text-slate-600">{st.guardian_phone}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {st.boarding_status || 'Boarding'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingStudent(st)}
                          className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Edit Subjects
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentToDelete(st)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT SUBJECTS MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">Manage Student Subjects</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select or uncheck subjects for <span className="font-bold text-slate-800">{editingStudent.full_name}</span> ({editingStudent.admission_number}).
              </p>
            </div>

            <form onSubmit={handleSaveStudentSubjects} className="space-y-6">
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                {availableSubjects.map(sub => {
                  const subName = sub.subject_name;
                  const isSelected = (editingStudent.student_subjects || []).includes(subName);

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubjectForEditing(subName)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
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

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-600/20 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STYLED DELETE CONFIRMATION MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 uppercase">Delete Learner Record?</h3>
              <p className="text-xs text-slate-500 font-medium">
                Are you sure you want to remove <span className="font-bold text-slate-800">{studentToDelete.full_name}</span> ({studentToDelete.admission_number})? All associated records will be deleted.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
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

export default LearnersDirectory;
