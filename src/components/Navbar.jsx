import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Search, Terminal, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full glass border-b border-white/10 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2 group z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 relative overflow-hidden"
          >
            {/* Glossy shine effect on hover */}
            <motion.div 
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ x: '100%', opacity: 0.5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-full h-full transform -skew-x-12"
            />
            <Beaker className="text-white w-6 h-6 relative z-10" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            E<span className="text-brand-secondary">LABS</span>
          </span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-white/60">
          <Link to="/" className="hover:text-white transition-colors px-2 py-1">Labs</Link>
          <Link to="/experiments/machine-learning" className="hover:text-white transition-colors px-2 py-1">Experiments</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors px-2 py-1">Documentation</a>
        </div>

        <div className="flex items-center gap-4 z-10 relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Search className="w-5 h-5 text-white/60" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Terminal className="w-5 h-5 text-white/60" />
          </motion.button>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
