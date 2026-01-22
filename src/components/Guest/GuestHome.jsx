import React, { useState, useEffect, useRef } from 'react'; // Added useState and hooks
import { useNavigate } from 'react-router-dom';
import About from './About';
import Programmes from './Programmes';
import News from './News';
import Gallery from './Gallery';
import AboutUs from './AboutUs';
import RegistrationForm from './RegistrationForm';
import Contact from './Contact';
import { askPublicAI } from '../../api'; // Switched from axios to your central API service

const GuestHome = ({ submittedName, setSubmittedName }) => {
  const navigate = useNavigate();

  // --- VINNIE TECH AI CHAT STATES (Added) ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Welcome to Makini School! I can help you with Admission Letters, Fee Structures, and School Rules. How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

    try {
      // Logic now uses your centralized api.js function
      const data = await askPublicAI(userInput, newMessages);
      
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the school office. Please try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-1000 relative">
      
      {/* PARENT/STAFF LOGIN BUTTON (Shifted up to bottom-28 to clear the bubble) */}
      <div className="fixed bottom-28 right-6 z-50">
        <button 
          onClick={() => navigate('/login-selection')}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-2xl hover:bg-blue-700 transition-all border-2 border-white flex items-center gap-3"
          style={{
            animation: window.innerWidth < 768 ? 'smoothMove 3s ease-in-out infinite' : 'none'
          }}
        >
          <i className="fas fa-lock"></i> Parent/Staff Login
        </button>
      </div>

      {/* --- VINNIE TECH AI CHAT BUBBLE (Added) --- */}
      <div className="fixed bottom-8 right-6 z-[60]">
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black uppercase italic text-sm tracking-tighter">Makini AI Assistant</h3>
                <p className="text-[10px] opacity-80 font-bold">Online | Enrollment Support</p>
              </div>
              <button onClick={() => setIsChatOpen(false)}><i className="fas fa-times"></i></button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold shadow-sm ${
                    msg.role === 'ai' ? 'bg-white text-slate-700 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-blue-600 animate-pulse uppercase">AI is typing...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Admission/Rules/Fees..."
                className="flex-1 bg-slate-100 p-3 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
              <button onClick={handleSendMessage} className="w-10 h-10 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}

        {/* The Floating Bubble Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-all active:scale-90 relative"
        >
          {isChatOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
          {!isChatOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>}
        </button>
      </div>

      <About submittedName={submittedName} setSubmittedName={setSubmittedName} />
      <Programmes /> 
      <News />
      <Gallery /> 
      <AboutUs />
      <RegistrationForm setSubmittedName={setSubmittedName} />
      <Contact />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smoothMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}} />
    </div>
  );
};

export default GuestHome;