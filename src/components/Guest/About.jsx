import React from 'react';
import { jsPDF } from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown, faArrowDown, faBullseye, faEye, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import campusImg from '../../assets/makini-campus.png';

const About = ({ submittedName, setSubmittedName }) => {
  
  const generateDetailedLetter = () => {
    const doc = new jsPDF();
    
    // Header & Identity
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("MAKINI SECONDARY SCHOOL", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("Kiambu Town HQ | Center for CBC Excellence", 105, 28, { align: "center" });
    doc.line(20, 32, 190, 32);

    // Admission Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Student Name: ${submittedName.toUpperCase()}`, 20, 45);
    
    // Fee Structure
    doc.setFont("helvetica", "bold");
    doc.text("2026 TERM 1 FEE STRUCTURE:", 20, 60);
    doc.setFont("helvetica", "normal");
    const fees = [
      "- Tuition & CBC Materials: KES 15,500",
      "- Digital Literacy Lab Fee: KES 3,500",
      "- Activity & Insurance: KES 2,000",
      "- School Maintenance: KES 1,000",
      "TOTAL PAYABLE: KES 22,000"
    ];
    doc.text(fees, 25, 70);

    // School Rules & Consent
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT CONDUCT & RULES:", 20, 115);
    doc.setFont("helvetica", "normal");
    const rules = [
      "1. Full compliance with the CBC learning framework.",
      "2. Respectful use of school digital devices and labs.",
      "3. Strict adherence to the 7:30 AM arrival time."
    ];
    doc.text(rules, 25, 125);

    // Personalised Consent
    doc.setFont("helvetica", "italic");
    const consent = `I, ${submittedName}, have reviewed the term fees of KES 22,000 and the school conduct rules. I understand these requirements and commit to maintaining the high standards of Makini Secondary.`;
    const splitConsent = doc.splitTextToSize(consent, 170);
    doc.text(splitConsent, 20, 155);
    
    doc.text("Student Signature: ____________________", 20, 180);

    doc.save(`${submittedName}_Admission_Package.pdf`);

    // AUTO-RESET LOGIC: Clear name and let another user enroll
    setTimeout(() => {
      setSubmittedName(""); 
      alert("System Reset: Ready for the next applicant.");
    }, 2000);
  };

  return (
    // ADDED id="home" HERE TO MATCH NAVBAR LINK
    <section id="home" className="py-20 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-black text-blue-900 dark:text-white mb-6 leading-tight">
            {submittedName ? `Excellent Choice, ${submittedName}!` : "Striving for Academic Excellence"}
          </h1>
          
          <div className="flex gap-4 mb-10">
            {submittedName ? (
              <button onClick={generateDetailedLetter} className="bg-green-600 text-white px-8 py-5 rounded-2xl font-bold flex items-center gap-3 animate-bounce shadow-2xl">
                Download Official Package <FontAwesomeIcon icon={faFileArrowDown} />
              </button>
            ) : (
              <button 
                onClick={() => document.getElementById('registration-form').scrollIntoView({behavior: 'smooth'})}
                className="bg-blue-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
              >
                Enroll Now <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
          </div>

          {/* Mission & Vision Section */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="p-6 bg-blue-50 dark:bg-slate-800 rounded-2xl border-l-4 border-blue-900">
              <FontAwesomeIcon icon={faBullseye} className="text-blue-900 mb-2 text-2xl" />
              <h4 className="font-bold dark:text-white">Our Mission</h4>
              <p className="text-xs text-gray-500">Holistic academic excellence.</p>
            </div>
            <div className="p-6 bg-yellow-50 dark:bg-slate-800 rounded-2xl border-l-4 border-yellow-400">
              <FontAwesomeIcon icon={faEye} className="text-yellow-600 mb-2 text-2xl" />
              <h4 className="font-bold dark:text-white">Our Vision</h4>
              <p className="text-xs text-gray-500">Innovation & Character.</p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-3">
             <h4 className="text-sm font-black uppercase text-blue-900 tracking-widest">Why Makini?</h4>
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <FontAwesomeIcon icon={faCheckDouble} className="text-green-500" />
               <span>Official CBC Competency-Based Learning Center.</span>
             </div>
             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
               <FontAwesomeIcon icon={faCheckDouble} className="text-green-500" />
               <span>Advanced Digital Literacy and Science Labs.</span>
             </div>
          </div>
        </div>

        <div className="relative">
          <img src={campusImg} className="rounded-[3rem] shadow-2xl w-full h-[550px] object-cover border-8 border-white dark:border-slate-800" alt="Campus" />
        </div>
      </div>
    </section>
  );
};
export default About;