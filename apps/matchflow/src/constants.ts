
import { Zone, Amenity, Path, MatchState } from './types';

import { 
  INITIAL_ZONES as SEED_ZONES, 
  INITIAL_AMENITIES as SEED_AMENITIES, 
  INITIAL_PATHS as SEED_PATHS 
} from './domain/venue/seed';

export const INITIAL_ZONES: Zone[] = SEED_ZONES;
export const INITIAL_AMENITIES: Amenity[] = SEED_AMENITIES;
export const INITIAL_PATHS: Path[] = SEED_PATHS;


export const INITIAL_MATCH: MatchState = {
  teams: { home: 'IND', away: 'AUS' },
  score: '184/4',
  overs: '32.4',
  session: 'Session 2',
  moment: 'Normal Play',
  timeToBreak: 15,
};
