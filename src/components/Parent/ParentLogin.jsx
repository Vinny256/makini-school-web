import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';

const ParentLogin = () => {
  const [step, setStep] = useState('login'); // 'login' or 'reset'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ admissionNumber: '', phone: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Password Rules Logic
  const rules = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*]/.test(newPassword),
    upper: /[A-Z]/.test(newPassword)
  };

  const strength = Object.values(rules).filter(Boolean).length;
  const strengthColor = strength <= 1 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-green-500';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic: Initial login using Adm No and Phone
      const res = await API.post("/parent/login", formData);
      if (res.data.success) {
        setStep('reset'); // Force password change on first access
      }
    } catch (err) {
      toast.error("Admission No or Phone mismatch");
    } finally { setLoading(false); }
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (strength < 4) return toast.error("Please follow all security rules");

    setLoading(true);
    try {
      await API.post("/parent/finalize-setup", { ...formData, newPassword });
      localStorage.setItem('vinnie_user', JSON.stringify({ ...formData, role: 'Parent' }));
      toast.success("Security Setup Complete!");
      navigate('/admin');
    } catch (err) { toast.error("Setup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
      {/* VINNIE BOUNCE CSS */}
      <style>{`.l-bar { width: 3px; height: 18px; background: white; animation: v-bounce 0.8s infinite; border-radius: 5px; } .l-bar:nth-child(2) { animation-delay: 0.1s; } .l-bar:nth-child(3) { animation-delay: 0.2s; } @keyframes v-bounce { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1.2); } }`}</style>

      <div className="max-w-md w-full bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative">
        
        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <i className="fas fa-family-pants text-4xl text-blue-500 mb-4"></i>
              <h2 className="text-2xl font-black uppercase italic">Parent <span className="text-blue-500">Portal</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Secure Access for Guardians</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <i className="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input type="text" placeholder="Student Admission Number" required className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 transition-all" onChange={(e)=>setFormData({...formData, admissionNumber: e.target.value})} />
              </div>
              <div className="relative">
                <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input type="tel" placeholder="Registered Phone Number" required className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 transition-all" onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              {loading ? <div className="flex gap-1">{[1,2,3].map(i=><div key={i} className="l-bar"></div>)}</div> : "Access Student Data"}
            </button>
          </form>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-xl font-black uppercase italic text-blue-400 mb-2 text-center">Security Setup</h2>
            <p className="text-slate-400 text-xs text-center font-bold mb-8">Create a strong password to protect your child's data.</p>
            
            <form onSubmit={handleFinalize} className="space-y-4">
              <input type="password" placeholder="New Strong Password" required className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500" onChange={(e)=>setNewPassword(e.target.value)} />
              
              {/* STRENGTH BAR */}
              <div className="flex gap-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`${strengthColor} transition-all duration-500`} style={{ width: `${(strength/4)*100}%` }}></div>
              </div>

              {/* RULES CHECKLIST */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-tighter pt-2">
                <div className={rules.length ? 'text-green-500' : 'text-slate-600'}><i className={`fas ${rules.length ? 'fa-check-circle' : 'fa-circle'} mr-1`}></i> 8+ Characters</div>
                <div className={rules.number ? 'text-green-500' : 'text-slate-600'}><i className={`fas ${rules.number ? 'fa-check-circle' : 'fa-circle'} mr-1`}></i> One Number</div>
                <div className={rules.special ? 'text-green-500' : 'text-slate-600'}><i className={`fas ${rules.special ? 'fa-check-circle' : 'fa-circle'} mr-1`}></i> Special (!@#)</div>
                <div className={rules.upper ? 'text-green-500' : 'text-slate-600'}><i className={`fas ${rules.upper ? 'fa-check-circle' : 'fa-circle'} mr-1`}></i> Upper Case</div>
              </div>

              <input type="password" placeholder="Repeat Password" required className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 mt-4" onChange={(e)=>setConfirmPassword(e.target.value)} />

              <button type="submit" disabled={loading || strength < 4} className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase tracking-widest mt-4 flex justify-center items-center disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-blue-500/20">
                {loading ? <div className="flex gap-1">{[1,2,3].map(i=><div key={i} className="l-bar"></div>)}</div> : "Secure Account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentLogin;