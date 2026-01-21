import React from 'react';
import PrincipalHome from '../Dashboards/Principal';
import DeanHome from '../Dashboards/DeanOfStudents';
// Vinnie: Importing the new Teacher component
import TeacherHome from '../Dashboards/Teacher'; 

const AdminDashboard = () => {
  // Get the user session we saved during login
  const user = JSON.parse(localStorage.getItem('vinnie_user'));

  if (!user) {
    window.location.href = '/staff-login';
    return null;
  }

  // ROLE SWITCHER: This decides which homepage to show
  switch (user.role) {
    case 'Principal':
      return <PrincipalHome user={user} />;
    case 'Dean of Students':
      return <DeanHome user={user} />;
    // Vinnie: Added the Teacher case here so it stops showing "Under Construction"
    case 'Teacher':
      return <TeacherHome user={user} />;
    default:
      return (
        <div className="p-20 text-center font-sans text-slate-900">
          <i className="fas fa-tools text-5xl text-slate-300 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-500 uppercase italic">Portal Under Construction</h2>
          <p className="text-slate-400 font-medium">Your specific role dashboard is being configured by Vinnie Tech.</p>
          <p className="text-xs text-blue-500 mt-4 font-black">Logged in as: {user.role}</p>
        </div>
      );
  }
};

export default AdminDashboard;