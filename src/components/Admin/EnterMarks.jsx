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
  const [maxMarks, setMaxMarks] = useState(100);

  // UI Toggles & Search
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');

  // Learners Roster & Marks State
  const [roster, setRoster] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingSingleId, setSavingSingleId] = useState(null);
  const [fetchingRoster, setFetchingRoster] = useState(false);

  // Identify Curriculum Mode based on selected class
  const isCbcClass = (className) => {
    const clean = (className || '').toLowerCase();
    return clean.includes('grade') || clean.includes('cbc') || clean.includes('pp');
  };

  // 1. Calculate Rubric / Letter Grade in real time
  const evaluateScore = (raw, max, isCbc) => {
    if (raw === '' || raw === null || isNaN(raw)) return { percentage: null, rubric: '', color: '' };
    const numRaw = parseFloat(raw);
    const numMax = parseFloat(max) || 100;
    const pct = Math.round((numRaw / numMax) * 100);

    if (isCbc) {
      if (pct >= 80) return { percentage: pct, rubric: 'EE', label: 'Exceeding Expectation', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      if (pct >= 60) return { percentage: pct, rubric: 'ME', label: 'Meeting Expectation', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      if (pct >= 40) return { percentage: pct, rubric: 'AE', label: 'Approaching Expectation', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      return { percentage: pct, rubric: 'BE', label: 'Below Expectation', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    } else {
      if (pct >= 80) return { percentage: pct, rubric: 'A', label: 'A (Plain)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      if (pct >= 75) return { percentage: pct, rubric: 'A-', label: 'A- (Minus)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      if (pct >= 70) return { percentage: pct, rubric: 'B+', label: 'B+ (Plus)', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
      if (pct >= 65) return { percentage: pct, rubric: 'B', label: 'B (Plain)', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      if (pct >= 60) return { percentage: pct, rubric: 'B-', label: 'B- (Minus)', color: 'bg-sky-100 text-sky-800 border-sky-300' };
      if (pct >= 55) return { percentage: pct, rubric: 'C+', label: 'C+ (Plus)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      if (pct >= 50) return { percentage: pct, rubric: 'C', label: 'C (Plain)', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      if (pct >= 45) return { percentage: pct, rubric: 'C-', label: 'C- (Minus)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      if (pct >= 40) return { percentage: pct, rubric: 'D+', label: 'D+ (Plus)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      if (pct >= 35) return { percentage: pct, rubric: 'D', label: 'D (Plain)', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      if (pct >= 30) return { percentage: pct, rubric: 'D-', label: 'D- (Minus)', color: 'bg-orange-200 text-orange-900 border-orange-400' };
      return { percentage: pct, rubric: 'E', label: 'E', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  // 2. Fetch Session Info, Classes, Streams, and Subjects with Teacher Filtering
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
        setExamSeries([{ id: 1, exam_name: 'Opener Exam' }, { id: 2, exam_name: 'Mid Term' }, { id: 3, exam_name: 'End Term' }]);
        setSelectedExam('Opener Exam');
      });

    API.get(`/academics/classes/${user.schoolId}`)
      .then(res => {
        const cls = res.data.classes || [];
        setClassList(cls);
        if (cls.length > 0) setSelectedClass(cls[0].class_name);
      })
      .catch(err => console.error("Classes error:", err));

    API.get(`/academics/streams/${user.schoolId}`)
      .then(res => {
        const stms = res.data.streams || [];
        setStreamList(stms);
        if (stms.length > 0) setSelectedStream(stms[0].stream_name);
      })
      .catch(err => console.error("Streams error:", err));

    API.get(`/academics/subjects/${user.schoolId}`)
      .then(res => {
        const allSubs = res.data.subjects || [];
        const assignedSubjects = user?.teachingSubjects || [];

        if (!isAdmin && assignedSubjects.length > 0) {
          const filtered = allSubs.filter(sub => 
            assignedSubjects.some(as => as.toLowerCase() === sub.subject_name.toLowerCase())
          );
          setSubjectList(filtered);
          if (filtered.length > 0) setSelectedSubject(filtered[0].id);
        } else {
          setSubjectList(allSubs);
          if (allSubs.length > 0) setSelectedSubject(allSubs[0].id);
        }
      })
      .catch(err => console.error("Subjects error:", err));
  }, [user?.schoolId, isAdmin, user?.teachingSubjects]);

  // 3. Fetch Roster and Existing Pre-Saved Marks
  useEffect(() => {
    if (selectedClass && selectedStream && user?.schoolId && selectedSubject) {
      setFetchingRoster(true);

      const targetSub = subjectList.find(s => String(s.id) === String(selectedSubject));
      const subName = targetSub ? targetSub.subject_name : '';

      Promise.all([
        API.get(`/academics/roster/${user.schoolId}?gradeLevel=${encodeURIComponent(selectedClass)}&stream=${encodeURIComponent(selectedStream)}`),
        subName && selectedExam ? API.get(`/academics/marks-by-roster/${user.schoolId}?subjectName=${encodeURIComponent(subName)}&term=${encodeURIComponent(currentTerm.term_name)}&examType=${encodeURIComponent(selectedExam)}&year=${currentTerm.academic_year}`) : Promise.resolve({ data: { marksMap: {} } })
      ])
        .then(([rosterRes, marksRes]) => {
          const students = rosterRes.data.students || [];
          const existingMarks = marksRes.data.marksMap || {};
          setRoster(students);

          const cbcMode = isCbcClass(selectedClass);
          const initialScores = {};

          students.forEach(st => {
            const saved = existingMarks[st.id];
            if (saved) {
              const evalObj = evaluateScore(saved.rawScore, saved.maxMarks || maxMarks, cbcMode);
              initialScores[st.id] = {
                rawScore: saved.rawScore,
                percentage: evalObj.percentage,
                rubric: evalObj.rubric,
                color: evalObj.color,
                label: evalObj.label,
                isSaved: true
              };
            } else {
              initialScores[st.id] = { rawScore: '', percentage: null, rubric: '', color: '', label: '', isSaved: false };
            }
          });

          setScores(initialScores);
        })
        .catch(err => console.error("Roster fetch error:", err))
        .finally(() => setFetchingRoster(false));
    }
  }, [selectedClass, selectedStream, selectedSubject, selectedExam, user?.schoolId, subjectList, currentTerm, maxMarks]);

  // Handle Input Score Change with validation warning
  const handleScoreChange = (studentId, rawValue) => {
    const numVal = parseFloat(rawValue);
    const limit = parseFloat(maxMarks) || 100;

    if (!isNaN(numVal) && numVal > limit) {
      toast.error(`Score cannot exceed maximum of ${limit}!`, { id: 'limit-alert' });
    }

    const cbcMode = isCbcClass(selectedClass);
    const evalObj = evaluateScore(rawValue, maxMarks, cbcMode);

    setScores(prev => ({
      ...prev,
      [studentId]: {
        rawScore: rawValue,
        percentage: evalObj.percentage,
        rubric: evalObj.rubric,
        color: evalObj.color,
        label: evalObj.label,
        isSaved: false
      }
    }));
  };

  const handleMaxMarksChange = (newMax) => {
    setMaxMarks(newMax);
    const cbcMode = isCbcClass(selectedClass);
    setScores(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        if (updated[id]?.rawScore !== '') {
          const evalObj = evaluateScore(updated[id].rawScore, newMax, cbcMode);
          updated[id] = { ...updated[id], ...evalObj, isSaved: false };
        }
      });
      return updated;
    });
  };

  // Quick Single Row Save
  const handleSaveSingle = async (studentId) => {
    const studentScore = scores[studentId];
    if (!studentScore || studentScore.rawScore === '') return toast.error("Enter a valid mark first.");
    if (parseFloat(studentScore.rawScore) > parseFloat(maxMarks)) {
      return toast.error(`Mark cannot exceed maximum of ${maxMarks}`);
    }

    setSavingSingleId(studentId);
    try {
      await API.post('/academics/record-batch', {
        schoolId: user.schoolId,
        term: currentTerm?.term_name || 'Term 1',
        examType: selectedExam,
        subjectId: selectedSubject,
        maxMarks,
        entries: [{
          studentId,
          rawScore: studentScore.rawScore,
          rubric: studentScore.rubric
        }]
      });
      toast.success("Mark updated!");
      setScores(prev => ({
        ...prev,
        [studentId]: { ...prev[studentId], isSaved: true }
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save mark.");
    } finally {
      setSavingSingleId(null);
    }
  };

  // Batch Save All Roster Marks
  const handleSaveAllMarks = async (e) => {
    e.preventDefault();
    if (!selectedExam) return toast.error("Please select an exam series.");
    if (!selectedSubject) return toast.error("Please select a subject.");

    const limit = parseFloat(maxMarks) || 100;
    const hasInvalid = Object.values(scores).some(s => {
      const n = parseFloat(s.rawScore);
      return !isNaN(n) && n > limit;
    });

    if (hasInvalid) {
      return toast.error("Cannot commit marks. One or more scores exceed the maximum allowable percentage.");
    }

    const entries = Object.keys(scores)
      .filter(id => scores[id].rawScore !== '')
      .map(id => ({
        studentId: id,
        rawScore: scores[id].rawScore,
        rubric: scores[id].rubric
      }));

    if (entries.length === 0) return toast.error("No marks entered to commit.");

    setLoading(true);
    try {
      await API.post('/academics/record-batch', {
        schoolId: user.schoolId,
        term: currentTerm?.term_name || 'Term 1',
        examType: selectedExam,
        subjectId: selectedSubject,
        maxMarks,
        entries
      });
      toast.success("All marks and evaluation rubrics saved!");
      setScores(prev => {
        const savedMap = { ...prev };
        entries.forEach(e => {
          if (savedMap[e.studentId]) savedMap[e.studentId].isSaved = true;
        });
        return savedMap;
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to commit marks.");
    } finally {
      setLoading(false);
    }
  };

  // Filter roster dynamically using the search bar
  const filteredRoster = roster.filter(st =>
    st.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    st.admission_number?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      
      {/* HEADER WITH INVERTED V (CHEVRON) COLLAPSE TOGGLE */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">
            Grading & Assessment Hub
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Academic Session: {currentTerm?.academic_year} — {currentTerm?.term_name} | Framework: {isCbcClass(selectedClass) ? 'CBC Competency Grading' : '8-4-4 Standard Scale'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-[10px] font-black uppercase tracking-wider">
              Executive / Full Access
            </span>
          )}
          
          {/* Collapse Toggle Button with Chevron */}
          <button
            type="button"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            <span>{isFiltersExpanded ? 'Hide Filters' : 'Show Filters'}</span>
            <i className={`fas fa-chevron-${isFiltersExpanded ? 'up' : 'down'} text-xs`}></i>
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE FILTER & CONFIGURATION PANEL */}
      {isFiltersExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-200">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Class Level</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none"
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
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none"
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
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {subjectList.length === 0 ? (
                <option value="">No subjects assigned</option>
              ) : (
                subjectList.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.subject_name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Exam Series</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              {examSeries.map(es => (
                <option key={es.id} value={es.exam_name}>{es.exam_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Marks Out Of (/)</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={maxMarks}
              onChange={(e) => handleMaxMarksChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-blue-400 rounded-xl text-sm font-bold text-blue-700 outline-none"
              placeholder="e.g. 30, 50, 100"
            />
          </div>
        </div>
      )}

      {/* QUICK STUDENT SEARCH BAR & COUNTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <i className="fas fa-search text-xs"></i>
          </span>
          <input
            type="text"
            placeholder="Quick search learner by name or adm..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Showing {filteredRoster.length} of {roster.length} Learners
        </span>
      </div>

      {/* ROSTER MARKS TABLE WITH HORIZONTAL SCROLL FOR MOBILE */}
      {fetchingRoster ? (
        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
          Loading Class Roster & Existing Marks...
        </div>
      ) : roster.length > 0 ? (
        <form onSubmit={handleSaveAllMarks} className="space-y-4">
          <div className="overflow-x-auto border border-slate-100 rounded-2xl w-full">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Adm No.</th>
                  <th className="p-4">Learner Name</th>
                  <th className="p-4 text-center">Score (/{maxMarks})</th>
                  <th className="p-4 text-center">Normalized (%)</th>
                  <th className="p-4 text-center">{isCbcClass(selectedClass) ? 'CBC Rubric' : '8-4-4 Grade'}</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredRoster.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-bold">
                      No learners match your search filter.
                    </td>
                  </tr>
                ) : (
                  filteredRoster.map(student => {
                    const studentData = scores[student.id] || { rawScore: '', percentage: null, rubric: '', color: '', isSaved: false };
                    const numVal = parseFloat(studentData.rawScore);
                    const limit = parseFloat(maxMarks) || 100;
                    const isError = !isNaN(numVal) && numVal > limit;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 font-mono font-bold text-blue-600">{student.admission_number}</td>
                        <td className="p-4 text-slate-900 font-semibold">{student.full_name}</td>

                        {/* RAW SCORE INPUT WITH REAL-TIME ERROR HIGHLIGHT */}
                        <td className="p-4 text-center">
                          <div className="inline-block">
                            <input
                              type="number"
                              min="0"
                              max={maxMarks}
                              step="0.5"
                              placeholder={`0-${maxMarks}`}
                              value={studentData.rawScore}
                              onChange={(e) => handleScoreChange(student.id, e.target.value)}
                              className={`w-28 px-3 py-1.5 border rounded-lg text-sm text-center font-mono font-bold outline-none transition ${
                                isError 
                                  ? 'bg-red-50 border-red-500 text-red-600 focus:ring-2 focus:ring-red-200' 
                                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-600 focus:bg-white'
                              }`}
                            />
                            {isError && (
                              <span className="block text-[9px] font-black uppercase text-red-500 mt-0.5">
                                Exceeds {limit}!
                              </span>
                            )}
                          </div>
                        </td>

                        {/* COMPUTED PERCENTAGE */}
                        <td className="p-4 text-center font-mono font-bold text-slate-700">
                          {studentData.percentage !== null ? `${studentData.percentage}%` : '—'}
                        </td>

                        {/* DYNAMIC RUBRIC / GRADE BADGE */}
                        <td className="p-4 text-center">
                          {studentData.rubric ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-xl text-xs font-black border ${studentData.color}`}
                              title={studentData.label}
                            >
                              {studentData.rubric}
                              <span className="hidden md:inline ml-1 font-semibold text-[10px]">
                                ({studentData.label})
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs font-bold">—</span>
                          )}
                        </td>

                        {/* ROW ACTION */}
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSaveSingle(student.id)}
                            disabled={savingSingleId === student.id || isError}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition ${
                              studentData.isSaved
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            } disabled:opacity-50`}
                          >
                            {savingSingleId === student.id ? 'Saving...' : studentData.isSaved ? 'Saved ✓' : 'Save / Update'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <p className="text-xs text-slate-400 font-semibold">
              * Click <strong>Save / Update</strong> per student, or commit the entire stream simultaneously below.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? 'Committing Stream Scores...' : 'Commit All Marks For Stream'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-100 rounded-2xl">
          No learners found registered in {selectedClass} ({selectedStream}).
        </div>
      )}
    </div>
  );
};

export default EnterMarks;
