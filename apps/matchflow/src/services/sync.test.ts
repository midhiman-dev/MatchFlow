/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SyncService } from './syncService';
import { ConnectivityService } from './connectivityService';

/**
 * Unit tests for SyncService and ConnectivityService.
 * This runs in a simulated environment.
 */
async function runSyncTests() {
  console.log('--- Offline Sync & Outbox Service Tests ---');
  const syncService = SyncService.getInstance();
  const connService = ConnectivityService.getInstance();

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
  syncService.clearOutbox();
  assert(syncService.getOutbox().length === 0, 'Outbox should be empty by default');

  // 2. Enqueue while Offline
  console.log('\n[TEST] Enqueue while Offline');
  connService.setMockStatus('offline');
  
  let handlerCalled = false;
  syncService.registerHandler('PLACE_ORDER', async (payload) => {
    handlerCalled = true;
    console.log(`    Handling order: ${payload.item}`);
  });

  await syncService.enqueue('PLACE_ORDER', { item: 'Samosa', price: 50 });
  assert(syncService.getOutbox().length === 1, 'Action should be in outbox when offline');
  assert(!handlerCalled, 'Handler should not be called while offline');

  // 3. Flush on Reconnect
  console.log('\n[TEST] Flush on Reconnect');
  connService.setMockStatus('online');
  // Wait for async flush
  await new Promise(resolve => setTimeout(resolve, 50));
  
  assert(handlerCalled, 'Handler should be called after reconnecting');
  assert(syncService.getOutbox().length === 0, 'Outbox should be empty after successful flush');

  // 4. Retry Logic on Failure
  console.log('\n[TEST] Retry Logic');
  connService.setMockStatus('offline');
  let failCount = 0;
  syncService.registerHandler('UPDATE_PROFILE', async () => {
    failCount++;
    throw new Error('Network timeout');
  });

  await syncService.enqueue('UPDATE_PROFILE', { name: 'Fan' });
  assert(syncService.getOutbox().length === 1, 'Failed action should start in outbox');
  
  connService.setMockStatus('online');
  await new Promise(resolve => setTimeout(resolve, 50));

  const outbox = syncService.getOutbox();
  assert(outbox.length === 1, 'Failed action should stay in outbox after 1st failure');
  assert(outbox[0].retryCount === 1, 'Retry count should increment to 1');

  if (allPassed) {
    console.log('\nALL SYNC SERVICE TESTS PASSED');
  } else {
    console.error('\nSOME SYNC SERVICE TESTS FAILED');
    process.exit(1);
  }
}

// Ensure clean start
SyncService.getInstance().clearOutbox();
runSyncTests().catch(err => {
  console.error(err);
  process.exit(1);
});
