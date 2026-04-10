
import React from 'react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { cn } from '../utils/cn';

export const FanHeader: React.FC = () => {
  const { connectivity } = useMatchFlow();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWxvsu7l99mkF3J9KGQW0sJdrlEUbFpw3GeTS83-GiYwF33kaM-VRtkW7pdBlsAxsCIaEovaAVLRgLEi2n9wOLYV6TGT5WEo_Ry7FRrzb8E45S2LkkmXDuxqbjrkAofTNhVXV9iNLzzGuseRoruP2VEXFY_VN1ZB2vffOARhwThRAiJRkOA5cVke34wAH2MrSEJgcF5W8e_0KjedXhTp_poA_Qa1IiXHZaTCXRURHvXrXz8S2K8dk4IsBXQadhdOJ5Of4qfEpFJec" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-xl font-headline font-bold tracking-tighter text-primary">MatchFlow</h1>
      </div>
      
      <div className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
        connectivity === 'Connected' ? "bg-tertiary-fixed text-on-tertiary-fixed" : 
        connectivity === 'Weak' ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
      )}>
        <span className={cn(
          "w-2 h-2 rounded-full",
          connectivity === 'Connected' ? "bg-tertiary animate-pulse" : 
          connectivity === 'Weak' ? "bg-amber-500" : "bg-slate-400"
        )} />
        {connectivity}
      </div>
    </header>
  );
};
