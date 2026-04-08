
import { Zone, Amenity, Path, MatchState } from './types';

export const INITIAL_ZONES: Zone[] = [
  { id: 'z1', name: 'North Stand', type: 'Stand', capacity: 5000, currentFans: 4200, congestionBand: 'High', densityScore: 0.84, entryRate: 10, exitRate: 5, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z2', name: 'South Stand', type: 'Stand', capacity: 5000, currentFans: 3800, congestionBand: 'Moderate', densityScore: 0.76, entryRate: 8, exitRate: 4, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z3', name: 'East Stand', type: 'Stand', capacity: 4000, currentFans: 3200, congestionBand: 'Moderate', densityScore: 0.8, entryRate: 5, exitRate: 3, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z4', name: 'West Stand', type: 'Stand', capacity: 4000, currentFans: 3500, congestionBand: 'High', densityScore: 0.87, entryRate: 7, exitRate: 4, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z5', name: 'North Concourse', type: 'Concourse', capacity: 2000, currentFans: 1800, congestionBand: 'High', densityScore: 0.9, entryRate: 50, exitRate: 40, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z6', name: 'South Concourse', type: 'Concourse', capacity: 2000, currentFans: 1200, congestionBand: 'Moderate', densityScore: 0.6, entryRate: 30, exitRate: 25, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z7', name: 'Gate A', type: 'Gate', capacity: 1000, currentFans: 200, congestionBand: 'Low', densityScore: 0.2, entryRate: 20, exitRate: 0, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z8', name: 'Gate B', type: 'Gate', capacity: 1000, currentFans: 450, congestionBand: 'Moderate', densityScore: 0.45, entryRate: 15, exitRate: 0, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z9', name: 'Gate C', type: 'Gate', capacity: 1000, currentFans: 100, congestionBand: 'Low', densityScore: 0.1, entryRate: 5, exitRate: 0, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z10', name: 'Gate D', type: 'Gate', capacity: 1000, currentFans: 50, congestionBand: 'Low', densityScore: 0.05, entryRate: 2, exitRate: 0, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z11', name: 'Food Court A', type: 'AmenityArea', capacity: 500, currentFans: 450, congestionBand: 'High', densityScore: 0.9, entryRate: 20, exitRate: 15, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'z12', name: 'Food Court B', type: 'AmenityArea', capacity: 500, currentFans: 200, congestionBand: 'Low', densityScore: 0.4, entryRate: 10, exitRate: 12, status: 'Open', updatedAt: new Date().toISOString() },
];

export const INITIAL_AMENITIES: Amenity[] = [
  { id: 'a1', name: 'Boundary Bites (Level 2)', type: 'Food', zoneId: 'z11', walkMinutes: 2, queueMinutes: 12, queueBand: 'High', confidence: 0.95, isRecommended: false, status: 'Open', updatedAt: new Date().toISOString(), image: 'https://picsum.photos/seed/pizza/200/200' },
  { id: 'a2', name: 'Snack Bay 1', type: 'Food', zoneId: 'z12', walkMinutes: 5, queueMinutes: 3, queueBand: 'Low', confidence: 0.9, isRecommended: true, status: 'Open', updatedAt: new Date().toISOString(), image: 'https://picsum.photos/seed/burger/200/200' },
  { id: 'a3', name: 'Washroom South (Level 1)', type: 'Washroom', zoneId: 'z6', walkMinutes: 1, queueMinutes: 15, queueBand: 'High', confidence: 0.85, isRecommended: false, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'a4', name: 'Washroom North-West', type: 'Washroom', zoneId: 'z5', walkMinutes: 3, queueMinutes: 2, queueBand: 'Low', confidence: 0.92, isRecommended: true, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'a5', name: 'First Aid Point', type: 'FirstAid', zoneId: 'z5', walkMinutes: 4, queueMinutes: 0, queueBand: 'Low', confidence: 1.0, isRecommended: false, status: 'Open', updatedAt: new Date().toISOString() },
  { id: 'a6', name: 'Merchandise Hub', type: 'Merchandise', zoneId: 'z6', walkMinutes: 2, queueMinutes: 5, queueBand: 'Moderate', confidence: 0.8, isRecommended: false, status: 'Open', updatedAt: new Date().toISOString() },
];

export const INITIAL_PATHS: Path[] = [
  { id: 'p1', fromZoneId: 'z1', toZoneId: 'z5', baseWeight: 2, isClosed: false, emergencyBlocked: false, label: 'North Stand to Concourse' },
  { id: 'p2', fromZoneId: 'z5', toZoneId: 'z11', baseWeight: 1, isClosed: false, emergencyBlocked: false, label: 'Concourse to Food Court A' },
  { id: 'p3', fromZoneId: 'z5', toZoneId: 'z7', baseWeight: 3, isClosed: false, emergencyBlocked: false, label: 'Concourse to Gate A' },
  { id: 'p4', fromZoneId: 'z2', toZoneId: 'z6', baseWeight: 2, isClosed: false, emergencyBlocked: false, label: 'South Stand to Concourse' },
  { id: 'p5', fromZoneId: 'z6', toZoneId: 'z12', baseWeight: 1, isClosed: false, emergencyBlocked: false, label: 'Concourse to Food Court B' },
  { id: 'p6', fromZoneId: 'z6', toZoneId: 'z8', baseWeight: 3, isClosed: false, emergencyBlocked: false, label: 'Concourse to Gate B' },
  { id: 'p7', fromZoneId: 'z5', toZoneId: 'z6', baseWeight: 5, isClosed: false, emergencyBlocked: false, label: 'Main Concourse Loop' },
  { id: 'p8', fromZoneId: 'z6', toZoneId: 'z10', baseWeight: 4, isClosed: false, emergencyBlocked: false, label: 'South Concourse to Gate D' },
];

export const INITIAL_MATCH: MatchState = {
  teams: { home: 'IND', away: 'AUS' },
  score: '184/4',
  overs: '32.4',
  session: 'Session 2',
  moment: 'Normal Play',
  timeToBreak: 15,
};
