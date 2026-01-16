import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMicroscope, 
  faPaintBrush, 
  faCode, 
  faScaleBalanced 
} from '@fortawesome/free-solid-svg-icons';

const Programmes = () => {
  const courses = [
    {
      title: "STEM Pathway",
      icon: faMicroscope,
      description: "Focused on Pure Sciences, Mathematics, and Technology for future engineers and doctors.",
      color: "border-blue-900"
    },
    {
      title: "Creative Arts & Sports",
      icon: faPaintBrush,
      description: "Nurturing talents in performing arts, visual arts, and physical education.",
      color: "border-yellow-400"
    },
    {
      title: "Digital Literacy & Coding",
      icon: faCode,
      description: "Advanced ICT integration preparing students for the global digital economy.",
      color: "border-blue-600"
    },
    {
      title: "Social Sciences",
      icon: faScaleBalanced,
      description: "Developing leadership, history, and citizenship skills for future social impact.",
      color: "border-slate-800"
    }
  ];

  return (
    <section id="programmes" className="py-24 bg-gray-50 dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 dark:text-white uppercase tracking-tight">
            Academic Programmes
          </h2>
          <div className="h-1.5 w-24 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
            Following the CBC framework, we offer diverse pathways designed to identify and nurture every student's unique potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-700 p-8 rounded-3xl shadow-xl border-t-8 ${course.color} hover:scale-105 transition-transform duration-300`}
            >
              <div className="text-3xl text-blue-900 dark:text-blue-400 mb-6">
                <FontAwesomeIcon icon={course.icon} />
              </div>
              <h3 className="font-bold text-xl mb-4 dark:text-white">{course.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programmes;