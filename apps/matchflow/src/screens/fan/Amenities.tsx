
import React, { useState } from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { FanTab } from '../FanApp';
import { motion } from 'motion/react';
import { Utensils, Droplets, HeartPulse, ShoppingBag, Navigation, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { selectNearbyAmenitiesWithLiveState, selectRecommendedAmenity } from '../../domain/live/amenitySelectors';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AmenitiesProps {
  onNavigate: (tab: FanTab) => void;
}

export const Amenities: React.FC<AmenitiesProps> = ({ onNavigate }) => {
  const { amenities, amenityLiveStates } = useMatchFlow();
  const [filter, setFilter] = useState<'All' | 'Food' | 'Washroom' | 'FirstAid'>('All');

  const enhancedAmenities = selectNearbyAmenitiesWithLiveState(amenityLiveStates ? amenities : amenities, amenityLiveStates);
  const recommendedFood = selectRecommendedAmenity(enhancedAmenities, 'Food');
  const recommendedWashroom = selectRecommendedAmenity(enhancedAmenities, 'Washroom');

  console.log('[Amenities] Enhanced Amenities:', enhancedAmenities);
  console.log('[Amenities] Recommended Food:', recommendedFood);
  
  const filteredAmenities = enhancedAmenities.filter(a => filter === 'All' || a.type === filter);

  const filterButtons = [
    { id: 'All', label: 'All', icon: null },
    { id: 'Food', label: 'Food & Drinks', icon: Utensils },
    { id: 'Washroom', label: 'Washrooms', icon: Droplets },
    { id: 'FirstAid', label: 'First Aid', icon: HeartPulse },
  ] as const;

  return (
    <div className="space-y-6 pb-8">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight mb-2">Nearby Amenities</h1>
        <p className="text-on-surface-variant text-sm font-medium">Real-time occupancy and walk-times from your stand.</p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {filterButtons.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id as any)}
            className={cn(
              "flex-shrink-0 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all",
              filter === id ? "bg-primary text-white shadow-md" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant"
            )}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* Amenities List */}
      <div className="space-y-4">
        {filteredAmenities.map((amenity, index) => (
          <motion.div
            key={amenity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 transition-all hover:shadow-md",
              amenity.isRecommended && "border-l-4 border-secondary"
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
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1 font-semibold text-tertiary-container">
                      <Navigation size={14} className="rotate-45" />
                      {amenity.walkMinutes} mins walk
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Open
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-surface-variant">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Wait Time</span>
                  <div className={cn(
                    "flex items-center gap-1.5 font-bold",
                    amenity.queueBand === 'Low' ? "text-emerald-600" : amenity.queueBand === 'High' ? "text-secondary" : "text-amber-600"
                  )}>
                    <div className="flex gap-0.5">
                      <div className={cn("w-1.5 h-3 rounded-full", amenity.queueBand !== 'Low' ? (amenity.queueBand === 'High' ? "bg-secondary" : "bg-amber-500") : "bg-emerald-500")} />
                      <div className={cn("w-1.5 h-3 rounded-full", amenity.queueBand === 'High' ? "bg-secondary" : (amenity.queueBand === 'Moderate' ? "bg-amber-500" : "bg-surface-variant"))} />
                      <div className={cn("w-1.5 h-3 rounded-full", amenity.queueBand === 'High' ? "bg-secondary" : "bg-surface-variant")} />
                    </div>
                    {amenity.queueBand} ({amenity.queueMinutes} mins)
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('Route')}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-primary-container transition-colors shadow-lg shadow-primary/10"
                >
                  <Navigation size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
