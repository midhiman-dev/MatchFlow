
import React from 'react';
import { useMatchFlow } from '../../context/MatchFlowContext';
import { motion } from 'motion/react';
import { Bell, Info, AlertTriangle, CheckCircle2, Navigation, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AlertsCenter: React.FC = () => {
  const { alerts } = useMatchFlow();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Emergency': return <AlertTriangle className="text-error" />;
      case 'Warning': return <AlertTriangle className="text-amber-500" />;
      case 'Recommendation': return <CheckCircle2 className="text-emerald-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold text-primary tracking-tight mb-2">Alerts Center</h1>
        <p className="text-on-surface-variant text-sm font-medium">Live updates and crowd guidance for your sector.</p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-outline-variant/10">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline">
              <Bell size={32} />
            </div>
            <div>
              <h3 className="font-bold text-primary">All Clear</h3>
              <p className="text-on-surface-variant text-sm">No active alerts for your location.</p>
            </div>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-white rounded-2xl p-5 shadow-sm border-l-4 flex gap-4 group cursor-pointer hover:shadow-md transition-all",
                alert.type === 'Emergency' ? "border-error" : 
                alert.type === 'Warning' ? "border-amber-500" : 
                alert.type === 'Recommendation' ? "border-emerald-500" : "border-blue-500"
              )}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-primary">{alert.title}</h3>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{alert.message}</p>
                
                {alert.type === 'Recommendation' && (
                  <button className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Route <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Static Demo Alerts if empty */}
      {alerts.length === 0 && (
        <div className="opacity-40">
          <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500 flex gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
              <Info className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary">Match Update</h3>
              <p className="text-sm text-on-surface-variant">Innings break scheduled for 14:15. Concourse traffic expected to rise.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
