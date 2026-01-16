import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faCalendarDays, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const News = () => {
  const newsItems = [
    {
      date: "Jan 15, 2026",
      category: "Academic",
      title: "Makini Leads in CBC Grade 9 Transition",
      desc: "Our Junior Secondary wing has been recognized as a model center for the new CBC assessment framework."
    },
    {
      date: "Jan 10, 2026",
      category: "Technology",
      title: "New Digital Literacy Lab Commissioned",
      desc: "Vinnie Tech Solutions has finalized the installation of 50 new high-speed workstations for coding classes."
    },
    {
      date: "Jan 05, 2026",
      category: "Events",
      title: "Annual Parent-Teacher Induction",
      desc: "Join us this Saturday for a detailed walkthrough of the 2026 fee structure and school policies."
    }
  ];

  return (
    <section id="news" className="py-24 bg-gray-50 dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-blue-900 p-4 rounded-2xl text-white shadow-lg">
            <FontAwesomeIcon icon={faNewspaper} size="xl" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Latest News</h2>
            <p className="text-blue-600 dark:text-yellow-400 font-bold text-sm tracking-widest uppercase">Campus Updates</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-slate-700 rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 dark:border-slate-600">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-300 text-xs font-black px-4 py-1.5 rounded-full uppercase">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>{item.date}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  {item.desc}
                </p>
                
                <button className="flex items-center gap-2 text-blue-900 dark:text-yellow-400 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                  <span>Read Full Story</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;