import React, { useState, useEffect } from 'react';
import API from '../../api';

const Overview = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/academics/executive-analytics/${user.schoolId}`);
      if (res.data.success) {
        setData(res.data.analytics);
      }
    } catch (err) {
      console.error("Failed to load institutional analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchAnalytics();
  }, [user?.schoolId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-bold uppercase text-xs tracking-wider animate-pulse">
        Aggregating Institutional Metrics & Merit Data...
      </div>
    );
  }

  const { totalStudents, totalStaff, schoolMean, gender, distribution, topStudentsPerClass, bestStreams } = data || {
    totalStudents: 0,
    totalStaff: 0,
    schoolMean: '0.0',
    gender: { boys: 0, girls: 0, boysPercent: 0, girlsPercent: 0 },
    distribution: { boarding: 0, day: 0, boardingPercent: 0, dayPercent: 0 },
    topStudentsPerClass: [],
    bestStreams: []
  };

  // SVG Donut calculation (r=40, circumference ≈ 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const boardingOffset = circumference - ((distribution.boardingPercent || 0) / 100) * circumference;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Enrolled</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{totalStudents}</h2>
            <p className="text-[10px] text-blue-600 font-bold mt-1">Active Scholars</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-user-graduate"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Faculty & Staff</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{totalStaff}</h2>
            <p className="text-[10px] text-indigo-600 font-bold mt-1">Certified Educators</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Institutional Mean</p>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">{schoolMean}%</h2>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">Across All Series</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Boarding / Day</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">{distribution.boarding} / {distribution.day}</h2>
            <p className="text-[10px] text-purple-600 font-bold mt-1">{distribution.boardingPercent}% Resident</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fas fa-bed"></i>
          </div>
        </div>
      </div>

      {/* 2. DEMOGRAPHIC CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GENDER DISTRIBUTION BARS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Gender Demographics</h3>
              <p className="text-[10px] text-slate-400 font-medium">Equal Opportunity Enrollment Ratio</p>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-lg">
              {totalStudents} Learners
            </span>
          </div>

          <div className="space-y-5 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-blue-600 flex items-center gap-2">
                  <i className="fas fa-mars"></i> Boys ({gender.boys})
                </span>
                <span className="font-mono text-slate-700">{gender.boysPercent}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${gender.boysPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-pink-600 flex items-center gap-2">
                  <i className="fas fa-venus"></i> Girls ({gender.girls})
                </span>
                <span className="font-mono text-slate-700">{gender.girlsPercent}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-pink-500 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${gender.girlsPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESIDENCE DONUT PIE CHART */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Boarding vs. Day Ratio</h3>
              <p className="text-[10px] text-slate-400 font-medium">Campus Accommodation Division</p>
            </div>
            <span className="text-[10px] font-black text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-lg">
              Housing Metrics
            </span>
          </div>

          <div className="flex items-center justify-around py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle 
                  cx="50" cy="50" r={radius} fill="transparent" stroke="#8b5cf6" strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={boardingOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-black text-slate-800 font-mono">{distribution.boardingPercent}%</span>
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Boarding</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-lg bg-purple-500 shadow-sm"></span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Boarders ({distribution.boarding})</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{distribution.boardingPercent}% of population</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-lg bg-slate-200 shadow-sm"></span>
                <div>
                  <h4 className="text-xs font-bold text-slate-600">Day Scholars ({distribution.day})</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{distribution.dayPercent}% of population</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. PERFORMANCE & MERIT MATRICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TOP PERFORMER PER CLASS (RANK #1) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                <i className="fas fa-crown text-amber-500"></i> Top Performer Per Class (Rank #1)
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Highest normalized average across registered cohorts</p>
            </div>
          </div>

          {topStudentsPerClass.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-100 rounded-2xl">
              No exam records submitted yet to compute merit ranks.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {topStudentsPerClass.map((st, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 font-black text-xs flex items-center justify-center border border-amber-200">
                      1
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-black text-[10px] rounded-lg">
                          {st.grade_level}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{st.full_name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Adm: {st.admission_number} | Stream: {st.stream}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600 font-mono">{st.mean_score}%</span>
                    <p className="text-[9px] font-black uppercase text-slate-400">Mean Score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BEST STREAM RANKINGS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                <i className="fas fa-trophy text-blue-600"></i> Stream Performance Hierarchy
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Ranked by aggregate assessment mean</p>
            </div>
          </div>

          {bestStreams.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-100 rounded-2xl">
              No stream assessments recorded yet.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {bestStreams.map((sm, index) => (
                <div key={index} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Stream {sm.stream}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{sm.student_count} Tested Scholars</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-blue-600 font-mono">
                      {sm.stream_mean}%
                    </span>
                    <p className="text-[9px] font-black uppercase text-slate-400">Average</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Overview;
