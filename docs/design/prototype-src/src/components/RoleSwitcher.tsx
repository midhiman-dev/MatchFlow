
import React from 'react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, connectivity, setConnectivity, resetState } = useMatchFlow();

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
      <div className="bg-white/80 backdrop-blur-md border border-outline-variant/20 rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
        {(['Fan', 'Operator', 'Steward'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
              role === r ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-surface-variant/50"
            )}
          >
            {r}
          </button>
        ))}
        <div className="w-px h-4 bg-outline-variant/30 mx-1" />
        <button
          onClick={resetState}
          className="p-1.5 rounded-full text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
          title="Reset Demo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
      
      <div className="bg-white/80 backdrop-blur-md border border-outline-variant/20 rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
        {(['Connected', 'Weak', 'Offline'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setConnectivity(c)}
            className={cn(
              "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tight transition-all",
              connectivity === c 
                ? (c === 'Connected' ? "bg-emerald-500 text-white" : c === 'Weak' ? "bg-amber-500 text-white" : "bg-slate-500 text-white")
                : "text-on-surface-variant hover:bg-surface-variant/50"
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};
