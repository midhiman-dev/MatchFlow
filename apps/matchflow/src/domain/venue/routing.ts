/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VenueGraph, VenueNode, Path, Zone, VenueStatus } from './types';
import { getNodeById, getPathsForNode } from './graph';

export type RoutePolicy = 'Normal' | 'Emergency';

export interface RouteStep {
  nodeId: string;
  nodeName: string;
  instruction: string;
  weight: number;
}

export interface RouteResult {
  steps: RouteStep[];
  totalWeight: number;
  status: 'Safe' | 'Congested' | 'Blocked';
  explanation: string;
  policy: RoutePolicy;
}

/**
 * Heuristic-based routing engine for MatchFlow.
 */
export class RoutingEngine {
  constructor(private graph: VenueGraph) {}

  /**
   * Calculates the best route between two nodes based on the given policy.
   */
  public calculateRoute(
    startNodeId: string,
    endNodeId: string,
    policy: RoutePolicy = 'Normal'
  ): RouteResult {
    const startNode = getNodeById(this.graph, startNodeId);
    const endNode = getNodeById(this.graph, endNodeId);

    if (!startNode || !endNode) {
      return this.blockedResult('Invalid start or end location.', policy);
    }

    if (startNodeId === endNodeId) {
      return {
        steps: [{
          nodeId: startNodeId,
          nodeName: startNode.name,
          instruction: 'You are already at your destination.',
          weight: 0
        }],
        totalWeight: 0,
        status: 'Safe',
        explanation: 'Destination reached.',
        policy
      };
    }

    const { distances, previous, explanations } = this.dijkstra(startNodeId, policy);

    if (distances[endNodeId] === Infinity) {
      const closureExplanations = explanations.filter(e => e.includes('closed'));
      const mainReason = closureExplanations.length > 0 
        ? `Route blocked by closures: ${closureExplanations.join(', ')}` 
        : 'No traversable path found to destination.';
      
      return this.blockedResult(mainReason, policy);
    }

    const steps = this.reconstructPath(previous, endNodeId);
    const totalWeight = distances[endNodeId];
    
    // Determine overall status
    let status: RouteResult['status'] = 'Safe';
    const hasCongestion = steps.some(s => {
      const zone = this.graph.zones.find(z => z.id === s.nodeId);
      return zone && (zone.congestionBand === 'High' || zone.congestionBand === 'Critical');
    });
    if (hasCongestion) status = 'Congested';

    // Generate explanation
    let explanation = policy === 'Emergency' 
      ? 'Emergency route prioritizing safety and speed.'
      : 'Optimal route based on distance and current crowd flow.';
    
    if (explanations.length > 0 && policy === 'Normal') {
      const congestionAvoided = explanations.find(e => e.includes('congested'));
      if (congestionAvoided) {
        explanation += ` Note: ${congestionAvoided}`;
      }
    }

    return {
      steps,
      totalWeight,
      status,
      explanation,
      policy
    };
  }

  private dijkstra(startNodeId: string, policy: RoutePolicy) {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const nodes = new Set<string>();
    const explanations: string[] = [];

    for (const node of this.graph.nodes) {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      nodes.add(node.id);
    }

    distances[startNodeId] = 0;

    while (nodes.size > 0) {
      // Get node with smallest distance
      let shortestDistance = Infinity;
      let closestNodeId: string | null = null;

      for (const nodeId of nodes) {
        if (distances[nodeId] < shortestDistance) {
          shortestDistance = distances[nodeId];
          closestNodeId = nodeId;
        }
      }

      if (closestNodeId === null || distances[closestNodeId] === Infinity) break;

      nodes.delete(closestNodeId);

      const paths = getPathsForNode(this.graph, closestNodeId);
      for (const path of paths) {
        const neighborId = path.fromNodeId === closestNodeId ? path.toNodeId : path.fromNodeId;
        if (!nodes.has(neighborId)) continue;

        const weight = this.calculateWeight(path, neighborId, policy, explanations);
        const alt = distances[closestNodeId] + weight;

        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = closestNodeId;
        }
      }
    }

    return { distances, previous, explanations: Array.from(new Set(explanations)) };
  }

  private calculateWeight(path: Path, toNodeId: string, policy: RoutePolicy, explanations: string[]): number {
    if (path.status === 'closed') {
      explanations.push(`Path ${path.label} is closed.`);
      return Infinity;
    }

    const toNode = getNodeById(this.graph, toNodeId);
    if (!toNode || toNode.status === 'closed') {
      if (toNode) explanations.push(`Zone ${toNode.name} is closed.`);
      return Infinity;
    }

    let weight = path.baseWeight;

    // Policy-based weighting
    if (policy === 'Normal') {
      const zone = this.graph.zones.find(z => z.id === toNodeId);
      if (zone) {
        if (zone.congestionBand === 'Moderate') weight *= 1.5;
        if (zone.congestionBand === 'High') {
          weight *= 3.0;
          explanations.push(`${zone.name} is heavily congested.`);
        }
        if (zone.congestionBand === 'Critical') {
          weight *= 10.0;
          explanations.push(`${zone.name} is critically congested.`);
        }
      }
    } else if (policy === 'Emergency') {
      // In emergency, we prioritize 'open' and 'safe' routes.
      // We might still avoid congested areas but with less penalty than Normal
      const zone = this.graph.zones.find(z => z.id === toNodeId);
      if (zone) {
        if (zone.congestionBand === 'Critical') weight *= 2.0;
      }
    }

    return weight;
  }

  private reconstructPath(previous: Record<string, string | null>, endNodeId: string): RouteStep[] {
    const path: RouteStep[] = [];
    let currentId: string | null = endNodeId;

    while (currentId !== null) {
      const node = getNodeById(this.graph, currentId);
      if (node) {
        path.unshift({
          nodeId: currentId,
          nodeName: node.name,
          instruction: this.getInstructionForNode(node),
          weight: 0 // Will be set post-reconstruction if needed, but totalWeight is enough for MVP
        });
      }
      currentId = previous[currentId];
    }

    // Refine instructions
    for (let i = 0; i < path.length; i++) {
      if (i === 0) {
        path[i].instruction = `Start at ${path[i].nodeName}`;
      } else if (i === path.length - 1) {
        path[i].instruction = `Arrive at ${path[i].nodeName}`;
      } else {
        path[i].instruction = `Proceed through ${path[i].nodeName}`;
      }
    }

    return path;
  }

  private getInstructionForNode(node: VenueNode): string {
    return `Pass through ${node.name}`;
  }

  private blockedResult(reason: string, policy: RoutePolicy): RouteResult {
    return {
      steps: [],
      totalWeight: 0,
      status: 'Blocked',
      explanation: reason,
      policy
    };
  }
}
