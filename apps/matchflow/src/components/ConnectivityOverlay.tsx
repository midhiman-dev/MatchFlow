
import React from 'react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, SignalHigh, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ConnectivityOverlay: React.FC = () => {
  const { connectivity, lastSyncTime } = useMatchFlow();

  const isVisible = connectivity !== 'Connected';
  const isOffline = connectivity === 'Offline';

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[72px] left-0 right-0 z-30 px-4 pointer-events-none"
        >
          <div className={cn(
            "max-w-md mx-auto rounded-2xl p-4 shadow-lg border backdrop-blur-md pointer-events-auto",
            isOffline 
              ? "bg-slate-900/90 border-slate-700 text-slate-100" 
              : "bg-amber-50/90 border-amber-200 text-amber-900"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-xl",
                isOffline ? "bg-slate-800" : "bg-amber-100"
              )}>
                {isOffline ? (
                  <WifiOff className="w-5 h-5 text-slate-400" />
                ) : (
                  <SignalHigh className="w-5 h-5 text-amber-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm">
                    {isOffline ? 'Working Offline' : 'Weak Connection'}
                  </h3>
                  <span className="text-[10px] opacity-70 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Last updated {formatTime(lastSyncTime)}
                  </span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed italic">
                  {isOffline 
                    ? "Providing emergency info & cached routes. Some features may be limited." 
                    : "Data may be slow to refresh. We'll keep trying in the background."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
