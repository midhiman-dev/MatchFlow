/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZoneLiveState, AmenityLiveState } from '../domain/live/types';
import { SimulationState, ZoneSimulationTarget, AmenitySimulationTarget } from '../domain/simulation/types';
import { ALL_SCENARIOS, BASELINE_SCENARIO } from '../domain/simulation/scenarios';
import { LiveStateService } from './liveStateService';
import { EmergencyService } from './emergencyService';

/**
 * Pure function to calculate the next step for a numeric value based on a target and momentum.
 */
function lerp(current: number, target: number, momentum: number): number {
  const diff = target - current;
  if (Math.abs(diff) < 0.001) return target;
  return current + diff * momentum;
}

/**
 * Service responsible for the demo simulation engine.
 * Decoupled from the UI to ensure deterministic updates.
 */
export class SimulationService {
  private static instance: SimulationService;
  
  private state: SimulationState = {
    activeScenarioId: null,
    status: 'stopped',
    startTime: null,
    tickCount: 0
  };

  private intervalId: any | null = null;
  private readonly TICK_MS = 2000;

  private constructor() {}

  public static getInstance(): SimulationService {
    if (!this.instance) {
      this.instance = new SimulationService();
    }
    return this.instance;
  }

  /**
   * Starts a specific scenario.
   */
  public start(scenarioId: string) {
    if (!ALL_SCENARIOS[scenarioId]) {
      console.error(`Scenario ${scenarioId} not found.`);
      return;
    }

    this.state = {
      ...this.state,
      activeScenarioId: scenarioId,
      status: 'running',
      startTime: this.state.startTime || Date.now(),
    };

    // Emergency Scenario side effects
    if (scenarioId === 'Emergency') {
      const emergencyService = EmergencyService.getInstance();
      const cmd = emergencyService.createCommand('activateEmergency', 'simulation-engine', {
        level: 'critical',
        message: 'SIMULATED EMERGENCY: Follow redirected routes.',
        reason: 'Simulation Trigger'
      });
      emergencyService.confirmCommand(cmd.id);
    }

    this.ensureIntervalRunning();
  }

  /**
   * Pauses the simulation.
   */
  public pause() {
    this.state.status = 'paused';
    this.clearInterval();
  }

  /**
   * Stops and resets the simulation to baseline.
   */
  public reset() {
    this.state = {
      ...this.state,
      activeScenarioId: BASELINE_SCENARIO.id,
      status: 'stopped',
      startTime: null,
      tickCount: 0
    };
    
    // Clear Emergency if it was active
    const emergencyService = EmergencyService.getInstance();
    if (emergencyService.getEmergencyState().active) {
      const cmd = emergencyService.createCommand('clearEmergency', 'simulation-engine', {
        reason: 'Simulation Reset'
      });
      emergencyService.confirmCommand(cmd.id);
    }

    // Immediate jump to baseline
    this.applyInstantTarget(BASELINE_SCENARIO.zoneTargets, BASELINE_SCENARIO.amenityTargets);
    this.clearInterval();
  }

  public getStatus(): SimulationState {
    return { ...this.state };
  }

  private ensureIntervalRunning() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), this.TICK_MS);
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Main simulation tick.
   * Computes the next state for all zones and amenities.
   */
  private tick() {
    if (this.state.status !== 'running') return;

    this.state.tickCount++;
    
    const scenario = ALL_SCENARIOS[this.state.activeScenarioId || 'baseline'];
    const momentum = scenario.momentum;

    // We get the current states from the LiveStateService to base our next step on them
    // This allows the simulator to be "reactive" to external changes if needed
    const liveService = LiveStateService.getInstance();
    
    // Update Zones
    Object.entries(scenario.zoneTargets).forEach(([zoneId, target]) => {
      const current = liveService.getCurrentZoneState(zoneId);
      if (!current) return;

      const nextDensity = lerp(current.density, target.density, momentum);
      const nextPressure = lerp(current.queuePressure, target.queuePressure, momentum);
      
      liveService.triggerMockZoneUpdate(zoneId, nextDensity, {
        flowDirection: target.flowDirection,
        queuePressure: nextPressure,
        entryRate: Math.floor(lerp(current.entryRate, target.entryRate, momentum)),
        exitRate: Math.floor(lerp(current.exitRate, target.exitRate, momentum)),
      });
    });

    // Update Amenities
    Object.entries(scenario.amenityTargets).forEach(([amenityId, target]) => {
      const current = liveService.getCurrentAmenityState(amenityId);
      if (!current) return;

      const nextWait = lerp(current.queueMinutes, target.queueMinutes, momentum);
      liveService.triggerMockAmenityUpdate(amenityId, nextWait);
    });
  }

  private applyInstantTarget(
    zoneTargets: Record<string, ZoneSimulationTarget>, 
    amenityTargets: Record<string, AmenitySimulationTarget>
  ) {
    const liveService = LiveStateService.getInstance();

    Object.entries(zoneTargets).forEach(([zoneId, target]) => {
      liveService.triggerMockZoneUpdate(zoneId, target.density, {
        flowDirection: target.flowDirection,
        queuePressure: target.queuePressure,
        entryRate: target.entryRate,
        exitRate: target.exitRate,
      });
    });

    Object.entries(amenityTargets).forEach(([amenityId, target]) => {
      liveService.triggerMockAmenityUpdate(amenityId, target.queueMinutes);
    });
  }
}
