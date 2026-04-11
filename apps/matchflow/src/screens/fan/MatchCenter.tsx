
import React from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { FanTab } from '../FanApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Utensils, 
  Clock, 
  ChevronRight, 
  Info, 
  Zap, 
  ShoppingBag, 
  Navigation, 
  ShieldAlert,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { selectNearbyAmenitiesWithLiveState } from '../../domain/live/amenitySelectors';

interface MatchCenterProps {
  onNavigate: (tab: FanTab) => void;
}

export const MatchCenter: React.FC<MatchCenterProps> = ({ onNavigate }) => {
  const { match, amenities, amenityLiveStates, activeScenario, connectivity, lastSyncTime } = useMatchFlow();

  const isOffline = connectivity === 'Offline';

  const isOffline = connectivity === 'Offline';
  const isWeak = connectivity === 'Weak';

  const enhancedAmenities = selectNearbyAmenitiesWithLiveState(amenities, amenityLiveStates);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Live Score Card */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "bg-[#0b193c] rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden transition-all duration-500",
          isOffline && "opacity-90 grayscale-[0.2]"
        )}
      >
        <div className="absolute top-0 right-0 p-5">
          {isOffline ? (
            <div className="bg-white/10 backdrop-blur-md text-white/70 px-3 py-1.5 rounded-full text-[10px] font-black tracking-tighter flex items-center gap-1.5">
              <WifiOff size={12} />
              CACHED
            </div>
          ) : (
            <div className="bg-secondary text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 ring-4 ring-white/5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-8 pt-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center p-3 shadow-inner">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDSdBA-MjJGR1joF9Bhobj-Do0i_6_3g8D_iH0kAqZzKnYk06Hf-7-egAuXeVpwHlOGvrsfVEDm6EmgoR9mlKPXOZxmHKEhFyC675qflZEULlNI_FBIbVfV_M7iHtdLZb_PacPf1xXgrUKQz_jbevfI-pBPzNMN1xrxLZpxd9Y4CIf2COK1_F3IGMJtOrzL0sKPKWwmqMfnqDMcFl-Iylri1E6LSs3fREz8bNfjlNV-b397CFPme1xt9wEjzGYOm76Z3puxWqvYjY" alt="IND" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="font-headline font-bold text-sm tracking-widest">IND</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">{match.session}</div>
            <div className="text-5xl font-headline font-black tracking-tighter leading-none mb-2">{match.score}</div>
            <div className="text-[10px] opacity-60 font-black tracking-widest">{match.overs} OVERS</div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center p-3 shadow-inner">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxCe_gkLmRySw0F8Qt8aqGCl84oWFNHb-q7x6tNrAMnrYiJeFns2ASjAuMVvqFIph4ykgaegeMfiVYzr3a9sfHWx2bIjgSFQjTEsB_HV-hGDrXltJt_ouBwnrLH9vkIrKcAWw3HWLUpQrC_8iHbvkb2g6kcq3WKm259oPdB6JGy-LvA_tYRjVcXJ6Q_mGfY_G_da_XWqo4-0WKN9KG6beXgk8mgyEtmKKKgzQIqyW7Vk1mXU2sveXBdKZeAdoviYSyyIPlneGxu2I" alt="AUS" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="font-headline font-bold text-sm tracking-widest">AUS</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/5">
          <div className="bg-white/5 p-3 flex flex-col items-center backdrop-blur-sm">
            <span className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">On Strike</span>
            <span className="text-sm font-bold">V. Kohli <span className="text-secondary">54*</span></span>
          </div>
          <div className="bg-white/5 p-3 flex flex-col items-center backdrop-blur-sm border-l border-white/10">
            <span className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Bowling</span>
            <span className="text-sm font-bold">P. Cummins <span className="opacity-60">1/38</span></span>
          </div>
        </div>

        {isOffline && (
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
            <RefreshCw size={10} className="animate-spin-slow" />
            Last synced {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </motion.section>

      {/* 2. Smart Prompt area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeScenario}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="bg-primary/5 border border-primary/10 rounded-[2rem] p-5 flex items-start gap-4 relative overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
            <Zap size={20} fill="currentColor" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary/60">MatchFlow AI</h3>
            <p className="text-sm font-bold text-primary leading-tight">
              {activeScenario === 'InningsBreak' 
                ? "Innings break in 5 mins. Concourse traffic is expected to spike soon. Order snacks now?"
                : activeScenario === 'WicketSurge'
                ? "Wicket surge detected! Avoid Stand North corridors for a smoother route."
                : activeScenario === 'DRSSpike'
                ? "DRS Review in progress. Use this 2-minute window to grab refreshments!"
                : activeScenario === 'ExitRush'
                ? "Match ending. Exit Gates A and B are currently clearest. Follow safety markers."
                : activeScenario === 'Emergency'
                ? "EMERGENCY: Path blocked in South Concourse. Follow redirected route to Gate D."
                : "Match is in progress. Perfect time to grab snacks with zero wait time at most stalls."}
            </p>
          </div>
          <ChevronRight size={18} className="text-primary/30 mt-1" />
        </motion.div>
      </AnimatePresence>

      {/* 3. Quick Actions Grid */}
      <section className="grid grid-cols-4 gap-3">
        {[
          { label: 'Map', icon: Navigation, tab: 'Route', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Order', icon: ShoppingBag, tab: 'Order', color: 'bg-rose-50 text-rose-600' },
          { label: 'Find', icon: MapPin, tab: 'Amenities', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Help', icon: ShieldAlert, tab: 'Alerts', color: 'bg-amber-50 text-amber-600' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.tab as FanTab)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={cn(
              "w-full aspect-square rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-sm",
              action.color
            )}>
              <action.icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant transition-colors group-hover:text-primary">
              {action.label}
            </span>
          </button>
        ))}
      </section>

      {/* 4. Seat & Location Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-outline">Your Seat</div>
            <div className="text-sm font-black text-primary">Row 12, Block G</div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-secondary/5 text-secondary flex items-center justify-center">
            <Info size={20} />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-outline">Stand</div>
            <div className="text-sm font-black text-secondary">North Stand</div>
          </div>
        </div>
      </div>

      {/* 5. Top Nearby Queue Snapshot */}
      <section className={cn(
        "bg-white rounded-[2.5rem] p-6 shadow-sm border border-outline-variant/20 relative",
        isOffline && "opacity-95"
      )}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h3 className="font-headline font-black text-primary uppercase tracking-widest text-xs flex items-center gap-2">
              <Clock size={16} className="text-tertiary" />
              Nearby Queues
            </h3>
            {isOffline && (
              <span className="text-[8px] font-black text-outline italic ml-6">Data from {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          <button 
            onClick={() => onNavigate('Amenities')}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary flex items-center gap-1",
              isOffline && "opacity-50"
            )}
          >
            Manage <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-5">
          {enhancedAmenities.slice(0, 3).map((amenity, idx) => (
            <div key={amenity.id} className={cn("group cursor-pointer", amenity.isStale && "stale-filter")}>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-surface-container overflow-hidden ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
                  {amenity.image ? (
                    <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <Info size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-black text-primary">{amenity.name}</span>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                        isOffline ? "bg-slate-100 text-slate-500" :
                        amenity.liveStatus === 'low' || amenity.liveStatus === 'Low' ? 'bg-emerald-100 text-emerald-700' : 
                        amenity.liveStatus === 'moderate' || amenity.liveStatus === 'Moderate' ? 'bg-amber-100 text-amber-700' : 
                        'bg-rose-100 text-rose-700'
                      )}>
                        {isOffline ? 'OFFLINE' : (amenity.liveStatus as string).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(amenity.liveStatus as string).toLowerCase() === 'low' ? 20 : (amenity.liveStatus as string).toLowerCase() === 'moderate' ? 55 : 90}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          isOffline ? "bg-slate-300" :
                          (amenity.liveStatus as string).toLowerCase() === 'low' ? 'bg-emerald-500' : 
                          (amenity.liveStatus as string).toLowerCase() === 'moderate' ? 'bg-amber-500' : 'bg-rose-500'
                        )}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant w-14 text-right">
                      {amenity.liveQueueMinutes !== undefined ? `${amenity.liveQueueMinutes}m` : 'BAND'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
