import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const EnterMarks = ({ user }) => {
  const isAdmin = ['Principal', 'Deputy Principal', 'Dean of Studies'].includes(user?.role);

  // Term & Exam Series
  const [currentTerm, setCurrentTerm] = useState({ academic_year: 2026, term_name: 'Term 1' });
  const [examSeries, setExamSeries] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');

  // Dropdown Lists
  const [classList, setClassList] = useState([]);
  const [streamList, setStreamList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  // Selected Options
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Roster & Marks
  const [roster, setRoster] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingRoster, setFetchingRoster] = useState(false);

  // 1. Fetch Session Info & Exams
  useEffect(() => {
    if (!user?.schoolId) return;

    API.get(`/academics/current-term/${user.schoolId}`)
      .then(res => {
        if (res.data.currentTerm) setCurrentTerm(res.data.currentTerm);
        const series = res.data.examSeries || [];
        setExamSeries(series);
        if (series.length > 0) setSelectedExam(series[0].exam_name);
      })
      .catch(() => {
        const defaults = [{ id: 1, exam_name: 'Mid Term' }, { id: 2, exam_name: 'End Term' }];
        setExamSeries(defaults);
        setSelectedExam('Mid Term');
      });

    // 2. Fetch Classes from /academics/classes
    API.get(`/academics/classes/${user.schoolId}`)
      .then(res => {
        const cls = res.data.classes || [];
        setClassList(cls);
        if (cls.length > 0) setSelectedClass(cls[0].class_name);
      })
      .catch(err => console.error("Classes load error:", err));

    // 3. Fetch Streams from /academics/streams
    API.get(`/academics/streams/${user.schoolId}`)
      .then(res => {
        const stms = res.data.streams || [];
        setStreamList(stms);
        if (stms.length > 0) setSelectedStream(stms[0].stream_name);
      })
      .catch(err => console.error("Streams load error:", err));

    // 4. Fetch Subjects from /academics/subjects
    API.get(`/academics/subjects/${user.schoolId}`)
      .then(res => {
        const subs = res.data.subjects || [];
        setSubjectList(subs);
        if (subs.length > 0) setSelectedSubject(subs[0].id);
      })
      .catch(err => console.error("Subjects load error:", err));
  }, [user?.schoolId]);

  // 5. Fetch Roster when class or stream changes
  useEffect(() => {
    if (selectedClass && selectedStream && user?.schoolId) {
      setFetchingRoster(true);
      API.get(`/academics/roster/${user.schoolId}?gradeLevel=${encodeURIComponent(selectedClass)}&stream=${encodeURIComponent(selectedStream)}`)
        .then(res => {
          setRoster(res.data.students || []);
          setMarks({});
        })
        .catch(err => console.error("Roster fetch error:", err))
        .finally(() => setFetchingRoster(false));
    }
  }, [selectedClass, selectedStream, user?.schoolId]);

  const handleScoreChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveAllMarks = async (e) => {
    e.preventDefault();
    if (!selectedExam) return toast.error("Please select an exam series.");
    if (!selectedSubject) return toast.error("Please select a subject.");

    setLoading(true);
    try {
      const matchedStream = streamList.find(s => s.stream_name.toLowerCase() === selectedStream.toLowerCase());

      await API.post('/academics/record-batch', {
        schoolId: user.schoolId,
        term: currentTerm?.term_name || 'Term 1',
        examType: selectedExam,
        subjectId: selectedSubject,
        gradeLevel: selectedClass,
        streamId: matchedStream?.id || null,
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
            Academic Session: {currentTerm?.academic_year} — {currentTerm?.term_name}
          </p>
        </div>
        {isAdmin && (
          <span className="self-start sm:self-auto px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-[10px] font-black uppercase tracking-wider">
            Executive / All Access
          </span>
        )}
      </div>

      {/* WORKSPACE SELECTORS */}
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

      {/* ROSTER TABLE */}
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
          No learners found registered in {selectedClass || 'this class'} ({selectedStream || 'this stream'}).
        </div>
      )}
    </div>
  );
};

export default EnterMarks;
