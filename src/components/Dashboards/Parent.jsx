import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const Parent = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        // Fetch the student linked to this parent's phone
        const res = await API.get(`/parent/child-details/${user.phone}`);
        setChildData(res.data);
      } catch (err) {
        toast.error("Could not load student data");
      } finally {
        setLoading(false);
      }
    };
    fetchChildDetails();
  }, [user.phone]);

  const handleDownloadPDF = () => {
    toast.success("Generating Fee Statement PDF...");
    // Future logic for PDF generation goes here
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">LOADING VINNIE PARENT PORTAL...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:relative w-72 bg-blue-950 text-white flex-col p-6 h-screen z-50 ${isSidebarOpen ? 'flex' : 'hidden md:flex'}`}>
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"><i className="fas fa-hand-holding-heart text-2xl"></i></div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-blue-400">Parent Portal</h2>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('Overview')} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold ${activeTab === 'Overview' ? 'bg-blue-600' : 'hover:bg-blue-900'}`}><i className="fas fa-home"></i> Dashboard</button>
          <button onClick={() => setActiveTab('Finance')} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold ${activeTab === 'Finance' ? 'bg-blue-600' : 'hover:bg-blue-900'}`}><i className="fas fa-wallet"></i> Fee Statement</button>
        </nav>
        <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="mt-6 p-4 bg-red-600/10 text-red-400 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all">Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase italic">Welcome, {user.name}</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Student: {childData?.full_name}</p>
          </div>
          <div className="md:hidden">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-blue-900 text-white rounded-xl"><i className="fas fa-bars"></i></button>
          </div>
        </header>

        {/* FINANCIAL OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Billed</p>
            <h2 className="text-2xl font-black text-slate-800">KES {childData?.total_billed || '0.00'}</h2>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Paid</p>
            <h2 className="text-2xl font-black text-green-600">KES {childData?.total_paid || '0.00'}</h2>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-md bg-blue-50/30">
            <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Outstanding Balance</p>
            <h2 className="text-2xl font-black text-blue-700">KES {childData?.balance || '0.00'}</h2>
          </div>
        </div>

        {/* STUDENT PERSONAL INFORMATION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-black uppercase italic text-slate-700">Personal Information</h2>
            <button onClick={handleDownloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <i className="fas fa-file-pdf mr-2"></i> Download Statement
            </button>
          </div>
          
          <div className="p-0">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {[
                  { label: 'Admission No:', value: childData?.admission_number },
                  { label: 'Full Name:', value: childData?.full_name },
                  { label: 'Gender:', value: childData?.gender },
                  { label: 'Date of Birth:', value: childData?.dob || 'Not Set' },
                  { label: 'Curriculum:', value: childData?.curriculum_type },
                  { label: 'Level:', value: childData?.grade_level },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 text-xs font-black uppercase text-slate-400 w-1/3">{item.label}</td>
                    <td className="p-5 text-sm font-bold text-slate-700">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button className="bg-blue-600 text-white w-full md:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
              <i className="fas fa-user-edit mr-2"></i> Update Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parent;