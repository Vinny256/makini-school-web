import React from 'react';
import About from './About';
import AboutUs from './AboutUs';
import RegistrationForm from './RegistrationForm';
import Programmes from './Programmes';
import Gallery from './Gallery';
import News from './News';
import Contact from './Contact'; // 1. Import the new file

const GuestHome = ({ submittedName, setSubmittedName }) => {
  return (
    <div className="animate-in fade-in duration-1000">
      <About submittedName={submittedName} setSubmittedName={setSubmittedName} />
      <Programmes /> 
      <News />
      <Gallery /> 
      <AboutUs />
      <RegistrationForm setSubmittedName={setSubmittedName} />
      
      {/* 2. Place Contact at the very bottom */}
      <Contact />
    </div>
  );
};

export default GuestHome;