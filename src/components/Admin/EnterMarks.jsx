import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const EnterMarks = ({ user }) => {
  const [currentTerm, setCurrentTerm] = useState(null);
  const [examSeries, setExamSeries] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [roster, setRoster] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  // 1. Fetch Current Term, Exam Series, and Workload
  useEffect(() => {
    if (user?.schoolId) {
      // Get current term & active exams
      API.get(`/academics/current-term/${user.schoolId}`)
        .then(res => {
          if (res.data.currentTerm) {
            setCurrentTerm(res.data.currentTerm);
            setExamSeries(res.data.examSeries || []);
            if (res.data.examSeries?.length > 0) {
              setSelectedExam(res.data.examSeries[0].exam_name);
            }
          }
        })
        .catch(err => console.error(err));

      // Get teacher's specific workload allocations
      API.get(`/academics/my-workload/${user.schoolId}/${user.id}`)
        .then(res => {
          setWorkload(res.data.workload || []);
          if (res.data.workload?.length > 0) {
            setSelectedAllocation(JSON.stringify(res.data.workload[0]));
          }
        })
        .catch(err => console.error(err));
    }
  }, [user?.schoolId, user?.id]);

  // 2. Fetch Student Roster when class/stream selection changes
  useEffect(() => {
    if (selectedAllocation) {
      const parsed = JSON.parse(selectedAllocation);
      API.get(`/academics/roster/${user.schoolId}?gradeLevel=${parsed.grade_level}&stream=${parsed.stream_name}`)
        .then(res => setRoster(res.data.students || []))
        .catch(err => console.error(err));
    }
  }, [selectedAllocation, user?.schoolId]);

  const handleScoreChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSaveAllMarks = async (e) => {
    e.preventDefault();
    if (!selectedExam) return toast.error("Please select an exam series.");
    
    setLoading(true);
    const parsed = JSON.parse(selectedAllocation);

    try {
      await API.post('/admin/academics/record-batch', {
        schoolId: user.schoolId,
        term: currentTerm?.term_name,
        examType: selectedExam,
        subjectId: parsed.subject_id,
        gradeLevel: parsed.grade_level,
        streamId: parsed.stream_id,
        marks
      });
      toast.success("All assessment scores saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to commit marks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">
            Grading & Marks Entry
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Academic Session: {currentTerm ? `${currentTerm.academic_year} - ${currentTerm.term_name}` : 'Loading...'}
          </p>
        </div>
      </div>

      {/* WORKLOAD & EXAM SELECTORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
            Assigned Class & Subject
          </label>
          <select
            value={selectedAllocation}
            onChange={(e) => setSelectedAllocation(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
          >
            {workload.length === 0 ? (
              <option value="">No classes allocated yet (Contact DOS)</option>
            ) : (
              workload.map((w) => (
                <option key={w.id} value={JSON.stringify(w)}>
                  {w.grade_level} ({w.stream_name}) — {w.subject_name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
            Exam Series
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
          >
            {examSeries.map((es) => (
              <option key={es.id} value={es.exam_name}>{es.exam_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* STUDENT ROSTER MARKS ENTRY TABLE */}
      {roster.length > 0 && (
        <form onSubmit={handleSaveAllMarks} className="space-y-4">
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Adm No.</th>
                  <th className="p-4">Learner Name</th>
                  <th className="p-4 w-48 text-right">Score / Rubric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {roster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-mono font-bold text-blue-600">{student.admission_number}</td>
                    <td className="p-4 text-slate-900 font-semibold">{student.full_name}</td>
                    <td className="p-4 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Score (%)"
                        value={marks[student.id] || ''}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-right font-mono font-bold outline-none focus:border-blue-600"
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Saving Roster Scores...' : 'Commit Marks For Stream'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EnterMarks;
