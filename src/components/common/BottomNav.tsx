import React from 'react';
import { Shirt, Briefcase, Footprints, Layers } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function BottomNav() {
  const NavItem = ({
    to,
    label,
    Icon
  }: {
    to: string,
    label: string,
    Icon: any
  }) => {
    return (
      <NavLink
        to={to}
        id={`nav-tab-${label.toLowerCase()}`}
        className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full pt-1 transition-all duration-300 relative cursor-pointer ${isActive
          ? 'text-[#111111] font-bold'
          : 'text-[#8B8B8A] hover:text-[#555555]'
          }`}
      >
        {({ isActive }) => (
          <>
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
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 drop-shadow-sm"
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>

            <span className={`text-[9px] tracking-wider uppercase mt-1 transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'font-semibold opacity-80'}`}>
              {label}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[72px] pb-2 z-50 bg-white/80 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-[#E5E5E5]/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] flex justify-around items-center px-2 select-none supports-[backdrop-filter]:bg-white/60">
      <NavItem to="/shirts" label="SHIRTS" Icon={Shirt} />
      <NavItem to="/trousers" label="TROUSERS" Icon={Layers} />
      <NavItem to="/bags" label="BAGS" Icon={Briefcase} />
      <NavItem to="/shoes" label="SHOES" Icon={Footprints} />
    </nav>
  );
}
