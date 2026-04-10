
import React, { useState } from 'react';
import { useMatchFlow } from '../context/MatchFlowContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Activity, 
  Map as MapIcon, 
  AlertTriangle, 
  Settings, 
  Play, 
  Square, 
  RefreshCcw,
  ChevronRight,
  TrendingUp,
  Users,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { selectHotspotSummary, selectVisibleZoneStatus } from '../domain/live/selectors';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OpsApp: React.FC = () => {
  const { 
    zones, 
    amenities, 
    activeScenario, 
    triggerScenario, 
    emergencyActive, 
    toggleEmergency,
    match,
    alerts,
    liveStates
  } = useMatchFlow();

  const hotspotSummary = selectHotspotSummary(liveStates, zones);

  const [activeView, setActiveView] = useState<'Dashboard' | 'Simulator' | 'Zones'>('Dashboard');

  const scenarios = [
    { id: 'Normal', label: 'Normal Play', icon: Play },
    { id: 'InningsBreak', label: 'Innings Break', icon: Activity },
    { id: 'WicketSurge', label: 'Wicket Surge', icon: TrendingUp },
    { id: 'ExitRush', label: 'Exit Rush', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b193c] text-white flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-headline font-black tracking-tighter text-white">MatchFlow</h1>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Ops Command Center</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Simulator', icon: Activity },
            { id: 'Zones', icon: MapIcon },
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                activeView === id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/60 hover:bg-white/5"
              )}
            >
              <Icon size={18} />
              {id}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => toggleEmergency(!emergencyActive)}
            className={cn(
              "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
              emergencyActive ? "bg-error text-white animate-pulse" : "bg-white/10 text-white hover:bg-error/20 hover:text-error"
            )}
          >
            <AlertTriangle size={16} />
            {emergencyActive ? 'Emergency Active' : 'Emergency Override'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-headline font-black text-primary tracking-tight">{activeView}</h2>
            <p className="text-on-surface-variant font-medium mt-1">Live stadium intelligence and surge management.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-outline uppercase">Match Time</p>
                <p className="text-lg font-bold text-primary">{match.overs} Overs</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-outline uppercase">Total Fans</p>
                <p className="text-lg font-bold text-primary">24,582</p>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'Dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                {zones.filter(z => z.type === 'Stand').map(zone => {
                  const visible = selectVisibleZoneStatus(zone, liveStates[zone.id]);
                  return (
                    <div key={zone.id} className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/10">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-outline uppercase tracking-widest">{zone.name}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                          visible.status === 'low' ? "bg-emerald-100 text-emerald-700" : 
                          visible.status === 'moderate' ? "bg-amber-100 text-amber-700" : "bg-error/10 text-error"
                        )}>{visible.status}</span>
                      </div>
                      <div className="text-3xl font-headline font-black text-primary mb-2">
                        {Math.round(visible.density * 100)}%
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            visible.status === 'critical' ? "bg-error" : visible.status === 'high' ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${visible.density * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Panels */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
                  <h3 className="text-xl font-headline font-black text-primary mb-6 flex items-center gap-2">
                    <MapIcon size={20} className="text-tertiary" />
                    Heatmap Analysis
                  </h3>
                  <div className="aspect-video bg-surface-container rounded-3xl overflow-hidden relative">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbJ5yxoHEYDP_5jsjVHL2gqdsCLMgvBN0vBwcAZuQO6OcDSFcpRa5bZyPgnOFdiWX4B-qIb59Aivgyeki8T0D1TkrQl2fD0KWdrpjvlduBx-J6v7MurU-9KzaPn0Lir11FMkIbevAFLDfChIZLa9MYsKEBzxHtGipOuLCRFPue45vLAimIkJVXLMtjL_KZz1ulV8Tb59SpRlHH6Pdhg9NI2CC98nFx_ROBXpDLVKnj6ybV8IEgtY5mi2RDPK1DJ-v-sUk8BfB2qsg" 
                      alt="Stadium Map" 
                      className="w-full h-full object-cover opacity-50 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    {/* Simulated Heatmap Overlays */}
                    {zones.map((z, i) => (
                      <div 
                        key={z.id}
                        className={cn(
                          "absolute w-12 h-12 rounded-full blur-xl transition-all duration-1000",
                          z.congestionBand === 'Critical' ? "bg-error/60 scale-150" : 
                          z.congestionBand === 'High' ? "bg-secondary/40 scale-125" : "bg-emerald-500/20"
                        )}
                        style={{ 
                          top: `${20 + (i * 15) % 60}%`, 
                          left: `${10 + (i * 25) % 80}%` 
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hotspot Overview (Added in T1) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
                  <h3 className="text-xl font-headline font-black text-primary mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-error" />
                    Hotspot Overview
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-error/5 p-4 rounded-2xl border border-error/10">
                        <p className="text-[10px] font-black text-error uppercase tracking-wider">Critical</p>
                        <p className="text-2xl font-black text-error">{hotspotSummary.criticalCount}</p>
                      </div>
                      <div className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-wider">High</p>
                        <p className="text-2xl font-black text-secondary">{hotspotSummary.highCount}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest">Top Risks</p>
                      {hotspotSummary.topHotspots.map(hotspot => (
                        <div key={hotspot.zoneId} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              hotspot.status === 'critical' ? "bg-error" : "bg-secondary"
                            )} />
                            <span className="text-xs font-bold text-primary">{hotspot.zoneName}</span>
                          </div>
                          <span className="text-[10px] font-black text-outline uppercase">{Math.round(hotspot.density * 100)}%</span>
                        </div>
                      ))}
                      {hotspotSummary.topHotspots.length === 0 && (
                        <p className="text-center py-4 text-xs font-bold text-outline">No active hotspots</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'Simulator' && (
            <motion.div 
              key="simulator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-3 gap-8"
            >
              <div className="col-span-1 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
                  <h3 className="text-xl font-headline font-black text-primary mb-6">Scenario Control</h3>
                  <div className="space-y-3">
                    {scenarios.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => triggerScenario(id)}
                        className={cn(
                          "w-full flex items-center justify-between p-5 rounded-2xl font-bold transition-all border",
                          activeScenario === id 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-surface-container-low text-primary border-outline-variant/10 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          {label}
                        </div>
                        {activeScenario === id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary-container rounded-[2.5rem] p-8 shadow-lg shadow-secondary/10">
                  <h3 className="text-xl font-headline font-black text-on-secondary-container mb-4 flex items-center gap-2">
                    <ShieldAlert size={20} />
                    Emergency Override
                  </h3>
                  <p className="text-on-secondary-container/80 text-sm font-medium mb-6">
                    Immediately trigger stadium-wide emergency protocols and evacuation routing.
                  </p>
                  <button 
                    onClick={() => toggleEmergency(!emergencyActive)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all",
                      emergencyActive ? "bg-white text-error" : "bg-on-secondary-container text-white"
                    )}
                  >
                    {emergencyActive ? 'Deactivate Emergency' : 'Activate Emergency'}
                  </button>
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-headline font-black text-primary">Simulation Impact Log</h3>
                  <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                    <RefreshCcw size={14} /> Clear Log
                  </button>
                </div>
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-primary">
                    <span className="text-outline">[14:52:10]</span> <span className="text-primary font-bold">SCENARIO_START:</span> InningsBreak initialized.
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-secondary">
                    <span className="text-outline">[14:52:15]</span> <span className="text-secondary font-bold">ZONE_UPDATE:</span> North Concourse density increased to 95%.
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-tertiary">
                    <span className="text-outline">[14:52:20]</span> <span className="text-tertiary font-bold">ALERT_PUBLISHED:</span> "Innings Break Soon" sent to 12,400 fans.
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-emerald-500">
                    <span className="text-outline">[14:52:25]</span> <span className="text-emerald-600 font-bold">ROUTE_RECOMPUTE:</span> 4,200 paths updated for optimal flow.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
