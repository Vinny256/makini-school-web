import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faXmark, 
  faGraduationCap, 
  faLock, 
  faUserShield, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ userRole, setUserRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Guest links use Objects for internal page scrolling
  const guestLinks = [
    { name: 'Dashboard', path: '#home' },
    { name: 'Programmes', path: '#programmes' },
    { name: 'News', path: '#news' },
    { name: 'Gallery', path: '#gallery' },
    // UPDATED: Changed #aboutus to #about-us to match the AboutUs component ID
    { name: 'About', path: '#about-us' }, 
    { name: 'Contact', path: '#contact' },
  ];

  // Teacher and Parent links are currently simple Strings
  const teacherLinks = ["Classroom", "Attendance", "Grading"];
  const parentLinks = ["My Child", "Fees", "Circulars"];

  const currentLinks = userRole === "teacher" ? teacherLinks : 
                       userRole === "parent" ? parentLinks : guestLinks;

  return (
    <nav className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-2 text-xl font-bold text-yellow-400">
          <FontAwesomeIcon icon={faGraduationCap} />
          <span>Makini Secondary</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-6 font-semibold uppercase text-xs tracking-widest">
          {currentLinks.map((link, index) => {
            const isObject = typeof link === 'object';
            const displayName = isObject ? link.name : link;
            const linkPath = isObject ? link.path : "#";

            return (
              <li key={index} className="hover:text-yellow-400 cursor-pointer transition-colors">
                <a href={linkPath}>{displayName}</a>
              </li>
            );
          })}
        </ul>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-2">
            {userRole === "guest" ? (
              <>
                <button onClick={() => setUserRole("teacher")} className="bg-blue-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-blue-700">
                  <FontAwesomeIcon icon={faLock} /> Teacher
                </button>
                <button onClick={() => setUserRole("parent")} className="bg-blue-700 px-4 py-2 rounded-xl text-xs flex items-center gap-2 hover:bg-blue-600">
                  <FontAwesomeIcon icon={faUserShield} /> Parent
                </button>
              </>
            ) : (
              <button onClick={() => setUserRole("guest")} className="bg-red-600 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            )}
          </div>

          <button 
            className="lg:hidden text-2xl w-10 h-10 flex items-center justify-center bg-blue-800 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-blue-900 border-t border-blue-800 p-6 shadow-2xl">
          <ul className="flex flex-col gap-4 font-bold uppercase text-sm">
            {currentLinks.map((link, index) => {
              const isObject = typeof link === 'object';
              const displayName = isObject ? link.name : link;
              const linkPath = isObject ? link.path : "#";

              return (
                <li key={index} className="border-b border-blue-800 pb-2">
                  <a href={linkPath} onClick={() => setIsMobileMenuOpen(false)}>
                    {displayName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;