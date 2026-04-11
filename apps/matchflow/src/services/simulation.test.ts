/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationService } from './simulationService';
import { LiveStateService } from './liveStateService';
import { BASELINE_SCENARIO, INNINGS_BREAK_SCENARIO } from '../domain/simulation/scenarios';

function runSimulationTests() {
  console.log('--- Simulation Service Tests ---');
  const simService = SimulationService.getInstance();
  const liveService = LiveStateService.getInstance();

  let allPassed = true;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`  [PASS] ${message}`);
    } else {
      console.error(`  [FAIL] ${message}`);
      allPassed = false;
    }
  };

  // 1. Initial State
  console.log('\n[TEST] Initial State');
  const status = simService.getStatus();
  assert(status.status === 'stopped', 'Simulation should be stopped by default');
  assert(status.activeScenarioId === null, 'No active scenario by default');

  // 2. Start Scenario
  console.log('\n[TEST] Start Scenario');
  simService.start(INNINGS_BREAK_SCENARIO.id);
  const runningStatus = simService.getStatus();
  assert(runningStatus.status === 'running', 'Simulation should be running');
  assert(runningStatus.activeScenarioId === INNINGS_BREAK_SCENARIO.id, 'Scenario ID should match');
  assert(runningStatus.startTime !== null, 'StartTime should be set');

  // 3. Reset Behavior
  console.log('\n[TEST] Reset Behavior');
  simService.reset();
  const resetStatus = simService.getStatus();
  assert(resetStatus.status === 'stopped', 'Simulation should be stopped after reset');
  assert(resetStatus.activeScenarioId === BASELINE_SCENARIO.id, 'Scenario should be baseline after reset');
  assert(resetStatus.tickCount === 0, 'Tick count should be 0 after reset');

  // Verify that reset actually applied baseline values to LiveStateService
  const z1 = liveService.getCurrentZoneState('z1');
  assert(z1?.density === BASELINE_SCENARIO.zoneTargets['z1'].density, 'Zone z1 density should be baseline');
  
  const a1 = liveService.getCurrentAmenityState('a1');
  assert(a1?.queueMinutes === BASELINE_SCENARIO.amenityTargets['a1'].queueMinutes, 'Amenity a1 queue should be baseline');

  // 4. Tick Transition (Incremental)
  console.log('\n[TEST] Tick Transition');
  simService.reset(); // ensure we are at baseline
  simService.start(INNINGS_BREAK_SCENARIO.id);
  
  // We manually call tick() to avoid waiting for interval in tests
  // Note: tick is private, but we can access it for testing purposes if we type cast or expose it
  (simService as any).tick();
  
  const z1AfterTick = liveService.getCurrentZoneState('z1');
  const baselineZ1 = BASELINE_SCENARIO.zoneTargets['z1'].density;
  const targetZ1 = INNINGS_BREAK_SCENARIO.zoneTargets['z1'].density;
  
  assert(z1AfterTick!.density > baselineZ1, 'Density should increase towards target after tick');
  assert(z1AfterTick!.density < targetZ1, 'Density should not jump immediately to target');
  assert(simService.getStatus().tickCount === 1, 'Tick count should increment');

  if (allPassed) {
    console.log('\nALL SIMULATION SERVICE TESTS PASSED');
  } else {
    console.error('\nSOME SIMULATION SERVICE TESTS FAILED');
    process.exit(1);
  }
}

runSimulationTests();
