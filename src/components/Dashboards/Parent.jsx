import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const Parent = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form State for editing
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchChildDetails();
  }, [user.phone]);

  const fetchChildDetails = async () => {
    try {
      const res = await API.get(`/parent/child-details/${user.phone}`);
      setChildData(res.data);
      setEditData(res.data); // Pre-fill the edit form
    } catch (err) {
      toast.error("Could not load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await API.put(`/parent/update-child/${childData.id}`, editData);
      toast.success("Student file updated successfully!");
      fetchChildDetails();
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="w-1 h-8 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>)}
       </div>
       <p className="text-blue-500 font-black uppercase tracking-widest mt-4 text-xs">Vinnie ERP Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        
        {/* TOP PROFILE HEADER */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-32 h-32 bg-slate-100 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl flex items-center justify-center">
            {childData.profile_pic_url ? (
               <img src={childData.profile_pic_url} className="w-full h-full object-cover" alt="Student" />
            ) : (
               <i className="fas fa-user-graduate text-5xl text-slate-300"></i>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 uppercase italic leading-none">{childData.full_name}</h1>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-2">{childData.grade_level} • {childData.admission_number}</p>
          </div>
        </div>

        {/* TOP 5 CATEGORIES (Clean Landing Page) */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-lg font-black uppercase italic text-slate-700">Quick Overview</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all"
            >
              Update Full Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              { label: 'Gender', val: childData.gender },
              { label: 'DOB', val: childData.dob ? new Date(childData.dob).toLocaleDateString() : 'Not Set' },
              { label: 'Curriculum', val: childData.curriculum_type },
              { label: 'Status', val: 'Active Student' },
              { label: 'Parent Link', val: childData.parent_phone }
            ].map((item, idx) => (
              <div key={idx} className="p-6 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{item.label}</p>
                <p className="font-bold text-slate-800 uppercase text-xs">{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIALS AREA (Fee Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
              <p className="text-[10px] font-black uppercase opacity-60">Total Billed</p>
              <h3 className="text-3xl font-black italic mt-2">KES {childData.total_billed?.toLocaleString()}</h3>
           </div>
           <div className="p-8 bg-emerald-500 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20">
              <p className="text-[10px] font-black uppercase opacity-60">Amount Paid</p>
              <h3 className="text-3xl font-black italic mt-2">KES {childData.total_paid?.toLocaleString()}</h3>
           </div>
           <div className="p-8 bg-white border-4 border-rose-500 rounded-[2.5rem] text-rose-500">
              <p className="text-[10px] font-black uppercase opacity-40">Current Balance</p>
              <h3 className="text-3xl font-black italic mt-2">KES {childData.balance?.toLocaleString()}</h3>
           </div>
        </div>
      </main>

      {/* COMPREHENSIVE UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 my-auto">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase italic">Edit Student Record</h2>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Makini Digital File System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/50 hover:text-white">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
              {/* NON-EDITABLE SECTION */}
              <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4 opacity-60">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400">Locked Name</label>
                   <p className="font-bold text-slate-800">{childData.full_name}</p>
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400">Admission No</label>
                   <p className="font-bold text-slate-800">{childData.admission_number}</p>
                </div>
              </div>

              {/* EDITABLE SECTION */}
              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Date of Birth</label>
                <input type="date" value={editData.dob?.split('T')[0] || ''} onChange={(e)=>setEditData({...editData, dob: e.target.value})} className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Religion</label>
                <select value={editData.religion || ''} onChange={(e)=>setEditData({...editData, religion: e.target.value})} className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  <option value="">Select Religion</option><option>Christian</option><option>Muslim</option><option>Hindu</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Country of Origin</label>
                <input type="text" value={editData.country_of_origin || ''} onChange={(e)=>setEditData({...editData, country_of_origin: e.target.value})} className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Language Spoken</label>
                <input type="text" value={editData.language_spoken || ''} onChange={(e)=>setEditData({...editData, language_spoken: e.target.value})} className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Medical Condition / Disability</label>
                <textarea rows="2" value={editData.disability || ''} onChange={(e)=>setEditData({...editData, disability: e.target.value})} className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Mention any allergies or conditions..."></textarea>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-4 border-t border-slate-100">
              <button 
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 h-16 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                {updating ? "Processing..." : "Commit Changes"}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 h-16 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parent;