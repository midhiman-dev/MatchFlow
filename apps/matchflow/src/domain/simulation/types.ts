/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZoneStatus, AmenityStatus, FlowDirection } from '../live/types';

/**
 * Target state for a zone during a specific simulation tick or scenario.
 */
export interface ZoneSimulationTarget {
  density: number;
  flowDirection: FlowDirection;
  entryRate: number;
  exitRate: number;
  queuePressure: number;
}

/**
 * Target state for an amenity during a specific simulation tick or scenario.
 */
export interface AmenitySimulationTarget {
  queueMinutes: number;
}

/**
 * A named simulation scenario with target states for affected zones/amenities.
 */
export interface SimulationScenario {
  id: string;
  label: string;
  description: string;
  
  /**
   * Target states for specific zones.
   * If a zone is not listed, it follows the baseline or previous state.
   */
  zoneTargets: Record<string, ZoneSimulationTarget>;
  
  /**
   * Target states for specific amenities.
   */
  amenityTargets: Record<string, AmenitySimulationTarget>;
  
  /**
   * Transition speed / momentum (0.0 to 1.0).
   * 1.0 means instant jump to target.
   * Lower values mean smoother, slower transition.
   */
  momentum: number;
}

/**
 * Control state of the simulation engine.
 */
export interface SimulationState {
  activeScenarioId: string | null;
  status: 'running' | 'paused' | 'stopped';
  startTime: number | null;
  tickCount: number;
}
