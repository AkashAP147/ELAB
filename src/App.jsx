import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import MeshBackground from './components/MeshBackground';
import Home from './pages/Home';
import Experiments from './pages/Experiments';
import ExperimentDetail from './pages/ExperimentDetail';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen selection:bg-brand-primary selection:text-white">
        <MeshBackground />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiments/:labId" element={<Experiments />} />
            <Route path="/experiment/:labId/:expId" element={<ExperimentDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm">
          <p>
            © 2026 ELAB{' '}
            <Link to="/admin" className="opacity-40 hover:opacity-100 transition-opacity select-none cursor-default" title="">
              •
            </Link>{' '}
            Designed by Akash Patil
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
