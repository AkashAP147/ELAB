import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MeshBackground from './components/MeshBackground';
import Home from './pages/Home';
import Experiments from './pages/Experiments';
import ExperimentDetail from './pages/ExperimentDetail';
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
            <Route path="/experiment/:id" element={<ExperimentDetail />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm">
          <p>© 2026 ELAB • Designed by Akash Patil</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
