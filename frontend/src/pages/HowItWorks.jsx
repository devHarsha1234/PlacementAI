import React from 'react';
import { Database, Settings2, Cpu, CheckCircle2, LineChart, FileJson, Server } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">ML Pipeline Architecture</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Understand how the PlacementAI system processes your data, trains models, and generates predictions.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden sm:block"></div>

        <div className="space-y-12">
          
          <Step 
            index="1"
            title="Kaggle Dataset"
            desc="The foundation is the Kaggle train.csv dataset containing 8,000 labeled records containing various student academic, technical, and professional attributes. The target variable is `placed` (1 or 0)."
            icon={<Database className="w-6 h-6 text-indigo-600" />}
            align="right"
          />

          <Step 
            index="2"
            title="Data Preprocessing & EDA"
            desc="The raw data undergoes rigorous cleaning. Missing numerical values are imputed using median strategies, categorical data via mode, and encoded using OneHotEncoder. Identifiers are dropped to prevent data leakage."
            icon={<Settings2 className="w-6 h-6 text-indigo-600" />}
            align="left"
          />

          <Step 
            index="3"
            title="Model Training & Comparison"
            desc="The 8,000 labeled records are split 80/20 into an internal 6,400-row training portion and a 1,600-row unseen holdout portion. Five supervised models are compared using 5-Fold Stratified Cross-Validation strictly on the 6,400 training rows."
            icon={<Cpu className="w-6 h-6 text-indigo-600" />}
            align="right"
          />

          <Step 
            index="4"
            title="Evaluation & Selection"
            desc="Models are compared based on Cross-Validation F1-Score due to class imbalance. The best model is retrained on the full 6,400 rows and evaluated ONCE on the 1,600 holdout rows."
            icon={<LineChart className="w-6 h-6 text-indigo-600" />}
            align="left"
            metrics={true}
          />

          <Step 
            index="5"
            title="Model Serialization"
            desc="The selected model (Logistic Regression) along with its entire preprocessing pipeline is serialized into a .joblib file, ensuring inference exactly matches training transformations."
            icon={<FileJson className="w-6 h-6 text-indigo-600" />}
            align="right"
          />

          <Step 
            index="6"
            title="REST API & Inference"
            desc="A Flask backend loads the .joblib file into memory. It exposes a /api/predict endpoint that accepts JSON from the React frontend, transforms the input, and returns the prediction and probability."
            icon={<Server className="w-6 h-6 text-indigo-600" />}
            align="left"
          />

          <Step 
            index="7"
            title="Explainability & Results"
            desc="Using feature importance and coefficient analysis, the system identifies which features most strongly influenced the final probability, presenting actionable insights to the student."
            icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
            align="right"
          />

        </div>
      </div>
    </div>
  );
};

const Step = ({ index, title, desc, icon, align, metrics }) => {
  const isLeft = align === 'left';
  
  return (
    <div className={`relative flex items-center justify-between md:justify-normal sm:flex-row flex-col w-full group ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      
      {/* Center Node */}
      <div className="absolute left-8 sm:left-auto md:left-1/2 w-12 h-12 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center font-bold text-slate-700 shadow-sm z-10 -translate-x-1/2 transition-colors group-hover:border-indigo-300">
        {index}
      </div>

      {/* Content */}
      <div className={`w-full sm:w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] pl-20 sm:pl-0 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
          
          {metrics && (
            <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-100 text-xs text-left grid grid-cols-2 gap-2">
              <div className="font-medium text-slate-500">Selected Model:</div>
              <div className="font-bold text-slate-900">Logistic Regression</div>
              <div className="font-medium text-slate-500">Task:</div>
              <div className="font-bold text-slate-900">Binary Classification</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
