import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Functional loading simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400); // Wait a tiny bit fully loaded
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      id="splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 h-screen w-full flex flex-col justify-between items-center bg-[#F9F9F8] text-[#111111] overflow-hidden px-6 py-16 z-[100]"
    >
      {/* Top Spacer */}
      <div className="h-1/4 w-full"></div>

      {/* Centralized Wordmark Logo */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-grow flex items-center justify-center"
      >
        <div className="w-48 md:w-64 aspect-square flex items-center justify-center bg-transparent relative">
          <img 
            alt="Dylan's Palace Brand Logo" 
            className="w-full h-full object-contain filter invert-0 drop-shadow-sm" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLtvJ5-gn7DMrCDl8rXPR9TVJiWX67XvhR1ku74xfsMcSmowk821NgXhWegGFgrZ-fzDndxUcBDCcb8jOVfcnQIGbYEOqLGTeIgy3pMvDtCL8bUcw7kj-wRDhZXpEAaDkNEmqXGsrkSmYJRrMVobADGXLoxLzfpJYC58yhBiMEXGFy2t5oN3fz3PbehBs5y6-Fjq4grNg1QbaHbgtBpTxslDKkmr5-ox0KejRij1epPdStDFqXn_W1BfHBY"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* Bottom Loading Indicator */}
      <div className="h-1/4 w-full flex flex-col items-center justify-end pb-8 gap-4 max-w-xs mx-auto">
        <div className="w-full relative">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B8B8A] mb-2 flex justify-between absolute -top-6 w-full">
            <span>Loading...</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </p>
          <div className="h-[2px] w-full bg-[#E5E5E5] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#111111]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
