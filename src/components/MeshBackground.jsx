import React from 'react';
import { motion } from 'framer-motion';

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-brand-primary/20 blur-[120px]"
      />
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-secondary/10 blur-[120px]"
      />
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-[1px]" />
    </div>
  );
};

export default MeshBackground;
