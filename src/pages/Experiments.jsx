import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, BookOpen, Loader2, FlaskConical } from 'lucide-react';
import { subscribeExperiments, getAllLabs } from '../data/firebaseService';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const Experiments = () => {
  const { labId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [experiments, setExperiments] = useState([]);
  const [labInfo, setLabInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch lab info
  useEffect(() => {
    const fetchLabInfo = async () => {
      const labRef = ref(database, `labs/${labId}`);
      const snapshot = await get(labRef);
      if (snapshot.exists()) {
        setLabInfo({ id: labId, ...snapshot.val() });
      }
    };
    fetchLabInfo();
  }, [labId]);

  // Subscribe to experiments for this lab
  useEffect(() => {
    const unsub = subscribeExperiments(labId, (exps) => {
      setExperiments(exps);
      setLoading(false);
    });
    return unsub;
  }, [labId]);

  const filteredExperiments = experiments.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const labName = labInfo?.name || 'Lab';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Labs
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{labName}</h1>
            {labInfo?.code && (
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {labInfo.code}
              </span>
            )}
          </div>
          <p className="text-white/40">{labInfo?.description || 'Select an experiment to begin your interactive learning journey.'}</p>
        </div>
        
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <p className="text-white/40 text-sm">Loading programs...</p>
        </div>
      )}

      {/* Programs Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExperiments.length > 0 ? (
            filteredExperiments.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={`/experiment/${labId}/${exp.id}`}>
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
              <FlaskConical className="w-10 h-10 text-white/20 mx-auto mb-4" />
              <p className="text-white/30">
                {searchQuery ? 'No programs found matching your search.' : 'No programs in this lab yet.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Experiments;
