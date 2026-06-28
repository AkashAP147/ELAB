import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Play, Copy, Check, Download } from 'lucide-react';
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
      // Don't switch experiments if typing in the practice editor
      if (e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'input') {
        return;
      }

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
  const [practiceCode, setPracticeCode] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [skipComments, setSkipComments] = useState(false);
  const [inlineBreakdown, setInlineBreakdown] = useState(true);
  const hiddenTextareaRef = React.useRef(null);
  const cursorRef = React.useRef(null);

  useEffect(() => {
    if (cursorRef.current && activeTab === 'practice') {
      cursorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [cursorPos, activeTab]);

  const targetCode = React.useMemo(() => {
    if (!skipComments) return experiment.code;
    return experiment.code
      .split('\n')
      .filter(line => !line.trim().startsWith('#'))
      .join('\n');
  }, [experiment.code, skipComments]);

  const autoGenerateExplanation = (code) => {
    const lines = code.split('\n');
    const autoExpl = [];
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimLine = line.trim();
      
      if (!trimLine) {
        autoExpl.push({ line: lineNum, text: 'Empty line for readability and spacing.', type: 'formatting' });
        return;
      }
      
      if (trimLine.startsWith('#')) {
        autoExpl.push({ line: lineNum, text: `Comment: ${trimLine.replace('#', '').trim()}`, type: 'info' });
        return;
      }

      let text = 'Executing an operation.';
      let type = 'execution';

      // Imports
      if (trimLine.startsWith('import ')) {
        const parts = trimLine.split(' ');
        if (parts.includes('as')) {
           text = `Imports the '${parts[1]}' library and aliases it as '${parts[3]}' for easier use.`;
        } else {
           text = `Imports the '${parts[1]}' library to use its functions.`;
        }
        type = 'import';
      } else if (trimLine.startsWith('from ')) {
        const parts = trimLine.split(' ');
        text = `Imports specific components (${parts.slice(3).join(' ')}) from the '${parts[1]}' library.`;
        type = 'import';
      } 
      // Machine Learning operations
      else if (trimLine.includes('train_test_split(')) {
        const vars = trimLine.split('=')[0].trim();
        text = `Splits the dataset into training and testing subsets, assigning them to: ${vars}.`;
        type = 'data';
      } else if (trimLine.includes('.fit(')) {
        const args = trimLine.split('.fit(')[1].split(')')[0];
        text = `Trains (fits) the machine learning model using the training data: ${args}.`;
        type = 'model';
      } else if (trimLine.includes('.predict(')) {
        const args = trimLine.split('.predict(')[1].split(')')[0];
        const vars = trimLine.includes('=') ? trimLine.split('=')[0].trim() : 'the result';
        text = `Uses the trained model to make predictions on ${args}, storing the output in '${vars}'.`;
        type = 'model';
      } else if (trimLine.includes('accuracy_score(') || trimLine.includes('mean_squared_error(')) {
        const args = trimLine.includes('(') ? trimLine.split('(')[1].split(')')[0] : '';
        text = `Evaluates the model's performance by comparing predicted values against actual values (${args}).`;
        type = 'evaluation';
      }
      // Data processing
      else if (trimLine.includes('pd.read_csv(') || trimLine.includes('pd.read_excel(')) {
        const file = trimLine.split('(')[1].split(')')[0];
        const vars = trimLine.split('=')[0].trim();
        text = `Reads the dataset from ${file} and loads it into a pandas DataFrame named '${vars}'.`;
        type = 'data';
      }
      // Functions
      else if (trimLine.startsWith('def ')) {
        const funcName = trimLine.split(' ')[1].split('(')[0];
        const args = trimLine.split('(')[1].split(')')[0];
        text = `Defines a function named '${funcName}' that accepts arguments: ${args || 'none'}.`;
        type = 'function';
      } else if (trimLine.startsWith('return ')) {
        const val = trimLine.substring(7).trim();
        text = `Outputs the calculated result '${val}' back to wherever the function was called.`;
        type = 'return';
      }
      // Output
      else if (trimLine.startsWith('print(')) {
        const val = trimLine.substring(6, trimLine.length - 1);
        text = `Prints the value or message ${val} to the console so you can see the result.`;
        type = 'output';
      }
      // Generic Assignment (fallback)
      else if (trimLine.includes('=')) {
        const parts = trimLine.split('=');
        const varName = parts[0].trim();
        const expression = parts.slice(1).join('=').trim();
        
        if (expression.includes('model') || expression.includes('Classifier') || expression.includes('Regressor')) {
          text = `Initializes a machine learning model (${expression.split('(')[0]}) and stores it in '${varName}'.`;
          type = 'model';
        } else {
          text = `Evaluates the expression '${expression}' and assigns the result to the variable '${varName}'.`;
          type = 'assignment';
        }
      } 
      // Specific function calls (Fallback)
      else if (trimLine.includes('plt.') || trimLine.includes('sns.')) {
        text = `Configures or generates a data visualization using the plotting library.`;
        type = 'plot';
      } else if (trimLine.endsWith(')')) {
         const func = trimLine.split('(')[0].trim().split(' ').pop();
         text = `Calls the function '${func}' to execute a specific task.`;
      }

      autoExpl.push({ line: lineNum, text, type });
    });
    
    return autoExpl;
  };

  const generatedExplanation = autoGenerateExplanation(experiment.code);
  const finalExplanation = generatedExplanation.map(gen => {
    const customExpl = experiment.explanation?.find(e => e.line === gen.line);
    return customExpl ? customExpl : gen;
  });

  if (!experiment) return <div className="text-white p-20 text-center">Experiment not found</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(experiment.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 md:mb-8 group text-sm md:text-base">
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Labs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Info Card (Order 1 on mobile, Col 1 Row 1 on desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 md:p-8 rounded-3xl lg:col-span-1 order-1 flex flex-col justify-center sticky top-6"
        >
          <span className="text-brand-secondary font-mono mb-2 md:mb-4 block text-xs md:text-sm">Experiment #{experiment.number}</span>
          <h1 className="text-lg md:text-3xl font-bold mb-2 md:mb-4 transition-all duration-300 hover:text-2xl active:text-2xl md:hover:text-3xl cursor-pointer line-clamp-1 hover:line-clamp-none active:line-clamp-none">
            {experiment.title}
          </h1>
          <p className="text-white/50 leading-relaxed text-xs md:text-base line-clamp-2 md:line-clamp-none hover:line-clamp-none transition-all duration-300 cursor-pointer">
            {experiment.description}
          </p>
          {experiment.downloadLink && (
            <div className="mt-4 md:mt-6">
              <a 
                href={experiment.downloadLink} 
                download 
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/20 hover:bg-brand-primary/40 text-brand-secondary border border-brand-primary/30 rounded-xl transition-all text-xs md:text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                {experiment.lab === 'DEVOP' ? 'Download PDF' : 'Download Dataset'}
              </a>
            </div>
          )}
        </motion.div>

        {/* Right Column: Code & Viewers (Order 2 on mobile, Col 2-3 Row 1-2 on desktop) */}
        <div className="lg:col-span-2 lg:row-span-2 order-2 space-y-6">
          <div className="glass rounded-3xl overflow-hidden flex flex-col h-[500px] lg:h-[700px]">
            {/* Tabs Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-2 md:gap-4">
                {['code', 'practice', 'output'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-xl transition-all capitalize",
                      activeTab === tab ? "bg-brand-primary text-white" : "text-white/50 hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === 'code' && (
                <div className="flex items-center gap-4 shrink-0">
                  <button 
                    onClick={() => setInlineBreakdown(!inlineBreakdown)}
                    className="hidden md:flex items-center gap-2 text-[10px] md:text-xs text-white/50 hover:text-white transition-colors select-none group"
                  >
                    <span>Breakdown</span>
                    <div className={cn(
                      "w-8 h-4 rounded-full relative transition-colors duration-300 border border-white/10",
                      inlineBreakdown ? "bg-brand-primary border-brand-primary" : "bg-black/40 group-hover:bg-black/60"
                    )}>
                      <div className={cn(
                        "w-3 h-3 rounded-full bg-white absolute top-[1px] transition-transform duration-300 shadow-sm",
                        inlineBreakdown ? "translate-x-[17px]" : "translate-x-[1px] opacity-50"
                      )} />
                    </div>
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/50 hover:text-white flex items-center gap-2 text-[10px] md:text-xs"
                  >
                    {copied ? <Check className="w-3 h-3 md:w-4 md:h-4 text-green-400" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden font-mono text-xs md:text-sm leading-relaxed flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'code' ? (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative w-full h-full flex flex-col"
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    <div className="flex-1 overflow-auto p-4 md:p-6 pb-40">
                      <div className="min-w-max">
                        {experiment.code.split('\n').map((line, idx) => {
                        const lineNum = idx + 1;
                        const isHighlighted = hoveredLine === lineNum;
                        const expl = finalExplanation.find(item => item.line === lineNum);

                        return (
                          <div 
                            key={idx} 
                            onMouseEnter={() => setHoveredLine(lineNum)}
                            className="relative flex flex-col justify-center"
                          >
                            <div className={cn(
                              "flex gap-4 md:gap-6 px-4 -mx-4 transition-all duration-200 cursor-pointer relative z-10",
                              isHighlighted ? "bg-brand-primary/30 scale-[1.01] shadow-[0_0_30px_rgba(99,102,241,0.2)] rounded-lg py-1" : "opacity-70 hover:opacity-100"
                            )}>
                              <span className="w-6 md:w-8 shrink-0 text-right text-white/40 select-none">{lineNum}</span>
                              <span className={cn("whitespace-pre", isHighlighted ? "text-white" : "text-indigo-200/80")}>
                                {line || ' '}
                              </span>
                            </div>

                            {/* Floating inline tooltip */}
                            <AnimatePresence>
                              {inlineBreakdown && isHighlighted && expl && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-10 md:left-14 top-full mt-1 z-30 pointer-events-none whitespace-normal w-max max-w-[80vw] md:max-w-xl bg-black/95 backdrop-blur-xl border border-brand-primary/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-xl p-3"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-brand-secondary">{expl.type || 'info'}</span>
                                  </div>
                                  <div className="text-xs md:text-sm text-white/95 font-sans leading-relaxed drop-shadow-md">
                                    {expl.text}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === 'practice' ? (
                  <motion.div
                    key="practice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col w-full relative"
                    onClick={() => {
                      if (hiddenTextareaRef.current) {
                        hiddenTextareaRef.current.focus();
                        const len = practiceCode.length;
                        hiddenTextareaRef.current.setSelectionRange(len, len);
                        setCursorPos(len);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/5 bg-black/20">
                      <div className="text-white/50 text-xs flex flex-col gap-1">
                        <span className="text-brand-secondary font-bold uppercase tracking-wider text-[10px]">Interactive Typing Mode</span>
                        <span>Start typing to match the code below. Red means error, green means correct.</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSkipComments(!skipComments);
                            setPracticeCode('');
                          }}
                          className="flex items-center gap-2 text-[10px] md:text-xs text-white/50 hover:text-white transition-colors select-none group"
                        >
                          <span>Skip Comments</span>
                          <div className={cn(
                            "w-8 h-4 rounded-full relative transition-colors duration-300 border border-white/10",
                            skipComments ? "bg-brand-primary border-brand-primary" : "bg-black/40 group-hover:bg-black/60"
                          )}>
                            <div className={cn(
                              "w-3 h-3 rounded-full bg-white absolute top-[1px] transition-transform duration-300 shadow-sm",
                              skipComments ? "translate-x-[17px]" : "translate-x-[1px] opacity-50"
                            )} />
                          </div>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPracticeCode('');
                            hiddenTextareaRef.current?.focus();
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                        >
                          Reset
                        </button>
                        {practiceCode === targetCode && (
                          <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                            <Check className="w-3 h-3" /> Perfect Match!
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-4 md:p-6 bg-black/40 font-mono text-xs md:text-sm leading-relaxed cursor-text relative">
                      <textarea
                        ref={hiddenTextareaRef}
                        className="fixed top-1/2 left-1/2 w-1 h-1 opacity-0 p-0 m-0 border-0 focus:ring-0 focus:outline-none -z-10"
                        value={practiceCode}
                        onChange={(e) => {
                          setPracticeCode(e.target.value);
                          setCursorPos(e.target.selectionStart);
                        }}
                        onSelect={(e) => setCursorPos(e.target.selectionStart)}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            const { selectionStart, selectionEnd } = e.target;
                            const newCode = practiceCode.substring(0, selectionStart) + '    ' + practiceCode.substring(selectionEnd);
                            setPracticeCode(newCode);
                            const newPos = selectionStart + 4;
                            setTimeout(() => {
                              if (hiddenTextareaRef.current) {
                                hiddenTextareaRef.current.selectionStart = hiddenTextareaRef.current.selectionEnd = newPos;
                                setCursorPos(newPos);
                              }
                            }, 0);
                          }
                        }}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        data-gramm="false"
                      />
                      
                      <div className="min-w-max">
                        {targetCode.split('\n').map((line, lineIndex) => {
                          const previousLinesLength = targetCode.split('\n').slice(0, lineIndex).join('\n').length;
                          // +1 for the newline character, except for the first line
                          const lineStartIdx = previousLinesLength + (lineIndex > 0 ? 1 : 0);
                          
                          return (
                            <div key={lineIndex} className="flex hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                              <div className="w-8 md:w-10 shrink-0 text-white/30 text-right pr-3 select-none">
                                {lineIndex + 1}
                              </div>
                              <div className="flex-1 whitespace-pre relative text-white/30">
                                {line.split('').map((char, charIndex) => {
                                  const globalIndex = lineStartIdx + charIndex;
                                  let colorClass = "text-white/30"; // default untyped
                                  let isErrorSpace = false;

                                  if (globalIndex < practiceCode.length) {
                                    const isCorrect = practiceCode[globalIndex] === char;
                                    colorClass = isCorrect ? "text-green-400" : "text-red-400 bg-red-400/20";
                                    if (!isCorrect && char === ' ') {
                                      isErrorSpace = true;
                                    }
                                  }

                                  const isCursor = globalIndex === cursorPos;

                                  return (
                                    <span 
                                      key={charIndex} 
                                      ref={isCursor ? cursorRef : null}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (hiddenTextareaRef.current) {
                                          let currentCode = practiceCode;
                                          if (globalIndex > practiceCode.length) {
                                            currentCode = practiceCode + targetCode.substring(practiceCode.length, globalIndex);
                                            setPracticeCode(currentCode);
                                          }
                                          
                                          setTimeout(() => {
                                            if (hiddenTextareaRef.current) {
                                              hiddenTextareaRef.current.focus();
                                              hiddenTextareaRef.current.setSelectionRange(globalIndex, globalIndex);
                                              setCursorPos(globalIndex);
                                            }
                                          }, 0);
                                        }
                                      }}
                                      className={cn(
                                        colorClass, 
                                        isCursor && "relative after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-brand-primary after:animate-pulse scroll-mb-32",
                                        isErrorSpace && "inline-block w-[0.5em]", // ensure error spaces are visible
                                        "cursor-text"
                                      )}
                                    >
                                      {char}
                                    </span>
                                  );
                                })}
                                {/* Handle cursor at the end of a line (newline pending) */}
                                {(() => {
                                  const isNewlineCursor = (lineStartIdx + line.length) === cursorPos;
                                  const isLastLine = lineIndex === targetCode.split('\n').length - 1;
                                  if (isNewlineCursor && !isLastLine) {
                                    return <span 
                                      ref={cursorRef}
                                      className="relative after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-brand-primary after:animate-pulse ml-[1px] text-white/30 cursor-text scroll-mb-32"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (hiddenTextareaRef.current) {
                                          const pos = lineStartIdx + line.length;
                                          hiddenTextareaRef.current.focus();
                                          hiddenTextareaRef.current.setSelectionRange(pos, pos);
                                          setCursorPos(pos);
                                        }
                                      }}
                                    >↵</span>;
                                  }
                                  if (isNewlineCursor && isLastLine) {
                                    return <span ref={cursorRef} className="relative after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-brand-primary after:animate-pulse ml-[1px] scroll-mb-32"></span>;
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 overflow-auto w-full"
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

      {/* Mobile Navigation Arrows (Visible only on small screens) */}
      <div className="mt-12 pt-8 border-t border-white/10 flex md:hidden items-center justify-between gap-4">
        {prevExperiment ? (
          <Link 
            to={`/experiment/${prevExperiment.id}`}
            className="flex-1 flex flex-col items-start gap-1 px-4 py-3 rounded-2xl glass hover:bg-white/10 transition-colors"
          >
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Previous</div>
            <div className="font-semibold text-xs line-clamp-1">{prevExperiment.title}</div>
          </Link>
        ) : <div className="flex-1"></div>}

        {nextExperiment ? (
          <Link 
            to={`/experiment/${nextExperiment.id}`}
            className="flex-1 flex flex-col items-end gap-1 px-4 py-3 rounded-2xl glass hover:bg-white/10 transition-colors text-right"
          >
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Next</div>
            <div className="font-semibold text-xs line-clamp-1">{nextExperiment.title}</div>
          </Link>
        ) : <div className="flex-1"></div>}
      </div>

      {/* Fixed Side Navigation Arrows (Desktop only) */}
      {prevExperiment && (
        <Link 
          to={`/experiment/${prevExperiment.id}`}
          title={`Previous: ${prevExperiment.title}`}
          className="hidden md:flex fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 p-3 lg:p-4 rounded-full glass hover:bg-white/10 transition-all group shadow-xl shadow-black/20 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
        </Link>
      )}

      {nextExperiment && (
        <Link 
          to={`/experiment/${nextExperiment.id}`}
          title={`Next: ${nextExperiment.title}`}
          className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 p-3 lg:p-4 rounded-full glass hover:bg-white/10 transition-all group shadow-xl shadow-black/20 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
};

export default ExperimentDetail;
