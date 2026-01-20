import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const AdminEnrollmentForm = () => {
  const [streams, setStreams] = useState([]);
  const [studentData, setStudentData] = useState({
    fullName: '',
    admNo: '',
    parentPhone: '',
    levelType: 'Form',
    levelNumber: '',
    stream: ''
  });

  // Fetch the configured streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/config/streams");
        
        // Debugging: Right-click your browser -> Inspect -> Console to see this
        console.log("Full Backend Response:", response.data);

        // Your backend sends { streams: [...] }. We extract it here
        let fetchedStreams = [];
        if (response.data.streams) {
          fetchedStreams = response.data.streams;
        } else if (Array.isArray(response.data)) {
          fetchedStreams = response.data;
        }

        setStreams(fetchedStreams);
      } catch (error) {
        console.error("Stream sync error:", error);
        toast.error("Could not load streams from database.");
      }
    };
    fetchStreams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const curriculum = (studentData.levelType === 'Grade') ? 'CBC' : '8-4-4';
    
    try {
      const response = await axios.post("http://localhost:5000/api/students/enroll", { ...studentData, curriculum });
      if (response.status === 201) {
        toast.success(`Enrolled ${studentData.fullName} to ${curriculum}!`);
        // Reset form but keep the streams list
        setStudentData({ fullName: '', admNo: '', parentPhone: '', levelType: 'Form', levelNumber: '', stream: '' });
      }
    } catch (error) {
      toast.error("Enrollment failed. Ensure all fields are filled.");
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-white shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Student Full Name" required className="p-3 rounded bg-slate-700 text-white outline-none border border-slate-600 focus:ring-2 focus:ring-purple-500"
            value={studentData.fullName} onChange={(e) => setStudentData({...studentData, fullName: e.target.value})} />
          <input type="text" placeholder="Admission Number" required className="p-3 rounded bg-slate-700 text-white outline-none border border-slate-600 focus:ring-2 focus:ring-purple-500"
            value={studentData.admNo} onChange={(e) => setStudentData({...studentData, admNo: e.target.value})} />
        </div>

        <div className="flex gap-4">
          <select className="p-3 rounded bg-slate-700 text-white outline-none border border-slate-600 flex-1 cursor-pointer"
            value={studentData.levelType} onChange={(e) => setStudentData({...studentData, levelType: e.target.value})}>
            <option value="Form">Form (8-4-4)</option>
            <option value="Grade">Grade (CBC)</option>
          </select>
          <input type="number" placeholder="No." required className="p-3 rounded bg-slate-700 text-white outline-none border border-slate-600 w-24"
            value={studentData.levelNumber} onChange={(e) => setStudentData({...studentData, levelNumber: e.target.value})} />
        </div>

        {/* DYNAMIC STREAM DROPDOWN */}
        <select 
          className="w-full p-3 rounded bg-slate-700 text-white outline-none border border-slate-600 cursor-pointer"
          required
          value={studentData.stream}
          onChange={(e) => setStudentData({...studentData, stream: e.target.value})}
        >
          <option value="">-- Select Stream --</option>
          {streams.length > 0 ? (
            streams.map((s, index) => (
              <option key={index} value={s} className="bg-slate-700">
                {s}
              </option>
            ))
          ) : (
            <option disabled>No streams found. Configure them first!</option>
          )}
        </select>

        <input type="text" placeholder="Parent Phone Number" required className="w-full p-3 rounded bg-slate-700 text-white outline-none border border-slate-600"
          value={studentData.parentPhone} onChange={(e) => setStudentData({...studentData, parentPhone: e.target.value})} />

        <button type="submit" className="w-full bg-purple-600 p-3 rounded-xl font-bold hover:bg-purple-500 transition-all shadow-lg active:scale-95">
          Enroll Student to System
        </button>
      </form>
    </div>
  );
};

export default AdminEnrollmentForm;