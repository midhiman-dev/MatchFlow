/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Amenity, AmenityType, CongestionBand } from '../venue/types';
import { AmenityLiveState, AmenityStatus } from './types';

const TIER_1_FRESH_MS = 3 * 60 * 1000; // 3 mins
const TIER_2_STALE_MS = 10 * 60 * 1000; // 10 mins

export interface EnhancedAmenity extends Amenity {
  liveQueueMinutes?: number;
  liveStatus: AmenityStatus | CongestionBand;
  isStale: boolean;
  stalenessLevel: 'Fresh' | 'Stale' | 'Historical';
  liveUpdatedAt?: number;
  recommendationReason?: string;
}

/**
 * Combines static amenity data with live state and handles staleness.
 */
export const selectNearbyAmenitiesWithLiveState = (
  amenities: Amenity[],
  liveStates: Record<string, AmenityLiveState>,
  currentTime: number = Date.now()
): EnhancedAmenity[] => {
  return amenities.map(amenity => {
    const liveState = liveStates[amenity.id];
    let stalenessLevel: 'Fresh' | 'Stale' | 'Historical' = 'Historical';
    let isStale = true;

    if (liveState) {
      const age = currentTime - liveState.updatedAt;
      if (age < TIER_1_FRESH_MS) {
        stalenessLevel = 'Fresh';
        isStale = false;
      } else if (age < TIER_2_STALE_MS) {
        stalenessLevel = 'Stale';
        isStale = true;
      } else {
        stalenessLevel = 'Historical';
        isStale = true;
      }
    }

    // Default to static domain model data
    let liveQueueMinutes: number | undefined = amenity.queueMinutes;
    let liveStatus: AmenityStatus | CongestionBand = amenity.queueBand;

    if (liveState) {
      if (stalenessLevel === 'Fresh') {
        liveQueueMinutes = liveState.queueMinutes;
        liveStatus = liveState.status;
      } else {
        // Downgrade: show band only, hide exact minutes
        liveQueueMinutes = undefined;
        liveStatus = liveState.status;
      }
    }

    return {
      ...amenity,
      liveQueueMinutes,
      liveStatus,
      isStale,
      stalenessLevel,
      liveUpdatedAt: liveState?.updatedAt
    };
  });
};

/**
 * Selects the best recommended amenity of a specific type.
 * Return null if no single amenity is significantly better (no-better-option fallback).
 */
export const selectRecommendedAmenity = (
  enhancedAmenities: EnhancedAmenity[],
  type: AmenityType
): EnhancedAmenity | null => {
  // We only recommend from non-stale live data
  const candidates = enhancedAmenities.filter(a => a.type === type && !a.isStale && a.liveQueueMinutes !== undefined);
  if (candidates.length === 0) return null;

  // Sort by total time (walk + wait)
  const sorted = [...candidates].sort((a, b) => {
    const totalA = a.walkMinutes + (a.liveQueueMinutes ?? 0);
    const totalB = b.walkMinutes + (b.liveQueueMinutes ?? 0);
    return totalA - totalB;
  });

  const best = sorted[0];
  if (sorted.length === 1) return best;

  const secondBest = sorted[1];
  const delta = (secondBest.walkMinutes + (secondBest.liveQueueMinutes ?? 0)) - 
                (best.walkMinutes + (best.liveQueueMinutes ?? 0));

  // No-better-option fallback: if the difference is less than 2 minutes, don't force a recommendation
  if (delta < 2) return null;

  return {
    ...best,
    recommendationReason: `Shortest total time (${best.walkMinutes + (best.liveQueueMinutes ?? 0)} mins)`
  };
};
