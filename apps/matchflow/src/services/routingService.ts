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
  // Construct a temporary graph using the live state from context
  const graph: VenueGraph = {
    nodes: zones, // simplified: all zones/amenities are nodes
    zones,
    amenities: [], // amenities should be nodes too if we want to route to them
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
