import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const SubjectsAndExamsControl = ({ user }) => {
  const [subjects, setSubjects] = useState([]);
  const [examSeries, setExamSeries] = useState([]);
  
  const [subjectForm, setSubjectForm] = useState({ subjectName: '', curriculum: 'CBC', department: 'General' });
  const [examForm, setExamForm] = useState({ examName: '', weightPercentage: 100 });
  
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);

  const fetchData = async () => {
    if (!user?.schoolId) return;
    try {
      const [subRes, examRes] = await Promise.all([
        API.get(`/academics/subjects/${user.schoolId}`),
        API.get(`/academics/exam-series/${user.schoolId}`)
      ]);
      setSubjects(subRes.data.subjects || []);
      setExamSeries(examRes.data.examSeries || []);
    } catch (err) {
      toast.error("Failed to load academic configurations.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.schoolId]);

  // Handle Subject Creation
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.subjectName.trim()) return toast.error("Enter a subject name.");

    setLoadingSub(true);
    try {
      await API.post('/academics/subjects', {
        schoolId: user.schoolId,
        subjectName: subjectForm.subjectName.trim(),
        curriculum: subjectForm.curriculum,
        department: subjectForm.department
      });
      toast.success("Subject added successfully!");
      setSubjectForm({ subjectName: '', curriculum: 'CBC', department: 'General' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add subject.");
    } finally {
      setLoadingSub(false);
    }
  };

  // Handle Exam Series Creation
  const handleAddExamSeries = async (e) => {
    e.preventDefault();
    if (!examForm.examName.trim()) return toast.error("Enter an exam series name.");

    setLoadingExam(true);
    try {
      await API.post('/academics/exam-series', {
        schoolId: user.schoolId,
        examName: examForm.examName.trim(),
        weightPercentage: examForm.weightPercentage
      });
      toast.success("Exam series registered successfully!");
      setExamForm({ examName: '', weightPercentage: 100 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add exam series.");
    } finally {
      setLoadingExam(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. SUBJECTS MANAGEMENT SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-400 mb-1">Subject Registry</h3>
          <p className="text-xs text-slate-500 font-medium">Configure institutional subjects taught across CBC and 8-4-4 programs.</p>
        </div>

        <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Subject Name (e.g. Chemistry)"
            value={subjectForm.subjectName}
            onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
            className="sm:col-span-2 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
            required
          />
          <select
            value={subjectForm.curriculum}
            onChange={(e) => setSubjectForm({ ...subjectForm, curriculum: e.target.value })}
            className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
          >
            <option value="CBC">CBC Curriculum</option>
            <option value="8-4-4">8-4-4 Curriculum</option>
            <option value="IGCSE">IGCSE / General</option>
          </select>
          <button
            type="submit"
            disabled={loadingSub}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {loadingSub ? 'Adding...' : 'Add Subject'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {subjects.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <span>{sub.subject_name}</span>
              <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md uppercase">{sub.curriculum || 'CBC'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. EXAM SERIES MANAGEMENT SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-400 mb-1">Exam Series & Assessment Types</h3>
          <p className="text-xs text-slate-500 font-medium">Define exam categories appearing in report cards (e.g. Opener, Mid-Term, End-Term, Mock).</p>
        </div>

        <form onSubmit={handleAddExamSeries} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Exam Name (e.g. Opener Exam, End Term)"
            value={examForm.examName}
            onChange={(e) => setExamForm({ ...examForm, examName: e.target.value })}
            className="sm:col-span-2 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
            required
          />
          <button
            type="submit"
            disabled={loadingExam}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {loadingExam ? 'Registering...' : 'Add Exam Series'}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {examSeries.map((ex) => (
            <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{ex.exam_name}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Weight: {ex.weight_percentage || 100}%</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${ex.is_locked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {ex.is_locked ? 'Locked' : 'Open'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SubjectsAndExamsControl;
