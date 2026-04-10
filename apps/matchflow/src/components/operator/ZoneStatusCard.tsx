/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Zone, ZoneLiveState, ZoneStatus, FlowDirection } from '../../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ZoneStatusCardProps {
  zone: Zone;
  liveState: ZoneLiveState;
  onClick?: () => void;
}

export const ZoneStatusCard: React.FC<ZoneStatusCardProps> = ({ zone, liveState, onClick }) => {
  const getStatusColor = (status: ZoneStatus) => {
    switch (status) {
      case 'critical': return 'text-error bg-error/10 border-error/20';
      case 'high': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const getStatusBadge = (status: ZoneStatus) => {
    const base = "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1";
    switch (status) {
      case 'critical': return <span className={cn(base, getStatusColor(status))}><AlertCircle size={10} /> {status}</span>;
      default: return <span className={cn(base, getStatusColor(status))}>{status}</span>;
    }
  };

  const getFlowIcon = (direction: FlowDirection) => {
    switch (direction) {
      case 'inbound': return <TrendingUp className="text-secondary" size={14} />;
      case 'outbound': return <TrendingDown className="text-emerald-500" size={14} />;
      case 'circular': return <RefreshCw className="text-amber-500" size={14} />;
      default: return <Minus className="text-outline" size={14} />;
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={cn(
        "bg-white p-5 rounded-3xl border border-outline-variant/10 shadow-sm cursor-pointer transition-all",
        liveState.status === 'critical' && "ring-2 ring-error/50 ring-offset-2"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-bold text-primary flex items-center gap-2">
            {zone.name}
            {getFlowIcon(liveState.flowDirection)}
          </h4>
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{zone.type}</p>
        </div>
        {getStatusBadge(liveState.status)}
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-headline font-black text-primary leading-none">
            {Math.round(liveState.density * 100)}%
          </div>
          <p className="text-[10px] font-bold text-outline uppercase mt-1">Density</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary">
            {Math.round(liveState.queuePressure * 100)}%
          </div>
          <p className="text-[10px] font-bold text-outline uppercase">Pressure</p>
        </div>
      </div>

      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${liveState.density * 100}%` }}
          className={cn(
            "h-full rounded-full",
            liveState.status === 'critical' ? "bg-error" : 
            liveState.status === 'high' ? "bg-secondary" : 
            liveState.status === 'moderate' ? "bg-amber-500" : "bg-emerald-500"
          )}
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-outline uppercase">In/Out Rate</span>
            <span className="text-xs font-bold text-primary">{liveState.entryRate}/{liveState.exitRate} <span className="text-[8px] text-outline">fpm</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-outline-variant">
          <Clock size={10} />
          <span className="text-[9px] font-bold">{timeAgo(liveState.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};
