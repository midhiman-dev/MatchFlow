/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { HotspotSummary } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HotspotSummaryPanelProps {
  summary: HotspotSummary;
}

export const HotspotSummaryPanel: React.FC<HotspotSummaryPanelProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
      <h3 className="text-xl font-headline font-black text-primary mb-6 flex items-center gap-2">
        <TrendingUp size={20} className="text-error" />
        Hotspot Overview
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-error/5 p-4 rounded-2xl border border-error/10">
            <p className="text-[10px] font-black text-error uppercase tracking-wider">Critical</p>
            <p className="text-2xl font-black text-error">{summary.criticalCount}</p>
          </div>
          <div className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
            <p className="text-[10px] font-black text-secondary uppercase tracking-wider">High</p>
            <p className="text-2xl font-black text-secondary">{summary.highCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-outline uppercase tracking-widest">Top Risks</p>
          {summary.topHotspots.map(hotspot => (
            <div key={hotspot.zoneId} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  hotspot.status === 'critical' ? "bg-error" : "bg-secondary"
                )} />
                <span className="text-xs font-bold text-primary">{hotspot.zoneName}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-primary uppercase">{Math.round(hotspot.density * 100)}%</span>
                <span className="text-[8px] font-bold text-outline uppercase">{hotspot.status}</span>
              </div>
            </div>
          ))}
          {summary.topHotspots.length === 0 && (
            <div className="text-center py-6 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/10">
              <p className="text-xs font-bold text-outline">No active hotspots</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
