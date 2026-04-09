# Spec 01 - Venue Domain Model

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Architect Agent

## Why
MatchFlow requires a structured, graph-based representation of the stadium to enable core features like heat mapping, queue-aware guidance, and emergency rerouting. A unified domain model ensures consistency across the fan app, operator dashboard, and simulation logic.

Answer:
- **What user or operator problem does this solve?** It provides the spatial "map" that allows fans to find amenities and operators to manage crowd flow.
- **Why is it important for the 72-hour MVP build?** It is the foundational layer upon which all other features (routing, heatmaps, simulator) are built.
- **What business/demo value does it unlock?** Enables believable routing outcomes and visible operational state transitions (e.g., closing a gate and seeing routes update).
- **Why should it be built now instead of later?** Without a defined domain model, other agents cannot implementation services or UI that depend on venue state.

---

## What
Define and implement the core venue domain model as a simplified graph of zones, paths, gates, and amenities.

### Include
- Shared TypeScript interfaces for all venue entities.
- A seed dataset representing a believable cricket venue (e.g., "MatchFlow Stadium").
- Basic graph validation rules (e.g., ensuring paths connect valid nodes).
- Support for "Closure" states on paths and zones.

### Must not be
- A CAD/BIM digital twin integration.
- A seat-level coordinate system.
- Dependent on real-time sensor hardware.

---

## Success Criteria
- Domain types are defined and shared across the application.
- Seed data represents a complete, traversable stadium graph with at least 4 stands, 8 concourse sections, and 10+ amenities.
- Validation logic catches disconnected nodes or invalid path definitions.
- The model supports toggling `status: "closed"` on any path or zone.

---

## Scope

### In Scope
- Core entities: `Zone`, `Path`, `Gate`, `Amenity`.
- Descriptive metadata for each (id, name, capacity, status).
- Graph structure (nodes and edges).
- Seed venue data (hardcoded or JSON).
- Validation utilities for the venue graph.

### Out of Scope
- Full indoor positioning (IPS).
- Geo-spatial coordinates (Lat/Long) unless simplified as 2D coordinates for rendering.
- Seat-level inventory or tracking.
- Rendering logic or UI components.

### Explicit Non-Goals
- No integration with external mapping APIs (Google Maps/Mapbox) for the 2D venue layout.
- No real-time sensor data ingestion in this slice.

---

## Constraints

### Product Constraints
- Must align with the "zone-based" architecture decision.
- Must be believable for a high-capacity stadium scenario.

### Technical Constraints
- Use TypeScript for all definitions.
- Keep the model serializable (for Firebase/JSON).
- Place domain code in a central, reusable location (e.g., `src/domain/`).

### Delivery Constraints
- No code implementation in this spec-creation task.
- Tasks must be small and verifiable.

---

## Dependencies

### Upstream dependencies
- `docs/architecture/architecture-overview.md`
- `docs/product/PRD.md`

### Downstream dependencies
- `02-fan-app-shell`
- `03-live-heatmap`
- `04-queue-alerts`
- `06-emergency-reroute`

---

## Current State

### Relevant files
- `src/types.ts` (contains prototype types to be refactored)
- `src/constants.ts` (contains prototype seed data to be refactored)

### Existing patterns to follow
- Simplified zone-level modeling from the AI Studio prototype.

### Existing behavior
- Prototype has basic `Zone` and `Amenity` types but lacks a formal graph-based `Path` model for multi-hop routing.

---

## Proposed Approach
- Extract and refine existing prototype types into a modular domain structure.
- Define a `VenueGraph` object that holds nodes (Zones/Amenities/Gates) and edges (Paths).
- Use a adjacency list or similar simple graph structure for traversability.
- Implement validation helper: `validateVenueGraph(graph): ValidationResult`.

---

## Data / Domain Model Impact

### New types / entities
- `VenueNode`: Base type for anything on the map.
- `Zone` (extends `VenueNode`): Stands, Concourses, Gate Areas.
- `Amenity` (extends `VenueNode`): Washrooms, Concessions.
- `Gate` (extends `VenueNode`): Entry/Exit points.
- `Path`: Connects two `VenueNodes`. Includes `isDirectional`, `weight` (length/friction), and `status`.

### Updated contracts
- Refine existing prototype `Zone` and `Amenity` types to include `nodeId` for graph linkage.

---

## UX / UI Notes
(Not applicable for this domain-level spec)

---

## Realtime / Offline / Security Notes

### Realtime
- Venue graph topology is mostly static but `status` (Open/Closed) must be updated in real-time.

### Offline
- Full venue graph and seed data must be cached for offline routing.

---

## Tasks

### T1 - Define Shared Domain Interfaces
**Goal**  
Establish the TypeScript contracts for the venue model in a central location.

**Files likely involved**  
- `src/domain/types/venue.ts`
- `src/domain/types/zone.ts`
- `src/domain/types/path.ts`

**Implementation notes**  
- Create `VenueNode`, `Zone`, `Amenity`, `Gate`, and `Path` interfaces.
- Ensure all types support a `status` field (`"open" | "closed" | "congested"`).
- Define `VenueGraph` as a collection of these entities.

**Must not**  
- Include UI properties or rendering logic.

**Verification**  
- Typecheck passes.

---

### T2 - Implement Seed Venue Graph
**Goal**  
Create a believable seed dataset for a large cricket stadium (e.g., 50k+ capacity).

**Files likely involved**  
- `src/domain/constants/matchFlowStadium.ts`

**Implementation notes**  
- Define 4 main stands (North, South, East, West).
- Define concourse loops (Inner/Outer) connecting the stands.
- Place washrooms and concessions in each concourse segment.
- Connect all nodes with `Path` objects.

**Must not**  
- Hardcode logic into the data file; it should be pure static data.

**Verification**  
- Manually review the graph for completeness and logical connectivity.

---

### T3 - Venue Graph Validation Utility
**Goal**  
Provide a way to ensure the venue graph is logically sound before the app starts.

**Files likely involved**  
- `src/domain/validation/venueValidator.ts`

**Implementation notes**  
- Check for duplicate node IDs.
- Check for paths pointing to non-existent nodes.
- Identify "islands" (isolated nodes with no paths).

**Must not**  
- Throw errors that crash the app; return a report or use console warnings for the MVP.

**Verification**  
- Unit test with a broken graph fixture.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] Seed data represents valid stadium topology
- [ ] No unrelated regressions observed
- [ ] Docs updated if behavior/contracts changed

### Manual verification checklist
- [ ] Review `matchFlowStadium.ts` for logical flow (e.g., Can I get from Stand A to Gate B via the Concourse?).

---

## Risks / Edge Cases
- **Graph Complexity**: Too many nodes/paths may lead to slower recomputation if not optimized.
- **Disconnected Nodes**: Seed data errors could break routing logic without clear errors.

---

## Change Log

### v1
- Initial draft based on PRD and Architecture Overview.
- Extracted domain logic from prototype context.
