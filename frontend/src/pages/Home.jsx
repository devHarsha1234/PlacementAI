import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Target, Zap, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center lg:pt-32 lg:pb-36">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Understand your placement readiness <br className="hidden md:block"/>
            before the <span className="text-indigo-600">placement season begins.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            Use machine learning trained on a Kaggle student placement dataset to analyze your profile and identify specific areas that can improve your career prospects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/predict" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition">
              Check My Placement Readiness
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/how-it-works" className="inline-flex justify-center items-center px-8 py-3.5 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">ML-Based Prediction</h3>
              <p className="text-slate-600">Powered by Logistic Regression evaluating 13 key academic and technical features.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Insights</h3>
              <p className="text-slate-600">Receive custom recommendations based on your specific profile strengths and weaknesses.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-slate-600">Understand exactly where you stand in academic, technical, and professional domains.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data-Driven Preparation</h3>
              <p className="text-slate-600">Stop guessing. Focus your preparation time on the metrics that actually matter for placement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Simplified */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">How the platform works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
            
            {[
              { step: '1', title: 'Enter Profile', desc: 'Provide your academic & technical details in a quick 4-step form.' },
              { step: '2', title: 'ML Analysis', desc: 'Our trained model evaluates your profile against historical data.' },
              { step: '3', title: 'Prediction', desc: 'Get a clear probability score of your placement likelihood.' },
              { step: '4', title: 'Skill Insights', desc: 'Review personalized recommendations to bridge your skill gaps.' }
            ].map((item) => (
              <div key={item.step} className="bg-white px-4">
                <div className="w-12 h-12 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 max-w-[180px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Credibility section */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800">
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">Kaggle</div>
              <div className="text-sm text-slate-400">Verified Dataset Source</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">Supervised</div>
              <div className="text-sm text-slate-400">Machine Learning</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">Binary</div>
              <div className="text-sm text-slate-400">Classification Task</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">5 Models</div>
              <div className="text-sm text-slate-400">Compared & Evaluated</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
