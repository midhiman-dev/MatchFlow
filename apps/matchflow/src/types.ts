import { 
  Zone as DomainZone, 
  Amenity as DomainAmenity, 
  Path as DomainPath,
  CongestionBand as DomainCongestionBand,
  VenueStatus
} from './domain/venue/types';

export type CongestionBand = DomainCongestionBand;
export type Zone = DomainZone;
export type Amenity = DomainAmenity;
export type Path = DomainPath;

export type { 
  VenueStatus,
  VenueNode,
  ZoneType,
  AmenityType,
  Gate,
  Closure,
  EventTrigger,
  VenueGraph 
} from './domain/venue/types';

import { 
  ZoneLiveState, 
  ZoneStatus, 
  AmenityLiveState,
  AmenityStatus,
  FlowDirection, 
  HotspotSummary 
} from './domain/live/types';

export type { 
  ZoneLiveState, 
  ZoneStatus, 
  AmenityLiveState,
  AmenityStatus,
  FlowDirection, 
  HotspotSummary 
};


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
  liveStates: Record<string, ZoneLiveState>;
  amenityLiveStates: Record<string, AmenityLiveState>;
  fanLocation: string; // zoneId
  lastSyncTime: string | null;
}
