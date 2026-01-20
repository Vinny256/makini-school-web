import React from 'react';
import PrincipalHome from '../Dashboards/Principal';
import DeanHome from '../Dashboards/DeanOfStudents';
// Import other roles as we create them

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
    default:
      return (
        <div className="p-20 text-center font-sans">
          <i className="fas fa-tools text-5xl text-slate-300 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-500">Portal Under Construction</h2>
          <p className="text-slate-400">Your specific role dashboard is being configured by Vinnie Tech.</p>
        </div>
      );
  }
};

export default AdminDashboard;