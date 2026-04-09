/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MATCHFLOW_STADIUM_GRAPH } from './seed';
import { getNodeById, getConnectedNodes, getPathsForNode } from './graph';
import { validateVenueGraph } from './validation';

function testVenueGraph() {
  console.log('--- Venue Graph Validation ---');
  const validation = validateVenueGraph(MATCHFLOW_STADIUM_GRAPH);
  console.log(`Is valid: ${validation.isValid}`);
  if (validation.errors.length > 0) {
    console.error('Errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }

  console.log('\n--- Graph Helper Tests ---');
  
  // Test getNodeById
  const northStand = getNodeById(MATCHFLOW_STADIUM_GRAPH, 'z1');
  console.log(`Found z1: ${northStand?.name === 'North Stand' ? 'PASS' : 'FAIL'}`);

  // Test getPathsForNode
  const z5Paths = getPathsForNode(MATCHFLOW_STADIUM_GRAPH, 'z5');
  console.log(`Paths for z5 (North Concourse (W)): ${z5Paths.length} (Expected: 7)`);
  
  // z5 has paths: p7-1, p7-8, p1, p3, p2, pa4, pa5
  const expectedPaths = ['p7-1', 'p7-8', 'p1', 'p3', 'p2', 'pa4', 'pa5'];
  const pIds = z5Paths.map(p => p.id).sort();
  const pathsMatch = JSON.stringify(pIds) === JSON.stringify(expectedPaths.sort());
  console.log(`z5 paths match: ${pathsMatch ? 'PASS' : 'FAIL'}`);

  // Test getConnectedNodes
  const connectedToZ5 = getConnectedNodes(MATCHFLOW_STADIUM_GRAPH, 'z5');
  console.log(`Connected to z5: ${connectedToZ5.length} (Expected: 7)`);
  const connectedNames = connectedToZ5.map(n => n.name).sort();
  console.log(`Connected names: ${connectedNames.join(', ')}`);


  console.log('\n--- Broken Graph Validation Test ---');
  const brokenGraph = {
    ...MATCHFLOW_STADIUM_GRAPH,
    paths: [
      ...MATCHFLOW_STADIUM_GRAPH.paths,
      { id: 'bad-path', fromNodeId: 'non-existent', toNodeId: 'z1', baseWeight: 1, isDirectional: false, status: 'open', label: 'Bad Path' }
    ]
  };
  const brokenValidation = validateVenueGraph(brokenGraph as any);
  console.log(`Broken graph is valid: ${brokenValidation.isValid} (Expected: false)`);
  console.log(`Errors found: ${brokenValidation.errors.length}`);
  console.log(`Error message: ${brokenValidation.errors[0]}`);

  if (validation.isValid && !brokenValidation.isValid && pathsMatch) {
    console.log('\nALL TESTS PASSED');
  } else {
    console.error('\nSOME TESTS FAILED');
    process.exit(1);
  }
}

testVenueGraph();
