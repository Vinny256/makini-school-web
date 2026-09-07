import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StreamClassManagement = ({ user }) => {
  const [streams, setStreams] = useState([]);
  const [newStreamInput, setNewStreamInput] = useState('');
  const [loadingStream, setLoadingStream] = useState(false);

  const [classes, setClasses] = useState([]);
  const [newClassForm, setNewClassForm] = useState({
    className: '',
    curriculum: 'CBC',
    tier: 'Junior School'
  });
  const [loadingClass, setLoadingClass] = useState(false);

  const fetchStreams = async () => {
    try {
      const res = await API.get(`/academics/streams/${user.schoolId}`);
      if (res.data.success) setStreams(res.data.streams || []);
    } catch (err) {
      console.error("Streams error:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get(`/academics/classes/${user.schoolId}`);
      if (res.data.success) setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Classes error:", err);
    }
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchStreams();
      fetchClasses();
    }
  }, [user?.schoolId]);

  const handleAddStream = async (e) => {
    e.preventDefault();
    const cleanStream = newStreamInput.trim();
    if (!cleanStream) return;

    setLoadingStream(true);
    try {
      const res = await API.post('/academics/streams', {
        schoolId: user.schoolId,
        streamName: cleanStream
      });
      toast.success(res.data.message || `Stream "${cleanStream}" registered!`);
      setNewStreamInput('');
      fetchStreams();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create stream");
    } finally {
      setLoadingStream(false);
    }
  };

  const handleDeleteStream = async (streamId, streamName) => {
    if (!window.confirm(`Delete stream "${streamName}"?`)) return;
    try {
      await API.delete(`/academics/streams/${streamId}`);
      toast.success(`Stream "${streamName}" deleted`);
      fetchStreams();
    } catch (err) {
      toast.error("Failed to delete stream");
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassForm.className.trim()) return;

    setLoadingClass(true);
    try {
      const res = await API.post('/academics/classes', {
        schoolId: user.schoolId,
        className: newClassForm.className.trim(),
        curriculum: newClassForm.curriculum,
        tier: newClassForm.tier
      });
      toast.success(res.data.message || `Class "${newClassForm.className}" added!`);
      setNewClassForm({ className: '', curriculum: 'CBC', tier: 'Junior School' });
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add class");
    } finally {
      setLoadingClass(false);
    }
  };

  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Delete class "${className}"?`)) return;
    try {
      await API.delete(`/academics/classes/${classId}`);
      toast.success(`Class "${className}" removed`);
      fetchClasses();
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* STREAM CONFIGURATOR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">School Stream Configurator</h3>
        <p className="text-xs text-slate-500 mb-6">
          Active streams saved directly to the database. These dynamically populate all student admissions and teacher allocations.
        </p>
        <form onSubmit={handleAddStream} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="New Stream Name (e.g. Simba, Red, East)"
            value={newStreamInput}
            onChange={(e) => setNewStreamInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
            required
          />
          <button
            type="submit"
            disabled={loadingStream}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {loadingStream ? 'Saving...' : 'Add Stream'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {streams.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold">No streams created yet. Add one above.</p>
          ) : (
            streams.map((st) => (
              <span 
                key={st.id} 
                className="bg-slate-100 border border-slate-200 text-slate-700 pl-4 pr-2 py-2 rounded-xl text-xs font-bold flex items-center gap-3"
              >
                <span>Stream {st.stream_name}</span>
                <button 
                  type="button" 
                  onClick={() => handleDeleteStream(st.id, st.stream_name)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* CLASS LEVELS CONFIGURATOR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">School Class Levels (CBC & 8-4-4)</h3>
        <p className="text-xs text-slate-500 mb-6">
          Manage Grade 1 through Grade 12 (CBC) and Form 1 through Form 4. Remove any levels this institution does not host.
        </p>

        <form onSubmit={handleAddClass} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            placeholder="Class Name (e.g. Grade 10)"
            value={newClassForm.className}
            onChange={(e) => setNewClassForm({ ...newClassForm, className: e.target.value })}
            className="sm:col-span-2 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600"
            required
          />
          <select
            value={newClassForm.curriculum}
            onChange={(e) => setNewClassForm({ ...newClassForm, curriculum: e.target.value })}
            className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none"
          >
            <option value="CBC">CBC Framework</option>
            <option value="8-4-4">8-4-4 System</option>
          </select>
          <button
            type="submit"
            disabled={loadingClass}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl transition disabled:opacity-50"
          >
            {loadingClass ? 'Saving...' : 'Add Class'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {classes.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold">No classes registered yet. Add one above.</p>
          ) : (
            classes.map((c) => (
              <span 
                key={c.id} 
                className="bg-slate-100 border border-slate-200 text-slate-800 pl-3 pr-2 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span>{c.class_name}</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-black">{c.curriculum}</span>
                <button 
                  type="button" 
                  onClick={() => handleDeleteClass(c.id, c.class_name)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamClassManagement;
