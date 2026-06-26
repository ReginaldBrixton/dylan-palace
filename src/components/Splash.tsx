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
        <div className="flex flex-col items-center justify-center bg-transparent relative">
          <motion.div
            initial={{ letterSpacing: '0.5em', opacity: 0 }}
            animate={{ letterSpacing: '0.05em', opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[28px] md:text-[36px] font-bold text-[#111111] uppercase tracking-tight text-center leading-none"
          >
            Dylan's
          </motion.div>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-32 h-px bg-[#111111] my-3 origin-center"
          />
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[20px] md:text-[28px] font-bold text-[#111111] uppercase tracking-[0.15em] text-center leading-none"
          >
            Palace
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[#8B8B8A] mt-4 font-semibold"
          >
            Premium Bespoke Apparel
          </motion.div>
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
