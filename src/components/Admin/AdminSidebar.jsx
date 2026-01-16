import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Corrected the export name from faUserGraduation to faUserGraduate
import { 
  faUserGraduate, 
  faChalkboardTeacher, 
  faUsers, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'students', name: 'Students', icon: faUserGraduate },
    { id: 'teachers', name: 'Teachers', icon: faChalkboardTeacher },
    { id: 'parents', name: 'Parents', icon: faUsers },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-6 shadow-2xl h-screen sticky top-0">
      <div className="mb-10">
        <h2 className="text-xl font-black uppercase tracking-widest text-yellow-400">Admin Panel</h2>
        <p className="text-xs text-blue-300">Makini Secondary</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === item.id 
                ? 'bg-white text-blue-900 shadow-lg scale-105' 
                : 'hover:bg-blue-800 text-blue-100'
            }`}
          >
            <div className={`w-8 text-center ${activeTab === item.id ? 'text-blue-900' : 'text-yellow-400'}`}>
              <FontAwesomeIcon icon={item.icon} />
            </div>
            {item.name}
          </button>
        ))}
      </nav>

      <button className="mt-auto flex items-center gap-4 px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-2xl transition-all font-bold text-sm">
        <FontAwesomeIcon icon={faSignOutAlt} />
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;