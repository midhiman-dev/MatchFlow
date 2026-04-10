# 03 - Live Heatmap & Zone State

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Architect / Realtime & Backend

## Why

Cricket stadiums experience intense, predictable surges during innings breaks, DRS decisions, wickets, and match endings. Operators and fans need real-time, actionable visibility into crowd distribution to manage these peaks safely and efficiently.

Answer:
- **What user or operator problem does this solve?** It solves the lack of visibility into crowd hotspots, preventing bottlenecks and improving fan movement.
- **Why is it important for the 72-hour MVP build?** It is the "wow" feature that demonstrates real-time stadium intelligence and decision support.
- **What business/demo value does it unlock?** It proves that MatchFlow can handle high-pressure scenarios with scannable, data-driven insights.
- **Why should it be built now instead of later?** The heatmap is the foundation for routing intelligence and queue alerts.

---

## What

This spec defines the live crowd state model and the operator-facing visualization for zone congestion.

### Include
- **Zone Live State Model**: A structured RTDB schema for real-time metrics.
- **Density & Flow Visualization**: An operator-facing heatmap component using non-color-only status indicators.
- **Unified Status Bands**: Standardized congestion levels (Low, Moderate, High, Critical) used across the platform.
- **Operational Metadata**: Timestamps, confidence scores, and flow rates.
- **Fan-Safe Hooks**: Simplified status readouts for use in the fan application.

### Must not be
- A simulator (this spec consumes data, it doesn't generate it).
- A seat-level tracker.
- A full routing engine.

---

## Success Criteria

- Operator can see a scannable heatmap of all stadium zones.
- RTDB updates are reflected in the UI with sub-second latency (in demo conditions).
- Zone status is communicated via both color and text/labels (accessibility).
- Stale data (>60s) is visibly marked as "Stale" or "Offline".
- All metrics (density, flow, queue pressure) are present in the data model.

---

## Scope

### In Scope
- RTDB schema definition for `/live/zones/{zoneId}`.
- Shared TypeScript interfaces for `ZoneLiveState`.
- Operator Dashboard "Heat View" component.
- Mock data seed script for local development.
- Stale-state visual treatment.

### Out of Scope
- Queue estimation logic (Spec 04 handles this).
- Simulator logic/scenario generation (Spec 08 handles this).
- CCTV/Computer Vision integration.
- Indoor positioning / Geolocation.

### Explicit Non-Goals
- No seat-level live tracking.
- No historical analytics (Live state only).
- No production-grade sensor integration.

---

## Constraints

### Product Constraints
- Must fit MatchFlow MVP scope
- Must preserve demo credibility
- Must prioritize usability and accessibility
- Must support cricket-stadium use cases where relevant

### Technical Constraints
- Data must live in **Firebase Realtime Database** for live distribution.
- Use **React + TypeScript**.
- Keep payloads compact to ensure performance under surge conditions.

---

## Dependencies

### Upstream dependencies
- `.ai/specs/01-venue-domain-model.md`: Requires zone IDs and names.

### Downstream dependencies
- `.ai/specs/04-queue-alerts.md`: Will use zone pressure to refine wait times.
- `.ai/specs/06-emergency-reroute.md`: Will use congestion data to weight routes.

---

## Current State

### Relevant files
- `apps/matchflow/src/types/venue.ts`
- `apps/matchflow/src/services/firebase.ts`

### Existing patterns to follow
- Zone IDs from the Venue Domain Model.
- Standardized UI color palettes from `DESIGN.md`.

---

## Proposed Approach

### Realtime Database Structure
```json
{
  "live": {
    "zones": {
      "ZONE_A1": {
        "density": 0.85,
        "status": "high",
        "flowDirection": "inbound",
        "entryRate": 45,
        "exitRate": 10,
        "queuePressure": 0.7,
        "updatedAt": 1712750000000,
        "confidence": 0.95
      }
    }
  }
}
```

### Shared Types
Create a centralized `ZoneLiveState` interface to be shared between operator and fan modules.

### Component Logic
- **OperatorHeatmap**: Renders a grid or list of zones with status badges.
- **FreshnessHook**: A hook to calculate if data is stale based on the `updatedAt` field.

---

## Data / Domain Model Impact

### New types / entities
- `ZoneLiveState`: The core real-time metric object.
- `ZoneStatus`: Enum/Union of `low | moderate | high | critical`.
- `FlowDirection`: Enum/Union of `inbound | outbound | stable | circular`.

---

## UX / UI Notes

### Operator UX expectations
- Fast-scanning "Traffic Light" system + Text Labels.
- High-pressure zones ("Critical") should jump out visually (e.g., pulsing or distinct borders).
- Ability to see trend direction (arrow icons for flow).

### Accessibility expectations
- High contrast (Text on status background).
- Non-color-only state (Status label: "HIGH" must be visible, not just red).
- Large touch targets for selecting zones for more detail.

---

## Realtime / Offline / Security Notes

### Realtime
- RTDB listeners for `/live/zones`.
- Update cadence: ~5-10s normally, ~1-2s during active surges (Simulator controlled).

### Offline
- Show last-known state with a "Disconnected" overlay.
- Mark timestamps clearly for all data points.

### Security
- Public (Fan) can READ `/live/zones` (limited fields if necessary).
- Operators can READ and potentially OVERRIDE (for demo/manual intervention).

---

## Tasks

### T1 - Define Shared Types and RTDB Schema

**Goal**  
Establish the technical contract for zone live state.

**Files likely involved**  
- `apps/matchflow/src/types/live.ts`
- `apps/matchflow/src/services/liveStateService.ts`

**Implementation notes**  
- Define `ZoneLiveState` interface.
- Create initial RTDB schema documentation/constants.
- Implement a basic service to subscribe to zone updates.

**Must not**  
- Implement simulator logic.

**Verification**  
- Typecheck pass.
- Log RTDB updates in console using mock data.

---

### T2 - Implement Operator Heatmap View

**Goal**  
Create the primary dashboard visualization for crowd density.

**Files likely involved**  
- `apps/matchflow/src/components/operator/HeatmapGrid.tsx`
- `apps/matchflow/src/components/operator/ZoneStatusCard.tsx`

**Implementation notes**  
- Render zones in a responsive grid.
- Apply conditional styling based on `status`.
- Display flow direction and pressure metrics.

**Must not**  
- Include routing or emergency controls.

**Verification**  
- Manual visual check against `DESIGN.md`.
- Verify non-color status indication is present.

---

### T3 - Implement Freshness and Fan-Safe Hooks

**Goal**  
Handle data decay and provide simplified hooks for the fan app.

**Files likely involved**  
- `apps/matchflow/src/hooks/useZoneHealth.ts`
- `apps/matchflow/src/components/shared/FreshnessIndicator.tsx`

**Implementation notes**  
- Create a hook to return `isStale` and human-readable "Last updated X ago".
- Create a simplified version of zone state for the Fan App (e.g., merging density and status).

**Must not**  
- Expose raw operational confidence scores to fans if they cause confusion.

**Verification**  
- Test with simulated clock delay to trigger "Stale" state.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] RTDB updates propagate to UI in <1s
- [ ] "Stale" state triggers after 60s of no updates
- [ ] Accessibility: High contrast and text labels confirmed

### Manual verification checklist
- [ ] Open Operator Dashboard, see mock zone cards.
- [ ] Manually change a value in Firebase Console; verify UI updates.
- [ ] Disconnect network, verify "Offline/Stale" messaging appears.

---

## Risks / Edge Cases

- **Data Explosion**: Too many zones updating too fast could lag the client. Solution: Throttle updates to 1s.
- **Clock Drift**: `updatedAt` might mismatch between server and client. Solution: Use `serverTimestamp`.
- **Misleading Data**: High density doesn't always mean "Bad" (e.g., Gate entry). Solution: Use context-aware status bands.

---

## Rollback / Safe Failure Notes

- If live data is null, fallback to "Venue model defaults" (Empty).
- If RTDB connection fails, show "Live data unavailable".

---

## Documentation Updates Required

- `docs/api/contracts.md` (Add ZoneLiveState)
- `docs/architecture/decisions.md` (RTDB usage for live state)

---

## Suggested Commit Strategy

- `feat(live-state): add shared zone live state types and RTDB schema`
- `feat(operator-ui): implement heatmap grid and zone cards`
- `feat(hooks): add data freshness and staleness handling`

---

## Implementation Prompt Template

> Read this spec and `skills.md`. Implement **[TASK ID] only**.  
> Stay within the defined scope and constraints.  
> Do not modify unrelated files.  
> Follow existing repo patterns.  
> Complete the listed verification steps and report results.

---

## Review Prompt Template

> Review the implementation of **[TASK ID]** against this spec and `skills.md`.  
> Check for:
> - RTDB schema compliance
> - Accessibility (non-color-only)
> - Stale data handling
> - Payload efficiency
> Report mismatches clearly.

---

## Definition of Done

This spec is done when:
- RTDB schema is live and seeded.
- Operator heatmap is scannable and accessible.
- Freshness logic protects against stale data.
- The slice is ready to be consumed by the Routing and Simulator specs.

---

## Change Log

### v1
- Initial draft covering zone live state metrics and operator heatmap.
