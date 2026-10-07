import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Lightbulb, TrendingUp, AlertTriangle, Cpu } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const stored = sessionStorage.getItem('recentPrediction');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/predict');
    }
  }, [navigate]);

  if (!result) return null;

  const isPlaced = result.prediction === 'Placed';
  const confidencePercent = Math.round(result.probability * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/predict')}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Assessment
      </button>

      <div className="text-center mb-10">
        <h1 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-3">Your Placement Outlook</h1>
        <div className={`inline-block border-4 ${isPlaced ? 'border-green-500 bg-green-50' : 'border-amber-500 bg-amber-50'} rounded-2xl p-8 mb-6 shadow-sm`}>
          <h2 className={`text-5xl font-extrabold ${isPlaced ? 'text-green-700' : 'text-amber-700'} tracking-tight mb-2 uppercase`}>
            {result.prediction}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="text-2xl font-bold text-slate-900">{confidencePercent}%</div>
            <div className="text-sm font-medium text-slate-500">Prediction Probability</div>
          </div>
        </div>
        
        <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <span className="font-semibold text-slate-900">What this means:</span> The trained model assigns a {(result.probability).toFixed(2)} probability to the predicted class based on patterns learned from the training data. This is a statistical probability and not a guaranteed real-world outcome.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm md:col-span-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
               <Cpu className="w-5 h-5 text-indigo-600" />
             </div>
             <div>
               <div className="text-sm font-medium text-slate-500">Selected ML Model</div>
               <div className="text-lg font-bold text-slate-900">{result.model || "Logistic Regression"}</div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-sm font-medium text-slate-500">Evaluation Metric</div>
             <div className="text-lg font-bold text-slate-900">F1-Score / ROC-AUC</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Key Factors Behind Your Prediction</h3>
          </div>
          <ul className="space-y-4">
            {result.explanation.map((exp, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span className="text-sm leading-relaxed">{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">Actionable Recommendations</h3>
          </div>
          {result.recommendations && result.recommendations.length > 0 ? (
            <ul className="space-y-4">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <div className="mt-0.5"><AlertTriangle className="h-4 w-4 text-amber-500" /></div>
                  <span className="text-sm leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500 flex items-center justify-center h-full pb-8">
              Keep maintaining your current strong profile! Focus on advanced interview prep.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
        >
          Go to Student Dashboard <ChevronRight className="ml-2 h-5 w-5" />
        </button>
        <button 
          onClick={() => navigate('/predict')}
          className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition"
        >
          Update Prediction
        </button>
      </div>
    </div>
  );
};

export default Results;
