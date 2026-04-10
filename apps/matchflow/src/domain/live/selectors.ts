/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZoneStatus, ZoneLiveState, HotspotSummary } from './types';
import { Zone } from '../venue/types';

/**
 * Determines the status band for a given density score.
 * Consistent with Spec 03 definitions.
 */
export const getStatusFromDensity = (density: number): ZoneStatus => {
  if (density >= 0.9) return 'critical';
  if (density >= 0.7) return 'high';
  if (density >= 0.4) return 'moderate';
  return 'low';
};

/**
 * Selects and formats the hotspots for the operator dashboard summary.
 */
export const selectHotspotSummary = (
  liveStates: Record<string, ZoneLiveState>,
  zones: Zone[]
): HotspotSummary => {
  const states = Object.values(liveStates);
  
  const criticalCount = states.filter(s => s.status === 'critical').length;
  const highCount = states.filter(s => s.status === 'high').length;
  
  const topHotspots = states
    .filter(s => s.status === 'critical' || s.status === 'high')
    .sort((a, b) => b.density - a.density)
    .slice(0, 5)
    .map(state => {
      const zone = zones.find(z => z.id === state.zoneId);
      return {
        zoneId: state.zoneId,
        zoneName: zone?.name || state.zoneId,
        status: state.status,
        density: state.density
      };
    });

  return {
    criticalCount,
    highCount,
    topHotspots
  };
};

/**
 * Maps live state to a display-ready format for the operator heatmap.
 * Ensures that even if live data is missing for a zone, we have a fallback.
 */
export const selectVisibleZoneStatus = (
  zone: Zone,
  liveState?: ZoneLiveState
): { status: ZoneStatus; label: string; density: number } => {
  if (!liveState) {
    // Fallback to domain model defaults if no live state exists
    const status = getStatusFromDensity(zone.densityScore);
    return {
      status,
      label: status.toUpperCase(),
      density: zone.densityScore
    };
  }

  return {
    status: liveState.status,
    label: liveState.status.toUpperCase(),
    density: liveState.density
  };
};
