
import React from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { FanTab } from '../FanApp';
import { motion } from 'motion/react';
import { MapPin, Utensils, Clock, ChevronRight, Info } from 'lucide-react';

interface MatchCenterProps {
  onNavigate: (tab: FanTab) => void;
}

export const MatchCenter: React.FC<MatchCenterProps> = ({ onNavigate }) => {
  const { match, amenities, activeScenario } = useMatchFlow();

  const recommendedAmenity = amenities.find(a => a.isRecommended);

  return (
    <div className="space-y-6 pb-8">
      {/* Live Score Card */}
      <motion.section 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0b193c] rounded-[2rem] p-6 text-white shadow-2xl shadow-primary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6 pt-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center p-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDSdBA-MjJGR1joF9Bhobj-Do0i_6_3g8D_iH0kAqZzKnYk06Hf-7-egAuXeVpwHlOGvrsfVEDm6EmgoR9mlKPXOZxmHKEhFyC675qflZEULlNI_FBIbVfV_M7iHtdLZb_PacPf1xXgrUKQz_jbevfI-pBPzNMN1xrxLZpxd9Y4CIf2COK1_F3IGMJtOrzL0sKPKWwmqMfnqDMcFl-Iylri1E6LSs3fREz8bNfjlNV-b397CFPme1xt9wEjzGYOm76Z3puxWqvYjY" alt="IND" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="font-headline font-bold text-sm tracking-wide">IND</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-1 opacity-70">{match.session}</div>
            <div className="text-4xl font-headline font-extrabold tracking-tighter">{match.score}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-1">{match.overs} OVERS</div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center p-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxCe_gkLmRySw0F8Qt8aqGCl84oWFNHb-q7x6tNrAMnrYiJeFns2ASjAuMVvqFIph4ykgaegeMfiVYzr3a9sfHWx2bIjgSFQjTEsB_HV-hGDrXltJt_ouBwnrLH9vkIrKcAWw3HWLUpQrC_8iHbvkb2g6kcq3WKm259oPdB6JGy-LvA_tYRjVcXJ6Q_mGfY_G_da_XWqo4-0WKN9KG6beXgk8mgyEtmKKKgzQIqyW7Vk1mXU2sveXBdKZeAdoviYSyyIPlneGxu2I" alt="AUS" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="font-headline font-bold text-sm tracking-wide">AUS</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-3 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-primary-container font-bold uppercase opacity-60">Batter</span>
            <span className="text-sm font-bold">V. Kohli* <span className="text-secondary-container">54(42)</span></span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-primary-container font-bold uppercase opacity-60">Bowler</span>
            <span className="text-sm font-bold">P. Cummins <span className="opacity-60">1/38</span></span>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Seat Card */}
        <div className="bg-white rounded-3xl p-5 flex flex-col justify-between shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <MapPin size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-outline">Your Seat</span>
          </div>
          <div>
            <div className="text-2xl font-headline font-extrabold text-primary">Row 12</div>
            <div className="text-xs font-bold text-on-surface-variant">North Stand • Block G</div>
          </div>
        </div>

        {/* Pro Tip / Scenario Card */}
        <div className="bg-secondary-container rounded-3xl p-5 flex flex-col justify-between shadow-lg shadow-secondary/20 relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-10 text-white">
            <Utensils size={80} />
          </div>
          <div className="z-10">
            <div className="text-[10px] font-black uppercase tracking-wider text-on-secondary-container/70 mb-2">Pro Tip</div>
            <p className="text-xs font-bold text-on-secondary-container leading-tight">
              {activeScenario === 'InningsBreak' 
                ? "Innings break in 5 mins: Order snacks now to skip the rush."
                : "Wicket surge detected: Expect high concourse traffic soon."}
            </p>
          </div>
          <button 
            onClick={() => onNavigate('Order')}
            className="mt-4 bg-on-secondary-container text-white text-[10px] font-bold uppercase py-2 px-4 rounded-xl w-fit z-10 hover:scale-105 transition-transform"
          >
            Pre-Order
          </button>
        </div>

        {/* Nearby Services */}
        <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10">
          <h3 className="font-headline font-bold text-primary mb-4 flex items-center gap-2">
            <Clock size={18} className="text-tertiary" />
            Nearby Services
          </h3>
          <div className="space-y-4">
            {amenities.slice(0, 2).map(amenity => (
              <div key={amenity.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container overflow-hidden">
                  {amenity.image ? (
                    <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <Info size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold">{amenity.name}</span>
                    <span className={`text-xs font-bold ${amenity.queueBand === 'Low' ? 'text-emerald-600' : 'text-secondary'}`}>
                      {amenity.queueBand === 'Low' ? 'Low Traffic' : `~${amenity.queueMinutes} min wait`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${amenity.queueBand === 'Low' ? 'bg-emerald-500' : 'bg-secondary'}`}
                      style={{ width: `${amenity.queueBand === 'Low' ? 20 : 70}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('Amenities')}
            className="mt-4 w-full py-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center gap-1"
          >
            See All Amenities <ChevronRight size={14} />
          </button>
        </div>

        {/* Map Preview */}
        <div className="col-span-2 relative h-48 rounded-[2rem] overflow-hidden shadow-sm group cursor-pointer" onClick={() => onNavigate('Route')}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbJ5yxoHEYDP_5jsjVHL2gqdsCLMgvBN0vBwcAZuQO6OcDSFcpRa5bZyPgnOFdiWX4B-qIb59Aivgyeki8T0D1TkrQl2fD0KWdrpjvlduBx-J6v7MurU-9KzaPn0Lir11FMkIbevAFLDfChIZLa9MYsKEBzxHtGipOuLCRFPue45vLAimIkJVXLMtjL_KZz1ulV8Tb59SpRlHH6Pdhg9NI2CC98nFx_ROBXpDLVKnj6ybV8IEgtY5mi2RDPK1DJ-v-sUk8BfB2qsg" 
            alt="Map" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase">Current Location</div>
              <div className="text-sm font-bold text-white">North Stand Entrance</div>
            </div>
            <div className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
              <MapPin size={14} />
              Explore Map
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
