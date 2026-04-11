import { 
  MATCHFLOW_STADIUM_GRAPH, 
  RoutingEngine, 
  RoutePolicy,
  VenueGraph,
  Zone,
  Path,
  CongestionBand
} from '../domain/venue';
import { ZoneLiveState } from '../domain/live/types';

export interface RouteStep {
  instruction: string;
  distance: number;
  zoneId: string;
}

export interface RouteResult {
  steps: RouteStep[];
  totalTime: number;
  status: 'Clear' | 'Congested' | 'Blocked';
  explanation?: string;
}

const statusToBand = (status: string): CongestionBand => {
  switch (status) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'moderate': return 'Moderate';
    default: return 'Low';
  }
};

/**
 * Bridge function to connect the UI to the domain RoutingEngine.
 */
export function calculateRoute(
  startZoneId: string,
  endZoneId: string,
  zones: Zone[],
  paths: Path[],
  liveStates: Record<string, ZoneLiveState> = {},
  policy: RoutePolicy = 'Normal'
): RouteResult {
  // Construct a temporary graph using the live state from context
  const mergedZones = zones.map(z => {
    const live = liveStates[z.id];
    if (!live) return z;
    return {
      ...z,
      congestionBand: statusToBand(live.status),
      densityScore: live.density
    };
  });

  const graph: VenueGraph = {
    nodes: mergedZones,
    zones: mergedZones,
    amenities: [],
    paths
  };

  const engine = new RoutingEngine(graph);
  const result = engine.calculateRoute(startZoneId, endZoneId, policy);

  return {
    steps: result.steps.map(s => ({
      instruction: s.instruction,
      distance: s.weight * 100,
      zoneId: s.nodeId
    })),
    totalTime: result.totalWeight,
    status: result.status === 'Safe' ? 'Clear' : result.status,
    explanation: result.explanation
  };
}
