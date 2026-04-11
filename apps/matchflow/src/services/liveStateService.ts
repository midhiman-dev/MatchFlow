/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZoneLiveState, ZoneStatus, FlowDirection, AmenityLiveState, AmenityStatus } from '../domain/live/types';
import { getStatusFromDensity, getAmenityStatusFromWait } from '../domain/live/selectors';

/**
 * Service to handle Firebase Realtime Database subscriptions for zone live state.
 * For T1, this uses mock data and intervals to demonstrate the contract.
 */
export class LiveStateService {
  private static instance: LiveStateService;
  private zoneListeners: ((states: Record<string, ZoneLiveState>) => void)[] = [];
  private amenityListeners: ((states: Record<string, AmenityLiveState>) => void)[] = [];
  private currentZoneStates: Record<string, ZoneLiveState> = {};
  private currentAmenityStates: Record<string, AmenityLiveState> = {};

  private constructor() {
    // Initial mock data
    this.currentZoneStates = {
      'z1': this.createMockZoneState('z1', 0.2),
      'z2': this.createMockZoneState('z2', 0.45),
      'z3': this.createMockZoneState('z3', 0.8),
      'z4': this.createMockZoneState('z4', 0.95),
    };

    this.currentAmenityStates = {
      'a1': this.createMockAmenityState('a1', 2),
      'a2': this.createMockAmenityState('a2', 12),
      'a3': this.createMockAmenityState('a3', 5),
    };
  }

  public static getInstance(): LiveStateService {
    if (!this.instance) {
      this.instance = new LiveStateService();
    }
    return this.instance;
  }

  private createMockZoneState(zoneId: string, density: number, overrides: Partial<ZoneLiveState> = {}): ZoneLiveState {
    return {
      zoneId,
      density,
      status: getStatusFromDensity(density),
      flowDirection: 'stable',
      entryRate: Math.floor(density * 100),
      exitRate: Math.floor(density * 20),
      queuePressure: density * 0.8,
      updatedAt: Date.now(),
      confidence: 0.95,
      ...overrides
    };
  }

  private createMockAmenityState(amenityId: string, waitMinutes: number): AmenityLiveState {
    return {
      amenityId,
      queueMinutes: waitMinutes,
      status: getAmenityStatusFromWait(waitMinutes),
      updatedAt: Date.now(),
      confidence: 0.9
    };
  }

  /**
   * Subscribes to all zone updates.
   */
  public subscribeToZones(callback: (states: Record<string, ZoneLiveState>) => void) {
    this.zoneListeners.push(callback);
    callback(this.currentZoneStates);

    return () => {
      this.zoneListeners = this.zoneListeners.filter(l => l !== callback);
    };
  }

  /**
   * Subscribes to all amenity updates.
   */
  public subscribeToAmenities(callback: (states: Record<string, AmenityLiveState>) => void) {
    this.amenityListeners.push(callback);
    callback(this.currentAmenityStates);

    return () => {
      this.amenityListeners = this.amenityListeners.filter(l => l !== callback);
    };
  }

  /**
   * Gets the current state of a specific zone.
   */
  public getCurrentZoneState(zoneId: string): ZoneLiveState | undefined {
    return this.currentZoneStates[zoneId];
  }

  /**
   * Gets the current state of a specific amenity.
   */
  public getCurrentAmenityState(amenityId: string): AmenityLiveState | undefined {
    return this.currentAmenityStates[amenityId];
  }

  /**
   * Manually trigger a mock zone update.
   */
  public triggerMockZoneUpdate(zoneId: string, newDensity: number, overrides: Partial<ZoneLiveState> = {}) {
    this.currentZoneStates[zoneId] = this.createMockZoneState(zoneId, newDensity, overrides);
    this.notifyZones();
  }

  /**
   * Manually trigger a mock amenity update.
   */
  public triggerMockAmenityUpdate(amenityId: string, newWait: number) {
    this.currentAmenityStates[amenityId] = this.createMockAmenityState(amenityId, newWait);
    this.notifyAmenities();
  }

  private notifyZones() {
    this.zoneListeners.forEach(l => l(this.currentZoneStates));
  }

  private notifyAmenities() {
    this.amenityListeners.forEach(l => l(this.currentAmenityStates));
  }
}
