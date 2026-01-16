import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory, 
  faUserGraduate, 
  faBullseye, 
  faQuoteLeft, 
  faAward, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const alumni = [
    { name: "Faith Njeri", year: "2023", quote: "Makini's STEM lab gave me the foundation to pursue Engineering at the University of Nairobi." },
    { name: "David Maina", year: "2022", quote: "The focus on character and moral integrity helped me become a leader in my community." }
  ];

  const hallOfFame = [
    { student: "Mercy Wanjiku", grade: "A (82 pts)", achievement: "Best in Mathematics 2025" },
    { student: "Vincent Karanja", grade: "A- (78 pts)", achievement: "Top Science Project (Vinnie Bot)" }
  ];

  return (
    <section id="about-us" className="py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section 1: History & Target Board */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <div className="flex items-center gap-3 text-blue-900 dark:text-yellow-400 mb-6">
              <FontAwesomeIcon icon={faHistory} size="xl" />
              <h2 className="text-4xl font-black uppercase tracking-tighter">Our Legacy</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Founded in 2015, Makini Secondary began with a vision to provide affordable, high-quality education that blends academic excellence with modern technical skills.
            </p>
            <div className="p-8 bg-blue-50 dark:bg-slate-800 rounded-3xl border-l-8 border-blue-900">
               <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Our Growth</h4>
               <p className="text-sm text-gray-500">From 20 students to a premier CBC Center of Excellence in Kiambu.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
              <FontAwesomeIcon icon={faBullseye} className="text-yellow-400 mb-4 text-3xl" />
              <h3 className="text-lg font-bold mb-1">Target Mean</h3>
              <div className="text-5xl font-black text-yellow-400">9.5</div>
              <p className="text-xs text-blue-200 mt-2">B+ (2026 Goal)</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl">
              <FontAwesomeIcon icon={faChartLine} className="text-green-400 mb-4 text-3xl" />
              <h3 className="text-lg font-bold mb-1">Last Mean</h3>
              <div className="text-5xl font-black text-green-400">8.2</div>
              <p className="text-xs text-gray-400 mt-2">B- (2025 Result)</p>
            </div>
          </div>
        </div>

        {/* Section 2: Hall of Fame */}
        <div className="mb-32">
          <div className="flex items-center gap-3 mb-12">
            <FontAwesomeIcon icon={faAward} size="xl" className="text-yellow-500" />
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Hall of Fame</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {hallOfFame.map((hero, i) => (
              <div key={i} className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                <div className="h-20 w-20 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-black">
                  {hero.grade.split(' ')[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xl dark:text-white">{hero.student}</h4>
                  <p className="text-sm text-blue-600 dark:text-yellow-400 font-medium">{hero.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Alumni Voices */}
        <div className="bg-blue-900 rounded-[4rem] p-12 lg:p-20 text-white">
          <div className="flex items-center gap-3 mb-12">
            <FontAwesomeIcon icon={faUserGraduate} size="xl" className="text-yellow-400" />
            <h2 className="text-4xl font-black uppercase tracking-tighter">Alumni Messages</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {alumni.map((msg, i) => (
              <div key={i} className="relative">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-blue-800 text-6xl absolute -top-4 -left-4" />
                <p className="relative z-10 text-lg italic mb-6 leading-relaxed text-blue-100">
                  "{msg.quote}"
                </p>
                <div>
                  <h4 className="font-bold text-yellow-400">{msg.name}</h4>
                  <p className="text-xs uppercase tracking-widest text-blue-300">Class of {msg.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;