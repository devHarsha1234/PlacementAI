import React from 'react';
import { Terminal, Database, Code2, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">About The Project</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          AI-Based Student Placement Prediction and Career Readiness System
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Purpose</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Many students face uncertainty regarding their placement prospects despite their academic and extracurricular efforts. This system evaluates a student's profile and predicts their likelihood of placement using historical data, helping them identify critical areas of improvement before placement season begins.
          </p>
          <p className="text-slate-600 leading-relaxed">
            This project demonstrates the complete end-to-end applied machine learning lifecycle: from data acquisition and exploratory analysis, to model training and hyperparameter tuning, all the way to deployment via a REST API and a modern web interface.
          </p>
        </div>
        <div className="bg-slate-50 border-t border-slate-200 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Database className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <div className="font-bold text-slate-900">Kaggle Dataset</div>
            <div className="text-xs text-slate-500 mt-1">8,000 Labeled Records</div>
          </div>
          <div className="text-center">
            <Code2 className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <div className="font-bold text-slate-900">13 Features</div>
            <div className="text-xs text-slate-500 mt-1">Carefully Engineered</div>
          </div>
          <div className="text-center">
            <Globe className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <div className="font-bold text-slate-900">REST API</div>
            <div className="text-xs text-slate-500 mt-1">Flask Backend</div>
          </div>
          <div className="text-center">
            <Terminal className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <div className="font-bold text-slate-900">Open Source</div>
            <div className="text-xs text-slate-500 mt-1">Academic Project</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Technology Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">Machine Learning & Backend</h3>
          <ul className="space-y-3">
            <TechItem name="Python 3.8+" desc="Core programming language" />
            <TechItem name="Scikit-Learn" desc="Model training and pipeline creation" />
            <TechItem name="Pandas & NumPy" desc="Data manipulation and analysis" />
            <TechItem name="Flask" desc="REST API development" />
            <TechItem name="Joblib" desc="Model serialization" />
          </ul>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">Frontend Application</h3>
          <ul className="space-y-3">
            <TechItem name="React 19" desc="UI component library" />
            <TechItem name="Vite" desc="Frontend build tool" />
            <TechItem name="Tailwind CSS 4" desc="Utility-first styling framework" />
            <TechItem name="React Router" desc="Application routing" />
            <TechItem name="Axios" desc="API communication" />
          </ul>
        </div>
      </div>
    </div>
  );
};

const TechItem = ({ name, desc }) => (
  <li className="flex justify-between items-center text-sm">
    <span className="font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">{name}</span>
    <span className="text-slate-500 text-right">{desc}</span>
  </li>
);

export default About;
