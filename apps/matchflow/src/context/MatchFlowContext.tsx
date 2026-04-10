
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ScenarioType, Zone, Amenity, Alert, Order, MatchState, CongestionBand, ZoneLiveState, AmenityLiveState } from '../types';
import { INITIAL_ZONES, INITIAL_AMENITIES, INITIAL_PATHS, INITIAL_MATCH } from '../constants';
import { LiveStateService } from '../services/liveStateService';

interface MatchFlowContextType extends AppState {
  setRole: (role: AppState['role']) => void;
  setConnectivity: (connectivity: AppState['connectivity']) => void;
  triggerScenario: (scenario: ScenarioType) => void;
  toggleEmergency: (active: boolean) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  placeOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
  updateZoneStatus: (zoneId: string, status: Zone['status']) => void;
  resetState: () => void;
  liveStates: Record<string, ZoneLiveState>;
  amenityLiveStates: Record<string, AmenityLiveState>;
}

const MatchFlowContext = createContext<MatchFlowContextType | undefined>(undefined);

export const MatchFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('matchflow_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return {
      role: 'Fan',
      connectivity: 'Connected',
      activeScenario: 'Normal',
      emergencyActive: false,
      zones: INITIAL_ZONES,
      amenities: INITIAL_AMENITIES,
      paths: INITIAL_PATHS,
      alerts: [],
      orders: [],
      match: INITIAL_MATCH,
      fanLocation: 'z1',
      lastSyncTime: new Date().toISOString(),
      liveStates: {},
      amenityLiveStates: {},
    };
  });

  const [liveStates, setLiveStates] = useState<Record<string, ZoneLiveState>>({});
  const [amenityLiveStates, setAmenityLiveStates] = useState<Record<string, AmenityLiveState>>({});

  useEffect(() => {
    const unsubZones = LiveStateService.getInstance().subscribeToZones((states) => {
      setLiveStates(states);
    });
    
    const unsubAmenities = LiveStateService.getInstance().subscribeToAmenities((states) => {
      setAmenityLiveStates(states);
    });

    return () => {
      unsubZones();
      unsubAmenities();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('matchflow_state', JSON.stringify(state));
  }, [state]);

  const setRole = (role: AppState['role']) => setState(s => ({ ...s, role }));
  const setConnectivity = (connectivity: AppState['connectivity']) => {
    setState(s => ({ 
      ...s, 
      connectivity,
      lastSyncTime: connectivity === 'Connected' ? new Date().toISOString() : s.lastSyncTime
    }));
  };

  const triggerScenario = (scenario: ScenarioType) => {
    setState(s => {
      const newState = { ...s, activeScenario: scenario };
      
      // Simulation Logic
      if (scenario === 'InningsBreak') {
        newState.zones = s.zones.map(z => z.type === 'Concourse' ? { ...z, congestionBand: 'Critical', densityScore: 0.95 } : z);
        newState.match = { ...s.match, moment: 'Innings Break Soon', timeToBreak: 5 };
        newState.alerts = [
          { id: Date.now().toString(), type: 'Recommendation', title: 'Innings Break Soon', message: 'Order snacks now to skip the rush.', timestamp: new Date().toISOString(), isRead: false },
          ...s.alerts
        ];
      } else if (scenario === 'WicketSurge') {
        newState.zones = s.zones.map(z => z.id === 'z1' ? { ...z, congestionBand: 'Critical', densityScore: 0.98 } : z);
        newState.match = { ...s.match, moment: 'Wicket Surge' };
      } else if (scenario === 'Emergency') {
        newState.emergencyActive = true;
        newState.zones = s.zones.map(z => z.id === 'z6' ? { ...z, status: 'emergency', congestionBand: 'Critical' } : z);
        newState.alerts = [
          { id: Date.now().toString(), type: 'Emergency', title: 'EMERGENCY ACTIVE', message: 'Path blocked in South Concourse. Follow directed route to Gate D.', timestamp: new Date().toISOString(), isRead: false },
          ...s.alerts
        ];
      } else if (scenario === 'Normal') {
        newState.zones = INITIAL_ZONES;
        newState.match = INITIAL_MATCH;
        newState.emergencyActive = false;
      }

      return newState;
    });
  };

  const toggleEmergency = (active: boolean) => {
    if (active) triggerScenario('Emergency');
    else triggerScenario('Normal');
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => {
    setState(s => ({
      ...s,
      alerts: [{ ...alert, id: Date.now().toString(), timestamp: new Date().toISOString(), isRead: false }, ...s.alerts]
    }));
  };

  const placeOrder = (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      status: state.connectivity === 'Offline' ? 'Pending' : 'Confirmed'
    };
    setState(s => ({ ...s, orders: [newOrder, ...s.orders] }));
  };

  const updateZoneStatus = (zoneId: string, status: Zone['status']) => {
    setState(s => ({
      ...s,
      zones: s.zones.map(z => z.id === zoneId ? { ...z, status } : z)
    }));
  };

  const resetState = () => {
    setState({
      role: 'Fan',
      connectivity: 'Connected',
      activeScenario: 'Normal',
      emergencyActive: false,
      zones: INITIAL_ZONES,
      amenities: INITIAL_AMENITIES,
      paths: INITIAL_PATHS,
      alerts: [],
      orders: [],
      match: INITIAL_MATCH,
      fanLocation: 'z1',
      lastSyncTime: new Date().toISOString(),
    });
  };

  // Simulation Tick Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(s => {
        if (s.activeScenario === 'Normal') return s;
        
        // Minor fluctuations
        return {
          ...s,
          zones: s.zones.map(z => ({
            ...z,
            currentFans: Math.max(0, z.currentFans + (Math.random() > 0.5 ? 10 : -10)),
            updatedAt: new Date().toISOString()
          }))
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [state.activeScenario]);

  return (
    <MatchFlowContext.Provider value={{ ...state, liveStates, amenityLiveStates, setRole, setConnectivity, triggerScenario, toggleEmergency, addAlert, placeOrder, updateZoneStatus, resetState }}>
      {children}
    </MatchFlowContext.Provider>
  );
};

export const useMatchFlow = () => {
  const context = useContext(MatchFlowContext);
  if (context === undefined) {
    throw new Error('useMatchFlow must be used within a MatchFlowProvider');
  }
  return context;
};
