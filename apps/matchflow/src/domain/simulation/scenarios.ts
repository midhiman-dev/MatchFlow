/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationScenario, ZoneSimulationTarget, AmenitySimulationTarget } from './types';

/**
 * Baseline state representing normal play.
 * Fans are mostly in their seats.
 */
export const BASELINE_SCENARIO: SimulationScenario = {
  id: 'baseline',
  label: 'Normal Play',
  description: 'Fans are mostly in their seats. Concourses and amenities have low pressure.',
  momentum: 0.1,
  zoneTargets: {
    'z1': { density: 0.1, flowDirection: 'stable', entryRate: 5, exitRate: 5, queuePressure: 0.1 },
    'z2': { density: 0.15, flowDirection: 'stable', entryRate: 8, exitRate: 5, queuePressure: 0.1 },
    'z3': { density: 0.05, flowDirection: 'stable', entryRate: 2, exitRate: 2, queuePressure: 0.05 },
    'z4': { density: 0.1, flowDirection: 'stable', entryRate: 5, exitRate: 5, queuePressure: 0.1 },
  },
  amenityTargets: {
    'a1': { queueMinutes: 1 },
    'a2': { queueMinutes: 3 },
    'a3': { queueMinutes: 1 },
  }
};

/**
 * Innings Break scenario.
 * Massive surge toward concessions and washrooms.
 */
export const INNINGS_BREAK_SCENARIO: SimulationScenario = {
  id: 'innings-break',
  label: 'Innings Break',
  description: 'High pressure on all concourses and amenities as fans leave their seats.',
  momentum: 0.05,
  zoneTargets: {
    'z1': { density: 0.8, flowDirection: 'outbound', entryRate: 50, exitRate: 5, queuePressure: 0.7 },
    'z2': { density: 0.9, flowDirection: 'outbound', entryRate: 60, exitRate: 2, queuePressure: 0.9 },
    'z3': { density: 0.85, flowDirection: 'circular', entryRate: 40, exitRate: 10, queuePressure: 0.8 },
    'z4': { density: 0.75, flowDirection: 'inbound', entryRate: 30, exitRate: 20, queuePressure: 0.6 },
  },
  amenityTargets: {
    'a1': { queueMinutes: 15 },
    'a2': { queueMinutes: 25 },
    'a3': { queueMinutes: 12 },
  }
};

export const ALL_SCENARIOS: Record<string, SimulationScenario> = {
  'Normal': BASELINE_SCENARIO,
  'InningsBreak': INNINGS_BREAK_SCENARIO,
  'DRSSpike': {
    ...BASELINE_SCENARIO,
    id: 'DRSSpike',
    label: 'DRS Spike',
    description: 'Sudden burst of in-seat order intent during DRS review.',
    amenityTargets: {
      ...BASELINE_SCENARIO.amenityTargets,
      'a1': { queueMinutes: 5 },
      'a2': { queueMinutes: 8 },
    }
  },
  'WicketSurge': {
    ...BASELINE_SCENARIO,
    id: 'WicketSurge',
    label: 'Wicket Surge',
    description: 'Localized corridor congestion near the affected stand.',
    zoneTargets: {
      ...BASELINE_SCENARIO.zoneTargets,
      'z1': { density: 0.95, flowDirection: 'outbound', entryRate: 80, exitRate: 10, queuePressure: 0.9 },
    }
  },
  'ExitRush': {
    ...BASELINE_SCENARIO,
    id: 'ExitRush',
    label: 'Exit Rush',
    description: 'High pressure on gates and outbound paths.',
    zoneTargets: {
      'z1': { density: 0.4, flowDirection: 'outbound', entryRate: 10, exitRate: 40, queuePressure: 0.4 },
      'z4': { density: 0.9, flowDirection: 'outbound', entryRate: 5, exitRate: 100, queuePressure: 0.9 },
    }
  },
  'Emergency': {
    ...BASELINE_SCENARIO,
    id: 'Emergency',
    label: 'Emergency',
    description: 'Blocked zone/path and forced reroute.',
    zoneTargets: {
      ...BASELINE_SCENARIO.zoneTargets,
      'z2': { density: 1.0, flowDirection: 'stable', entryRate: 0, exitRate: 0, queuePressure: 1.0 },
    }
  }
};
