import React from 'react';

export default function AtelierDiagram() {
  return (
    <svg viewBox="0 0 640 560" className="h-full w-full" role="img" aria-label="Abstract garment construction diagram">
      <rect width="640" height="560" fill="#eeece6" />
      <g stroke="#c8c2b7" strokeWidth="1">
        {Array.from({ length: 15 }).map((_, index) => <line key={`v-${index}`} x1={index * 48} x2={index * 48} y1="0" y2="560" />)}
        {Array.from({ length: 13 }).map((_, index) => <line key={`h-${index}`} x1="0" x2="640" y1={index * 48} y2={index * 48} />)}
      </g>
      <g fill="none" stroke="#151515" strokeLinecap="round" strokeLinejoin="round">
        <path d="M213 119c31-21 61-32 107-32s76 11 107 32l49 55-53 55-31-28v245H248V201l-31 28-53-55 49-55Z" fill="#f9f8f4" strokeWidth="4" />
        <path d="M273 94c6 34 24 51 47 51s41-17 47-51" strokeWidth="3" />
        <path d="M320 146v300M248 248h144M248 354h144" stroke="#4b5f34" strokeDasharray="8 8" strokeWidth="2" />
        <path d="M217 229 164 174M423 229l53-55" strokeWidth="2" />
        <circle cx="320" cy="238" r="5" fill="#151515" />
        <circle cx="320" cy="278" r="5" fill="#151515" />
        <circle cx="320" cy="318" r="5" fill="#151515" />
      </g>
      <g fill="#5d5b56" fontFamily="Inter, sans-serif" fontSize="12">
        <text x="70" y="163">01 / SHOULDER LINE</text><text x="438" y="336">02 / BALANCE POINT</text><text x="72" y="421">03 / HEM WEIGHT</text>
      </g>
      <g stroke="#4b5f34" strokeWidth="2"><path d="M179 159h-58"/><path d="M392 331h80"/><path d="M248 416H122"/></g>
    </svg>
  );
}
