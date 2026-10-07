import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';

const STEPS = [
  { id: 'academic', title: 'Academic Profile' },
  { id: 'technical', title: 'Technical Skills' },
  { id: 'experience', title: 'Experience' },
  { id: 'professional', title: 'Professional Skills' },
  { id: 'review', title: 'Review' }
];

const Predict = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    cgpa: '',
    attendance_percentage: '',
    backlogs: 0,
    coding_score: '',
    aptitude_score: '',
    technical_score: '',
    preferred_domain: '',
    projects_count: 0,
    internships_count: 0,
    hackathons_participated: 0,
    communication_score: '',
    mock_interview_score: '',
    leadership_score: ''
  });

  const [domains, setDomains] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/features`)
      .then(res => {
        if (res.data.categorical_options && res.data.categorical_options.preferred_domain) {
          setDomains(res.data.categorical_options.preferred_domain);
        }
      })
      .catch(err => {
        console.error("Could not fetch domains from backend:", err);
        setDomains(['Data Science', 'Software Development', 'Web Development', 'Business Analytics', 'Cloud Computing', 'Mobile App Development']);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    const payload = {};
    Object.keys(formData).forEach(key => {
      payload[key] = formData[key] === '' ? null : (key === 'preferred_domain' ? formData[key] : Number(formData[key]));
    });

    try {
      const response = await axios.post(`${API_URL}/api/predict`, payload);
      
      // Store in session storage to use in Results and Dashboard
      sessionStorage.setItem('recentPrediction', JSON.stringify(response.data));
      sessionStorage.setItem('recentProfile', JSON.stringify(payload));
      
      // Simulate professional loading sequence
      setTimeout(() => navigate('/results'), 1500);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze profile. Ensure backend is running.");
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
        
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 
                isCurrent ? 'bg-white border-indigo-600 text-indigo-600' : 
                'bg-white border-slate-300 text-slate-400'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : (idx + 1)}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${isCurrent ? 'text-indigo-900' : 'text-slate-500'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Placement Readiness Assessment</h1>
        <p className="mt-2 text-slate-600">Complete your profile to receive a personalized analysis.</p>
      </div>

      {renderStepIndicator()}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing your profile...</h3>
          <div className="text-slate-500 max-w-sm mx-auto space-y-2 text-sm text-left ml-auto mr-auto w-fit">
            <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Processing academic profile</p>
            <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Evaluating technical skills</p>
            <p className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-indigo-500 animate-spin"/> Comparing placement patterns</p>
            <p className="flex items-center gap-2 opacity-50"><Check className="w-4 h-4 opacity-0"/> Generating insights</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{STEPS[currentStep].title}</h2>
            
            {/* Form Steps */}
            <div className="space-y-6">
              
              {currentStep === 0 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current CGPA (out of 10)</label>
                    <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. 8.5" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Attendance Percentage (%)</label>
                    <input type="number" step="0.1" min="0" max="100" name="attendance_percentage" value={formData.attendance_percentage} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. 85" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Number of Active Backlogs</label>
                    <input type="number" min="0" max="20" name="backlogs" value={formData.backlogs} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Coding Assessment Score (0-100)</label>
                    <input type="number" min="0" max="100" name="coding_score" value={formData.coding_score} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                    <p className="text-xs text-slate-500 mt-1">Average score across coding platforms/tests</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Technical Subject Score (0-100)</label>
                    <input type="number" min="0" max="100" name="technical_score" value={formData.technical_score} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">General Aptitude Score (0-100)</label>
                    <input type="number" min="0" max="100" name="aptitude_score" value={formData.aptitude_score} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Domain</label>
                    <select name="preferred_domain" value={formData.preferred_domain} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white" required>
                      <option value="" disabled>Select domain</option>
                      {domains.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Completed Projects</label>
                    <input type="number" min="0" name="projects_count" value={formData.projects_count} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Internships Completed</label>
                    <input type="number" min="0" name="internships_count" value={formData.internships_count} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hackathons Participated</label>
                    <input type="number" min="0" name="hackathons_participated" value={formData.hackathons_participated} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Communication Skills (0-100)</label>
                    <input type="number" min="0" max="100" name="communication_score" value={formData.communication_score} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                    <p className="text-xs text-slate-500 mt-1">Self-rated or assessed communication ability</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mock Interview Performance (0-100)</label>
                    <input type="number" min="0" max="100" name="mock_interview_score" value={formData.mock_interview_score} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Leadership Score (0-100)</label>
                    <input type="number" min="0" max="100" name="leadership_score" value={formData.leadership_score} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                      <h3 className="font-bold text-slate-900">Academic</h3>
                      <button onClick={() => setCurrentStep(0)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-slate-500">CGPA</span><span className="font-medium">{formData.cgpa || '-'}</span>
                      <span className="text-slate-500">Attendance</span><span className="font-medium">{formData.attendance_percentage ? `${formData.attendance_percentage}%` : '-'}</span>
                      <span className="text-slate-500">Backlogs</span><span className="font-medium">{formData.backlogs}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                      <h3 className="font-bold text-slate-900">Technical</h3>
                      <button onClick={() => setCurrentStep(1)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-slate-500">Coding</span><span className="font-medium">{formData.coding_score || '-'}</span>
                      <span className="text-slate-500">Technical</span><span className="font-medium">{formData.technical_score || '-'}</span>
                      <span className="text-slate-500">Aptitude</span><span className="font-medium">{formData.aptitude_score || '-'}</span>
                      <span className="text-slate-500">Domain</span><span className="font-medium">{formData.preferred_domain || '-'}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                      <h3 className="font-bold text-slate-900">Experience & Skills</h3>
                      <button onClick={() => setCurrentStep(2)} className="text-indigo-600 text-sm hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-slate-500">Projects</span><span className="font-medium">{formData.projects_count}</span>
                      <span className="text-slate-500">Internships</span><span className="font-medium">{formData.internships_count}</span>
                      <span className="text-slate-500">Communication</span><span className="font-medium">{formData.communication_score || '-'}</span>
                      <span className="text-slate-500">Interview Score</span><span className="font-medium">{formData.mock_interview_score || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            {currentStep > 0 ? (
              <button 
                type="button" 
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </button>
            ) : <div></div>}
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none shadow-sm"
              >
                Analyze My Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;


