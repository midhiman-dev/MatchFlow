/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VenueStatus = 'open' | 'closed' | 'congested' | 'emergency';

export type CongestionBand = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface VenueNode {
  id: string;
  name: string;
  status: VenueStatus;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export type ZoneType = 'Stand' | 'Concourse' | 'Gate' | 'AmenityArea';

export interface Zone extends VenueNode {
  type: ZoneType;
  capacity: number;
  currentFans: number;
  congestionBand: CongestionBand;
  densityScore: number; // 0 to 1
  entryRate: number;
  exitRate: number;
}


export type AmenityType = 'Food' | 'Washroom' | 'FirstAid' | 'Merchandise';

export interface Amenity extends VenueNode {
  type: AmenityType;
  zoneId: string; // The zone where this amenity is located
  walkMinutes: number;
  queueMinutes: number;
  queueBand: CongestionBand;
  confidence: number; // 0 to 1
  isRecommended: boolean;
  image?: string;
}

export interface Gate extends Zone {
  type: 'Gate';
  gateCode?: string;
}

export interface Path {
  id: string;
  fromNodeId: string; // Can be Zone, Gate, or Amenity ID
  toNodeId: string;
  baseWeight: number; // distance or time in minutes
  isDirectional: boolean;
  status: VenueStatus;
  label: string;
}

export interface Closure {
  id: string;
  targetId: string; // ID of the Zone or Path that is closed
  targetType: 'Zone' | 'Path';
  reason: string;
  timestamp: string;
}

export interface EventTrigger {
  id: string;
  type: 'InningsBreak' | 'WicketSurge' | 'DRSSpike' | 'ExitRush' | 'Emergency';
  label: string;
  description?: string;
}

export interface VenueGraph {
  nodes: VenueNode[];
  zones: Zone[];
  amenities: Amenity[];
  paths: Path[];
}
