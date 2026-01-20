import React from 'react';
import { useNavigate } from 'react-router-dom';
import About from './About';
import Programmes from './Programmes';
import News from './News';
import Gallery from './Gallery';
import AboutUs from './AboutUs';
import RegistrationForm from './RegistrationForm';
import Contact from './Contact';

const GuestHome = ({ submittedName, setSubmittedName }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-1000 relative">
      
      {/* PARENT/STAFF LOGIN BUTTON */}
      <div className="fixed bottom-10 right-6 z-50">
        <button 
          onClick={() => navigate('/login-selection')}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-2xl hover:bg-blue-700 transition-all border-2 border-white flex items-center gap-3"
          style={{
            // Animation active only on mobile (below 768px)
            animation: window.innerWidth < 768 ? 'smoothMove 3s ease-in-out infinite' : 'none'
          }}
        >
          <i className="fas fa-lock"></i> Parent/Staff Login
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