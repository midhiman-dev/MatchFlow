
import React, { useState, useMemo } from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { calculateRoute, RouteResult } from '../../services/routingService';
import { motion } from 'motion/react';
import { Navigation, MapPin, Clock, Info, ArrowUp, CornerUpRight, CheckCircle2, Layers, LocateFixed } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const RouteGuidance: React.FC = () => {
  const { fanLocation, zones, paths, emergencyActive, connectivity, lastSyncTime } = useMatchFlow();
  const [destinationId, setDestinationId] = useState<string>('z8'); // Default to Gate B
  const [isWalking, setIsWalking] = useState(false);

  const route = useMemo(() => 
    calculateRoute(fanLocation, destinationId, zones, paths, emergencyActive ? 'Emergency' : 'Normal'),
    [fanLocation, destinationId, zones, paths, emergencyActive]
  );

  const destinationZone = zones.find(z => z.id === destinationId);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="uppercase tracking-widest text-secondary font-bold text-[10px]">Active Guidance</span>
          <h1 className="text-4xl font-extrabold text-primary leading-tight mt-1">Route to {destinationZone?.name}</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col min-w-[100px]">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Arrival</span>
            <span className="text-2xl font-bold text-primary">{route.totalTime} mins</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col min-w-[100px]">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full animate-pulse",
                route.status === 'Clear' ? "bg-emerald-500" : route.status === 'Congested' ? "bg-amber-500" : "bg-error"
              )} />
              <span className={cn(
                "text-2xl font-bold",
                route.status === 'Clear' ? "text-emerald-600" : route.status === 'Congested' ? "text-amber-600" : "text-error"
              )}>{route.status}</span>
            </div>
          </div>
        </div>
      </div>
      
      {connectivity === 'Offline' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 text-slate-700">
          <Clock size={20} />
          <p className="text-xs font-bold">Showing cached routing data. Path congestion metrics from {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>
        </div>
      )}

      {/* Map HUD */}
      <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-primary rounded-2xl overflow-hidden shadow-2xl group">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoVpCKvZwukRz6AaVje6d9kd6PULxH_p_tH2_FxxgyWrSpPRm3SdnyLopsLa-YcK5TaWU9T7DXoa1yEN_agyHzMFI7AepXKH8jRg82Jfhe53xs11l--N2Me3wYXEDkxXBpdyfMRBdcaAu1Wdaq9itxjVd2OOHGFtI_V7UG3H-__-e-YfqSKFhwKnpOT6YkOob9bNmcEpsaGHTxIlJevb0y5IiDHNcvbK2lNcWBkqzNAPXlzSM7pHSnUQ6sUTCgarvc0qBX4YjB0g8" 
          alt="Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="bg-primary/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Current Location</p>
              <p className="text-white font-semibold">{zones.find(z => z.id === fanLocation)?.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="pointer-events-auto bg-white/10 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                <LocateFixed size={18} />
              </button>
              <button className="pointer-events-auto bg-white/10 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                <Layers size={18} />
              </button>
            </div>
          </div>
          
          <div className="w-full flex items-center justify-center">
            <button 
              onClick={() => setIsWalking(!isWalking)}
              className={cn(
                "pointer-events-auto px-8 py-4 rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center gap-4 group",
                isWalking ? "bg-emerald-500 text-white" : "bg-secondary-container text-on-secondary-container"
              )}
            >
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg">{isWalking ? 'Walking Active' : 'Start Walking'}</span>
                <span className="text-xs opacity-80">Voice guidance active</span>
              </div>
              <Navigation size={28} className={cn("transition-transform", isWalking ? "animate-bounce" : "group-hover:translate-x-1")} />
            </button>
          </div>
        </div>
      </div>

      {/* Directions List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-primary px-2">Step-by-Step Directions</h3>
          {route.steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "bg-white p-6 rounded-2xl shadow-sm flex items-start gap-5 border-l-4",
                i === 0 ? "border-primary" : "border-outline-variant/30 opacity-60"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                i === 0 ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant"
              )}>
                {i === 0 ? <CornerUpRight size={24} /> : <ArrowUp size={24} />}
              </div>
              <div className="flex-1">
                <p className={cn("text-lg font-bold", i === 0 ? "text-primary" : "text-on-surface-variant")}>
                  {step.instruction}
                </p>
                <p className="text-on-surface-variant text-sm mt-1">Follow the floor markers for {step.distance} meters.</p>
              </div>
              <span className="text-on-surface-variant font-mono text-sm">{step.distance}m</span>
            </motion.div>
          ))}
        </div>

        {/* Alternatives */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-primary px-2">Alternative</h3>
          <div className="bg-surface-container p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/20 h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-bold uppercase text-on-surface-variant">Scenic Route</span>
                <span className="text-primary font-bold text-sm">8 mins</span>
              </div>
              <p className="font-bold text-primary">Outer Concourse Path</p>
              <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">Avoid the central hub congestion. Lower crowd density (82% less traffic).</p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/4" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-emerald-600 uppercase">
                <span>Very Low Crowd</span>
                <span>Optimal</span>
              </div>
              <button className="mt-2 w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm">
                Switch to Alternative
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
