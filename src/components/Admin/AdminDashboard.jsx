import React from 'react';
import PrincipalHome from '../Dashboards/Principal';
import DeanHome from '../Dashboards/DeanOfStudents';
import TeacherHome from '../Dashboards/Teacher'; 
import ParentHome from '../Dashboards/Parent';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('vinnie_user'));

  if (!user) {
    window.location.href = '/staff-login';
    return null;
  }

  // VINNIE: Convert role to uppercase to ensure the match always works
  const currentRole = user.role ? user.role.toUpperCase() : '';

  switch (currentRole) {
    case 'PRINCIPAL':
      return <PrincipalHome user={user} />;
    case 'DEAN OF STUDENTS':
    case 'DEAN': // Added a backup match for Dean
      return <DeanHome user={user} />;
    case 'TEACHER':
      return <TeacherHome user={user} />;
    case 'PARENT':
      return <ParentHome user={user} />;
    default:
      return (
        <div className="p-20 text-center font-sans text-slate-900">
          <i className="fas fa-tools text-5xl text-slate-300 mb-4"></i>
          <h2 className="text-xl font-bold text-slate-500 uppercase italic text-rose-500">Portal Under Construction</h2>
          <p className="text-slate-400 font-medium">Your specific role dashboard is being configured by Vinnie Tech.</p>
          <p className="text-xs text-blue-500 mt-4 font-black underline">Logged in as: {user.role}</p>
        </div>
      );
  }
};

export default AdminDashboard;