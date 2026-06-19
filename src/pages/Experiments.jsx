import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Filter, BookOpen } from 'lucide-react';
import { experiments } from '../data/experiments';

const Experiments = () => {
  const { labId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const labName = labId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const filteredExperiments = experiments.filter(exp => 
    exp.lab.toLowerCase() === labName.toLowerCase() &&
    (exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     exp.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Labs
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">{labName} Experiments</h1>
          <p className="text-white/40">Select an experiment to begin your interactive learning journey.</p>
        </div>
        
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperiments.length > 0 ? (
          filteredExperiments.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={`/experiment/${exp.id}`}>
                <div className="glass p-8 rounded-3xl group hover:border-brand-primary/30 transition-all flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex flex-col items-center justify-center border border-brand-primary/20 shrink-0">
                    <span className="text-xs font-bold text-brand-primary/60">EXP</span>
                    <span className="text-xl font-bold text-white">{exp.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{exp.title}</h3>
                    <p className="text-white/40 text-sm mb-6 line-clamp-2">{exp.description}</p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-secondary">
                      <BookOpen className="w-4 h-4" />
                      Explore Now
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl">
            <p className="text-white/30">No experiments found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiments;
