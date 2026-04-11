# Spec 06 - Emergency Reroute

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Architect Agent

## Why

MatchFlow must prioritize safety above all else. In a high-capacity stadium environment, sudden incidents (blocked gates, corridor congestion, hazards) require immediate and coordinated action. 

Answer:
- **What user or operator problem does this solve?** It allows operators to override convenience-based guidance with safety-first instructions and ensures fans are never directed into dangerous or closed areas.
- **Why is it important for the 72-hour MVP build?** It demonstrates the system's resilience and its ability to handle "unhappy path" scenarios which are critical for operational trust.
- **What business/demo value does it unlock?** A powerful "wow" moment where a closure in one part of the stadium immediately changes the guidance for thousands of (simulated) fans.
- **Why should it be built now instead of later?** Routing and guidance logic must be safety-aware from the start to avoid technical debt in the core pathfinding algorithms.

---

## What

Explicitly define and implement the "Emergency Mode" and "Closure Management" capabilities of MatchFlow.

### Include
- **Global Emergency Mode**: A system-wide state that triggers high-priority UI overlays for fans and stewards.
- **Dynamic Closures**: The ability for an operator to mark any `Zone` or `Path` as "Closed".
- **Safety-First Routing**: Update the routing service to automatically recompute routes that avoid all closed nodes/edges.
- **Operator Workflow**: A dedicated area in the dashboard to toggle emergency mode and manage active closures with confirmation steps.
- **Fan Guidance**: Context-aware emergency banners and updated route step-by-step instructions.
- **Audit Logging**: Persistent record of who closed what, when, and why.

### Must not be
- A full-blown incident management suite with ticketing, chat, and resource dispatch.
- Integration with external 911/emergency response systems.
- Automated closure logic based on AI (must be operator-led in this slice).

---

## Success Criteria
- Operator can toggle "Emergency Mode" and see it reflected across all connected fan apps within < 2 seconds.
- Closing a path that is part of an active fan route causes that route to recompute and notify the fan immediately.
- Emergency banners persist and take precedence over all other notifications (e.g., ordering, match alerts).
- Safe rerouting successfully finds alternative paths even when multiple zones are closed.
- If no safe route exists, a clear "Blocked - Seek Steward" message is displayed.

---

## Scope

### In Scope
- `EmergencyState` schema in Realtime Database.
- `Closure` records in Firestore (for audit) and Realtime Database (for live response).
- Operator Dashboard: Emergency toggle switch.
- Operator Dashboard: Zone/Path interactive closure toggle.
- Fan App: Global emergency overlay/banner.
- Fan App: Dynamic route updating based on live closure state.
- Steward View: Simplified "Redirection Mode" showing where current flows are being shunted.

### Out of Scope
- Automated emergency triggers (e.g., "Fire sensor detected").
- Multi-operator collaboration/concurrency handling (assume single operator for MVP).
- Historical replay of emergency events (demo-only).

### Explicit Non-Goals
- No integration with seat-level tracking.
- No public address (PA) system integration.
- No legal compliance or regulatory certification work.

---

## Constraints

### Product Constraints
- Emergency UI must be high-contrast and unmistakable.
- Action to close a path must requires a confirmation step to prevent accidental stadium-wide confusion.

### Technical Constraints
- Must use existing `RoutingEngine` in `apps/matchflow/src/domain/venue/routing.ts`.
- Must use Firebase Realtime Database for the "Live Alert" distribution.
- Must use Firestore for the "Audit Log" of closures.

---

## Dependencies

### Upstream dependencies
- `01-venue-domain-model` (for `VenueStatus` and `Closure` types)
- `02-fan-app-shell` (for emergency banner placement)
- `docs/architecture/architecture-overview.md`

### Downstream dependencies
- `08-demo-simulator` (will use emergency scenarios to validate this spec)

---

## Current State

### Relevant files
- `apps/matchflow/src/domain/venue/types.ts`: Defines `VenueStatus` ('emergency', 'closed') and `Closure`.
- `apps/matchflow/src/domain/venue/routing.ts`: `calculateWeight` already checks for `status === 'closed'`.
- `apps/matchflow/src/screens/FanApp.tsx`: Base navigation for fan.
- `apps/matchflow/src/screens/OperatorDashboard.tsx`: Base navigation for operator.

### Existing behavior
- The domain model supports the *idea* of closures, but there is no UI to trigger them nor a global state to propagate them.
- `RoutingEngine` can handle closures if they are present in the graph provided to it.

---

## Proposed Approach

1.  **Shared State**: Define a `global/emergency` node in Realtime Database.
2.  **Closure Sync**: Live closures should be stored in `live/closures`. When an operator closes a zone, the backend (or a central controller) updates the `VenueGraph` status for all clients.
3.  **Route Hook**: Fan app should use a React hook or similar mechanism to watch the `live/closures` state. If any active route steps involve a newly closed ID, trigger `calculateRoute` again.
4.  **Operator Action**: Implement a "Safety" tab in the Operator Dashboard where zones/paths can be searched and toggled.

---

## Data / Domain Model Impact

### New types / entities
- `GlobalEmergencyState`: `{ active: boolean, level: 'Notice' | 'Warning' | 'Critical', message: string, timestamp: string }`
- `AuditClosureEntry` (Firestore): `{ operatorId: string, targetId: string, timestamp: string, reason: string, action: 'Close' | 'Open' }`

---

## UX / UI Notes

### Fan UX expectations
- **Emergency Overlay**: If `EmergencyState.active`, show a non-dismissible (or high-priority) red banner at the top of every screen.
- **Route Recalculation**: If following a route that gets blocked, show a "Route Updated - Safety Reroute" toast.

### Operator UX expectations
- **Big Red Button**: Emergency Mode should be prominent but protected (e.g., long press or confirmation toast).
- **Map Interaction**: (Optionally) Clicking a zone on the heatmap provides a "Close Zone" action.

### Accessibility expectations
- High contrast (red/white/black for emergency).
- Clear typography.
- Standard "Safe Exit" iconography.

---

## Tasks

### T1 - Emergency State & Closure Schema
**Goal**  
Implement the live state distribution for emergency mode and closures.

**Files likely involved**  
- `apps/matchflow/src/domain/live/types.ts`
- `apps/matchflow/src/services/emergencyService.ts`

**Implementation notes**  
- Define `EmergencyState` and `LiveClosure` types.
- Create service functions to fetch/push these to Realtime Database.

**Verification**  
- Manual check via Firebase Console or mock state: changing `emergency/active` toggles a console log in the client.

---

### T2 - Routing Service Integration
**Goal**  
Ensure `RoutingEngine` correctly responds to the *live* closure state.

**Files likely involved**  
- `apps/matchflow/src/domain/venue/routing.ts`
- `apps/matchflow/src/hooks/useSafeRoute.ts` (New hook)

**Implementation notes**  
- The hook should listen to `LiveClosures`.
- When closures change, it should update the local `VenueGraph` instance used by the `RoutingEngine`.
- Trigger recalculation if the current route is affected.

**Verification**  
- Unit test: `calculateRoute` returns `Blocked` when the only path is closed.

---

### T3 - Operator Emergency & Closure UI
**Goal**  
Provide the operator with tools to trigger emergency mode and close paths.

**Files likely involved**  
- `apps/matchflow/src/screens/operator/SafetyControls.tsx` (New screen)
- `apps/matchflow/src/components/operator/ClosureToggle.tsx`

**Implementation notes**  
- Emergency Mode Toggle: Requires a `ConfirmDialog`.
- Searchable list of Zones and Paths with "Open/Close" toggles.
- Add an "Audit Reason" text field to the closure action.

**Verification**  
- Manual test: Toggling a closure updates the Realtime Database and persists the audit log to Firestore.

---

### T4 - Fan Emergency Guidance
**Goal**  
Implement the high-priority fan experience during incidents.

**Files likely involved**  
- `apps/matchflow/src/components/fan/EmergencyBanner.tsx`
- `apps/matchflow/src/screens/fan/RouteGuidance.tsx`

**Implementation notes**  
- Banner should be global (part of the App Shell).
- If `EmergencyState.active`, the `RouteGuidance` screen should switch to "Emergency Dispersal" mode (red theme, simplified instructions).

**Verification**  
- Manual test: Enabling emergency mode shows the banner on Match Center and Amenities screens.

---

### T5 - Steward Redirection View
**Goal**  
Provide a simplified view for on-ground staff to see where fans are being sent.

**Files likely involved**  
- `apps/matchflow/src/screens/steward/RedirectGuidance.tsx`

**Implementation notes**  
- List of active closures.
- Clear "Send fans toward [Zone Name]" instructions based on the common reroute targets.

**Verification**  
- Manual check: Visualizing the steward screen while a closure is active shows the correct redirection target.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] Emergency mode propagates to fan app < 2s
- [ ] Recomputation avoids closed paths correctly
- [ ] Audit entry created in Firestore on closure
- [ ] Emergency banner is visible on all fan screens

### Manual verification checklist
1. Start a route from 'North Stand' to 'Gate A' in the Fan App.
2. In the Operator Dashboard, close a path currently on that route.
3. Observe the Fan App showing "Route Updated" and a new path being displayed.
4. Activate "Emergency Mode" and verify all Fan App screens show the red emergency banner.

### Simulator validation
- [ ] **Emergency closure/reroute scenario**: Trigger a simulated incident that closes a main concourse artery and verify fans are redirected to secondary exits.

---

## Risks / Edge Cases
- **No Route Fallback**: What if closing a zone makes a stand completely unreachable? UI must show a "Seek Support" fallback instead of just an empty map.
- **Connectivity**: If a fan is offline when an emergency is triggered, they will have stale (unsafe) guidance. The app must highlight the staleness of the route if sync is lost.

---

## Rollback / Safe Failure Notes
- If the routing service fails during an emergency, the app should display the absolute nearest "Safe Zone" or "Emergency Exit" using a hardcoded fallback list linked to the fan's last known stand context.

---

## Change Log

### v1
- Initial draft based on PRD and routing engine capabilities.
- Defined split between operator control and fan guidance.
- Added auditor entry requirement.
