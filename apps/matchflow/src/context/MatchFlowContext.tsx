
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ScenarioType, Zone, Amenity, Alert, Order, MatchState, CongestionBand, ZoneLiveState, AmenityLiveState, MenuProduct, ServiceMode } from '../types';
import { INITIAL_ZONES, INITIAL_AMENITIES, INITIAL_PATHS, INITIAL_MATCH } from '../constants';
import { LiveStateService } from '../services/liveStateService';
import { updateCartItem, placeOrder, createInitialCart } from '../services/orderService';
import { EmergencyService } from '../services/emergencyService';
import { ConnectivityService } from '../services/connectivityService';
import { SyncService } from '../services/syncService';
import { SimulationService } from '../services/simulationService';

interface MatchFlowContextType extends AppState {
  setRole: (role: AppState['role']) => void;
  setConnectivity: (connectivity: AppState['connectivity']) => void;
  triggerScenario: (scenario: ScenarioType) => void;
  toggleEmergency: (active: boolean) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  
  // Ordering Actions
  addToCart: (product: MenuProduct) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (product: MenuProduct, quantity: number) => void;
  setServiceMode: (mode: ServiceMode, seatInfo?: string) => void;
  submitOrder: () => void;
  clearCart: () => void;
  
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
      currentEmergency: EmergencyService.getInstance().getEmergencyState(),
      activeClosures: EmergencyService.getInstance().getActiveClosures(),
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

    const unsubConnectivity = ConnectivityService.getInstance().subscribe((status) => {
      setConnectivity(status === 'online' ? 'Connected' : 'Offline');
    });

    // Register Sync Handlers
    SyncService.getInstance().registerHandler('PLACE_ORDER', async (payload) => {
      console.log('[SyncService] Successfully synced offline order:', payload.id);
      // For MVP T1, the outbox flush itself handles removal from outbox.
      // We could also trigger a state update here if we want to change order status from 'Pending' to 'Confirmed'.
    });

    // For the MVP, we poll the emergency service or ideally would subscribe
    const interval = setInterval(() => {
      const service = EmergencyService.getInstance();
      const emergency = service.getEmergencyState();
      const closures = service.getActiveClosures();
      
      setState(s => {
        const closureIds = new Set(closures.map(c => c.targetId));
        return {
          ...s,
          currentEmergency: emergency,
          activeClosures: closures,
          emergencyActive: emergency.active,
          zones: s.zones.map(z => ({
            ...z,
            status: closureIds.has(z.id) ? 'closed' : (z.status === 'emergency' && !emergency.active ? 'open' : z.status)
          })),
          paths: s.paths.map(p => ({
            ...p,
            status: closureIds.has(p.id) ? 'closed' : 'open'
          }))
        };
      });
    }, 1000);

    return () => {
      unsubZones();
      unsubAmenities();
      clearInterval(interval);
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
      
      // Delegation to Simulation Engine
      const simService = SimulationService.getInstance();
      if (scenario === 'Normal') {
        simService.reset();
      } else {
        simService.start(scenario);
      }

      // Keep Match Center specific state updates
      if (scenario === 'InningsBreak') {
        newState.match = { ...s.match, moment: 'Innings Break Soon', timeToBreak: 5 };
        newState.alerts = [
          { id: Date.now().toString(), type: 'Recommendation', title: 'Innings Break Soon', message: 'Order snacks now to skip the rush.', timestamp: new Date().toISOString(), isRead: false },
          ...s.alerts
        ];
      } else if (scenario === 'WicketSurge') {
        newState.match = { ...s.match, moment: 'Wicket Surge' };
      } else if (scenario === 'Emergency') {
        newState.emergencyActive = true;
        newState.alerts = [
          { id: Date.now().toString(), type: 'Emergency', title: 'EMERGENCY ACTIVE', message: 'Path blocked in South Concourse. Follow directed route to Gate D.', timestamp: new Date().toISOString(), isRead: false },
          ...s.alerts
        ];
      } else if (scenario === 'Normal') {
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

  const addToCart = (product: MenuProduct) => {
    setState(s => ({ ...s, cart: updateCartItem(s.cart, product, (s.cart.items.find(i => i.productId === product.id)?.quantity || 0) + 1) }));
  };

  const removeFromCart = (productId: string) => {
    setState(s => {
      const item = s.cart.items.find(i => i.productId === productId);
      if (!item) return s;
      return { ...s, cart: updateCartItem(s.cart, { id: productId } as any, item.quantity - 1) };
    });
  };

  const updateCartQuantity = (product: MenuProduct, quantity: number) => {
    setState(s => ({ ...s, cart: updateCartItem(s.cart, product, quantity) }));
  };

  const setServiceMode = (mode: ServiceMode, seatInfo?: string) => {
    setState(s => ({ ...s, cart: { ...s.cart, serviceMode: mode, seatInfo } }));
  };

  const submitOrder = () => {
    setState(s => {
      const newOrder = placeOrder(s.cart, s.role + '-USER', s.connectivity);
      const orders = [newOrder, ...s.orders];
      
      if (newOrder.isOfflinePending) {
        SyncService.getInstance().enqueue('PLACE_ORDER', newOrder);
      }

      return {
        ...s,
        orders,
        cart: createInitialCart(s.cart.serviceMode)
      };
    });
  };

  const clearCart = () => setState(s => ({ ...s, cart: createInitialCart(s.cart.serviceMode) }));

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
      cart: createInitialCart(),
      pendingSyncOrders: [],
      match: INITIAL_MATCH,
      fanLocation: 'z1',
      lastSyncTime: new Date().toISOString(),
    });
  };

  // Simulation Engine is now managed by SimulationService

  return (
    <MatchFlowContext.Provider value={{ 
      ...state, 
      liveStates, 
      amenityLiveStates, 
      setRole, 
      setConnectivity, 
      triggerScenario, 
      toggleEmergency, 
      addAlert, 
      addToCart,
      removeFromCart,
      updateCartQuantity,
      setServiceMode,
      submitOrder,
      clearCart,
      updateZoneStatus, 
      resetState 
    }}>
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
