/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { cn } from '../utils/cn';

export const EmergencyBanner: React.FC = () => {
  const { currentEmergency, activeClosures } = useMatchFlow();
  
  const hasIncident = currentEmergency.active || activeClosures.length > 0;
  
  if (!hasIncident) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] p-4 flex items-center justify-between shadow-lg backdrop-blur-md border-b",
          currentEmergency.active 
            ? "bg-error text-white border-white/20" 
            : "bg-amber-500 text-slate-900 border-amber-600/20"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <AlertTriangle size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {currentEmergency.active ? 'Emergency Mode Active' : 'Operational Closure'}
            </span>
            <span className="font-bold text-sm line-clamp-1">
              {currentEmergency.message || (activeClosures.length > 0 ? `${activeClosures.length} area(s) closed` : 'Incident in progress')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentEmergency.active && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Live Update
            </div>
          )}
          <ChevronRight className="opacity-60" size={20} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
