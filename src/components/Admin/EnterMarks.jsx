import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const EnterMarks = ({ user }) => {
  const isAdmin = ['Principal', 'Deputy Principal', 'Dean of Studies'].includes(user?.role);

  // Term & Exam Series
  const [currentTerm, setCurrentTerm] = useState(null);
  const [examSeries, setExamSeries] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');

  // Teacher Scoped Workload (for regular teachers)
  const [workload, setWorkload] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState('');

  // Admin Master Selectors (for Principal / Deputy / DOS)
  const [classList, setClassList] = useState([]);
  const [streamList, setStreamList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Learners Roster & Marks
  const [roster, setRoster] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingRoster, setFetchingRoster] = useState(false);

  // 1. Fetch Session Info, Exams, and Options
  useEffect(() => {
    if (!user?.schoolId) return;

    // Load active term & exams
    API.get(`/academics/current-term/${user.schoolId}`)
      .then(res => {
        if (res.data.currentTerm) {
          setCurrentTerm(res.data.currentTerm);
          const series = res.data.examSeries || [];
          setExamSeries(series);
          if (series.length > 0) setSelectedExam(series[0].exam_name);
        } else {
          setCurrentTerm({ academic_year: 2026, term_name: 'Term 1' });
          setExamSeries([{ id: 1, exam_name: 'Mid Term' }, { id: 2, exam_name: 'End Term' }]);
          setSelectedExam('Mid Term');
        }
      })
      .catch(() => {
        setCurrentTerm({ academic_year: 2026, term_name: 'Term 1' });
      });

    if (isAdmin) {
      // Load all classes, streams, and subjects for admin override
      Promise.all([
        API.get(`/academics/classes/${user.schoolId}`),
        API.get(`/academics/streams/${user.schoolId}`),
        API.get(`/config/subjects/${user.schoolId}`)
      ]).then(([classRes, streamRes, subRes]) => {
        const classes = classRes.data.classes || [];
        const streams = streamRes.data.streams || [];
        const subjects = subRes.data.subjects || [];

        setClassList(classes);
        setStreamList(streams);
        setSubjectList(subjects);

        if (classes.length > 0) setSelectedClass(classes[0].class_name);
        if (streams.length > 0) setSelectedStream(streams[0].stream_name);
        if (subjects.length > 0) setSelectedSubject(subjects[0].id);
      }).catch(err => console.error("Admin options load error:", err));
    } else {
      // Regular teacher: fetch strictly allocated classes
      API.get(`/academics/my-workload/${user.schoolId}/${user.id}`)
        .then(res => {
          const items = res.data.workload || [];
          setWorkload(items);
          if (items.length > 0) setSelectedAllocation(JSON.stringify(items[0]));
        })
        .catch(err => console.error("Workload load error:", err));
    }
  }, [user?.schoolId, user?.id, isAdmin]);

  // 2. Fetch Roster
  useEffect(() => {
    let targetClass = '';
    let targetStream = '';

    if (isAdmin) {
      targetClass = selectedClass;
      targetStream = selectedStream;
    } else if (selectedAllocation) {
      try {
        const parsed = JSON.parse(selectedAllocation);
        targetClass = parsed.grade_level;
        targetStream = parsed.stream_name;
      } catch (e) {
        return;
      }
    }

    if (targetClass && targetStream && user?.schoolId) {
      setFetchingRoster(true);
      API.get(`/academics/roster/${user.schoolId}?gradeLevel=${targetClass}&stream=${targetStream}`)
        .then(res => {
          setRoster(res.data.students || []);
          setMarks({});
        })
        .catch(err => console.error("Roster fetch error:", err))
        .finally(() => setFetchingRoster(false));
    }
  }, [isAdmin, selectedClass, selectedStream, selectedAllocation, user?.schoolId]);

  const handleScoreChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveAllMarks = async (e) => {
    e.preventDefault();
    if (!selectedExam) return toast.error("Please select an exam series.");

    let subjectId, gradeLevel, streamId;

    if (isAdmin) {
      subjectId = selectedSubject;
      gradeLevel = selectedClass;
      const matchedStream = streamList.find(s => s.stream_name === selectedStream);
      streamId = matchedStream?.id;
    } else {
      const parsed = JSON.parse(selectedAllocation);
      subjectId = parsed.subject_id;
      gradeLevel = parsed.grade_level;
      streamId = parsed.stream_id;
    }

    if (!subjectId) return toast.error("Please select a subject.");

    setLoading(true);
    try {
      await API.post('/academics/record-batch', {
        schoolId: user.schoolId,
        term: currentTerm?.term_name || 'Term 1',
        examType: selectedExam,
        subjectId,
        gradeLevel,
        streamId,
        marks
      });
      toast.success("Scores recorded successfully!");
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
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Academic Session: {currentTerm ? `${currentTerm.academic_year} — ${currentTerm.term_name}` : 'Term 1 2026'}
          </p>
        </div>
        {isAdmin && (
          <span className="self-start sm:self-auto px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-[10px] font-black uppercase tracking-wider">
            Executive / All Access
          </span>
        )}
      </div>

      {/* WORKSPACE SELECTORS */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {classList.map(c => (
                <option key={c.id} value={c.class_name}>{c.class_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {streamList.map(s => (
                <option key={s.id} value={s.stream_name}>{s.stream_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {subjectList.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.subject_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Exam Series</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {examSeries.map(es => (
                <option key={es.id} value={es.exam_name}>{es.exam_name}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
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
                workload.map(w => (
                  <option key={w.id} value={JSON.stringify(w)}>
                    {w.grade_level} ({w.stream_name}) — {w.subject_name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Exam Series</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {examSeries.map(es => (
                <option key={es.id} value={es.exam_name}>{es.exam_name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ROSTER MARKS ENTRY */}
      {fetchingRoster ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
          Loading Class Roster...
        </div>
      ) : roster.length > 0 ? (
        <form onSubmit={handleSaveAllMarks} className="space-y-4">
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Adm No.</th>
                  <th className="p-4">Learner Name</th>
                  <th className="p-4 w-48 text-right">Score / Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {roster.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-mono font-bold text-blue-600">{student.admission_number}</td>
                    <td className="p-4 text-slate-900 font-semibold">{student.full_name}</td>
                    <td className="p-4 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="%"
                        value={marks[student.id] || ''}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-right font-mono font-bold outline-none focus:border-blue-600"
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
            {loading ? 'Committing Scores...' : 'Commit Marks For Stream'}
          </button>
        </form>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-100 rounded-2xl">
          No learners found registered in this class and stream combination.
        </div>
      )}
    </div>
  );
};

export default EnterMarks;
