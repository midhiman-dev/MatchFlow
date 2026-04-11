
import React from 'react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Users, MapPin, CheckCircle2, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const StewardApp: React.FC = () => {
  const { emergencyActive, alerts, zones, activeClosures, currentEmergency } = useMatchFlow();
  const emergencyAlert = alerts.find(a => a.type === 'Emergency');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-on-error flex items-center justify-center text-error shadow-lg shadow-error/20">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold tracking-tight">Steward View</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector North-West • ID 429</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </header>

      {(emergencyActive || activeClosures.length > 0) ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "rounded-3xl p-6 space-y-6 shadow-2xl transition-colors duration-500",
            emergencyActive ? "bg-error shadow-error/20" : "bg-amber-500 text-slate-900 shadow-amber-500/20"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={32} />
              <h2 className="text-2xl font-headline font-black uppercase tracking-tight">Instruction</h2>
            </div>
            <span className="text-[10px] font-black opacity-60">
              {new Date(currentEmergency.updatedAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="bg-black/10 rounded-2xl p-5 border border-white/10">
            <p className="text-xl font-bold leading-tight italic">
              "{currentEmergency.active ? currentEmergency.message : `${activeClosures.length} Operational Closures Active`}"
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Closures</p>
            {activeClosures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeClosures.map(c => (
                  <div key={c.targetId} className="bg-black/20 px-3 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                    <MapPin size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">{zones.find(z => z.id === c.targetId)?.name || c.targetId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium opacity-80">No specific area closures reported.</p>
            )}
          </div>

          <button 
            onClick={() => alert('Instruction Acknowledged')}
            className={cn(
              "w-full py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all",
              emergencyActive ? "bg-white text-error" : "bg-slate-900 text-white"
            )}
          >
            ACKNOWLEDGE ORDER
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <section className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Current Post</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-amber-500">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-2xl font-bold">North Concourse</p>
                <p className="text-sm text-slate-400">Sector 4 • Level 1</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
              <Users className="text-blue-400 mb-2" size={24} />
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Density</p>
              <p className="text-2xl font-bold">84%</p>
            </div>
            <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
              <RefreshCw className="text-emerald-400 mb-2" size={24} />
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Flow Rate</p>
              <p className="text-2xl font-bold">50/min</p>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2">Recent Alerts</h2>
            {alerts.slice(0, 2).map(alert => (
              <div key={alert.id} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div>
                  <p className="font-bold text-sm">{alert.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4 flex justify-around items-center">
        <button className="flex flex-col items-center gap-1 text-amber-500">
          <Shield size={20} />
          <span className="text-[10px] font-bold uppercase">Status</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <Users size={20} />
          <span className="text-[10px] font-bold uppercase">Crowd</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <RefreshCw size={20} />
          <span className="text-[10px] font-bold uppercase">Sync</span>
        </button>
      </nav>
    </div>
  );
};
