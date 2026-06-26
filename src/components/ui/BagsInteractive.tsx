import { useState } from 'react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../../utils/haptic';
import { Shield } from 'lucide-react';

export default function BagsInteractive() {
  const [locked, setLocked] = useState(true);
  const [stuffing, setStuffing] = useState(30); // 0 (empty) to 100 (fully expanded)
  const [hovered, setHovered] = useState(false);

  const toggleLock = () => {
    setLocked(!locked);
    // Double pulse haptic feedback for satisfying clicky clasp action
    triggerHaptic('medium');
    setTimeout(() => triggerHaptic('selection'), 100);
  };

  const handleStuffingChange = (val: number) => {
    setStuffing(val);
    if (val % 8 === 0) {
      triggerHaptic('selection');
    }
  };

  return (
    <div
      className="p-6 bg-white border border-[#E5E5E5] rounded-2xl shadow-md h-full flex flex-col justify-between select-none relative overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-3 right-3 flex gap-2">
        <span className="font-mono text-[9px] text-[#8B8B8A] bg-[#F4F4F3] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Shield size={10} /> SecurClasp v2
        </span>
      </div>

      <div className="mb-2">
        <h4 className="font-serif text-[17px] font-bold text-[#111111] uppercase tracking-tight">
          Structural Volume
        </h4>
        <p className="text-[11px] text-[#8B8B8A] uppercase tracking-widest mt-0.5">
          Shield status: {locked ? 'CLASSIFIED LOCK' : 'ACCESSIBLE OPEN'}
        </p>
      </div>

      {/* Bag SVG Chassis */}
      <div className="flex-grow flex items-center justify-center relative min-h-[170px] py-1">
        <svg
          viewBox="0 0 200 170"
          className="w-full h-full max-h-[160px] drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern id="grid-bags" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#F1F1F1" strokeWidth="1" />
          </pattern>
          <rect width="200" height="170" fill="url(#grid-bags)" rx="8" />

          {/* BAG HANDLE */}
          <motion.path
            d="M 70,55 C 70,22 130,22 130,55"
            fill="none"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={{
              y: -stuffing * 0.05
            }}
          />

          {/* MAIN BAG SACK BODY */}
          <motion.path
            d="M 50,55 
               L 150,55 
               L 165,145 
               Q 100,155 35,145 Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="2.5"
            animate={{
              d: `M ${50 - stuffing * 0.08},55 
                  L ${150 + stuffing * 0.08},55 
                  L ${165 + stuffing * 0.15},145 
                  Q 100,${155 + stuffing * 0.08} ${35 - stuffing * 0.15},145 Z`
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          />

          {/* FRONT FLAP COVER BAR (Smooth sliding open path) */}
          <motion.path
            d="M 50,55 L 150,55 L 140,110 L 60,110 Z"
            fill="#E5E5E5"
            stroke="#111111"
            strokeWidth="1.8"
            animate={{
              d: locked
                ? `M ${50 - stuffing * 0.08},55 L ${150 + stuffing * 0.08},55 L ${140 + stuffing * 0.06},110 L ${60 - stuffing * 0.06},110 Z`
                : `M ${50 - stuffing * 0.08},55 L ${150 + stuffing * 0.08},55 L ${135 + stuffing * 0.03},80 L ${65 - stuffing * 0.03},80 Z`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />

          {/* REVOLVING PREMIUM CLASP BOLT */}
          <motion.g
            animate={{
              x: 100,
              y: locked ? 100 : 72
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            {/* Clasp Plate */}
            <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
            {/* Locked rotating bar */}
            <motion.line
              x1="-7" y1="0"
              x2="7" y2="0"
              stroke="#111111"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ rotate: locked ? 0 : 90 }}
              transition={{ type: 'spring', stiffness: 150, damping: 12 }}
            />
          </motion.g>

          {/* Interior layout display metadata labels */}
          <g opacity={hovered ? 1 : 0} className="transition-opacity duration-300">
            <line x1="100" y1="125" x2="100" y2="145" stroke="#4A5D23" strokeWidth="0.8" strokeDasharray="3,3" />
            <text x="75" y="137" className="font-mono text-[7px] fill-[#4A5D23]" fontWeight="bold">EXPANSION DEPTH: {(140 + stuffing * 0.35).toFixed(0)}mm</text>
          </g>
        </svg>

        {/* Locked secure status flag overlay */}
        <button
          onClick={toggleLock}
          className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"
          aria-label={locked ? "Unlock Clasp" : "Lock Clasp"}
        >
          <div className="bg-white/95 px-3 py-1.5 border border-[#E5E5E5] rounded-full shadow-lg text-[9px] font-bold uppercase tracking-widest text-[#111111] flex items-center gap-1.5 active:scale-95 transition-transform">
            {locked ? 'UNLATCH BAG' : 'SECURE LOCK'}
          </div>
        </button>
      </div>

      {/* Control Slider */}
      <div className="flex flex-col gap-2 mt-2 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider">
            Stuffing Volume Expander
          </span>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#4A5D23]/10 text-[#4A5D23] rounded-full">
            {(stuffing).toFixed(0)}% FULL
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={stuffing}
          onChange={(e) => handleStuffingChange(Number(e.target.value))}
          className="w-full h-1 bg-[#E5E5E5] rounded-lg appearance-none cursor-ew-resize accent-[#111111]"
          aria-label="Bag volume modifier"
        />
      </div>
    </div>
  );
}
