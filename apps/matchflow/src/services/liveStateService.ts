/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZoneLiveState, ZoneStatus, FlowDirection } from '../domain/live/types';
import { getStatusFromDensity } from '../domain/live/selectors';

/**
 * Service to handle Firebase Realtime Database subscriptions for zone live state.
 * For T1, this uses mock data and intervals to demonstrate the contract.
 */
export class LiveStateService {
  private static instance: LiveStateService;
  private listeners: ((states: Record<string, ZoneLiveState>) => void)[] = [];
  private currentStates: Record<string, ZoneLiveState> = {};

  private constructor() {
    // Initial mock data
    this.currentStates = {
      'z1': this.createMockState('z1', 0.2),
      'z2': this.createMockState('z2', 0.45),
      'z3': this.createMockState('z3', 0.8),
      'z4': this.createMockState('z4', 0.95),
    };
  }

  public static getInstance(): LiveStateService {
    if (!this.instance) {
      this.instance = new LiveStateService();
    }
    return this.instance;
  }

  private createMockState(zoneId: string, density: number): ZoneLiveState {
    return {
      zoneId,
      density,
      status: getStatusFromDensity(density),
      flowDirection: 'stable',
      entryRate: Math.floor(density * 100),
      exitRate: Math.floor(density * 20),
      queuePressure: density * 0.8,
      updatedAt: Date.now(),
      confidence: 0.95
    };
  }

  /**
   * Subscribes to all zone updates.
   * In the future, this will hook into Firebase RTDB.
   */
  public subscribeToZones(callback: (states: Record<string, ZoneLiveState>) => void) {
    this.listeners.push(callback);
    // Emotional first update
    callback(this.currentStates);

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Manually trigger a mock update (for demo/simulation purposes in T1).
   */
  public triggerMockUpdate(zoneId: string, newDensity: number) {
    this.currentStates[zoneId] = this.createMockState(zoneId, newDensity);
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentStates));
    console.log('[LiveStateService] RTDB Update:', this.currentStates);
  }
}
