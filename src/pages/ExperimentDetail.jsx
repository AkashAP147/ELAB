import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Play, Copy, Check } from 'lucide-react';
import { experiments } from '../data/experiments';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}

const ExperimentDetail = () => {
  const { id } = useParams();
  
  const currentIndex = experiments.findIndex(e => e.id === id);
  const experiment = experiments[currentIndex];
  const prevExperiment = currentIndex > 0 ? experiments[currentIndex - 1] : null;
  const nextExperiment = currentIndex < experiments.length - 1 ? experiments[currentIndex + 1] : null;

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && prevExperiment) {
        navigate(`/experiment/${prevExperiment.id}`);
      } else if (e.key === 'ArrowRight' && nextExperiment) {
        navigate(`/experiment/${nextExperiment.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevExperiment, nextExperiment, navigate]);

  const [activeTab, setActiveTab] = useState('code');
  const [hoveredLine, setHoveredLine] = useState(null);
  const [copied, setCopied] = useState(false);

  const autoGenerateExplanation = (code) => {
    const lines = code.split('\n');
    const autoExpl = [];
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimLine = line.trim();
      
      if (trimLine.startsWith('import') || trimLine.startsWith('from')) {
        autoExpl.push({ line: lineNum, text: `Importing library: ${trimLine.split(' ').slice(0, 2).join(' ')}`, type: 'import' });
      } else if (trimLine.includes('plt.') || trimLine.includes('sns.')) {
        autoExpl.push({ line: lineNum, text: 'Visualizing data using plotting functions.', type: 'plot' });
      } else if (trimLine.includes('pd.read_') || trimLine.includes('load_') || trimLine.includes('fetch_')) {
        autoExpl.push({ line: lineNum, text: 'Loading and preparing the dataset.', type: 'data' });
      } else if (trimLine.includes('.fit(') || trimLine.includes('.train(')) {
        autoExpl.push({ line: lineNum, text: 'Training the machine learning model on the provided data.', type: 'model' });
      } else if (trimLine.includes('.predict(')) {
        autoExpl.push({ line: lineNum, text: 'Making predictions using the trained model.', type: 'model' });
      } else if (trimLine.startsWith('#')) {
        autoExpl.push({ line: lineNum, text: `Comment: ${trimLine.replace('#', '').trim()}`, type: 'info' });
      }
    });
    
    return autoExpl.length > 0 ? autoExpl : [{ line: 1, text: 'Start exploring this code by reading line by line.', type: 'info' }];
  };

  const finalExplanation = experiment.explanation?.length > 0 
    ? experiment.explanation 
    : autoGenerateExplanation(experiment.code);

  if (!experiment) return <div className="text-white p-20 text-center">Experiment not found</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(experiment.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Labs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Explanation */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <span className="text-brand-secondary font-mono mb-4 block">Experiment #{experiment.number}</span>
            <h1 className="text-3xl font-bold mb-4">{experiment.title}</h1>
            <p className="text-white/50 leading-relaxed">{experiment.description}</p>
          </motion.div>

          <div className="glass p-6 rounded-3xl min-h-[200px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-primary" />
              Interactive Breakdown
            </h3>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {hoveredLine ? (
                  finalExplanation.filter(item => item.line === hoveredLine).length > 0 ? (
                    finalExplanation.filter(item => item.line === hoveredLine).map((item, idx) => (
                      <motion.div 
                        key={`expl-${item.line}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/30"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 bg-white/5 px-2 py-1 rounded">Line {item.line}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-secondary">{item.type || 'info'}</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{item.text || item}</p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      key="no-expl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-sm text-center italic"
                    >
                      No specific explanation for line {hoveredLine}.
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                    </div>
                    <p className="text-sm text-white/50">Hover over any line of code to see its detailed explanation here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Viewers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl overflow-hidden flex flex-col h-[700px]">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-4">
                {['code', 'output'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-sm font-medium px-4 py-2 rounded-xl transition-all capitalize",
                      activeTab === tab ? "bg-brand-primary text-white" : "text-white/50 hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === 'code' && (
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/50 hover:text-white flex items-center gap-2 text-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed">
              <AnimatePresence mode="wait">
                {activeTab === 'code' ? (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative"
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    {experiment.code.split('\n').map((line, idx) => {
                      const lineNum = idx + 1;
                      const isHighlighted = hoveredLine === lineNum;
                      return (
                        <div 
                          key={idx} 
                          onMouseEnter={() => setHoveredLine(lineNum)}
                          className={cn(
                            "flex gap-6 px-4 -mx-4 transition-all duration-200 cursor-pointer",
                            isHighlighted ? "bg-brand-primary/20 scale-[1.01] shadow-[0_0_30px_rgba(99,102,241,0.1)] z-10 rounded-lg" : "opacity-70 hover:opacity-100"
                          )}
                        >
                          <span className="w-8 text-right text-white/20 select-none">{lineNum}</span>
                          <span className={cn("whitespace-pre", isHighlighted ? "text-white" : "text-indigo-200/80")}>
                            {line || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12"
                  >
                    {experiment.output.length > 0 ? (
                      <img 
                        src={experiment.output[0]} 
                        alt="Experiment Result" 
                        className="rounded-2xl border border-white/10 shadow-2xl max-w-full h-auto"
                      />
                    ) : experiment.textOutput ? (
                      <div className="w-full text-left space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Play className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-bold text-green-400 uppercase tracking-widest">Console Output</span>
                        </div>
                        <div className="bg-black/40 rounded-2xl border border-white/10 p-6 overflow-auto">
                          <pre className="text-green-300/90 text-xs leading-relaxed whitespace-pre-wrap font-mono">{experiment.textOutput}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                          <Play className="w-10 h-10 text-white/20" />
                        </div>
                        <h4 className="text-xl font-bold">No output visual generated yet</h4>
                        <p className="text-white/30">Run the code locally to see visualization results or check documentation.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Side Navigation Arrows */}
      {prevExperiment && (
        <Link 
          to={`/experiment/${prevExperiment.id}`}
          title={`Previous: ${prevExperiment.title}`}
          className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full glass hover:bg-white/10 transition-all group shadow-xl shadow-black/20 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
        </Link>
      )}

      {nextExperiment && (
        <Link 
          to={`/experiment/${nextExperiment.id}`}
          title={`Next: ${nextExperiment.title}`}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full glass hover:bg-white/10 transition-all group shadow-xl shadow-black/20 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
};

export default ExperimentDetail;
