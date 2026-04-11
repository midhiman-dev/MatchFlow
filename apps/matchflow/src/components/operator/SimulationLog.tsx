/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SimulationService } from '../../services/simulationService';
import { Clock, Info, AlertTriangle, Route } from 'lucide-react';
import { clsx } from 'clsx';

interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'ALERT' | 'ROUTE';
  message: string;
}

export const SimulationLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // In a real app we would subscribe to an event bus
    // For T2, we fake some logs based on simulation status changes
    const sim = SimulationService.getInstance();
    let lastStatus = sim.getStatus().status;
    let lastScenario = sim.getStatus().activeScenarioId;

    const addLog = (type: LogEntry['type'], message: string) => {
      const entry: LogEntry = {
        id: Date.now().toString() + Math.random(),
        time: new Date().toLocaleTimeString([], { hour12: false }),
        type,
        message
      };
      setLogs(prev => [entry, ...prev].slice(0, 10));
    };

    const interval = setInterval(() => {
      const status = sim.getStatus();
      
      if (status.status !== lastStatus) {
        addLog('INFO', `Simulation status changed to ${status.status.toUpperCase()}`);
        lastStatus = status.status;
      }

      if (status.activeScenarioId !== lastScenario) {
        addLog('ALERT', `Active scenario changed to ${status.activeScenarioId || 'BASELINE'}`);
        lastScenario = status.activeScenarioId;
      }
      
      // Random "propagation" logs during active simulation
      if (status.status === 'running' && Math.random() > 0.7) {
        const types: LogEntry['type'][] = ['INFO', 'ROUTE'];
        const type = types[Math.floor(Math.random() * types.length)];
        const messages = {
          'INFO': ['Zone density updating...', 'Wait times recalibrating...', 'Queue pressure rising...'],
          'ROUTE': ['Rerouting 1,200 fans...', 'Optimizing concourse flow...', 'Path weights updated.']
        };
        const msgList = messages[type as keyof typeof messages];
        addLog(type, msgList[Math.floor(Math.random() * msgList.length)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 font-mono text-xs max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className={clsx(
            "p-4 rounded-xl border-l-4 transition-all animate-in slide-in-from-left-2 duration-300",
            log.type === 'INFO' ? "bg-primary/5 border-primary" : 
            log.type === 'ALERT' ? "bg-secondary/5 border-secondary" : "bg-emerald-500/5 border-emerald-500"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-outline/60 flex items-center gap-1">
              <Clock size={10} />
              {log.time}
            </span>
            <span className={clsx(
              "font-black uppercase tracking-widest text-[8px]",
              log.type === 'INFO' ? "text-primary" : 
              log.type === 'ALERT' ? "text-secondary" : "text-emerald-600"
            )}>
              {log.type}
            </span>
          </div>
          <p className="text-primary/80 leading-relaxed font-bold">{log.message}</p>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-center py-10 text-outline/40 italic">
          No simulation events logged yet.
        </div>
      )}
    </div>
  );
};
