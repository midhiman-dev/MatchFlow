# 04 - Queue Alerts and Amenity Guidance

## Status
- Approved

## Owner
- Human owner: [Human Name]
- Primary implementing agent: Architect / Frontend / Realtime & Backend

## Why

Cricket stadiums experience extreme crowd surges during innings breaks, DRS decisions, and wickets. Fans often face long, unpredictable queues at washrooms and concessions, leading to frustration and missed match moments.

Answer:
- **What user or operator problem does this solve?** Fans don't know which amenity has the shortest queue. Operators have no visibility into which concessions are overwhelmed.
- **Why is it important for the 72-hour MVP build?** It's a high-impact, visible "smart" feature that differentiates MatchFlow from a static venue map.
- **What business/demo value does it unlock?** Demonstrates load balancing and "wow" moments where the app suggests a better alternative.

---

## What

This spec defines the implementation of a real-time amenity pressure and guidance system. It includes the data model, centralized recommendation logic, and UI enhancements for both fans and operators.

### Include
- **Amenity Live State**: A compact object in Realtime Database for each amenity (queue minutes, band, freshness, confidence).
- **Least-Crowded Recommendation**: A helper that identifies the best nearby amenity of a specific type (e.g., shortest total time = walk + wait).
- **Fan Amenities Screen**: Enhanced list with freshness timestamps, "Recommended" badges, and detailed recommendation reasons.
- **Operator Pressure Hooks**: A dashboard component summarizing top amenity hotspots.

---

## Success Criteria

- Fan can see queue wait bands (Low/Moderate/High) for all nearby amenities.
- Fan sees a "Recommended" tag on at least one amenity when a better alternative exists nearby.
- UI shows a "Updated X min ago" freshness indicator.
- Stale data (e.g., > 5 mins old) causes the UI to degrade from exact minutes to broad bands.
- Operator dashboard shows a list of the top 3 highest-pressure amenities.

---

## Scope

### In Scope
- `AmenityLiveState` data model and RTDB sync.
- Wait-state bands (Low, Moderate, High, Critical).
- Freshness metadata (updatedAt, expiresAt).
- Simplified "Best Nearby" algorithm.
- Fan-facing recommendation detail view.
- Operator-facing amenity pressure summary panel.

### Out of Scope
- Real sensor integration (CCTV/Hardware).
- Order placement or payment (covered in Spec 05).
- Wayfinding/Navigation directions (covered in Spec 02).
- Emergency closure logic (covered in Spec 06).

### Explicit Non-Goals
- No seat-level tracking.
- No historical analytics (MVP focuses on live state).
- No complex predictive modeling beyond simple bands.

---

## Constraints

### Product Constraints
- Must use non-color-only status indicators (e.g., icons or text labels).
- Must remain clear under stadium glare (high contrast).
- Must preserve demo credibility during simulator-driven surges.

### Technical Constraints
- Use **Firebase Realtime Database** for live state sync.
- Keep implementation modular in `apps/matchflow/src`.
- Avoid adding new heavy dependencies.

---

## Dependencies

### Upstream dependencies
- `.ai/specs/01-venue-domain-model.md` (for Amenity and Zone base types)
- `.ai/specs/02-fan-app-shell.md` (for the Amenities screen layout)

### Downstream dependencies
- `.ai/specs/05-in-seat-ordering.md` (will use queue pressure to nudge users to order from seat)

---

## Current State

### Relevant files
- `apps/matchflow/src/domain/venue/types.ts`: Defines the `Amenity` type.
- `apps/matchflow/src/screens/fan/Amenities.tsx`: Current list implementation.
- `apps/matchflow/src/context/MatchFlowContext.tsx`: Manages amenity state.

### Existing behavior
- `Amenity` type already has `queueMinutes`, `queueBand`, and `isRecommended`.
- `Amenities.tsx` renders a basic list with filters.
- `MatchFlowContext` provides static or simulator-driven amenity data.

---

## Proposed Approach

### Where the code should live
- **Types**: Refine `Amenity` in `domain/venue/types.ts` or add `AmenityLiveState` in `domain/live/types.ts`.
- **Logic**: Create `apps/matchflow/src/domain/live/amenitySelectors.ts` for recommendation logic.
- **UI**: Enhance `apps/matchflow/src/screens/fan/Amenities.tsx` and create `apps/matchflow/src/components/operator/AmenityPressurePanel.tsx`.

### Shared Types
```typescript
export interface AmenityLiveState {
  amenityId: string;
  queueMinutes: number;
  queueBand: CongestionBand;
  updatedAt: number; // Unix timestamp
  confidence: number;
  isRecommended: boolean; // Computed by backend or service
}
```

---

## Data / Domain Model Impact

### Updated contracts
- `Amenity` (Venue type): Keep static properties (name, type, zoneId, walkMinutes).
- `AmenityLiveState` (Live type): New contract for RTDB updates.

---

## UX / UI Notes

### Fan UX expectations
- List should be sorted by "Recommended" first, then distance.
- Cards should clearly show "Updated X mins ago".
- Detail view (or tooltip) explaining why it's recommended (e.g., "5 min saved vs nearby alternatives").

### Operator UX expectations
- Hotspot panel highlighting "High" or "Critical" queue pressure.
- Quick link from the panel to the relevant zone map.

---

## Tasks

### T1 - Live State Model and State Plumbing

**Goal**  
Define the `AmenityLiveState` contract and expand `LiveStateService` to support amenity subscriptions. Update the mock data generation in `LiveStateService` to include initial amenity states.

**Files likely involved**  
- `apps/matchflow/src/domain/live/types.ts`
- `apps/matchflow/src/services/liveStateService.ts`
- `apps/matchflow/src/context/MatchFlowContext.tsx`

**Implementation notes**  
- Add `AmenityLiveState` to `types.ts`.
- Add `subscribeToAmenities` to `LiveStateService`.
- Wire `amenityLiveStates` into `MatchFlowContext` (similar to `liveStates` for zones).

**Verification**  
- Typecheck passes.
- Console logs in `LiveStateService` show `AmenityLiveState` updates.
- `MatchFlowContext` exposes `amenityLiveStates` to consumer components.

---

### T2 - Recommendation Logic (Least-Crowded Nearby)

**Goal**  
Implement a helper that computes the "best" amenity of a specific type based on `walkMinutes + queueMinutes`.

**Files likely involved**  
- `apps/matchflow/src/domain/live/selectors.ts`

**Implementation notes**  
- Function `getRecommendedAmenities(amenities, liveStates, userZoneId)`.
- Returns an ID of the best candidate per type.

**Verification**  
- Unit tests or console log validation of the recommendation result.

---

### T3 - Fan UI: Enhanced Amenities Screen

**Goal**  
Update `Amenities.tsx` to display real-time freshness, recommendations, and degraded bands.

**Files likely involved**  
- `apps/matchflow/src/screens/fan/Amenities.tsx`

**Implementation notes**  
- Add relative time for `updatedAt`.
- Show detailed reason (e.g., "Shortest wait nearby").
- Handle "offline/stale" UI state if `updatedAt` is too old.

**Verification**  
- Manual check: Amenities list shows relative timestamps and recommended badges correctly.

---

### T4 - Operator UI: Amenity Pressure Panel

**Goal**  
Create and integrate an `AmenityPressurePanel` into the `OpsApp` dashboard.

**Files likely involved**  
- `apps/matchflow/src/components/operator/AmenityPressurePanel.tsx` (New)
- `apps/matchflow/src/screens/OpsApp.tsx`

**Verification**  
- Manual check: Ops dashboard shows a list of amenities with high pressure.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] Amenities list displays freshness relative to current time
- [ ] "Recommended" badge appears on the lowest-latency amenity
- [ ] Operator dashboard reflects simulated high pressure

### manual verification checklist
- [ ] Trigger "Innings Break" scenario and verify queue bands in Fan app.
- [ ] Verify "Updated X s ago" text is updating.
- [ ] Verify non-color-only indicators (labels like "High", "Low").

---

## Risks / Edge Cases

- **Stale Data**: If the simulator stops, wait times might become dangerously misleading. UI must show a clear "Stale" warning.
- **Ties in Recommendations**: If two amenities are equal, stick to distance or alphabet as a tie-breaker.
- **Small Screens**: Multi-column lists might break; stick to a narrow mobile-first vertical card list.

---

## Rollback / Safe Failure Notes

- If live state is missing, fallback to the static `queueBand` from the venue model.
- If `updatedAt` is missing, hide the freshness label.

---

## Documentation Updates Required

- `docs/api/contracts.md`: Add `AmenityLiveState` schema.

---

## Change Log

### v1
- Initial draft based on PRD FR-04 and AC-04.
