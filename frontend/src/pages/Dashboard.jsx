import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Award, BookOpen, Briefcase, ArrowRight, Activity } from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('recentProfile');
    const storedResult = sessionStorage.getItem('recentPrediction');
    
    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedResult) setResult(JSON.parse(storedResult));
  }, []);

  if (!profile || !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Profile Data Found</h2>
        <p className="text-slate-500 mb-8">Complete the placement readiness assessment to view your dashboard.</p>
        <Link to="/predict" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">
          Take Assessment
        </Link>
      </div>
    );
  }

  const isPlaced = result.prediction === 'Placed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Your personalized academic and career readiness snapshot.</p>
        </div>
        <Link to="/predict" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition">
          Update Profile
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Current Prediction</p>
              <h3 className={`text-2xl font-bold ${isPlaced ? 'text-green-600' : 'text-amber-600'}`}>{result.prediction}</h3>
            </div>
            <div className={`p-2 rounded-lg ${isPlaced ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
              <TargetIcon />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div className={`h-2 rounded-full ${isPlaced ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${Math.round(result.probability * 100)}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{Math.round(result.probability * 100)}% Model Probability</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Overall CGPA</p>
              <h3 className="text-2xl font-bold text-slate-900">{profile.cgpa} <span className="text-sm font-normal text-slate-400">/ 10</span></h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6">Active Backlogs: <span className="font-medium text-slate-700">{profile.backlogs}</span></p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Technical Skills</p>
              <h3 className="text-2xl font-bold text-slate-900">{profile.technical_score} <span className="text-sm font-normal text-slate-400">/ 100</span></h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6">Domain: <span className="font-medium text-slate-700">{profile.preferred_domain}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Full Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">Profile Snapshot</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <ProfileStat label="Coding Score" value={profile.coding_score} max="100" />
                <ProfileStat label="Aptitude" value={profile.aptitude_score} max="100" />
                <ProfileStat label="Communication" value={profile.communication_score} max="100" />
                <ProfileStat label="Interview Score" value={profile.mock_interview_score} max="100" />
                <ProfileStat label="Projects" value={profile.projects_count} />
                <ProfileStat label="Internships" value={profile.internships_count} />
                <ProfileStat label="Hackathons" value={profile.hackathons_participated} />
                <ProfileStat label="Leadership" value={profile.leadership_score} max="100" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Career Focus Areas</h3>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-6">
              {result.recommendations && result.recommendations.length > 0 ? (
                <ul className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                      <div className="mt-0.5"><Award className="w-4 h-4 text-indigo-500" /></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">Your profile is currently strong across all assessed domains.</p>
              )}
              
              <Link to="/insights" className="mt-6 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                View detailed insights <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const ProfileStat = ({ label, value, max }) => (
  <div>
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-lg font-semibold text-slate-900">{value} {max && <span className="text-xs text-slate-400 font-normal">/ {max}</span>}</p>
  </div>
);

export default Dashboard;
