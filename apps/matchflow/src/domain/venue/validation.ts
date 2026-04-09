/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VenueGraph, Path, VenueNode } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Performs a full validation of the venue graph structure.
 */
export function validateVenueGraph(graph: VenueGraph): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  validateNodes(graph, result);
  validatePaths(graph, result);
  validateConnectivity(graph, result);

  result.isValid = result.errors.length === 0;
  return result;
}

/**
 * Ensures all nodes have unique IDs and basic required fields.
 */
function validateNodes(graph: VenueGraph, result: ValidationResult) {
  const ids = new Set<string>();
  
  graph.nodes.forEach(node => {
    if (ids.has(node.id)) {
      result.errors.push(`Duplicate node ID found: ${node.id}`);
    }
    ids.add(node.id);

    if (!node.name) {
      result.errors.push(`Node ${node.id} is missing a name`);
    }
  });

  // Verify that all zones and amenities are also in the main nodes array
  graph.zones.forEach(zone => {
    if (!graph.nodes.find(n => n.id === zone.id)) {
      result.errors.push(`Zone ${zone.id} (${zone.name}) missing from master nodes array`);
    }
  });

  graph.amenities.forEach(amenity => {
    if (!graph.nodes.find(n => n.id === amenity.id)) {
      result.errors.push(`Amenity ${amenity.id} (${amenity.name}) missing from master nodes array`);
    }
    
    // Amenity must point to a valid zone
    if (!graph.zones.find(z => z.id === amenity.zoneId)) {
      result.errors.push(`Amenity ${amenity.id} points to non-existent zone ${amenity.zoneId}`);
    }
  });
}

/**
 * Validates that all paths point to existing nodes.
 */
function validatePaths(graph: VenueGraph, result: ValidationResult) {
  const nodeIds = new Set(graph.nodes.map(n => n.id));

  graph.paths.forEach(path => {
    if (!nodeIds.has(path.fromNodeId)) {
      result.errors.push(`Path ${path.id} has invalid fromNodeId: ${path.fromNodeId}`);
    }
    if (!nodeIds.has(path.toNodeId)) {
      result.errors.push(`Path ${path.id} has invalid toNodeId: ${path.toNodeId}`);
    }
    if (path.fromNodeId === path.toNodeId) {
      result.warnings.push(`Path ${path.id} is a self-loop (from ${path.fromNodeId} to ${path.toNodeId})`);
    }
  });
}

/**
 * Checks for isolated nodes (islands).
 */
function validateConnectivity(graph: VenueGraph, result: ValidationResult) {
  const nodeIdsWithPaths = new Set<string>();
  
  graph.paths.forEach(p => {
    nodeIdsWithPaths.add(p.fromNodeId);
    nodeIdsWithPaths.add(p.toNodeId);
  });

  graph.nodes.forEach(node => {
    if (!nodeIdsWithPaths.has(node.id)) {
      result.warnings.push(`Node ${node.id} (${node.name}) is isolated (no connected paths)`);
    }
  });
}

/**
 * Type guard to check if a node is a Zone.
 */
export function isZone(node: VenueNode): node is any {
  return 'capacity' in node && 'type' in node;
}

/**
 * Type guard to check if a node is an Amenity.
 */
export function isAmenity(node: VenueNode): node is any {
  return 'zoneId' in node && 'walkMinutes' in node;
}
