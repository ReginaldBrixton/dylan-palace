import { useState } from 'react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../../utils/haptic';
import { Move } from 'lucide-react';

export default function TrousersInteractive() {
  const [drapePct, setDrapePct] = useState(50); // 0 (Slim fit) to 100 (Wide palazzo fit)
  const [accent, setAccent] = useState(false);

  const handleDrapeChange = (val: number) => {
    setDrapePct(val);
    if (val % 8 === 0) {
      triggerHaptic('selection');
    }
  };

  return (
    <div
      className="p-6 bg-white border border-[#E5E5E5] rounded-2xl shadow-md h-full flex flex-col justify-between select-none relative overflow-hidden group"
      onMouseEnter={() => setAccent(true)}
      onMouseLeave={() => setAccent(false)}
    >
      <div className="absolute top-3 right-3 flex gap-2">
        <span className="font-mono text-[9px] text-[#8B8B8A] bg-[#F4F4F3] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Move size={10} /> Live Tailor
        </span>
      </div>

      <div className="mb-2">
        <h4 className="font-serif text-[17px] font-bold text-[#111111] uppercase tracking-tight">
          Adaptive Drape Engine
        </h4>
        <p className="text-[11px] text-[#8B8B8A] uppercase tracking-widest mt-0.5">
          Style: {drapePct < 30 ? 'Slim Crop' : drapePct > 70 ? 'Avant Wide-Leg' : 'Classic Pleat'}
        </p>
      </div>

      {/* Trouser SVG Outline Chassis */}
      <div className="flex-grow flex items-center justify-center relative min-h-[170px] py-1">
        <svg
          viewBox="0 0 200 170"
          className="w-full h-full max-h-[160px] drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern id="grid-pants" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#F1F1F1" strokeWidth="1" />
          </pattern>
          <rect width="200" height="170" fill="url(#grid-pants)" rx="8" />

          {/* TROUSER PATH */}
          {/* Left Waist band */}
          <path d="M 70,15 L 130,15 L 132,25 L 68,25 Z" fill="#E5E5E5" stroke="#111111" strokeWidth="1.5" />

          {/* Main Trousers Body (morphs based on drapePct) */}
          <motion.path
            d="M 68,25 
               C 66,45 60,65 52,90
               C 45,115 42,140 38,155
               L 80,155
               C 85,135 92,105 100,75
               C 108,105 115,135 120,155
               L 162,155
               C 158,140 155,115 148,90
               C 140,65 134,45 132,25 
               Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="2"
            animate={{
              d: `M 68,25 
                  C 66,45 60,65 ${52 - drapePct * 0.18} ,90
                  C ${45 - drapePct * 0.28},115 ${42 - drapePct * 0.35},140 ${38 - drapePct * 0.42},155
                  L ${80 - drapePct * 0.12},155
                  C ${85 - drapePct * 0.05},135 92,105 100,75
                  C 108,105 ${115 + drapePct * 0.05},135 ${120 + drapePct * 0.12},155
                  L ${162 + drapePct * 0.42},155
                  C ${158 + drapePct * 0.35},140 ${155 + drapePct * 0.28},115 ${148 + drapePct * 0.18},90
                  C 140,65 134,45 132,25 
                  Z`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />

          {/* Elegant Pleat Lines (moving organically to represent wide folding structure) */}
          <motion.path
            d="M 85,25 Q 78,85 70,155"
            fill="none"
            stroke="#111111"
            strokeWidth="0.8"
            strokeDasharray="4,3"
            animate={{
              d: `M 85,25 Q 78,85 ${70 - drapePct * 0.25},155`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />

          <motion.path
            d="M 115,25 Q 122,85 130,155"
            fill="none"
            stroke="#111111"
            strokeWidth="0.8"
            strokeDasharray="4,3"
            animate={{
              d: `M 115,25 Q 122,85 ${130 + drapePct * 0.25},155`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />

          {/* Waist button and pocket slits */}
          <circle cx="100" cy="20" r="3" fill="#111111" />
          <path d="M 72,32 L 80,45" stroke="#111111" strokeWidth="1" />
          <path d="M 128,32 L 120,45" stroke="#111111" strokeWidth="1" />

          {/* Tailored Spec tag overlay */}
          <g opacity={accent ? 1 : 0} className="transition-opacity duration-300">
            <line x1="30" y1="110" x2="10" y2="110" stroke="#4A5D23" strokeWidth="1" />
            <text x="8" y="103" className="font-mono text-[6px] fill-[#4A5D23]" fontWeight="bold">HEM OPEN: {(22 + drapePct * 0.4).toFixed(0)}mm</text>
            <line x1="170" y1="110" x2="190" y2="110" stroke="#4A5D23" strokeWidth="1" />
            <text x="145" y="103" className="font-mono text-[6px] fill-[#4A5D23]" fontWeight="bold">DRAPE WEIGHT: heavy-weight cotton</text>
          </g>
        </svg>
      </div>

      {/* Control Slider */}
      <div className="flex flex-col gap-2 mt-2 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider">
            Tailor Drape Slider
          </span>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#4A5D23]/10 text-[#4A5D23] rounded-full">
            {drapePct > 65 ? 'AVANT DRAPE' : 'SLIM CROP'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={drapePct}
          onChange={(e) => handleDrapeChange(Number(e.target.value))}
          className="w-full h-1 bg-[#E5E5E5] rounded-lg appearance-none cursor-ew-resize accent-[#111111]"
          aria-label="Pants cut drape modifier"
        />
      </div>
    </div>
  );
}
