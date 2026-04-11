# 08 - Demo Simulator

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Simulation Agent / Realtime & Backend

## Why

MatchFlow's value proposition—dynamic crowd management during cricket surges—cannot be effectively demonstrated or tested with static data. A believable simulator is required to exercise the system's live intelligence.

Answer:
- **What user or operator problem does this solve?** It allows operators to validate their hotspot detection and intervention workflows. It allows devs to test routing and queue logic under stress.
- **Why is it important for the 72-hour MVP build?** It makes the "live" nature of the product believable for stakeholders and judges without requiring real stadium hardware.
- **What business/demo value does it unlock?** It enables repeatable, structured demo scripts (e.g., "Now we trigger the Innings Break surge...").
- **Why should it be built now instead of later?** It is the primary engine for validating the integration of all other "Live" features (Heatmap, Alerts, Routing).

---

## What

The Demo Simulator is a synthetic event engine that models cricket-specific crowd movement and operational emergencies.

### Include
- **Simulation Control API**: Start, stop, and reset scenarios via the Operator Dashboard.
- **Scenario Logic**: Grouped state transitions for:
    - **Innings Break**: Massive surge toward concessions and washrooms.
    - **DRS Spike**: Sudden burst of in-seat order intent.
    - **Wicket Surge**: localized corridor congestion near the affected stand.
    - **End-Match Exit Rush**: High pressure on gates and outbound paths.
    - **Emergency Closure**: Immediate zone/path blockage and forced reroute.
- **Downstream Publication**: Direct updates to `/live/zones`, `/live/amenities`, and `/live/alerts` in Realtime Database.
- **Believable Delay/jitter**: Heuristics to make state changes feel "live" rather than instant/robotic.

### Must not be
- A physics-accurate crowd simulator (no individual agent modeling).
- A historical data replay tool (it should be interactive).
- Dependent on external sensor hardware.

---

## Success Criteria

- Operator can trigger "Innings Break" and see the Heatmap turn "Severe" in concession zones within 2 seconds.
- Fan app receives a "Smart Prompt" about high queue wait times during a simulated surge.
- Routing engine recomputes paths when a zone is "Closed" by the Emergency scenario.
- Simulator can be reset to "Normal Play" (baseline) state reliably.
- Simulation state (Active Scenario Name, Time Elapsed) is visible on the Ops Dashboard.

---

## Scope

### In Scope
- Simulation Engine (Timer-driven state updates).
- Scenario definitions (JSON-based or structured functions).
- RTDB schema for simulation control (`/live/scenario`).
- Operator "Sim Control Panel" UI.
- Mock "Match Event" triggers (Simulator-driven wickets/DRS).

### Out of Scope
- Detailed order fulfillment simulation (Spec 05 handles basic ordering).
- Real-world map integration (Simulator uses internal venue graph).
- Complex statistical modeling.

### Explicit Non-Goals
- No seat-level tracking.
- No actual CCTV feeds or vision AI.
- No dependency on real match APIs (everything is synthetic).

---

## Constraints

### Product Constraints
- Scenarios must be recognizable as "Cricket Stadium" events.
- Transitions must be smooth enough to be believable but fast enough for a short demo.
- Must preserve MatchFlow MVP scope.

### Technical Constraints
- Must update **Firebase Realtime Database** as the source of truth.
- Must use existing `Venue` graph and `LiveState` types.
- Must run in the browser (Operator Dashboard) or as a lightweight Cloud Run service. (Browser-based engine is preferred for simplicity in the MVP).

---

## Dependencies

### Upstream dependencies
- `01-venue-domain-model.md`: Requires Zones and Amenities.
- `03-live-heatmap.md`: Consumes simulated zone density.
- `04-queue-alerts.md`: Consumes simulated amenity pressure.
- `06-emergency-reroute.md`: Responds to simulated closures.

### Downstream dependencies
- Used by all demo walkthroughs and QA sessions.

---

## Current State

### Relevant files
- `apps/matchflow/src/services/liveStateService.ts`: Currently has some basic random mock updates.
- `apps/matchflow/src/types/live.ts`: Defines `ZoneLiveState` and `AmenityLiveState`.

### Existing behavior
- `liveStateService.ts` currently "simulates" data by randomly jittering values on a 5s interval.
- No concept of "Scenarios" or "Start/Stop" exists yet.

---

## Proposed Approach

### Simulation Engine
A `SimulationEngine` class/hook will:
1. Maintain a `Scenario` state.
2. Every *tick* (e.g., 2000ms), look up the current scenario's "target" values for each zone/amenity.
3. Move current values toward target values using a "momentum" heuristic (avoiding instant jumps).
4. Write results to RTDB.

### RTDB Schema Impact
```json
{
  "live": {
    "scenario": {
      "activeId": "innings-break",
      "startTime": 1712750000000,
      "status": "running",
      "label": "Innings Break Rush"
    }
  }
}
```

---

## Scenario Logic Definitions

| Scenario | Target Zones | Effect |
| :--- | :--- | :--- |
| **Normal Play** | Seating Stands | High Density (0.7), Concourses/Food (0.1) |
| **Innings Break** | Concourses, Washrooms, Food Courts | Density Spike (0.9), Queue Pressure (0.8) |
| **DRS Spike** | Concessions | High "In-Seat Order" signal, Wait times +2 mins |
| **Wicket Surge** | Specific Stand Corridor | Momentary Density Spike (1.0), Flow: Outbound |
| **Exit Rush** | Gates, Ramps, Perimeter | Density Spike (0.9), Flow: Outbound |
| **Emergency** | Blocked Zone/Path | Density: Critical, Status: Closed |

---

## Tasks

### T1 - Simulator Foundation & Control Logic

**Goal**  
Implement the `SimulationEngine` infrastructure and the RTDB control schema. Replace random jitter with state-aware updates.

**Files likely involved**  
- `apps/matchflow/src/services/simulationEngine.ts` (New)
- `apps/matchflow/src/types/live.ts`
- `apps/matchflow/src/services/liveStateService.ts`

**Implementation notes**  
- Define `SimulationScenario` interface.
- Implement `startScenario(id)`, `stopScenario()`, and `resetToBaseline()`.
- Update `liveStateService` to consume the engine's output rather than random jitter.

**Must not**  
- Implement complex individual scenarios yet (just "Normal" vs "Paused").

**Verification**  
- Can toggle simulator state in RTDB and see logs in console.

---

## T2 - Implement Cricket Surge Scenarios

**Goal**  
Define the business logic for Innings Break, DRS, Wicket, and Exit Rush.

**Files likely involved**  
- `apps/matchflow/src/domain/simulation/scenarios.ts` (New)
- `apps/matchflow/src/services/simulationEngine.ts`

**Implementation notes**  
- Map scenarios to specific `ZoneID`s and `AmenityID`s.
- Implement the "Target Value" interpolation logic.
- Ensure "Wicket" scenario is spatially aware (affects stand near the event).

**Verification**  
- Trigger "Innings Break" -> Verify Food Court zones in RTDB turn "High/Critical".
- Trigger "Exit Rush" -> Verify Gate zones turn "High".

---

## T3 - Emergency Scenario & Routing Feedback

**Goal**  
Implement the "Emergency Closure" scenario and ensure it triggers path recomputation and alerts.

**Files likely involved**  
- `apps/matchflow/src/domain/simulation/scenarios.ts`
- `apps/matchflow/src/services/routingService.ts`
- `apps/matchflow/src/services/alertService.ts`

**Implementation notes**  
- Emergency scenario should set a specific zone/path to `status: 'closed'`.
- Ensure `routingService` correctly weights or blocks paths based on simulator-driven closures.
- Automatically emit a "High Priority" alert when Emergency starts.

**Verification**  
- Trigger "Emergency" -> Verify active fan route in PWA changes to an alternate.

---

## T4 - Operator Dashboard: Simulation Controls

**Goal**  
Add a believable "Sim Control Panel" to the Operator Dashboard.

**Files likely involved**  
- `apps/matchflow/src/components/operator/SimulatorControls.tsx` (New)
- `apps/matchflow/src/screens/OpsApp.tsx`

**Implementation notes**  
- Accessible buttons for each scenario.
- Status indicator: "Active: Innings Break (02:45)".
- "Reset to Baseline" safety button.

**Verification**  
- Manual UI test: Click "DRS Spike" and see it reflected in scenario state.

---

## Validation

### Required validation
- [ ] Typecheck/build passes.
- [ ] Scenario transitions are reflected in RTDB within 500ms of toggle.
- [ ] Reset to baseline clears all "High/Critical" statuses.
- [ ] Emergency scenario blocks a pre-defined path and forces a reroute.

### Manual verification checklist
- [ ] Open Ops Dashboard + Fan PWA side-by-side.
- [ ] Trigger "Innings Break" -> See Heatmap turn red + See Fan "Smart Prompt" appear.
- [ ] Trigger "Emergency" -> See Fan route update to alternate.
- [ ] Trigger "Reset" -> See everything return to green/normal.

---

## Risks / Edge Cases

- **Scenario Overlap**: What if two scenarios are triggered? Solution: Simulator is single-active-scenario only.
- **Data Persistence**: Simulator values should NOT overwrite durable Firestore data, only live RTDB state.
- **Performance**: High-frequency updates (>10Hz) could lag the RTDB. Solution: Tick at 1-2Hz.

---

## Documentation Updates Required

- `docs/testing/demo-scenarios.md`: Define the official demo script using the simulator.
- `docs/api/contracts.md`: Add `/live/scenario` schema.

---

## Suggested Commit Strategy

- `feat(sim): add SimulationEngine foundation and RTDB control`
- `feat(sim): implement cricket-aware surge scenarios`
- `feat(sim): add Emergency Closure and routing feedback loop`
- `feat(ops-ui): add simulator control panel to dashboard`

---

## Implementation Prompt Template

> Read this spec and `skills.md`. Implement **[TASK ID] only**.  
> Stay within the defined scope and constraints.  
> Do not modify unrelated files.  
> Follow existing repo patterns for Firebase services.  
> Complete the listed verification steps.

---

## Definition of Done

This spec is done when:
- The Operator can control match-aware surges from the dashboard.
- Heatmap, Queue, and Routing logic all respond predictably to simulated events.
- The simulator is stable enough for a live 5-minute walkthrough.

---

## Change Log

### v1
- Initial draft for 72-hour MVP Demo Simulator.
