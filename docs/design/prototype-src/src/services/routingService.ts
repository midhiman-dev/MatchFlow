
import { Zone, Path } from '../types';

export interface RouteStep {
  instruction: string;
  distance: number;
  zoneId: string;
}

export interface RouteResult {
  steps: RouteStep[];
  totalTime: number;
  status: 'Clear' | 'Congested' | 'Blocked';
}

export function calculateRoute(
  startZoneId: string,
  endZoneId: string,
  zones: Zone[],
  paths: Path[]
): RouteResult {
  // Simple heuristic: find direct path or one-hop path
  // In a real app, this would be Dijkstra
  
  const startZone = zones.find(z => z.id === startZoneId);
  const endZone = zones.find(z => z.id === endZoneId);
  
  if (!startZone || !endZone) return { steps: [], totalTime: 0, status: 'Blocked' };
  
  // Direct path
  const directPath = paths.find(p => 
    (p.fromZoneId === startZoneId && p.toZoneId === endZoneId) ||
    (p.fromZoneId === endZoneId && p.toZoneId === startZoneId)
  );

  if (directPath && !directPath.isClosed && !directPath.emergencyBlocked) {
    return {
      steps: [
        { instruction: `Proceed from ${startZone.name} to ${endZone.name}`, distance: directPath.baseWeight * 100, zoneId: endZoneId }
      ],
      totalTime: directPath.baseWeight,
      status: endZone.congestionBand === 'Critical' ? 'Congested' : 'Clear'
    };
  }

  // One-hop path via Concourse (z5 or z6)
  const viaZones = ['z5', 'z6'];
  for (const viaId of viaZones) {
    const path1 = paths.find(p => 
      (p.fromZoneId === startZoneId && p.toZoneId === viaId) ||
      (p.fromZoneId === viaId && p.toZoneId === startZoneId)
    );
    const path2 = paths.find(p => 
      (p.fromZoneId === viaId && p.toZoneId === endZoneId) ||
      (p.fromZoneId === endZoneId && p.toZoneId === viaId)
    );

    if (path1 && path2 && !path1.isClosed && !path2.isClosed && !path1.emergencyBlocked && !path2.emergencyBlocked) {
      const viaZone = zones.find(z => z.id === viaId)!;
      return {
        steps: [
          { instruction: `Head to ${viaZone.name}`, distance: path1.baseWeight * 100, zoneId: viaId },
          { instruction: `From ${viaZone.name}, proceed to ${endZone.name}`, distance: path2.baseWeight * 100, zoneId: endZoneId }
        ],
        totalTime: path1.baseWeight + path2.baseWeight,
        status: (viaZone.congestionBand === 'Critical' || endZone.congestionBand === 'Critical') ? 'Congested' : 'Clear'
      };
    }
  }

  return {
    steps: [{ instruction: 'No safe route found. Please wait for steward instructions.', distance: 0, zoneId: startZoneId }],
    totalTime: 0,
    status: 'Blocked'
  };
}
