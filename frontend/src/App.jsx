import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/results" element={<Results />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Student Placement Intelligence Platform. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
