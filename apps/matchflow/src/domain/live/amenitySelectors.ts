/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Amenity, AmenityType, CongestionBand } from '../venue/types';
import { AmenityLiveState, AmenityStatus } from './types';

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export interface EnhancedAmenity extends Amenity {
  liveQueueMinutes?: number;
  liveStatus: AmenityStatus | CongestionBand;
  isStale: boolean;
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
    const isStale = liveState ? (currentTime - liveState.updatedAt > STALE_THRESHOLD_MS) : true;

    // Default to static domain model data
    let liveQueueMinutes: number | undefined = amenity.queueMinutes;
    let liveStatus: AmenityStatus | CongestionBand = amenity.queueBand;

    if (liveState) {
      if (isStale) {
        // Downgrade stale data: show band only, no exact minutes
        liveQueueMinutes = undefined;
        liveStatus = liveState.status;
      } else {
        liveQueueMinutes = liveState.queueMinutes;
        liveStatus = liveState.status;
      }
    }

    return {
      ...amenity,
      liveQueueMinutes,
      liveStatus,
      isStale
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
