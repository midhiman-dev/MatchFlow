/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Zone, ZoneLiveState } from '../../types';
import { ZoneStatusCard } from './ZoneStatusCard';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeatmapGridProps {
  zones: Zone[];
  liveStates: Record<string, ZoneLiveState>;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ zones, liveStates }) => {
  const [filter, setFilter] = React.useState<'All' | 'Critical' | 'Stand' | 'Gate'>('All');

  const filteredZones = zones.filter(zone => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return liveStates[zone.id]?.status === 'critical';
    if (filter === 'Stand') return zone.type === 'Stand';
    if (filter === 'Gate') return zone.type === 'Gate';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} className="text-primary" />
          <h3 className="text-xl font-headline font-black text-primary uppercase tracking-tight">Stadium Zones</h3>
          <span className="ml-2 px-2 py-0.5 bg-surface-container rounded-lg text-[10px] font-black text-outline">
            {filteredZones.length} {filteredZones.length === 1 ? 'Zone' : 'Zones'}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-outline-variant/10 shadow-sm">
          {(['All', 'Critical', 'Stand', 'Gate'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f ? "bg-primary text-white shadow-md shadow-primary/20" : "text-outline hover:bg-surface-container-low"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredZones.map(zone => (
          <ZoneStatusCard 
            key={zone.id}
            zone={zone}
            liveState={liveStates[zone.id] || {
              zoneId: zone.id,
              density: 0,
              status: 'low',
              flowDirection: 'stable',
              entryRate: 0,
              exitRate: 0,
              queuePressure: 0,
              updatedAt: Date.now(),
              confidence: 0
            }}
          />
        ))}
        {filteredZones.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-outline-variant/20 flex flex-col items-center justify-center gap-4">
            <Filter size={48} className="text-outline/20" />
            <div className="text-center">
              <p className="text-sm font-bold text-primary">No zones match your filter</p>
              <p className="text-xs text-outline mt-1">Try selecting 'All' to see all venue areas.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
