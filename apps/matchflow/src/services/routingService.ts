import { 
  MATCHFLOW_STADIUM_GRAPH, 
  RoutingEngine, 
  RoutePolicy,
  VenueGraph,
  Zone,
  Path
} from '../domain/venue';

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

/**
 * Bridge function to connect the UI to the domain RoutingEngine.
 */
export function calculateRoute(
  startZoneId: string,
  endZoneId: string,
  zones: Zone[],
  paths: Path[],
  policy: RoutePolicy = 'Normal'
): RouteResult {
  // Construct a temporary graph if needed, but we usually use the seed for now
  // For the MVP, we use the MATCHFLOW_STADIUM_GRAPH which is the source of truth
  const engine = new RoutingEngine(MATCHFLOW_STADIUM_GRAPH);
  const result = engine.calculateRoute(startZoneId, endZoneId, policy);

  return {
    steps: result.steps.map(s => ({
      instruction: s.instruction,
      distance: s.weight * 100, // Conversion to arbitrary distance for UI
      zoneId: s.nodeId
    })),
    totalTime: result.totalWeight,
    status: result.status === 'Safe' ? 'Clear' : result.status,
    explanation: result.explanation
  };
}
