/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getStatusFromDensity, selectHotspotSummary, selectVisibleZoneStatus } from './selectors';
import { ZoneLiveState, ZoneStatus } from './types';
import { Zone } from '../venue/types';

function runLiveStateTests() {
  console.log('--- Live State Selector Tests ---');

  // 1. Banding Tests
  console.log('\n[TEST] Density Banding');
  const bands: [number, ZoneStatus][] = [
    [0.1, 'low'],
    [0.45, 'moderate'],
    [0.75, 'high'],
    [0.95, 'critical']
  ];

  let bandingPass = true;
  bands.forEach(([density, expected]) => {
    const result = getStatusFromDensity(density);
    console.log(`  Density ${density} -> ${result} (Expected: ${expected})`);
    if (result !== expected) bandingPass = false;
  });
  console.log(`Condition: Banding logic correct: ${bandingPass ? 'PASS' : 'FAIL'}`);

  // 2. Hotspot Summary Tests
  console.log('\n[TEST] Hotspot Summary');
  const mockZones: Zone[] = [
    { id: 'z1', name: 'North Stand', type: 'Stand', capacity: 5000, currentFans: 1000, congestionBand: 'Low', densityScore: 0.2, entryRate: 0, exitRate: 0, status: 'open', updatedAt: '' },
    { id: 'z2', name: 'South Concourse', type: 'Concourse', capacity: 2000, currentFans: 1800, congestionBand: 'High', densityScore: 0.9, entryRate: 0, exitRate: 0, status: 'open', updatedAt: '' },
    { id: 'z3', name: 'West Gate', type: 'Gate', capacity: 1000, currentFans: 800, congestionBand: 'High', densityScore: 0.8, entryRate: 0, exitRate: 0, status: 'open', updatedAt: '' }
  ];

  const mockLiveStates: Record<string, ZoneLiveState> = {
    'z1': { zoneId: 'z1', density: 0.2, status: 'low', flowDirection: 'stable', entryRate: 5, exitRate: 5, queuePressure: 0.1, updatedAt: Date.now(), confidence: 1 },
    'z2': { zoneId: 'z2', density: 0.95, status: 'critical', flowDirection: 'inbound', entryRate: 50, exitRate: 5, queuePressure: 0.9, updatedAt: Date.now(), confidence: 1 },
    'z3': { zoneId: 'z3', density: 0.82, status: 'high', flowDirection: 'outbound', entryRate: 10, exitRate: 40, queuePressure: 0.7, updatedAt: Date.now(), confidence: 1 }
  };

  const summary = selectHotspotSummary(mockLiveStates, mockZones);
  console.log(`  Summary: Critical: ${summary.criticalCount}, High: ${summary.highCount}`);
  console.log(`  Top Hotspot: ${summary.topHotspots[0]?.zoneName} (${summary.topHotspots[0]?.status})`);

  const summaryPass = summary.criticalCount === 1 && summary.highCount === 1 && summary.topHotspots[0].zoneId === 'z2';
  console.log(`Condition: Hotspot summary correct: ${summaryPass ? 'PASS' : 'FAIL'}`);

  // 3. Visible Zone Status Selector
  console.log('\n[TEST] Visible Zone Status (Live vs Fallback)');
  
  // Live case
  const visibleLive = selectVisibleZoneStatus(mockZones[1], mockLiveStates['z2']);
  console.log(`  Live (z2): ${visibleLive.status}, ${visibleLive.label}`);
  const liveVisiblePass = visibleLive.status === 'critical' && visibleLive.label === 'CRITICAL';

  // Fallback case (no live state)
  const visibleFallback = selectVisibleZoneStatus(mockZones[0], undefined);
  console.log(`  Fallback (z1): ${visibleFallback.status}, ${visibleFallback.label}`);
  const fallbackVisiblePass = visibleFallback.status === 'low' && visibleFallback.label === 'LOW';

  const visiblePass = liveVisiblePass && fallbackVisiblePass;
  console.log(`Condition: Visible status selector correct: ${visiblePass ? 'PASS' : 'FAIL'}`);

  const allPassed = bandingPass && summaryPass && visiblePass;
  if (allPassed) {
    console.log('\nALL LIVE STATE TESTS PASSED');
  } else {
    console.error('\nSOME LIVE STATE TESTS FAILED');
    process.exit(1);
  }
}

runLiveStateTests();
