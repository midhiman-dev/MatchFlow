/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MATCHFLOW_STADIUM_GRAPH } from './seed';
import { RoutingEngine } from './routing';
import { VenueGraph } from './types';

function runRoutingTests() {
  console.log('--- Venue Routing Engine Tests ---');
  const engine = new RoutingEngine(MATCHFLOW_STADIUM_GRAPH);

  // 1. Stand to Amenity (Manual check from Stand to Amenity)
  console.log('\n[TEST] North Stand (z1) to Snack Bay 1 (a2)');
  const r1 = engine.calculateRoute('z1', 'a2');
  console.log(`Status: ${r1.status}, Steps: ${r1.steps.length}, Total Weight: ${r1.totalWeight}`);
  console.log(`Explanation: ${r1.explanation}`);
  r1.steps.forEach((s, i) => console.log(`  ${i+1}. ${s.instruction}`));
  const reachedDestination = r1.steps[r1.steps.length - 1].nodeId === 'a2';
  console.log(`Condition: Reached destination: ${reachedDestination ? 'PASS' : 'FAIL'}`);

  // 2. Stand to Exit (Manual check from Stand to Exit)
  console.log('\n[TEST] East Stand (z3) to Gate B (z8)');
  const r2 = engine.calculateRoute('z3', 'z8');
  console.log(`Status: ${r2.status}, Steps: ${r2.steps.length}, Total Weight: ${r2.totalWeight}`);
  r2.steps.forEach((s, i) => console.log(`  ${i+1}. ${s.instruction}`));
  const reachedGate = r2.steps[r2.steps.length - 1].nodeId === 'z8';
  console.log(`Condition: Reached Gate B: ${reachedGate ? 'PASS' : 'FAIL'}`);

  // 3. Blocked Path
  console.log('\n[TEST] Blocked Path (z5 <-> z6 closed)');
  const blockedGraph: VenueGraph = {
    ...MATCHFLOW_STADIUM_GRAPH,
    paths: MATCHFLOW_STADIUM_GRAPH.paths.map(p => 
      p.id === 'p7-1' ? { ...p, status: 'closed' } : p
    )
  };
  const blockedEngine = new RoutingEngine(blockedGraph);
  const r3 = blockedEngine.calculateRoute('z1', 'z6');
  console.log(`Status: ${r3.status}, Weight: ${r3.totalWeight}`);
  console.log(`Explanation: ${r3.explanation}`);
  // Should have gone around the loop: z1 -> z5 -> z18 -> z17 -> z16 -> z15 -> z14 -> z13 -> z6
  const wentAround = r3.steps.length > 3;
  console.log(`Condition: Went around the loop: ${wentAround ? 'PASS' : 'FAIL'}`);

  // 4. No-route fallback
  console.log('\n[TEST] No-route Fallback (Isolated Node)');
  const isolatedGraph: VenueGraph = {
    ...MATCHFLOW_STADIUM_GRAPH,
    paths: MATCHFLOW_STADIUM_GRAPH.paths.filter(p => p.fromNodeId !== 'z9' && p.toNodeId !== 'z9')
  };
  const isolatedEngine = new RoutingEngine(isolatedGraph);
  const r4 = isolatedEngine.calculateRoute('z1', 'z9');
  console.log(`Status: ${r4.status}`);
  console.log(`Explanation: ${r4.explanation}`);
  console.log(`Condition: Blocked status: ${r4.status === 'Blocked' ? 'PASS' : 'FAIL'}`);

  // 5. Emergency-safe routing vs Normal (Congestion Alternate)
  console.log('\n[TEST] Emergency vs Normal Routing (Congested Path)');
  // Make NW concourse (z18) critically congested
  const congestedGraph: VenueGraph = {
    ...MATCHFLOW_STADIUM_GRAPH,
    zones: MATCHFLOW_STADIUM_GRAPH.zones.map(z => 
      z.id === 'z18' ? { ...z, congestionBand: 'Critical' } : z
    )
  };
  const congestedEngine = new RoutingEngine(congestedGraph);
  
  // From North Stand (z1) to West Stand (z4)
  // Short path is z1 -> z5 -> z18 -> z4 (weight 2+2+2 = 6, but z18 is critical)
  // Long path is z1 -> z5 -> z6 -> z13 -> z14 -> z15 -> z16 -> z17 -> z18 -> z4 (very long)
  // Or z1 -> z5 -> z18 ... wait z18 is the only way to z4 in current seed? 
  // Let's check west stand connectivity. West stand (z4) connects to z18 via p10.
  // Gate D (z10) connects to z17. z17 connects to z18.
  
  console.log('Normal Policy:');
  const r5Normal = congestedEngine.calculateRoute('z1', 'z4', 'Normal');
  console.log(`  Weight: ${r5Normal.totalWeight}, Explanation: ${r5Normal.explanation}`);
  
  console.log('Emergency Policy:');
  const r5Emergency = congestedEngine.calculateRoute('z1', 'z4', 'Emergency');
  console.log(`  Weight: ${r5Emergency.totalWeight}, Explanation: ${r5Emergency.explanation}`);
  
  const emergencyIsFaster = r5Emergency.totalWeight < r5Normal.totalWeight;
  console.log(`Condition: Emergency ignores/reduces congestion penalty: ${emergencyIsFaster ? 'PASS' : 'FAIL'}`);

  const allPassed = reachedDestination && reachedGate && wentAround && (r4.status === 'Blocked') && emergencyIsFaster;
  if (allPassed) {
    console.log('\nALL ROUTING TESTS PASSED');
  } else {
    console.error('\nSOME ROUTING TESTS FAILED');
    process.exit(1);
  }
}

runRoutingTests();
