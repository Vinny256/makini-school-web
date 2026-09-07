import React, { useState, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-hot-toast';

const Principal = ({ user }) => {
  const [stats, setStats] = useState({ staff: 0, students: 0, meanGrade: '0.0' });
  const [activeTab, setActiveTab] = useState('Staff Management');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Staff Management states
  const [staffList, setStaffList] = useState([]);
  const [staffForm, setStaffForm] = useState({ fullName: '', role: 'Teacher' });
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [fetchingStaff, setFetchingStaff] = useState(true);

  // Bulk SMS state
  const [smsData, setSmsData] = useState({ targetGroup: 'All Parents', message: '' });
  const [isSendingSms, setIsSendingSms] = useState(false);

  // Fetch school overview stats
  const fetchStats = async () => {
    try {
      const res = await API.get(`/admin/stats/${user.schoolId}`);
      setStats({
        staff: parseInt(res.data.staff) || 0,
        students: parseInt(res.data.students) || 0,
        meanGrade: res.data.meanGrade || '0.0'
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  // Fetch staff directory
  const fetchStaff = async () => {
    try {
      setFetchingStaff(true);
      const res = await API.get(`/staff/school/${user.schoolId}`);
      setStaffList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load staff directory");
    } finally {
      setFetchingStaff(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) {
      fetchStats();
      fetchStaff();
    }
  }, [user?.schoolId]);

  // Register new staff member (Name + Role only)
  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.fullName.trim()) {
      return toast.error("Please enter the staff member's full name");
    }

    setLoadingStaff(true);
    try {
      const res = await API.post('/staff/register', {
        schoolId: user.schoolId,
        fullName: staffForm.fullName.trim(),
        role: staffForm.role
      });

      toast.success(
        `Staff Registered!\nCode: ${res.data.staff.staff_code} | Key: ${res.data.staff.password}`,
        { duration: 8000 }
      );

      setStaffForm({ fullName: '', role: 'Teacher' });
      fetchStaff();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoadingStaff(false);
    }
  };

  // Copy credentials helper
  const copyCredentials = (code, pass, name) => {
    navigator.clipboard.writeText(`Staff: ${name}\nLogin Code: ${code}\nAccess Key: ${pass}`);
    toast.success(`Copied login credentials for ${name}`);
  };

  // Bulk SMS handler
  const handleSendSMS = async (e) => {
    e.preventDefault();
    if (!smsData.message.trim()) return toast.error("Please type a message.");
    setIsSendingSms(true);
    try {
      await API.post('/admin/communications/bulk-sms', {
        schoolId: user.schoolId,
        ...smsData
      });
      toast.success("Broadcast dispatched successfully!");
      setSmsData({ ...smsData, message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dispatch SMS.");
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row w-full overflow-x-hidden">
      
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-slate-900 text-white px-5 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm shadow-md">
            <i className="fas fa-university text-white"></i>
          </div>
          <div>
            <h2 className="text-sm font-black italic uppercase tracking-tight leading-none">
              Executive <span className="text-blue-500">Portal</span>
            </h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {user?.schoolName || 'School System'}
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-blue-400 active:scale-95 transition"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* COMMAND CENTER SIDEBAR */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-72 bg-slate-900 text-white flex flex-col p-6 h-screen z-50 transition-transform duration-300 ease-in-out shadow-2xl
        md:sticky md:top-0 md:translate-x-0 md:shadow-none md:shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* DESKTOP BRANDING */}
        <div className="hidden md:block mb-8 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
            <i className="fas fa-university text-2xl"></i>
          </div>
          <h2 className="text-base font-black uppercase italic tracking-wider">
            Executive <span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {user?.schoolName || 'School Dashboard'}
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          <p className="text-slate-500 text-[10px] font-black uppercase mb-3 ml-2 tracking-widest">Main Menu</p>
          
          <button 
            type="button"
            onClick={() => switchTab('Overview')}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-chart-pie w-5"></i> <span>Overview</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Staff Management')}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Staff Management' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-users-cog w-5"></i> <span>Staff Control</span>
          </button>

          <button 
            type="button"
            onClick={() => switchTab('Bulk SMS Hub')}
            className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'Bulk SMS Hub' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className="fas fa-bullhorn w-5"></i> <span>Bulk SMS Hub</span>
          </button>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="pt-4 border-t border-slate-800 mt-auto">
          {!showExitConfirm ? (
            <button 
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-3 w-full p-3.5 bg-red-600/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
            >
              <i className="fas fa-sign-out-alt w-5"></i> Exit Portal
            </button>
          ) : (
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 animate-in fade-in">
              <p className="text-[10px] font-black uppercase text-center mb-2 text-slate-400">Confirm Exit?</p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black uppercase hover:bg-red-700"
                >
                  Yes
                </button>
                <button 
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-black uppercase hover:bg-slate-600"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight italic uppercase">
              {activeTab}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-wider mt-0.5">
              Principal: {user?.fullName || user?.name} | {user?.schoolName}
            </p>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in duration-300">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">Total Staff</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.staff}</h2>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">Total Students</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.students}</h2>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-400">School Mean</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{stats.meanGrade}</h2>
            </div>
          </div>
        )}

        {/* STAFF MANAGEMENT TAB */}
        {activeTab === 'Staff Management' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            
            {/* ADD PERSONNEL CARD */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-400 mb-4 sm:mb-6">
                Add New Personnel
              </h3>

              <form onSubmit={handleRegisterStaff} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Mary Wanjiku)"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="flex-1 px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-800 text-sm font-semibold outline-none focus:border-blue-600 focus:bg-white transition"
                  required
                />

                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full sm:w-56 px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-700 text-sm font-semibold outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Deputy Principal">Deputy Principal</option>
                  <option value="Dean of Studies">Dean of Studies</option>
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Secretary">School Secretary</option>
                  <option value="Bursar">Bursar / Accounts</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Support Staff">Support Staff</option>
                </select>

                <button
                  type="submit"
                  disabled={loadingStaff}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                  {loadingStaff ? 'Generating...' : 'Register Staff'}
                </button>
              </form>
            </div>

            {/* STAFF DIRECTORY TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm sm:text-base">
                    Active Faculty & Staff
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Credentials auto-generated via school initials
                  </p>
                </div>
                <span className="text-xs font-black bg-blue-50 text-blue-600 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-blue-100">
                  {staffList.length} Personnel
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[550px]">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-4 sm:p-5">Member Name</th>
                      <th className="p-4 sm:p-5">Designation</th>
                      <th className="p-4 sm:p-5">Staff Login Code</th>
                      <th className="p-4 sm:p-5">Access Key</th>
                      <th className="p-4 sm:p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                    {fetchingStaff ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                          Loading Staff Directory...
                        </td>
                      </tr>
                    ) : staffList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                          No staff members registered yet.
                        </td>
                      </tr>
                    ) : (
                      staffList.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4 sm:p-5 font-bold text-slate-900">{member.full_name}</td>
                          <td className="p-4 sm:p-5">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                              member.role === 'Principal'
                                ? 'bg-purple-100 text-purple-700'
                                : member.role === 'Secretary'
                                ? 'bg-pink-100 text-pink-700'
                                : member.role === 'Bursar'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 font-mono font-bold text-blue-600">
                            {member.staff_code || member.vinnie_digital_code || '—'}
                          </td>
                          <td className="p-4 sm:p-5 font-mono font-bold text-emerald-600">
                            {member.password || member.access_key || '••••••••'}
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <button
                              type="button"
                              onClick={() => copyCredentials(
                                member.staff_code || member.vinnie_digital_code,
                                member.password || member.access_key,
                                member.full_name
                              )}
                              className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition border border-slate-200"
                            >
                              <i className="fas fa-copy mr-1"></i> Copy
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* BULK SMS TAB */}
        {activeTab === 'Bulk SMS Hub' && (
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl animate-in fade-in duration-300">
            <h2 className="text-base sm:text-lg font-black uppercase text-slate-800 tracking-tight mb-1 sm:mb-2">
              Broadcast Communications Engine
            </h2>
            <p className="text-xs text-slate-500 mb-4 sm:mb-6 font-medium">
              Dispatch official SMS announcements directly to guardians, staff, or sponsors.
            </p>

            <form onSubmit={handleSendSMS} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Recipient Channel
                </label>
                <select
                  value={smsData.targetGroup}
                  onChange={(e) => setSmsData({ ...smsData, targetGroup: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-blue-600 transition"
                >
                  <option value="All Parents">All Parents & Guardians</option>
                  <option value="All Staff">School Staff & Faculty</option>
                  <option value="Fee Defaulters">Fee Defaulters Only</option>
                  <option value="Board of Management">Board of Management (B.O.M)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Notice Body
                </label>
                <textarea
                  rows="4"
                  placeholder="Enter official institutional dispatch message..."
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSendingSms}
                className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isSendingSms ? 'Transmitting SMS...' : 'Dispatch Broadcast SMS'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default Principal;
