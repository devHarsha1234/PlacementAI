import React, { useEffect, useState } from 'react';
import { BookOpen, Code, Users, Briefcase, ChevronRight } from 'lucide-react';

const Insights = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('recentProfile');
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Please complete the readiness assessment to generate personalized insights.
      </div>
    );
  }

  const getStatus = (val, thresholdGood, thresholdStrong) => {
    if (val >= thresholdStrong) return { label: 'Strong', color: 'text-green-700 bg-green-100' };
    if (val >= thresholdGood) return { label: 'Good', color: 'text-indigo-700 bg-indigo-100' };
    return { label: 'Needs Improvement', color: 'text-amber-700 bg-amber-100' };
  };

  const getRecommendations = (category) => {
    switch (category) {
      case 'academic':
        return [
          "Maintain CGPA above 8.0 to clear initial resume shortlists.",
          "Clear any active backlogs immediately before placement season.",
          "Ensure attendance requirements are met to avoid disqualification."
        ];
      case 'technical':
        return [
          "Practice Data Structures and Algorithms 4 days a week on LeetCode/HackerRank.",
          "Participate in weekend coding contests to improve speed and logic.",
          "Master core CS subjects: OS, DBMS, Computer Networks, and OOPs."
        ];
      case 'experience':
        return [
          "Build at least two end-to-end projects with clear real-world applications.",
          "Deploy your projects live and include architecture diagrams in your GitHub.",
          "Attempt to secure a 2-month summer internship to gain industry exposure."
        ];
      case 'professional':
        return [
          "Conduct mock interviews with peers or mentors weekly.",
          "Prepare STAR (Situation, Task, Action, Result) method answers for behavioral rounds.",
          "Improve verbal communication by speaking on technical topics for 5 minutes daily."
        ];
      default:
        return [];
    }
  };

  const academicStatus = getStatus(profile.cgpa, 7.5, 8.5);
  const technicalStatus = getStatus((profile.coding_score + profile.technical_score)/2, 65, 80);
  const experienceStatus = getStatus(profile.projects_count + profile.internships_count, 2, 4);
  const professionalStatus = getStatus((profile.communication_score + profile.mock_interview_score)/2, 65, 80);

  const sections = [
    { id: 'academic', title: 'Academic Readiness', icon: <BookOpen className="w-5 h-5"/>, status: academicStatus, score: `${profile.cgpa}/10 CGPA` },
    { id: 'technical', title: 'Technical Readiness', icon: <Code className="w-5 h-5"/>, status: technicalStatus, score: `${Math.round((profile.coding_score + profile.technical_score)/2)}/100 Avg` },
    { id: 'experience', title: 'Projects & Experience', icon: <Briefcase className="w-5 h-5"/>, status: experienceStatus, score: `${profile.projects_count} Projects, ${profile.internships_count} Internships` },
    { id: 'professional', title: 'Professional Skills', icon: <Users className="w-5 h-5"/>, status: professionalStatus, score: `${Math.round((profile.communication_score + profile.mock_interview_score)/2)}/100 Avg` }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Career Preparation Insights</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">Profile-based preparation recommendations to improve your placement readiness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-slate-600 shadow-sm border border-slate-200">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{section.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{section.score}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${section.status.color}`}>
                {section.status.label}
              </span>
            </div>
            
            <div className="p-6 flex-grow">
              <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Recommended Actions</h4>
              <ul className="space-y-3">
                {getRecommendations(section.id).map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
