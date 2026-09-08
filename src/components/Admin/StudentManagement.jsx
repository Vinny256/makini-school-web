import React, { useState, useEffect } from 'react';
import API from '../../api'; // or fetch depending on your project setup
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const StudentManagement = ({ user, onStudentAdmitted }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNumber: '',
    gender: 'Male',
    gradeLevel: '',
    stream: '',
    parentName: '',
    parentPhone: '',
    studentSubjects: []
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [classList, setClassList] = useState([]);
  const [streamList, setStreamList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch classes, streams, and active subjects for this school on mount
  useEffect(() => {
    if (!user?.schoolId) return;

    Promise.all([
      API.get(`/academics/subjects/${user.schoolId}`),
      API.get(`/academics/classes/${user.schoolId}`),
      API.get(`/academics/streams/${user.schoolId}`)
    ])
      .then(([subRes, classRes, streamRes]) => {
        setAvailableSubjects(subRes.data.subjects || []);
        const cls = classRes.data.classes || [];
        const stms = streamRes.data.streams || [];
        setClassList(cls);
        setStreamList(stms);

        // Set default dropdown selections if available
        setFormData(prev => ({
          ...prev,
          gradeLevel: cls.length > 0 ? cls[0].class_name : '',
          stream: stms.length > 0 ? stms[0].stream_name : ''
        }));
      })
      .catch(err => console.error("Failed to fetch form setup data", err));
  }, [user?.schoolId]);

  // Manual reset to "forget" the current entry session
  const resetForm = () => {
    setFormData({ 
      studentName: '', 
      admissionNumber: '', 
      gender: 'Male',
      gradeLevel: classList.length > 0 ? classList[0].class_name : '',
      stream: streamList.length > 0 ? streamList[0].stream_name : '',
      parentName: '', 
      parentPhone: '',
      studentSubjects: [] 
    });
    toast("Form cleared for new entry", { icon: '🧹' });
  };

  const handleSubjectToggle = (subName) => {
    setFormData(prev => {
      const exists = prev.studentSubjects.includes(subName);
      return {
        ...prev,
        studentSubjects: exists 
          ? prev.studentSubjects.filter(s => s !== subName)
          : [...prev.studentSubjects, subName]
      };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim()) return toast.error("Enter student full name.");
    
    setLoading(true);
    const firstName = formData.studentName.split(' ')[0];

    try {
      const response = await API.post('/students/add', {
        schoolId: user.schoolId,
        full_name: formData.studentName.trim(),
        first_name: firstName,
        admission_number: formData.admissionNumber.trim(),
        gender: formData.gender,
        grade_level: formData.gradeLevel,
        stream: formData.stream,
        guardian_name: formData.parentName.trim(),
        guardian_phone: formData.parentPhone.trim(),
        studentSubjects: formData.studentSubjects
      });

      if (response.data.success || response.status === 201 || response.status === 200) {
        toast.success(`Success! ${firstName} registered.`, {
          style: { borderRadius: '15px', background: '#1e3a8a', color: '#fff' }
        });
        
        // AUTO-RESET: Forgets the session after successful save
        setFormData({ 
          studentName: '', 
          admissionNumber: '', 
          gender: 'Male',
          gradeLevel: classList.length > 0 ? classList[0].class_name : '',
          stream: streamList.length > 0 ? streamList[0].stream_name : '',
          parentName: '', 
          parentPhone: '',
          studentSubjects: [] 
        });

        if (onStudentAdmitted) onStudentAdmitted();
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-blue-50 dark:border-slate-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-blue-900 dark:text-yellow-400 uppercase flex items-center gap-3">
            <FontAwesomeIcon icon={faUserPlus} /> Manual Registration
          </h2>
          {/* Manual Session Reset Button */}
          <button 
            type="button"
            onClick={resetForm}
            className="text-gray-400 hover:text-blue-900 transition-colors p-2"
            title="Clear current session"
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Core Details */}
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Student Details</label>
              <input 
                type="text" required value={formData.studentName}
                placeholder="Full Student Name"
                className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900 text-sm font-semibold"
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              />
              <input 
                type="text" required value={formData.admissionNumber}
                placeholder="Admission Number (e.g., MAK/001)"
                className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900 text-sm font-semibold"
                onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none text-sm font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Class Level</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none text-sm font-semibold"
                  >
                    {classList.map(c => (
                      <option key={c.id} value={c.class_name}>{c.class_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Stream</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({...formData, stream: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none text-sm font-semibold"
                >
                  {streamList.map(s => (
                    <option key={s.id} value={s.stream_name}>{s.stream_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent Details */}
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Parent Details</label>
              <input 
                type="text" required value={formData.parentName}
                placeholder="Parent/Guardian Name"
                className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900 text-sm font-semibold"
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
              />
              <input 
                type="text" required value={formData.parentPhone}
                placeholder="Parent Phone Number"
                className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-900 text-sm font-semibold"
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              />
            </div>
          </div>

          {/* DYNAMIC SUBJECT ENROLLMENT CHECKLIST */}
          <div className="pt-2">
            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
              Enrolled Subjects (Required for Subject-Specific Grading Rosters)
            </label>
            {availableSubjects.length === 0 ? (
              <p className="text-xs text-amber-600 font-bold">No custom subjects found. Please add subjects in 'Subjects & Exams' first.</p>
            ) : (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700 rounded-2xl">
                {availableSubjects.map((sub) => {
                  const subName = sub.subject_name;
                  const isSelected = formData.studentSubjects.includes(subName);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubjectToggle(subName)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        isSelected 
                          ? 'bg-blue-900 text-white shadow-md' 
                          : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-100'
                      }`}
                    >
                      {subName} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-tighter transition-all shadow-xl ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-800'
            }`}
          >
            {loading ? 'Processing...' : 'Finalize Official Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentManagement;
