import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Code, Cpu, Database, Server, FlaskConical, Beaker, Atom, GraduationCap, Layers, Boxes, FileCode, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeLabs, subscribeExperiments } from '../data/firebaseService';

// Icon map matching what's used in Admin panel
const ICON_MAP = {
  Brain, Code, Database, Cpu, Server, FlaskConical, Beaker, Atom, GraduationCap, Layers, Boxes, FileCode, BookOpen,
};

const Home = () => {
  const [labs, setLabs] = useState([]);
  const [labCounts, setLabCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Subscribe to labs in realtime
  useEffect(() => {
    const unsub = subscribeLabs((labsData) => {
      setLabs(labsData);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Subscribe to experiment counts for each lab
  useEffect(() => {
    if (labs.length === 0) return;
    
    const unsubs = labs.map((lab) =>
      subscribeExperiments(lab.id, (exps) => {
        setLabCounts((prev) => ({ ...prev, [lab.id]: exps.length }));
      })
    );

    return () => unsubs.forEach((u) => u());
  }, [labs]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-16 md:mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-tight"
        >
          Engineering <span className="text-gradient">Virtual Coding</span> Labs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 md:mb-10 px-4 md:px-0"
        >
          A premium interactive platform for mastering complex coding concepts through visual feedback and real-time interactive breakdowns.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 md:px-0"
        >
          <button className="bg-brand-primary w-full sm:w-auto hover:bg-brand-primary/80 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 mx-auto">
            Explore All Experiments <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <p className="text-white/40 text-sm">Loading labs...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && labs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 text-center max-w-lg mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FlaskConical className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Labs Yet</h3>
          <p className="text-white/40 text-sm mb-6">
            Head over to the Admin Dashboard to add your first lab section.
          </p>
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/80 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
          >
            Go to Admin <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Lab Cards */}
      {!loading && labs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labs.map((lab, index) => {
            const IconComp = ICON_MAP[lab.icon] || Brain;
            const count = labCounts[lab.id] || 0;

            return (
              <Link
                key={lab.id}
                to={`/experiments/${lab.id}`}
                className="block h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -10 }}
                  className="glass p-8 rounded-3xl relative overflow-hidden group cursor-pointer h-full"
                >
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${lab.color}`} />
                <div className="mb-6 p-4 w-fit rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <IconComp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{lab.name}</h3>
                <span className="text-xs font-mono text-brand-secondary/70 mb-3 block">{lab.code}</span>
                <p className="text-white/40 mb-6 line-clamp-2">{lab.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white/60">{count} Programs</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
