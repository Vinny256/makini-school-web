import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { toast } from 'react-hot-toast';

const ParentLogin = () => {
  // Steps: login -> (challenge OR reset/setup) -> dashboard
  // Added 'challenge' for returning users and 'verify_question' for resets
  const [step, setStep] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ admissionNumber: '', phone: '', password: '', question: '', answer: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Security Reset State
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');

  const navigate = useNavigate();

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
      const res = await API.post("/parent/login", { admissionNumber: formData.admissionNumber, phone: formData.phone });
      
      if (res.data.status === 'CHALLENGE_PASSWORD') {
        setStep('challenge'); // Returning user
      } else {
        setStep('reset'); // First time setup
      }
    } catch (err) {
      toast.error("Admission No or Phone mismatch");
    } finally { setLoading(false); }
  };

  const handleChallenge = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/parent/verify-password", { 
        admissionNumber: formData.admissionNumber, 
        password: formData.password 
      });
      localStorage.setItem('vinnie_user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.full_name}`);
      navigate('/admin');
    } catch (err) {
      toast.error("Incorrect password");
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/parent/get-security-question/${formData.admissionNumber}`);
      setRecoveryQuestion(res.data.question);
      setStep('verify_question');
    } catch (err) {
      toast.error("Recovery data not found. Contact Dean.");
    } finally { setLoading(false); }
  };

  const handleVerifyQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/parent/verify-security-answer", { 
        admissionNumber: formData.admissionNumber, 
        answer: recoveryAnswer 
      });
      setStep('reset'); // Allow them to set a new password
    } catch (err) {
      toast.error("Incorrect answer");
    } finally { setLoading(false); }
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (strength < 4) return toast.error("Please follow all security rules");
    if (step === 'reset' && (!formData.question || !formData.answer)) return toast.error("Set a security question");

    setLoading(true);
    try {
      await API.post("/parent/finalize-setup", { 
        ...formData, 
        newPassword,
        question: formData.question,
        answer: formData.answer
      });
      localStorage.setItem('vinnie_user', JSON.stringify({ ...formData, role: 'Parent' }));
      toast.success("Security Setup Complete!");
      navigate('/admin');
    } catch (err) { toast.error("Setup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white text-sm">
      <style>{`.l-bar { width: 3px; height: 18px; background: white; animation: v-bounce 0.8s infinite; border-radius: 5px; } .l-bar:nth-child(2) { animation-delay: 0.1s; } .l-bar:nth-child(3) { animation-delay: 0.2s; } @keyframes v-bounce { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1.2); } }`}</style>

      <div className="max-w-md w-full bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative">
        
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <i className="fas fa-user-shield text-4xl text-blue-500 mb-4"></i>
              <h2 className="text-2xl font-black uppercase italic">Parent <span className="text-blue-500">Portal</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Secure Access for Guardians</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <i className="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input type="text" placeholder="Admission Number" required className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 transition-all" onChange={(e)=>setFormData({...formData, admissionNumber: e.target.value})} />
              </div>
              <div className="relative">
                <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input type="tel" placeholder="Phone Number" required className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500 transition-all" onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center shadow-lg active:scale-95 transition-all">
              {loading ? <div className="flex gap-1">{[1,2,3].map(i=><div key={i} className="l-bar"></div>)}</div> : "Identify Parent"}
            </button>
          </form>
        )}

        {step === 'challenge' && (
          <form onSubmit={handleChallenge} className="space-y-6 animate-in zoom-in">
            <h2 className="text-xl font-black uppercase italic text-blue-400 text-center">Verify Identity</h2>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input type="password" placeholder="Enter Password" required className="w-full pl-12 p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500" onChange={(e)=>setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase tracking-widest">Login</button>
            <button type="button" onClick={handleForgotPassword} className="w-full text-[10px] font-black uppercase text-slate-500 hover:text-blue-400">Forgot Password?</button>
          </form>
        )}

        {step === 'verify_question' && (
          <form onSubmit={handleVerifyQuestion} className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-xl font-black uppercase italic text-yellow-500 text-center">Security Check</h2>
            <p className="text-xs font-bold text-slate-400 text-center">{recoveryQuestion}</p>
            <input type="text" placeholder="Type Answer" required className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500" onChange={(e)=>setRecoveryAnswer(e.target.value)} />
            <button type="submit" className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase tracking-widest">Verify & Reset</button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleFinalize} className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-black uppercase italic text-green-500 text-center">Security Setup</h2>
            
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Account Recovery Question</label>
                <select className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none text-xs" onChange={(e)=>setFormData({...formData, question: e.target.value})}>
                    <option value="">Choose Question</option>
                    <option>What is your child's favorite subject?</option>
                    <option>What is your child's middle name?</option>
                    <option>What was your first car model?</option>
                </select>
                <input type="text" placeholder="Your Answer" className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none" onChange={(e)=>setFormData({...formData, answer: e.target.value})} />
            </div>

            <div className="pt-4 space-y-4">
                <input type="password" placeholder="New Strong Password" required className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500" onChange={(e)=>setNewPassword(e.target.value)} />
                <div className="flex gap-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`${strengthColor} transition-all duration-500`} style={{ width: `${(strength/4)*100}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-tighter">
                    <div className={rules.length ? 'text-green-500' : 'text-slate-600'}>8+ Chars</div>
                    <div className={rules.number ? 'text-green-500' : 'text-slate-600'}>Number</div>
                    <div className={rules.special ? 'text-green-500' : 'text-slate-600'}>Special</div>
                    <div className={rules.upper ? 'text-green-500' : 'text-slate-600'}>Upper Case</div>
                </div>
                <input type="password" placeholder="Repeat Password" required className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:border-blue-500" onChange={(e)=>setConfirmPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={strength < 4} className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30">Save Security Profile</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ParentLogin;