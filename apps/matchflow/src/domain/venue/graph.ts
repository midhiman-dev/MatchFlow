/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VenueGraph, VenueNode, Path, VenueStatus, Zone, Amenity } from './types';

/**
 * Retrieves a node (Zone, Gate, or Amenity) by its ID from the graph.
 */
export function getNodeById(graph: VenueGraph, id: string): VenueNode | undefined {
  return graph.nodes.find(n => n.id === id);
}

/**
 * Gets all paths originating from or terminating at a specific node.
 */
export function getPathsForNode(graph: VenueGraph, nodeId: string): Path[] {
  return graph.paths.filter(p => p.fromNodeId === nodeId || (!p.isDirectional && p.toNodeId === nodeId));
}

/**
 * Gets all nodes directly connected to a specific node via open paths.
 */
export function getConnectedNodes(graph: VenueGraph, nodeId: string): VenueNode[] {
  const nodePaths = getPathsForNode(graph, nodeId);
  const connectedIds = nodePaths
    .filter(p => p.status === 'open')
    .map(p => (p.fromNodeId === nodeId ? p.toNodeId : p.fromNodeId));
  
  return graph.nodes.filter(n => connectedIds.includes(n.id));
}

/**
 * Checks if a node is currently open.
 */
export function isNodeOpen(node: VenueNode): boolean {
  return node.status === 'open' || node.status === 'congested';
}

/**
 * Checks if a path is currently open.
 */
export function isPathOpen(path: Path): boolean {
  return path.status === 'open';
}

/**
 * Utility to find all amenities of a specific type.
 */
export function getAmenitiesByType(graph: VenueGraph, type: Amenity['type']): Amenity[] {
  return graph.amenities.filter(a => a.type === type);
}

/**
 * Gets the parent zone for an amenity.
 */
export function getZoneForAmenity(graph: VenueGraph, amenity: Amenity): Zone | undefined {
  return graph.zones.find(z => z.id === amenity.zoneId);
}
