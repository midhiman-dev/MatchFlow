/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zone, Amenity, Path, VenueGraph } from './types';

export const INITIAL_ZONES: Zone[] = [
  // Stands
  { id: 'z1', name: 'North Stand', type: 'Stand', capacity: 5000, currentFans: 4200, congestionBand: 'High', densityScore: 0.84, entryRate: 10, exitRate: 5, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z2', name: 'South Stand', type: 'Stand', capacity: 5000, currentFans: 3800, congestionBand: 'Moderate', densityScore: 0.76, entryRate: 8, exitRate: 4, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z3', name: 'East Stand', type: 'Stand', capacity: 4000, currentFans: 3200, congestionBand: 'Moderate', densityScore: 0.8, entryRate: 5, exitRate: 3, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z4', name: 'West Stand', type: 'Stand', capacity: 4000, currentFans: 3500, congestionBand: 'High', densityScore: 0.87, entryRate: 7, exitRate: 4, status: 'open', updatedAt: new Date().toISOString() },
  
  // Concourses (8 sections for a full loop)
  { id: 'z5', name: 'North Concourse (W)', type: 'Concourse', capacity: 2000, currentFans: 1800, congestionBand: 'High', densityScore: 0.9, entryRate: 50, exitRate: 40, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z6', name: 'North Concourse (E)', type: 'Concourse', capacity: 2000, currentFans: 1200, congestionBand: 'Moderate', densityScore: 0.6, entryRate: 30, exitRate: 25, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z13', name: 'East Concourse (N)', type: 'Concourse', capacity: 2000, currentFans: 1000, congestionBand: 'Low', densityScore: 0.5, entryRate: 20, exitRate: 15, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z14', name: 'East Concourse (S)', type: 'Concourse', capacity: 2000, currentFans: 900, congestionBand: 'Low', densityScore: 0.45, entryRate: 15, exitRate: 10, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z15', name: 'South Concourse (E)', type: 'Concourse', capacity: 2000, currentFans: 1100, congestionBand: 'Moderate', densityScore: 0.55, entryRate: 25, exitRate: 20, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z16', name: 'South Concourse (W)', type: 'Concourse', capacity: 2000, currentFans: 1300, congestionBand: 'Moderate', densityScore: 0.65, entryRate: 35, exitRate: 25, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z17', name: 'West Concourse (S)', type: 'Concourse', capacity: 2000, currentFans: 1500, congestionBand: 'High', densityScore: 0.75, entryRate: 40, exitRate: 35, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z18', name: 'West Concourse (N)', type: 'Concourse', capacity: 2000, currentFans: 1700, congestionBand: 'High', densityScore: 0.85, entryRate: 45, exitRate: 40, status: 'open', updatedAt: new Date().toISOString() },

  // Gates
  { id: 'z7', name: 'Gate A (North)', type: 'Gate', capacity: 1000, currentFans: 200, congestionBand: 'Low', densityScore: 0.2, entryRate: 20, exitRate: 0, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z8', name: 'Gate B (South)', type: 'Gate', capacity: 1000, currentFans: 450, congestionBand: 'Moderate', densityScore: 0.45, entryRate: 15, exitRate: 0, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z9', name: 'Gate C (East)', type: 'Gate', capacity: 1000, currentFans: 100, congestionBand: 'Low', densityScore: 0.1, entryRate: 5, exitRate: 0, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z10', name: 'Gate D (West)', type: 'Gate', capacity: 1000, currentFans: 50, congestionBand: 'Low', densityScore: 0.05, entryRate: 2, exitRate: 0, status: 'open', updatedAt: new Date().toISOString() },

  // Amenity Areas
  { id: 'z11', name: 'Food Court North', type: 'AmenityArea', capacity: 500, currentFans: 450, congestionBand: 'High', densityScore: 0.9, entryRate: 20, exitRate: 15, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'z12', name: 'Food Court South', type: 'AmenityArea', capacity: 500, currentFans: 200, congestionBand: 'Low', densityScore: 0.4, entryRate: 10, exitRate: 12, status: 'open', updatedAt: new Date().toISOString() },
];

export const INITIAL_AMENITIES: Amenity[] = [
  // Food
  { id: 'a1', name: 'Boundary Bites', type: 'Food', zoneId: 'z11', walkMinutes: 2, queueMinutes: 12, queueBand: 'High', confidence: 0.95, isRecommended: false, status: 'open', updatedAt: new Date().toISOString(), image: 'https://picsum.photos/seed/pizza/200/200' },
  { id: 'a2', name: 'Snack Bay 1', type: 'Food', zoneId: 'z12', walkMinutes: 5, queueMinutes: 3, queueBand: 'Low', confidence: 0.9, isRecommended: true, status: 'open', updatedAt: new Date().toISOString(), image: 'https://picsum.photos/seed/burger/200/200' },
  { id: 'a7', name: 'Cricket Curry', type: 'Food', zoneId: 'z13', walkMinutes: 3, queueMinutes: 8, queueBand: 'Moderate', confidence: 0.88, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },
  
  // Washrooms
  { id: 'a3', name: 'Washroom South', type: 'Washroom', zoneId: 'z15', walkMinutes: 1, queueMinutes: 15, queueBand: 'High', confidence: 0.85, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'a4', name: 'Washroom North', type: 'Washroom', zoneId: 'z5', walkMinutes: 3, queueMinutes: 2, queueBand: 'Low', confidence: 0.92, isRecommended: true, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'a8', name: 'Washroom East', type: 'Washroom', zoneId: 'z14', walkMinutes: 2, queueMinutes: 5, queueBand: 'Moderate', confidence: 0.9, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'a9', name: 'Washroom West', type: 'Washroom', zoneId: 'z17', walkMinutes: 2, queueMinutes: 4, queueBand: 'Low', confidence: 0.91, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },

  // Others
  { id: 'a5', name: 'First Aid Point', type: 'FirstAid', zoneId: 'z5', walkMinutes: 4, queueMinutes: 0, queueBand: 'Low', confidence: 1.0, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'a6', name: 'Merchandise Hub', type: 'Merchandise', zoneId: 'z16', walkMinutes: 2, queueMinutes: 5, queueBand: 'Moderate', confidence: 0.8, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },
  { id: 'a10', name: 'Program Kiosk', type: 'Merchandise', zoneId: 'z18', walkMinutes: 1, queueMinutes: 1, queueBand: 'Low', confidence: 0.95, isRecommended: false, status: 'open', updatedAt: new Date().toISOString() },
];

export const INITIAL_PATHS: Path[] = [
  // Concourse Loop
  { id: 'p7-1', fromNodeId: 'z5', toNodeId: 'z6', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop N' },
  { id: 'p7-2', fromNodeId: 'z6', toNodeId: 'z13', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop NE' },
  { id: 'p7-3', fromNodeId: 'z13', toNodeId: 'z14', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop E' },
  { id: 'p7-4', fromNodeId: 'z14', toNodeId: 'z15', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop SE' },
  { id: 'p7-5', fromNodeId: 'z15', toNodeId: 'z16', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop S' },
  { id: 'p7-6', fromNodeId: 'z16', toNodeId: 'z17', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop SW' },
  { id: 'p7-7', fromNodeId: 'z17', toNodeId: 'z18', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop W' },
  { id: 'p7-8', fromNodeId: 'z18', toNodeId: 'z5', baseWeight: 2, isDirectional: false, status: 'open', label: 'Concourse Loop NW' },

  // Stands to Concourses
  { id: 'p1', fromNodeId: 'z1', toNodeId: 'z5', baseWeight: 2, isDirectional: false, status: 'open', label: 'North Stand to Concourse' },
  { id: 'p4', fromNodeId: 'z2', toNodeId: 'z15', baseWeight: 2, isDirectional: false, status: 'open', label: 'South Stand to Concourse' },
  { id: 'p9', fromNodeId: 'z3', toNodeId: 'z13', baseWeight: 2, isDirectional: false, status: 'open', label: 'East Stand to Concourse' },
  { id: 'p10', fromNodeId: 'z4', toNodeId: 'z18', baseWeight: 2, isDirectional: false, status: 'open', label: 'West Stand to Concourse' },

  // Gates to Concourses
  { id: 'p3', fromNodeId: 'z7', toNodeId: 'z5', baseWeight: 3, isDirectional: false, status: 'open', label: 'Gate A to Concourse' },
  { id: 'p6', fromNodeId: 'z8', toNodeId: 'z15', baseWeight: 3, isDirectional: false, status: 'open', label: 'Gate B to Concourse' },
  { id: 'p11', fromNodeId: 'z9', toNodeId: 'z14', baseWeight: 3, isDirectional: false, status: 'open', label: 'Gate C to Concourse' },
  { id: 'p8', fromNodeId: 'z10', toNodeId: 'z17', baseWeight: 3, isDirectional: false, status: 'open', label: 'Gate D to Concourse' },

  // Amenity Areas to Concourses
  { id: 'p2', fromNodeId: 'z11', toNodeId: 'z5', baseWeight: 1, isDirectional: false, status: 'open', label: 'Food Court N to Concourse' },
  { id: 'p5', fromNodeId: 'z12', toNodeId: 'z16', baseWeight: 1, isDirectional: false, status: 'open', label: 'Food Court S to Concourse' },

  // Amenities to their Zones (Implicit connection paths for the graph)
  { id: 'pa1', fromNodeId: 'a1', toNodeId: 'z11', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a1' },
  { id: 'pa2', fromNodeId: 'a2', toNodeId: 'z12', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a2' },
  { id: 'pa3', fromNodeId: 'a3', toNodeId: 'z15', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a3' },
  { id: 'pa4', fromNodeId: 'a4', toNodeId: 'z5', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a4' },
  { id: 'pa5', fromNodeId: 'a5', toNodeId: 'z5', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a5' },
  { id: 'pa6', fromNodeId: 'a6', toNodeId: 'z16', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a6' },
  { id: 'pa7', fromNodeId: 'a7', toNodeId: 'z13', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a7' },
  { id: 'pa8', fromNodeId: 'a8', toNodeId: 'z14', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a8' },
  { id: 'pa9', fromNodeId: 'a9', toNodeId: 'z17', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a9' },
  { id: 'pa10', fromNodeId: 'a10', toNodeId: 'z18', baseWeight: 0, isDirectional: false, status: 'open', label: 'Internal: a10' },
];

export const MATCHFLOW_STADIUM_GRAPH: VenueGraph = {
  nodes: [...INITIAL_ZONES, ...INITIAL_AMENITIES],
  zones: INITIAL_ZONES,
  amenities: INITIAL_AMENITIES,
  paths: INITIAL_PATHS
};

