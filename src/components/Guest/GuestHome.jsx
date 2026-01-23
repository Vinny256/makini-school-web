import React, { useState, useEffect, useRef } from 'react'; // Added useState and hooks
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf"; // Added for PDF generation
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

  // --- HELPERS FOR FORMATTING ---
  // This cleans up the raw AI text for the chat bubbles (removes markdown stars for cleaner reading)
  const formatChatText = (text) => {
    return text.replace(/\*\*/g, '').replace(/###/g, '');
  };

  // --- PDF GENERATION LOGIC (Vinnie Tech - STYLED VERSION) ---
  const handleDownloadPDF = (rawText) => {
    const doc = new jsPDF();
    
    // 1. Header with Makini Blue Brand Bar
    doc.setFillColor(37, 99, 235); // Makini Blue
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("MAKINI SECONDARY SCHOOL", 105, 22, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("P.O. Box 29356 - 00100, Nairobi, Kenya | Makini Road, Off Ngong Road", 105, 30, { align: "center" });
    doc.text("Official Enrollment & Registrar Document", 105, 38, { align: "center" });

    // 2. Main Body Content Styling
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(12);
    
    // Clean text: removes markdown artifacts and labels for the PDF content
    const cleanText = rawText
        .replace(/DOCUMENT TEMPLATE \d: /g, '')
        .replace(/ITEMIZED FEE STRUCTURE 2026/g, '')
        .replace(/\*\*/g, '')
        .replace(/---/g, '')
        .trim();
    
    // Logic to handle itemized lists and spacing
    const lines = doc.splitTextToSize(cleanText, 175);
    let yPosition = 60;

    lines.forEach((line) => {
        // If line contains a colon or looks like a header, make it bold
        if (line.includes(':') && line.length < 50) {
            doc.setFont("helvetica", "bold");
            doc.text(line, 20, yPosition);
            doc.setFont("helvetica", "normal");
        } else {
            doc.text(line, 20, yPosition);
        }
        yPosition += 8;

        // Add page break if content is too long
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
    });

    // 3. Footer with Security Hash
    doc.setDrawColor(226, 232, 240); // Slate-200 line
    doc.line(20, 275, 190, 275);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("This is an electronically generated document. Verify authenticity via the Makini QR System.", 105, 282, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("Document Verified by Vinnie Tech ERP Security Protocol", 105, 288, { align: "center" });
    
    doc.save("Makini_Official_Document.pdf");
  };

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
      
      {/* PARENT/STAFF LOGIN BUTTON */}
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

      {/* --- VINNIE TECH AI CHAT BUBBLE --- */}
      <div className="fixed bottom-8 right-6 z-[60]">
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <i className="fas fa-user-tie text-white"></i>
                </div>
                <div>
                  <h3 className="font-black uppercase italic text-sm tracking-tighter">Makini AI Assistant</h3>
                  <p className="text-[10px] opacity-80 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online | Registrar Support
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:rotate-90 transition-transform"><i className="fas fa-times"></i></button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg, index) => {
                const isTemplate = msg.text.includes("DOCUMENT TEMPLATE") || msg.text.includes("ITEMIZED FEE STRUCTURE");

                return (
                  <div key={index} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    {isTemplate && msg.role === 'ai' ? (
                      /* PROFESSIONAL PDF FILE CARD */
                      <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-lg w-full max-w-[280px] flex flex-col items-center gap-4 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center relative shadow-inner">
                          <i className="fas fa-file-pdf text-red-600 text-4xl"></i>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                            <i className="fas fa-check text-white text-[10px]"></i>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-black text-slate-900 uppercase leading-tight tracking-wide">
                            {msg.text.split('\n')[0].replace('Header:', '').replace('ITEMIZED', '').trim()}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold mt-1">Official Makini Document</p>
                        </div>
                        <button 
                          onClick={() => handleDownloadPDF(msg.text)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-md hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-download"></i> View & Download PDF
                        </button>
                      </div>
                    ) : (
                      /* NORMAL CHAT BUBBLE */
                      <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold shadow-sm whitespace-pre-line leading-relaxed ${
                        msg.role === 'ai' ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        {formatChatText(msg.text)}
                      </div>
                    )}
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex items-center gap-2 px-4">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Processing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t flex gap-2 items-center">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 bg-slate-100 p-3 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all"
              />
              <button onClick={handleSendMessage} className="w-12 h-12 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg active:scale-90 transition-transform">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}

        {/* The Floating Bubble Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-all active:scale-90 relative border-2 border-white/20"
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