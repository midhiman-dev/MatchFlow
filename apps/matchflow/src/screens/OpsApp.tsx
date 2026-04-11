
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
  ShieldAlert,
  Zap
} from 'lucide-react';
import { SimulationLog } from '../components/operator/SimulationLog';
import { SimulationService } from '../services/simulationService';
import { ALL_SCENARIOS } from '../domain/simulation/scenarios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { selectHotspotSummary, selectVisibleZoneStatus } from '../domain/live/selectors';
import { HeatmapGrid } from '../components/operator/HeatmapGrid';
import { HotspotSummaryPanel } from '../components/operator/HotspotSummaryPanel';
import { ZoneStatusCard } from '../components/operator/ZoneStatusCard';

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
    { id: 'Normal', label: 'Normal Play', icon: Play, color: 'text-emerald-500' },
    { id: 'InningsBreak', label: 'Innings Break', icon: Activity, color: 'text-secondary' },
    { id: 'DRSSpike', label: 'DRS Spike', icon: Zap, color: 'text-tertiary' },
    { id: 'WicketSurge', label: 'Wicket Surge', icon: TrendingUp, color: 'text-secondary' },
    { id: 'ExitRush', label: 'Exit Rush', icon: Users, color: 'text-primary' },
  ] as const;

  const sim = SimulationService.getInstance();
  const simStatus = sim.getStatus();

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
                {zones.filter(z => z.type === 'Stand').slice(0, 4).map(zone => (
                  <ZoneStatusCard 
                    key={zone.id} 
                    zone={zone} 
                    liveState={liveStates[zone.id] || {
                      zoneId: zone.id,
                      density: zone.densityScore,
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

                <HotspotSummaryPanel summary={hotspotSummary} />
              </div>

              {/* Alerts Panel Row */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
                <h3 className="text-xl font-headline font-black text-primary mb-6 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-secondary" />
                  Active Alerts
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {alerts.slice(0, 4).map(alert => (
                    <div key={alert.id} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5 flex gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        alert.type === 'Emergency' ? "bg-error" : 
                        alert.type === 'Warning' ? "bg-secondary" : "bg-primary"
                      )} />
                      <div>
                        <p className="font-bold text-sm text-primary">{alert.title}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="col-span-full text-center py-4 text-outline">
                      <p className="text-sm font-bold">No active alerts</p>
                    </div>
                  )}
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
                    {scenarios.map(({ id, label, icon: Icon, color }) => (
                      <button
                        key={id}
                        onClick={() => triggerScenario(id as any)}
                        className={cn(
                          "w-full flex items-center justify-between p-5 rounded-2xl font-bold transition-all border",
                          activeScenario === id 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-surface-container-low text-primary border-outline-variant/10 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <Icon size={18} className={activeScenario === id ? "text-white" : color} />
                          {label}
                        </div>
                        {activeScenario === id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
                  <h3 className="text-xl font-headline font-black text-primary mb-6">Engine Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                      <p className="text-[10px] font-black text-outline uppercase">Active Ticks</p>
                      <p className="text-xl font-bold text-primary">{simStatus.tickCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                      <p className="text-[10px] font-black text-outline uppercase">Refresh Rate</p>
                      <p className="text-xl font-bold text-primary">0.5Hz</p>
                    </div>
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
                  <button 
                    onClick={() => sim.reset()}
                    className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:text-secondary transition-colors"
                  >
                    <RefreshCcw size={14} /> Global Reset
                  </button>
                </div>
                <SimulationLog />
              </div>
            </motion.div>
          )}

          {activeView === 'Zones' && (
            <motion.div 
              key="zones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HeatmapGrid zones={zones} liveStates={liveStates} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
