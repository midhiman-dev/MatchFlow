
import React from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { motion } from 'motion/react';
import { AlertTriangle, Navigation, Phone, ShieldAlert, ArrowRight } from 'lucide-react';

export const EmergencyView: React.FC = () => {
  const { alerts, fanLocation, zones, currentEmergency } = useMatchFlow();
  const emergencyAlert = alerts.find(a => a.type === 'Emergency');
  const currentZone = zones.find(z => z.id === fanLocation);

  return (
    <div className="min-h-screen bg-error text-white p-6 flex flex-col">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-error shadow-2xl animate-pulse">
          <AlertTriangle size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-black tracking-tighter uppercase">Emergency Active</h1>
          <p className="text-xl font-bold opacity-90">Please follow directed evacuation routes immediately.</p>
        </div>

        {(currentEmergency.active || emergencyAlert) && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-full max-w-md text-left">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Official Instruction</span>
            </div>
            <p className="text-lg font-bold leading-tight">
              {currentEmergency.active ? currentEmergency.message : emergencyAlert?.message}
            </p>
          </div>
        )}

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white text-error rounded-3xl p-6 flex items-center justify-between shadow-xl">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Exit Gate</p>
              <p className="text-3xl font-headline font-black">GATE D</p>
              <p className="text-xs font-bold">Via South Concourse</p>
            </div>
            <div className="bg-error text-white p-4 rounded-2xl">
              <Navigation size={32} className="rotate-45" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Phone size={24} />
              <span className="text-[10px] font-bold uppercase">SOS Call</span>
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
              <ShieldAlert size={24} />
              <span className="text-[10px] font-bold uppercase">First Aid</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 pb-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">
          <span>Current Location: {currentZone?.name}</span>
          <span>Emergency Cache: Active</span>
        </div>
        <button className="w-full bg-white text-error py-4 rounded-2xl font-headline font-black text-xl flex items-center justify-center gap-2 shadow-xl">
          Start Evacuation Route <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};
