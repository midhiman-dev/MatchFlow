/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { selectNearbyAmenitiesWithLiveState, selectRecommendedAmenity } from './amenitySelectors';
import { Amenity } from '../venue/types';
import { AmenityLiveState } from './types';

function runAmenitySelectorTests() {
  console.log('--- Amenity Selector Tests ---');

  const now = Date.now();
  const mockAmenities: Amenity[] = [
    { 
      id: 'a1', name: 'Food Bay 1', type: 'Food', zoneId: 'z1', 
      walkMinutes: 5, queueMinutes: 10, queueBand: 'Moderate', 
      status: 'open', updatedAt: '', confidence: 1, isRecommended: false 
    },
    { 
      id: 'a2', name: 'Food Bay 2', type: 'Food', zoneId: 'z2', 
      walkMinutes: 2, queueMinutes: 5, queueBand: 'Low', 
      status: 'open', updatedAt: '', confidence: 1, isRecommended: false 
    },
    { 
      id: 'a3', name: 'Washroom A', type: 'Washroom', zoneId: 'z1', 
      walkMinutes: 3, queueMinutes: 2, queueBand: 'Low', 
      status: 'open', updatedAt: '', confidence: 1, isRecommended: false 
    },
  ];

  const mockLiveStates: Record<string, AmenityLiveState> = {
    'a1': { amenityId: 'a1', queueMinutes: 2, status: 'low', updatedAt: now, confidence: 1 },
    'a2': { amenityId: 'a2', queueMinutes: 12, status: 'high', updatedAt: now, confidence: 1 },
    // a3 has no live state (fallback to static)
  };

  // 1. Live State Mapping and Recommendation Logic
  console.log('\n[TEST] Recommendation Logic (Shortest total time)');
  const enhanced = selectNearbyAmenitiesWithLiveState(mockAmenities, mockLiveStates, now);
  
  // Food Bay 1: walk 5 + queue 2 = 7 mins
  // Food Bay 2: walk 2 + queue 12 = 14 mins
  const recommendedFood = selectRecommendedAmenity(enhanced, 'Food');
  console.log(`  Recommended Food: ${recommendedFood?.name} (Expected: Food Bay 1)`);
  
  const recommendationPass = recommendedFood?.id === 'a1' && recommendedFood.recommendationReason?.includes('Shortest total time');
  console.log(`Condition: Recommendation logic correct: ${recommendationPass ? 'PASS' : 'FAIL'}`);

  // 2. Stale Data Downgrade
  console.log('\n[TEST] Stale Data Downgrade');
  const staleTime = now + (6 * 60 * 1000); // 6 mins later
  const staleEnhanced = selectNearbyAmenitiesWithLiveState(mockAmenities, mockLiveStates, staleTime);
  
  const a1Stale = staleEnhanced.find(a => a.id === 'a1');
  console.log(`  Stale Amenity a1: liveQueueMinutes=${a1Stale?.liveQueueMinutes}, isStale=${a1Stale?.isStale}`);
  
  const stalePass = a1Stale?.isStale === true && a1Stale?.liveQueueMinutes === undefined;
  console.log(`Condition: Stale data downgrade correct: ${stalePass ? 'PASS' : 'FAIL'}`);

  // 3. No-Better-Option Fallback
  console.log('\n[TEST] No-Better-Option Fallback');
  const closeLiveStates: Record<string, AmenityLiveState> = {
    'a1': { amenityId: 'a1', queueMinutes: 5, status: 'moderate', updatedAt: now, confidence: 1 },
    'a2': { amenityId: 'a2', queueMinutes: 8, status: 'moderate', updatedAt: now, confidence: 1 },
  };
  // a1: walk 5 + queue 5 = 10
  // a2: walk 2 + queue 8 = 10
  // delta = 0 (< 2 mins)
  
  const closeEnhanced = selectNearbyAmenitiesWithLiveState(mockAmenities, closeLiveStates, now);
  const recommendedClose = selectRecommendedAmenity(closeEnhanced, 'Food');
  console.log(`  Recommended Close: ${recommendedClose?.name} (Expected: null)`);
  
  const fallbackPass = recommendedClose === null;
  console.log(`Condition: No-better-option fallback correct: ${fallbackPass ? 'PASS' : 'FAIL'}`);

  // 4. Default Fallback Behavior (No Live State)
  console.log('\n[TEST] Fallback Behavior (No Live State)');
  const recommendedWashroom = selectRecommendedAmenity(enhanced, 'Washroom');
  console.log(`  Recommended Washroom: ${recommendedWashroom?.name} (Expected: null because no live data)`);
  
  // Currently we only recommend if we have non-stale live data with queueMinutes
  const noLiveDataPass = recommendedWashroom === null;
  console.log(`Condition: No live data fallback correct: ${noLiveDataPass ? 'PASS' : 'FAIL'}`);

  const allPassed = recommendationPass && stalePass && fallbackPass && noLiveDataPass;
  if (allPassed) {
    console.log('\nALL AMENITY SELECTOR TESTS PASSED');
  } else {
    console.error('\nSOME AMENITY SELECTOR TESTS FAILED');
    process.exit(1);
  }
}

runAmenitySelectorTests();
