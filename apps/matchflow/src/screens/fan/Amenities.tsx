
import React, { useState } from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { FanTab } from '../FanApp';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Droplets, HeartPulse, ShoppingBag, Navigation, Clock, CheckCircle2, ChevronRight, Info, AlertCircle, ShoppingCart } from 'lucide-react';
import { selectNearbyAmenitiesWithLiveState, selectRecommendedAmenity, EnhancedAmenity } from '../../domain/live/amenitySelectors';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to format relative time
// Utility to format relative time
const formatRelativeTime = (timestamp?: number) => {
  if (!timestamp) return 'No historical data';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
};

interface AmenitiesProps {
  onNavigate: (tab: FanTab) => void;
}

export const Amenities: React.FC<AmenitiesProps> = ({ onNavigate }) => {
  const { amenities, amenityLiveStates, connectivity } = useMatchFlow();
  const [filter, setFilter] = useState<'All' | 'Food' | 'Washroom' | 'FirstAid'>('All');
  const [selectedAmenity, setSelectedAmenity] = useState<EnhancedAmenity | null>(null);

  const isOffline = connectivity === 'Offline';

  const enhancedAmenities = selectNearbyAmenitiesWithLiveState(amenities, amenityLiveStates);
  
  // Get recommendations for active categories
  const recommendedFood = selectRecommendedAmenity(enhancedAmenities, 'Food');
  const recommendedWashroom = selectRecommendedAmenity(enhancedAmenities, 'Washroom');
  
  const currentRecommendation = filter === 'Food' ? recommendedFood : 
                               filter === 'Washroom' ? recommendedWashroom : 
                               (recommendedFood || recommendedWashroom);

  const filteredAmenities = enhancedAmenities.filter(a => filter === 'All' || a.type === filter);

  const filterButtons = [
    { id: 'All', label: 'All', icon: null },
    { id: 'Food', label: 'Food & Drinks', icon: Utensils },
    { id: 'Washroom', label: 'Washrooms', icon: Droplets },
    { id: 'FirstAid', label: 'First Aid', icon: HeartPulse },
  ] as const;

  return (
    <div className="space-y-6 pb-24 relative min-h-full">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight mb-2">Nearby Amenities</h1>
        <p className="text-on-surface-variant text-sm font-medium">Real-time occupancy and walk-times from your stand.</p>
      </div>

      {/* Recommended Highlight Section */}
      <AnimatePresence>
        {currentRecommendation && filter !== 'FirstAid' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary-container/30 border-2 border-secondary/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
            onClick={() => setSelectedAmenity(currentRecommendation)}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 size={80} className="text-secondary" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Best Bet</span>
              <span className="text-secondary font-bold text-xs">{currentRecommendation.recommendationReason}</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-headline font-black text-primary leading-tight mb-1">{currentRecommendation.name}</h3>
                <div className="flex items-center gap-3 text-sm font-bold text-on-surface-variant">
                  <span className="flex items-center gap-1 text-tertiary">
                    <Navigation size={14} className="rotate-45" /> {currentRecommendation.walkMinutes}m walk
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Clock size={14} /> {currentRecommendation.liveQueueMinutes}m wait
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onNavigate('Route'); }}
                  className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <Navigation size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {filterButtons.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id as any)}
            className={cn(
              "flex-shrink-0 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all border",
              filter === id 
                ? "bg-primary text-white shadow-md border-primary" 
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant border-transparent"
            )}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* Amenities List */}
      <div className="space-y-4">
        {filteredAmenities.map((amenity, index) => {
          const liveState = amenityLiveStates[amenity.id];
          return (
            <motion.div
              key={amenity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAmenity(amenity)}
              className={cn(
                "group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 transition-all hover:shadow-md cursor-pointer",
                amenity.isRecommended && !amenity.isStale && "border-l-4 border-secondary",
                amenity.isStale && "stale-filter"
              )}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high flex-shrink-0 overflow-hidden relative">
                    {amenity.image ? (
                      <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40">
                        {amenity.type === 'Washroom' ? <Droplets size={24} /> : <HeartPulse size={24} />}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline font-bold text-lg text-primary">{amenity.name}</h3>
                      {amenity.isRecommended && (
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Recommended</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-1 text-tertiary">
                        <Navigation size={12} className="rotate-45" />
                        {amenity.walkMinutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatRelativeTime(amenity.liveUpdatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-surface-variant font-headline">
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Wait Time</span>
                    <div className={cn(
                      "flex items-center gap-1.5 font-black text-xl leading-none",
                      amenity.liveStatus === 'low' || amenity.liveStatus === 'Low' ? "text-emerald-500" : 
                      amenity.liveStatus === 'critical' || amenity.liveStatus === 'Critical' ? "text-error" : 
                      amenity.liveStatus === 'high' || amenity.liveStatus === 'High' ? "text-secondary" : "text-amber-500"
                    )}>
                      {amenity.liveQueueMinutes !== undefined ? `${amenity.liveQueueMinutes}m` : (
                        <span className="text-sm opacity-80 uppercase tracking-tighter">{amenity.liveStatus}</span>
                      )}
                      <div className="flex gap-0.5 ml-1">
                        <div className={cn("w-1 h-3 rounded-full", (amenity.liveStatus as string).toLowerCase() !== 'low' ? "bg-primary/20" : "bg-emerald-500")} />
                        <div className={cn("w-1 h-3 rounded-full", ['moderate', 'high', 'critical'].includes((amenity.liveStatus as string).toLowerCase()) ? "bg-amber-500" : "bg-primary/20")} />
                        <div className={cn("w-1 h-3 rounded-full", ['high', 'critical'].includes((amenity.liveStatus as string).toLowerCase()) ? "bg-secondary" : "bg-primary/20")} />
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-outline-variant" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation Detail Overlay */}
      <AnimatePresence>
        {selectedAmenity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAmenity(null)}
          >
            <motion.div
              initial={{ y: 100, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.9 }}
              className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-48 bg-surface-container relative">
                {selectedAmenity.image ? (
                  <img src={selectedAmenity.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/10">
                    {selectedAmenity.type === 'Washroom' ? <Droplets size={64} /> : <Utensils size={64} />}
                  </div>
                )}
                <button 
                  onClick={() => setSelectedAmenity(null)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight size={24} className="rotate-90" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-secondary font-black text-[10px] uppercase tracking-widest mb-2 block">{selectedAmenity.type}</span>
                    <h2 className="text-3xl font-headline font-black text-primary tracking-tight leading-none">{selectedAmenity.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Queue Status</p>
                    <p className={cn(
                      "text-2xl font-black font-headline capitalize leading-none",
                      (selectedAmenity.liveStatus as string).toLowerCase() === 'low' ? "text-emerald-500" : "text-amber-500"
                    )}>
                      {selectedAmenity.liveStatus}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Walk Time</p>
                    <p className="text-xl font-black text-primary font-headline">{selectedAmenity.walkMinutes} mins</p>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Queue Time</p>
                    <p className="text-xl font-black text-primary font-headline">
                      {selectedAmenity.liveQueueMinutes !== undefined ? `${selectedAmenity.liveQueueMinutes} mins` : 'Wait-only'}
                    </p>
                  </div>
                </div>

                {selectedAmenity.stalenessLevel === 'Stale' && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800">
                    <AlertCircle size={20} />
                    <p className="text-xs font-bold">Data is stale. Showing occupancy band instead of exact minutes.</p>
                  </div>
                )}

                {selectedAmenity.stalenessLevel === 'Historical' && (
                  <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-800">
                    <Clock size={20} />
                    <p className="text-xs font-bold">Showing historical data. Connection weak or lost.</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button 
                    onClick={() => onNavigate('Route')}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Navigation size={18} />
                    Start Guided Route
                  </button>
                  {selectedAmenity.type === 'Food' && (
                    <button 
                      onClick={() => onNavigate('Order')}
                      className="w-full bg-secondary-container text-on-secondary-container py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-secondary/10 transition-colors"
                    >
                      <ShoppingCart size={18} />
                      Order Snapshots In-Seat
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap CTA */}
      <div className="bg-primary-container/10 border border-primary-container/20 rounded-2xl p-6 mt-8 flex items-center gap-6">
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white shadow-lg">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtipfrbL9zxS9esjHEZxnkumrq9aJadtx_s3Bsu6A-rfOMXRksOctLrk5m5C_bZvlxwi51gjrcSYE0tCvPve0HOt7rcrweozKuDAWyLcXhiv_2vAgasGgqXGaZUpVfp_feVkNZwwOLzWu_aVsi70kb0rrK0ZKAVqsa3ljA9wgNnYWGFX-vvLKkcRureuxdcDEnChJO42ZbtS-AzwlmbtkPi2jdBjfn0FhDwRCduxB8wbBgengh4ZqgGXQKWQiqgVLQsjlzb52poEA" alt="Heatmap" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h4 className="font-headline font-bold text-primary mb-1">Stadia Heatmap View</h4>
          <p className="text-on-surface-variant text-xs mb-3">Visualize crowd density and live movement paths.</p>
          <button className="text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline">
            Open Map View <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
