/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ZoneStatus = 'low' | 'moderate' | 'high' | 'critical';
export type FlowDirection = 'inbound' | 'outbound' | 'stable' | 'circular';

/**
 * Technical contract for real-time zone metrics.
 * Designed for Firebase Realtime Database (RTDB) sync.
 */
export interface ZoneLiveState {
  zoneId: string;
  density: number; // 0.0 to 1.0
  status: ZoneStatus;
  flowDirection: FlowDirection;
  entryRate: number; // fans/minute
  exitRate: number; // fans/minute
  queuePressure: number; // 0.0 to 1.0 (normalized pressure on zone facilities/exits)
  updatedAt: number; // Unix timestamp for drift-syncing
  confidence: number; // 0.0 to 1.0 logic-confidence in this reading
}

/**
 * Aggregated hotspot summary for operator overview.
 */
export interface HotspotSummary {
  criticalCount: number;
  highCount: number;
  topHotspots: Array<{
    zoneId: string;
    zoneName: string;
    status: ZoneStatus;
    density: number;
  }>;
}
