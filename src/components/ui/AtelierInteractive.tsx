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
          viewBox="0 0 260 170"
          className="w-full h-full max-h-[170px] drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#F1F1F1" strokeWidth="1" />
            </pattern>
            <linearGradient id="gUpper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F3F3F1" />
              <stop offset="100%" stopColor="#DDDDDB" />
            </linearGradient>
            <linearGradient id="gToe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6F6F5" />
              <stop offset="100%" stopColor="#D6D6D3" />
            </linearGradient>
            <linearGradient id="gHeel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EEEEEC" />
              <stop offset="100%" stopColor="#CDCDCB" />
            </linearGradient>
            <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E4E4E1" />
            </linearGradient>
            <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3C3C3C" />
              <stop offset="100%" stopColor="#141414" />
            </linearGradient>
            <radialGradient id="gCollar" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#3A3A3A" />
              <stop offset="100%" stopColor="#141414" />
            </radialGradient>
          </defs>
          <rect width="260" height="170" fill="url(#grid)" rx="8" />

          {/* GROUND SHADOW */}
          <ellipse cx="132" cy="148" rx="104" ry="5.5" fill="#111111" opacity="0.10" />

          {/* OUTSOLE - thick rubber bottom with toe spring */}
          <path
            d="M 30,136 C 26,141 29,146 36,146 L 210,146 C 222,146 231,142 237,134 C 239,131 237,128 233,128 C 226,131 217,133 207,134 C 150,137 82,137 44,136 C 38,135 33,134 30,136 Z"
            fill="url(#gOut)"
            stroke="#0C0C0C"
            strokeWidth="0.8"
          />
          {/* Outsole tread notches */}
          <g stroke="#000000" strokeWidth="1" opacity="0.45">
            <line x1="58" y1="138" x2="58" y2="145" />
            <line x1="80" y1="138" x2="80" y2="145" />
            <line x1="102" y1="138" x2="102" y2="145" />
            <line x1="124" y1="138" x2="124" y2="145" />
            <line x1="146" y1="138" x2="146" y2="145" />
            <line x1="168" y1="138" x2="168" y2="145" />
            <line x1="190" y1="137" x2="190" y2="145" />
          </g>

          {/* MIDSOLE - white foam wedge */}
          <path
            d="M 36,113 C 70,118 112,122 152,121 C 178,120 198,118 212,116 C 222,115 229,117 233,121 L 234,128 C 226,131 217,133 207,134 C 150,137 82,137 44,136 C 38,136 32,136 30,136 L 30,134 C 27,127 29,119 36,113 Z"
            fill="url(#gMid)"
            stroke="#C9C9C7"
            strokeWidth="0.9"
          />
          {/* Midsole foam seam */}
          <path
            d="M 34,126 C 80,130 140,131 206,127 C 218,126 226,126 232,127"
            fill="none"
            stroke="#D2D2D0"
            strokeWidth="0.8"
          />
          {/* Heel air-unit detail */}
          <ellipse cx="44" cy="129" rx="9" ry="4" fill="#FFFFFF" stroke="#C9C9C7" strokeWidth="0.7" opacity="0.9" />

          {/* HEEL COUNTER - rigid back panel */}
          <path
            d="M 40,113 C 37,96 41,80 50,69 C 53,66 57,66 59,69 C 51,80 48,96 49,113 C 46,114 43,114 40,113 Z"
            fill="url(#gHeel)"
            stroke="#111111"
            strokeWidth="1.1"
          />
          {/* Heel pull tab */}
          <path
            d="M 50,69 C 47,64 47,59 51,57 C 55,55 59,57 60,61 C 57,62 54,64 53,68 Z"
            fill="#E2E2E0"
            stroke="#111111"
            strokeWidth="0.9"
          />

          {/* UPPER BODY - main side panel */}
          <motion.path
            d="M 40,113 C 38,96 43,79 53,69 C 60,62 69,58 80,57 C 90,56 96,57 99,60 C 112,55 126,56 140,62 C 160,71 180,84 202,100 C 212,107 220,112 224,116 C 216,117 205,117 195,118 C 150,121 92,120 40,113 Z"
            fill="url(#gUpper)"
            stroke="#1A1A1A"
            strokeWidth="1.4"
            animate={{
              d: `M 40,113 C 38,96 43,79 53,${69 - tension * 0.015} C 60,${62 - tension * 0.01} 69,${58 - tension * 0.015} 80,${57 - tension * 0.02} C 90,${56 - tension * 0.02} 96,${57 - tension * 0.015} 99,${60 - tension * 0.02} C 112,${55 - tension * 0.015} 126,56 140,62 C 160,71 180,84 202,100 C 212,107 220,112 224,116 C 216,117 205,117 195,118 C 150,121 92,120 40,113 Z`
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          {/* Quarter panel shading overlay */}
          <path
            d="M 52,108 C 60,90 74,74 92,68 C 110,63 132,67 154,78 C 176,89 196,102 212,113 C 200,114 188,114 176,114 C 130,116 88,114 52,108 Z"
            fill="#000000"
            opacity="0.04"
          />

          {/* TOE CAP - reinforced front */}
          <path
            d="M 168,110 C 184,106 200,105 214,110 C 220,112 224,114 224,116 C 216,117 205,117 195,118 C 186,118 178,117 171,116 C 168,114 167,112 168,110 Z"
            fill="url(#gToe)"
            stroke="#1A1A1A"
            strokeWidth="1.1"
          />
          {/* Toe cap seam */}
          <path
            d="M 170,113 C 186,109 202,108 216,112"
            fill="none"
            stroke="#BDBDBB"
            strokeWidth="0.7"
            strokeDasharray="2.5,2"
          />
          {/* Perforation dots */}
          <g fill="#BCBCBA" opacity="0.8">
            <circle cx="182" cy="110" r="0.8" /><circle cx="188" cy="109" r="0.8" />
            <circle cx="194" cy="109" r="0.8" /><circle cx="200" cy="110" r="0.8" />
            <circle cx="185" cy="113" r="0.8" /><circle cx="191" cy="112" r="0.8" />
            <circle cx="197" cy="112" r="0.8" /><circle cx="203" cy="113" r="0.8" />
          </g>

          {/* Vamp / forefoot seam */}
          <path
            d="M 100,64 C 120,68 142,77 164,90 C 180,99 194,107 206,113"
            fill="none"
            stroke="#C9C9C7"
            strokeWidth="0.7"
            strokeDasharray="3,2"
          />

          {/* BRAND SWOOSH */}
          <path
            d="M 70,108 C 100,98 140,90 184,84 C 192,83 197,86 198,92 C 191,90 183,91 175,93 C 138,100 102,108 74,114 Z"
            fill="#4A5D23"
            opacity="0.92"
          />

          {/* COLLAR OPENING - padded ankle opening */}
          <motion.path
            d="M 55,68 C 62,59 72,54 84,53 C 91,53 96,55 99,60 C 92,57 82,57 74,60 C 66,63 60,66 57,71 Z"
            fill="url(#gCollar)"
            stroke="#111111"
            strokeWidth="0.8"
            animate={{
              d: `M 55,68 C 62,${59 - tension * 0.015} 72,${54 - tension * 0.02} 84,${53 - tension * 0.015} C 91,${53 - tension * 0.01} 96,${55 - tension * 0.015} 99,${60 - tension * 0.02} C 92,57 82,57 74,60 C 66,63 60,66 57,71 Z`
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          />

          {/* TONGUE - padded, peeks above the laces */}
          <motion.path
            d="M 95,60 C 97,49 103,42 112,42 C 119,42 124,48 125,56 C 121,51 114,50 108,52 C 102,54 98,57 97,62 Z"
            fill="url(#gToe)"
            stroke="#1A1A1A"
            strokeWidth="1"
            animate={{ y: -tension * 0.07, x: tension * 0.02 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
          <rect x="106" y="46" width="13" height="4.5" rx="1.2" fill="#4A5D23" />

          {/* EYELETS - two rows along the instep */}
          <g fill="#2A2A2A" stroke="#000000" strokeWidth="0.6">
            <circle cx="100" cy="62" r="1.7" /><circle cx="110" cy="65" r="1.7" />
            <circle cx="120" cy="69" r="1.7" /><circle cx="130" cy="73" r="1.7" />
            <circle cx="97" cy="70" r="1.7" /><circle cx="107" cy="73" r="1.7" />
            <circle cx="117" cy="77" r="1.7" /><circle cx="127" cy="81" r="1.7" />
          </g>

          {/* LACES - criss-cross, gap closes with tension */}
          {(() => {
            const c = tension > 70 ? '#111111' : '#4A5D23';
            const e = tension * 0.04;   // back row moves down
            const f = tension * 0.04;   // front row moves up
            const L = (x1: number, y1: number, x2: number, y2: number, i: number) => (
              <motion.line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={c} strokeWidth="2.2" strokeLinecap="round"
                animate={{ x1, y1, x2, y2 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              />
            );
            return (
              <>
                {L(100, 62 + e, 98, 70 - f, 0)}
                {L(100, 62 + e, 107, 73 - f, 1)}
                {L(97, 70 - f, 110, 65 + e, 2)}
                {L(110, 65 + e, 117, 77 - f, 3)}
                {L(107, 73 - f, 120, 69 + e, 4)}
                {L(120, 69 + e, 127, 81 - f, 5)}
                {L(117, 77 - f, 130, 73 + e, 6)}
              </>
            );
          })()}

          {/* BOW KNOT */}
          <motion.g
            animate={{ y: -tension * 0.04, scale: 1 - tension * 0.0012 }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            style={{ transformOrigin: '101px 60px' }}
          >
            <motion.path
              d="M 101,60 C 93,52 82,50 78,57 C 75,63 84,68 96,63 Z"
              fill="none" stroke={tension > 70 ? '#111111' : '#4A5D23'} strokeWidth="2.2" strokeLinecap="round"
              animate={{ d: `M 101,60 C ${93 - tension * 0.03},${52 - tension * 0.04} ${82 - tension * 0.05},${50 - tension * 0.03} ${78 - tension * 0.04},${57 - tension * 0.02} C ${75 - tension * 0.03},${63 - tension * 0.02} ${84 - tension * 0.02},68 ${96 - tension * 0.01},63 Z` }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            />
            <motion.path
              d="M 101,60 C 109,52 120,50 124,57 C 127,63 118,68 106,63 Z"
              fill="none" stroke={tension > 70 ? '#111111' : '#4A5D23'} strokeWidth="2.2" strokeLinecap="round"
              animate={{ d: `M 101,60 C ${109 + tension * 0.03},${52 - tension * 0.04} ${120 + tension * 0.05},${50 - tension * 0.03} ${124 + tension * 0.04},${57 - tension * 0.02} C ${127 + tension * 0.03},${63 - tension * 0.02} ${118 + tension * 0.02},68 ${106 + tension * 0.01},63 Z` }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            />
            <circle cx="101" cy="60" r="2.4" fill={tension > 70 ? '#111111' : '#4A5D23'} />
            <motion.path d="M 99,62 Q 96,71 93,79" fill="none" stroke={tension > 70 ? '#111111' : '#4A5D23'} strokeWidth="1.6" strokeLinecap="round" animate={{ d: `M 99,62 Q ${96 - tension * 0.01},${71 + tension * 0.02} ${93 - tension * 0.02},${79 + tension * 0.03}` }} transition={{ type: 'spring', stiffness: 120, damping: 15 }} />
            <motion.path d="M 103,62 Q 106,71 109,79" fill="none" stroke={tension > 70 ? '#111111' : '#4A5D23'} strokeWidth="1.6" strokeLinecap="round" animate={{ d: `M 103,62 Q ${106 + tension * 0.01},${71 + tension * 0.02} ${109 + tension * 0.02},${79 + tension * 0.03}` }} transition={{ type: 'spring', stiffness: 120, damping: 15 }} />
          </motion.g>

          {/* Dynamic spec tags on hover */}
          <g opacity={hovered ? 1 : 0} className="transition-opacity duration-300">
            <line x1="48" y1="80" x2="26" y2="52" stroke="#111111" strokeWidth="0.6" strokeDasharray="2,2" />
            <text x="6" y="46" className="font-mono text-[6px]" fill="#111111">HEEL COUNTER</text>
            <line x1="196" y1="105" x2="220" y2="84" stroke="#111111" strokeWidth="0.6" strokeDasharray="2,2" />
            <text x="208" y="78" className="font-mono text-[6px]" fill="#111111">TOE CAP</text>
            <line x1="113" y1="60" x2="118" y2="30" stroke="#4A5D23" strokeWidth="0.6" strokeDasharray="2,2" />
            <text x="100" y="24" className="font-mono text-[6px]" fill="#4A5D23">LACE SYSTEM</text>
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
