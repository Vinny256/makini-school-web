import React, { useState } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const StreamSetup = () => {
  const [streams, setStreams] = useState([""]);

  const handleStreamChange = (index, value) => {
    const updatedStreams = [...streams];
    updatedStreams[index] = value;
    setStreams(updatedStreams);
  };

  const addStream = () => setStreams([...streams, ""]);

  const removeStream = (index) => {
    const filtered = streams.filter((_, i) => i !== index);
    setStreams(filtered);
  };

  const saveToDatabase = async () => {
    try {
      // Remove any empty strings before saving
      const validStreams = streams.filter(s => s.trim() !== "");
      await API.post('/config/streams', { streams: validStreams });
      toast.success("Streams saved! Your enrollment dropdown is updated.");
    } catch (err) {
      toast.error("Failed to save streams. Check backend.");
    }
  };

  return (
    <div className="p-4 border border-slate-700 rounded-2xl bg-slate-800 shadow-lg text-white">
      <h2 className="text-lg font-bold mb-3 text-green-400">Step 1: Configure School Streams</h2>
      
      {streams.map((name, index) => (
        <div key={index} className="flex mb-2 gap-2">
          <input
            type="text"
            value={name}
            placeholder={`Stream ${index + 1} Name`}
            onChange={(e) => handleStreamChange(index, e.target.value)}
            // FIXED: text-white ensures you can see what you type!
            className="flex-1 bg-slate-700 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          {streams.length > 1 && (
            <button onClick={() => removeStream(index)} className="px-3 bg-red-600/20 text-red-500 rounded hover:bg-red-600/40">✕</button>
          )}
        </div>
      ))}

      <button onClick={addStream} className="text-blue-400 text-sm font-semibold hover:underline mb-4 block">+ Add Another Stream</button>

      <button onClick={saveToDatabase} className="w-full bg-green-600 text-white p-2 rounded-xl font-bold hover:bg-green-500 transition-all">
        Save Streams
      </button>
    </div>
  );
};

export default StreamSetup;