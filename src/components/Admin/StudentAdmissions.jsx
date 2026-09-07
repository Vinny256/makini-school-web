import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StudentAdmissions = ({ user, onStudentAdmitted }) => {
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const [studentForm, setStudentForm] = useState({
    admissionNumber: '',
    fullName: '',
    gender: 'Male',
    curriculum: 'CBC',
    gradeLevel: '',
    stream: '',
    upiNumber: '',
    guardianName: '',
    guardianPhone: '',
    boardingStatus: 'Boarding'
  });

  useEffect(() => {
    if (!user?.schoolId) return;

    Promise.all([
      API.get(`/academics/classes/${user.schoolId}`),
      API.get(`/academics/streams/${user.schoolId}`)
    ]).then(([classRes, streamRes]) => {
      const cls = classRes.data.classes || [];
      const stms = streamRes.data.streams || [];
      setClasses(cls);
      setStreams(stms);

      if (cls.length > 0) {
        setStudentForm(prev => ({
          ...prev,
          gradeLevel: cls[0].class_name,
          curriculum: cls[0].curriculum
        }));
      }
      if (stms.length > 0) {
        setStudentForm(prev => ({ ...prev, stream: stms[0].stream_name }));
      }
    }).catch(err => console.error("Admissions fetch error:", err));
  }, [user?.schoolId]);

  const handleAdmitStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.stream) return toast.error("Please add and select a stream first.");
    if (!studentForm.gradeLevel) return toast.error("Please add and select a class first.");

    setLoadingStudent(true);
    try {
      const res = await API.post('/students/register', {
        schoolId: user.schoolId,
        ...studentForm
      });
      toast.success(`Learner Admitted: ${res.data.student.full_name} (${res.data.student.admission_number})`);
      setStudentForm({
        admissionNumber: '',
        fullName: '',
        gender: 'Male',
        curriculum: classes[0]?.curriculum || 'CBC',
        gradeLevel: classes[0]?.class_name || '',
        stream: streams[0]?.stream_name || '',
        upiNumber: '',
        guardianName: '',
        guardianPhone: '',
        boardingStatus: 'Boarding'
      });
      if (onStudentAdmitted) onStudentAdmitted();
    } catch (err) {
      toast.error(err.response?.data?.message || "Student admission failed");
    } finally {
      setLoadingStudent(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Admit Learner: Dynamic Classes & Streams</h3>
        <p className="text-xs text-slate-500 mb-6">Enroll students into any configured grade level (Grade 1-12 or Form 1-4) with assigned stream.</p>

        <form onSubmit={handleAdmitStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Admission Number</label>
            <input
              type="text"
              placeholder="e.g. 1084"
              value={studentForm.admissionNumber}
              onChange={(e) => setStudentForm({ ...studentForm, admissionNumber: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Learner's Full Name"
              value={studentForm.fullName}
              onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Gender</label>
            <select
              value={studentForm.gender}
              onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
              required
            >
              <option value="Male">Male (Boy)</option>
              <option value="Female">Female (Girl)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Class / Grade Level</label>
            <select
              value={studentForm.gradeLevel}
              onChange={(e) => {
                const selectedClassName = e.target.value;
                const matchedClass = classes.find(c => c.class_name === selectedClassName);
                setStudentForm({ 
                  ...studentForm, 
                  gradeLevel: selectedClassName,
                  curriculum: matchedClass?.curriculum || 'CBC'
                });
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
              required
            >
              {classes.length === 0 ? (
                <option value="">No classes found - configure in Streams & Classes</option>
              ) : (
                classes.map((c) => (
                  <option key={c.id} value={c.class_name}>
                    {c.class_name} ({c.tier} — {c.curriculum})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Stream Allocation</label>
            <select
              value={studentForm.stream}
              onChange={(e) => setStudentForm({ ...studentForm, stream: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
              required
            >
              {streams.length === 0 ? (
                <option value="">No streams found - configure in Streams & Classes</option>
              ) : (
                streams.map((st) => (
                  <option key={st.id} value={st.stream_name}>{st.stream_name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">NEMIS / UPI Code</label>
            <input
              type="text"
              placeholder="e.g. ABC123XYZ"
              value={studentForm.upiNumber}
              onChange={(e) => setStudentForm({ ...studentForm, upiNumber: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Guardian Phone (SMS)</label>
            <input
              type="text"
              placeholder="07XXXXXXXX"
              value={studentForm.guardianPhone}
              onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Accommodation Status</label>
            <select
              value={studentForm.boardingStatus}
              onChange={(e) => setStudentForm({ ...studentForm, boardingStatus: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
            >
              <option value="Boarding">Boarding Scholar</option>
              <option value="Day">Day Scholar</option>
            </select>
          </div>

          <div className="sm:col-span-3 mt-2">
            <button
              type="submit"
              disabled={loadingStudent}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loadingStudent ? 'Enrolling...' : 'Admit Learner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAdmissions;
