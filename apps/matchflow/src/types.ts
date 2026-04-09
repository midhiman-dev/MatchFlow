
export type CongestionBand = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface Zone {
  id: string;
  name: string;
  type: 'Stand' | 'Concourse' | 'Gate' | 'AmenityArea';
  capacity: number;
  currentFans: number;
  congestionBand: CongestionBand;
  densityScore: number; // 0 to 1
  entryRate: number;
  exitRate: number;
  status: 'Open' | 'Closed' | 'Emergency';
  updatedAt: string;
}

export type AmenityType = 'Food' | 'Washroom' | 'FirstAid' | 'Merchandise';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  zoneId: string;
  walkMinutes: number;
  queueMinutes: number;
  queueBand: CongestionBand;
  confidence: number; // 0 to 1
  isRecommended: boolean;
  status: 'Open' | 'Closed';
  updatedAt: string;
  image?: string;
}

export interface Path {
  id: string;
  fromZoneId: string;
  toZoneId: string;
  baseWeight: number; // distance or time
  isClosed: boolean;
  emergencyBlocked: boolean;
  label: string;
}

export interface Alert {
  id: string;
  type: 'Info' | 'Warning' | 'Emergency' | 'Recommendation';
  title: string;
  message: string;
  timestamp: string;
  targetZoneId?: string;
  actionUrl?: string;
  isRead: boolean;
}

export interface Order {
  id: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Failed';
  timestamp: string;
  type: 'Pickup' | 'InSeat';
  seatInfo?: string;
}

export interface MatchState {
  teams: { home: string; away: string };
  score: string;
  overs: string;
  session: string;
  moment: string; // e.g., "Innings Break Soon", "Wicket Surge"
  timeToBreak?: number; // minutes
}

export type ScenarioType = 'Normal' | 'InningsBreak' | 'DRSSpike' | 'WicketSurge' | 'ExitRush' | 'Emergency';

export interface AppState {
  role: 'Fan' | 'Operator' | 'Steward';
  connectivity: 'Connected' | 'Weak' | 'Offline';
  activeScenario: ScenarioType;
  emergencyActive: boolean;
  zones: Zone[];
  amenities: Amenity[];
  paths: Path[];
  alerts: Alert[];
  orders: Order[];
  match: MatchState;
  fanLocation: string; // zoneId
}
