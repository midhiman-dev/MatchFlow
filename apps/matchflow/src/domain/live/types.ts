/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ZoneStatus = 'low' | 'moderate' | 'high' | 'critical';
export type AmenityStatus = 'low' | 'moderate' | 'high' | 'critical';
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
 * Technical contract for real-time amenity metrics (queues).
 * Designed for Firebase Realtime Database (RTDB) sync.
 */
export interface AmenityLiveState {
  amenityId: string;
  queueMinutes: number;
  status: AmenityStatus;
  updatedAt: number; // Unix timestamp 
  confidence: number; // 0.0 to 1.0
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

/**
 * Global emergency status.
 */
export type EmergencyLevel = 'notice' | 'warning' | 'critical';

export interface EmergencyState {
  active: boolean;
  level: EmergencyLevel;
  message: string;
  updatedAt: number;
}

/**
 * Live closure record for sync.
 */
export interface LiveClosure {
  targetId: string;
  targetType: 'zone' | 'path';
  reason: string;
  timestamp: number;
}

/**
 * Structured operator command for safety actions.
 */
export type CommandType = 'activateEmergency' | 'clearEmergency' | 'closePath' | 'closeZone' | 'openPath' | 'openZone';

export interface SafetyCommand {
  id: string;
  type: CommandType;
  targetId?: string; // ID of path or zone
  level?: EmergencyLevel;
  message?: string;
  reason: string;
  operatorId: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'applied' | 'failed';
}

/**
 * Audit record for durable storage (Firestore).
 */
export interface SafetyAuditLog {
  id: string;
  commandId: string;
  operatorId: string;
  action: CommandType;
  targetId?: string;
  reason: string;
  timestamp: number;
  previousState?: any;
  newState?: any;
}
