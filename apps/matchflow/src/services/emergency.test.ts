/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmergencyService } from './emergencyService';

function runEmergencyTests() {
  console.log('--- Emergency & Safety Service Tests ---');
  const service = EmergencyService.getInstance();
  const operatorId = 'test-op-01';

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
  const initialState = service.getEmergencyState();
  assert(!initialState.active, 'Emergency should be inactive by default');
  assert(service.getActiveClosures().length === 0, 'Should have no active closures by default');

  // 2. Command Creation (Pending)
  console.log('\n[TEST] Command Creation');
  const cmd1 = service.createCommand('activateEmergency', operatorId, {
    level: 'critical',
    message: 'FIRE EVACUATION',
    reason: 'Simulated fire in North Stand'
  });
  
  assert(cmd1.status === 'pending', 'Newly created command should be pending');
  assert(service.getEmergencyState().active === false, 'Pending command should not affect live state');

  // 3. Command Confirmation & Application
  console.log('\n[TEST] Command Application');
  const result1 = service.confirmCommand(cmd1.id);
  assert(result1.success, 'Command confirmation should succeed');
  
  const newState = service.getEmergencyState();
  assert(newState.active === true, 'Emergency state should now be active');
  assert(newState.level === 'critical', 'Level should match command');
  assert(newState.message === 'FIRE EVACUATION', 'Message should match command');

  // 4. Closure Commands
  console.log('\n[TEST] Closure Actions');
  const cmd2 = service.createCommand('closePath', operatorId, {
    targetId: 'path-north-1',
    reason: 'Debris blocking stairs'
  });
  service.confirmCommand(cmd2.id);
  
  const closures = service.getActiveClosures();
  assert(closures.length === 1, 'Should have 1 active closure');
  assert(closures[0].targetId === 'path-north-1', 'Target ID should match');
  assert(closures[0].targetType === 'path', 'Target type should be path');

  // 5. Open/Clear Actions
  console.log('\n[TEST] Clearing Actions');
  const cmd3 = service.createCommand('openPath', operatorId, {
    targetId: 'path-north-1',
    reason: 'Path cleared by security'
  });
  service.confirmCommand(cmd3.id);
  assert(service.getActiveClosures().length === 0, 'Closure should be removed');

  const cmd4 = service.createCommand('clearEmergency', operatorId, {
    reason: 'End of incident'
  });
  service.confirmCommand(cmd4.id);
  assert(!service.getEmergencyState().active, 'Emergency should be cleared');

  // 6. Audit Trail
  console.log('\n[TEST] Audit Logging');
  const history = service.getAuditHistory();
  assert(history.length === 4, 'Should have 4 audit records');
  assert(history[0].action === 'activateEmergency', 'First audit record action should match');
  assert(history[1].action === 'closePath', 'Second audit record action should match');
  assert(history[3].action === 'clearEmergency', 'Fourth audit record action should match');
  assert(history[0].operatorId === operatorId, 'Operator ID should be recorded');
  assert(history[1].reason === 'Debris blocking stairs', 'Reason should be recorded');

  if (allPassed) {
    console.log('\nALL EMERGENCY SERVICE TESTS PASSED');
  } else {
    console.error('\nSOME EMERGENCY SERVICE TESTS FAILED');
    process.exit(1);
  }
}

// Reset service before running tests
EmergencyService.getInstance().reset();
runEmergencyTests();
