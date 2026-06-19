import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Code, Cpu, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { experiments } from '../data/experiments';

const labDefs = [
  {
    title: 'Machine Learning',
    description: 'Explore regression, classification, and clustering algorithms.',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Python Programming',
    description: 'Master core concepts and advanced data structures.',
    icon: Code,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    title: 'Data Science',
    description: 'Techniques for data visualization and statistical analysis.',
    icon: Database,
    color: 'from-green-400 to-emerald-600',
  },
  {
    title: 'Artificial Intelligence',
    description: 'Deep learning, neural networks, and computer vision.',
    icon: Cpu,
    color: 'from-purple-500 to-pink-600',
  }
];

const labs = labDefs.map(lab => ({
  ...lab,
  count: experiments.filter(e => e.lab === lab.title).length
}));

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Engineering <span className="text-gradient">Virtual Coding</span> Labs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/50 max-w-2xl mx-auto mb-10"
        >
          A premium interactive platform for mastering complex coding concepts through visual feedback and real-time interactive breakdowns.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button className="bg-brand-primary hover:bg-brand-primary/80 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-2 mx-auto">
            Explore All Experiments <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {labs.map((lab, index) => (
          <Link
            key={lab.title}
            to={`/experiments/${lab.title.toLowerCase().replace(/\s+/g, '-')}`}
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
              <lab.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{lab.title}</h3>
            <p className="text-white/40 mb-6 line-clamp-2">{lab.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white/60">{lab.count} Experiments</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
