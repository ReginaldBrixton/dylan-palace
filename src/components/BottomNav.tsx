import React from 'react';
import { Shirt, Briefcase, Footprints, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  currentCategory: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS';
  onSelectCategory: (category: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS') => void;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, currentCategory, onSelectCategory, onNavigate }: BottomNavProps) {
  const handleTabClick = (category: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS') => {
    onSelectCategory(category);
    onNavigate('plp');
  };

  const isPlpActive = currentScreen === 'plp';

  const NavItem = ({ 
    category, 
    label, 
    Icon 
  }: { 
    category: 'SHIRTS' | 'TROUSERS' | 'SHOES' | 'BAGS', 
    label: string, 
    Icon: any 
  }) => {
    const isActive = isPlpActive && currentCategory === category;
    
    return (
      <button
        id={`nav-tab-${category.toLowerCase()}`}
        onClick={() => handleTabClick(category)}
        className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-all duration-300 relative cursor-pointer ${
          isActive
            ? 'text-[#111111] font-bold'
            : 'text-[#8B8B8A] hover:text-[#555555]'
        }`}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute top-0 w-8 h-[3px] bg-[#111111] rounded-b-md shadow-[0_0_8px_rgba(17,17,17,0.5)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
        
        <motion.div
          animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative z-10 drop-shadow-sm"
        >
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        </motion.div>
        
        <span className={`text-[9px] tracking-wider uppercase mt-1 transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'font-semibold opacity-80'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[72px] pb-2 z-50 bg-white/80 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-[#E5E5E5]/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] flex justify-around items-center px-2 select-none supports-[backdrop-filter]:bg-white/60">
      <NavItem category="SHIRTS" label="SHIRTS" Icon={Shirt} />
      <NavItem category="TROUSERS" label="TROUSERS" Icon={Layers} />
      <NavItem category="BAGS" label="BAGS" Icon={Briefcase} />
      <NavItem category="SHOES" label="SHOES" Icon={Footprints} />
    </nav>
  );
}
