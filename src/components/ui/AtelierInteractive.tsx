import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { triggerHaptic } from '../../utils/haptic';
import { Eye, Shield, HelpCircle, Layers, Maximize2, Move } from 'lucide-react';

// ============================================================================
// 1. SHOES INTERACTIVE (Minimalist Weaving & Lacing Interactive SVG)
// ============================================================================
export function ShoesInteractive() {
  const [tension, setTension] = useState(0); // 0 (Loose) to 100 (Bound)
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Trigger high frequency subtle tick haptics as user drags the slider
  const handleTensionChange = (value: number) => {
    setTension(value);
    if (value % 8 === 0) {
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
          <Layers size={10} /> Active Lacing
        </span>
      </div>

      <div className="mb-2">
        <h4 className="font-serif text-[17px] font-bold text-[#111111] uppercase tracking-tight">
          Lace Tension System
        </h4>
        <p className="text-[11px] text-[#8B8B8A] uppercase tracking-widest mt-0.5">
          Level: {tension}% Locked
        </p>
      </div>

      {/* Sneaker SVG Chassis */}
      <div className="flex-grow flex items-center justify-center relative min-h-[170px] py-2">
        <svg
          viewBox="0 0 240 160"
          className="w-full h-full max-h-[160px] drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle grid background to look like a draft blueprint */}
          <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#F1F1F1" strokeWidth="1" />
          </pattern>
          <rect width="240" height="160" fill="url(#grid)" rx="8" />

          {/* SNEAKER OUTLINE SHAPE */}
          {/* Sole */}
          <path
            d="M 20,130 C 50,131 90,132 140,132 C 175,132 195,128 220,118 C 220,112 215,108 200,108 L 190,108 Q 110,110 20,118 Z"
            fill="#E5E5E5"
            stroke="#111111"
            strokeWidth="1.5"
            className="transition-colors duration-500"
          />
          {/* Midsole Layer */}
          <path
            d="M 22,122 C 70,123 120,123 170,121 C 190,120 205,116 218,111 L 217,114 C 192,124 172,127 135,127 C 85,127 45,126 22,125 Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="1"
          />

          {/* Upper mesh chassis */}
          <motion.path
            d="M 24,115 C 38,82 58,58 100,58 C 110,58 118,65 125,75 C 132,85 140,92 165,95 C 185,97 205,101 216,108"
            fill="none"
            stroke="#111111"
            strokeWidth="2"
            animate={{
              d: `M 24,115 C 38,${82 - tension * 0.05} 58,${58 - tension * 0.08} ${100 - tension * 0.05},${58 + tension * 0.05} C ${110 - tension * 0.05},${58 + tension * 0.05} 118,65 125,75 C 132,85 140,92 165,95 C 185,97 205,101 216,108`
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          {/* Heel counter cup & pull tab */}
          <motion.path
            d="M 24,115 C 14,105 16,75 22,70 C 24,68 28,68 28,73 L 26,90"
            fill="none"
            stroke="#111111"
            strokeWidth="1.5"
            animate={{
              scaleX: 1 - tension * 0.0005,
              skewY: tension * 0.02
            }}
          />

          {/* Eyelets (Lacing Holes) */}
          <circle cx="106" cy="67" r="2.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
          <circle cx="114" cy="74" r="2.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
          <circle cx="122" cy="81" r="2.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
          <circle cx="130" cy="88" r="2.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />

          {/* Tongue component */}
          <motion.path
            d="M 100,58 Q 115,45 132,58"
            fill="none"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              y: tension * 0.1,
              x: -tension * 0.05
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />

          {/* SHOELACES - Dynamically weaving path depending on tension state */}
          {/* Weave Segment 1 */}
          <motion.line
            x1="106" y1="67"
            x2="114" y2="74"
            stroke="#4A5D23"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              x1: 106 + tension * 0.04,
              y1: 67 + tension * 0.05,
              x2: 114 - tension * 0.04,
              stroke: tension > 70 ? "#111111" : "#4A5D23"
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />
          {/* Weave Segment 2 */}
          <motion.line
            x1="114" y1="74"
            x2="122" y2="81"
            stroke="#4A5D23"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              x1: 114 + tension * 0.04,
              y1: 74 + tension * 0.05,
              x2: 122 - tension * 0.04,
              stroke: tension > 70 ? "#111111" : "#4A5D23"
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />
          {/* Weave Segment 3 */}
          <motion.line
            x1="122" y1="81"
            x2="130" y2="88"
            stroke="#4A5D23"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              x1: 122 + tension * 0.04,
              y1: 81 + tension * 0.05,
              x2: 130 - tension * 0.04,
              stroke: tension > 70 ? "#111111" : "#4A5D23"
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          {/* Hanging Bow Laces (Tighten up perfectly!) */}
          <motion.path
            d="M 106,67 Q 95,48 85,55 C 75,62 90,75 106,67"
            fill="none"
            stroke="#4A5D23"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
              d: `M 106,67 Q ${95 + tension * 0.15},${48 + tension * 0.22} ${85 + tension * 0.25},${55 + tension * 0.18} C ${75 + tension * 0.3},62 ${90 + tension * 0.18},75 106,67`,
              stroke: tension > 70 ? "#111111" : "#4A5D23"
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          <motion.path
            d="M 106,67 Q 100,38 115,44 C 125,50 115,62 106,67"
            fill="none"
            stroke="#4A5D23"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
              d: `M 106,67 Q ${100 + tension * 0.1},${38 + tension * 0.3} ${115 + tension * 0.02},${44 + tension * 0.22} C ${125 - tension * 0.1},50 ${115 - tension * 0.1},62 106,67`,
              stroke: tension > 70 ? "#111111" : "#4A5D23"
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          {/* Dynamic Specs details tags */}
          <g opacity={hovered ? 1 : 0} className="transition-opacity duration-300">
            <line x1="58" y1="58" x2="35" y2="35" stroke="#111111" strokeWidth="0.8" strokeDasharray="3,3" />
            <text x="10" y="28" className="font-mono text-[7px]" fill="#111111">CALFSKIN GRAB</text>

            <line x1="165" y1="95" x2="190" y2="70" stroke="#111111" strokeWidth="0.8" strokeDasharray="3,3" />
            <text x="175" y="64" className="font-mono text-[7px]" fill="#111111">PERFORATED TOE</text>
          </g>
        </svg>

        {/* Tactile drag overlay signifier */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1.5 animate-bounce">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B8B8A] uppercase">
            TENSION LAB
          </span>
        </div>
      </div>

      {/* Control Slider */}
      <div className="flex flex-col gap-2 mt-2 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#555555] uppercase tracking-wider">
            LACE TENSION CONTROL
          </span>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#4A5D23]/10 text-[#4A5D23] rounded-full">
            {tension > 70 ? 'TACTICAL LOCK' : 'RELAXED FIT'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={tension}
          onChange={(e) => handleTensionChange(Number(e.target.value))}
          className="w-full h-1 bg-[#E5E5E5] rounded-lg appearance-none cursor-ew-resize accent-[#111111]"
          aria-label="Weave tension modifier"
        />
      </div>
    </div>
  );
}

// ============================================================================
// 2. TROUSERS INTERACTIVE (Modern Dynamic Drape & Width Tailoring Simulator)
// ============================================================================
export function TrousersInteractive() {
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

// ============================================================================
// 3. BAGS INTERACTIVE (Clasp Lock Mechanism & Organic Expanded Bag Volume)
// ============================================================================
export function BagsInteractive() {
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
