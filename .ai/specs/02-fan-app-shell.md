# Spec 02 - Fan App Shell

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Frontend Agent

## Why
The Fan App is the primary touchpoint for thousands of stadium attendees. It must be fast, resilient to weak connectivity, and capable of immediately overriding convenience features with safety-first instructions. A robust app shell coordinates navigation, global state (offline/emergency), and ensures a consistent premium feel across all match-center surfaces.

Answer:
- **What user or operator problem does this solve?** Fans need a reliable, always-on assistant that doesn't "break" when the network is congested or when an emergency occurs.
- **Why is it important for the 72-hour MVP build?** It provides the structural integrity of the fan experience; without it, features like ordering or routing feel like disconnected tools rather than a unified "MatchFlow" companion.
- **What business/demo value does it unlock?** Demonstrates high-quality Google-native PWA behavior, including graceful degradation and emergency takeover.
- **Why should it be built now instead of later?** The shell is the container for all subsequent fan-facing feature implementation.

---

## What
Refine the Fan App Shell to support all MVP surfaces with consistent layout, transitions, and global state management (connectivity and emergency).

### Include
- **Robust Navigation**: Refine the 5-tab system (Match, Amenities, Route, Order, Alerts).
- **Offline/Degraded Overlay**: A non-intrusive but clear signal when connectivity is weak or offline, including "last updated" info.
- **Contextual Exit Guidance**: A specific view or state triggered near match-end or by operator signal for orderly dispersal.
- **Emergency Guidance Refinement**: Seamless takeover of the UI when `emergencyActive` is true, ensuring clear exit instructions.
- **Global Design System**: Ensure all fan screens follow the premium MatchFlow aesthetic (glassmorphism, vibrant typography, fluid animations).

### Must not be
- A redesign of the venue graph or routing logic (handled in Spec 01 and future routing specs).
- A heavy multi-page application (must be a fluid SPA/PWA).

---

## Success Criteria
- Fan can navigate between all 5 main tabs with fluid transitions.
- Offline status is clearly visible with a "Last Updated" timestamp when network is lost.
- Emergency mode immediately replaces all other content with the `EmergencyView`.
- Exit Guidance is visible as a contextual prompt or specific view when the match is in "PostMatch" state.
- UI remains responsive and readable in high-glare/walking conditions (large targets, high contrast).

---

## Scope

### In Scope
- `FanApp.tsx` navigation and tab coordination.
- `FanHeader.tsx` connectivity and header logic.
- `FanBottomNav.tsx` tab switching and badge logic.
- `OfflineOverlay` component for degraded state communication.
- `ExitGuidance` specific surface implementation.
- Refinement of `MatchCenter`, `Amenities`, `RouteGuidance`, `OrderSnacks`, and `AlertsCenter` to fit the refined shell.

### Out of Scope
- Backend implementation of Realtime DB (Authoritative state logic).
- Detailed logic of "In-seat ordering" (Spec 05).
- Detailed logic of "Queue Alerts" (Spec 04).

### Explicit Non-Goals
- No full payment gateway in this shell slice.
- No custom map engine (use simplified 2D layouts).

---

## Constraints

### Product Constraints
- Must align with the Screen Flows defined in `docs/design/screen-flows.md`.
- Connectivity states must be "Connected", "Weak", or "Offline".

### Technical Constraints
- Use `motion/react` (Framer Motion) for transitions.
- CSS must be Vanilla CSS or Tailwind (as per repo pattern).
- Components must be React functional components with TypeScript.

### Delivery Constraints
- Keep T1/T2/T3 small and reviewable.
- Do not modify unrelated files in the `domain` or `services` layers unless required for state wiring.

---

## Dependencies

### Upstream dependencies
- `01-venue-domain-model` (for location naming and zone context).
- `docs/architecture/architecture-overview.md`
- `docs/design/screen-flows.md`

### Downstream dependencies
- `03-live-heatmap`
- `04-queue-alerts`
- `05-in-seat-ordering`

---

## Current State

### Relevant files
- `apps/matchflow/src/screens/FanApp.tsx`: Base container.
- `apps/matchflow/src/components/FanHeader.tsx`: Current basic header.
- `apps/matchflow/src/components/FanBottomNav.tsx`: Current navigation.
- `apps/matchflow/src/screens/fan/*`: Current screen implementations.

### Existing behavior
- Basic tab switching exists.
- Emergency takeover logic exists in `FanApp.tsx`.
- Connectivity indicator is visible but simple.

---

## Proposed Approach
- **State Management**: Use `MatchFlowContext` to drive global shell states (tab, connectivity, emergency).
- **Layout Consistency**: Define a standard `PageContainer` with correct padding and scroll behavior.
- **Offline Overlay**: Implement as a portal or fixed banner that tracks `connectivity` state and `lastSync` time.
- **Exit Guidance**: Triggered by match state; can be a specific tab item that appears or a persistent banner in Match Center.

---

## Data / Domain Model Impact

### New types / entities
- `ConnectivityState`: `'Connected' | 'Weak' | 'Offline'` (already exists in some forms, needs refinement).

### Updated contracts
- `MatchFlowContext` should expose `lastSyncTime: Date | null`.

---

## UX / UI Notes
- **Transitions**: Slide-left/right on tab change, Fade-in for content.
- **Typography**: Match branding (Outfit or Inter).
- **Colors**: Deep blues (#0b193c), Electric secondary (#facc15), Error red for emergency.

---

## Realtime / Offline / Security Notes
- **Offline**: Shell must load even without network (PWA Service Worker assumed/required).
- **Security**: No spectator access to Operator/Steward views from Fan shell.

---

## Tasks

### T1 - Implement Offline/Degraded Mode Overlay
**Goal**  
Provide a clear, non-blocking UI for when the network is weak or offline, showing the freshness of current data.

**Files likely involved**  
- `apps/matchflow/src/components/ConnectivityOverlay.tsx` (New)
- `apps/matchflow/src/components/FanHeader.tsx`
- `apps/matchflow/src/context/MatchFlowContext.tsx`

**Implementation notes**  
- Create a banner/overlay that appears when `connectivity !== 'Connected'`.
- Display "Last updated at [Time]" based on `lastSyncTime`.
- Use a friendly but firm "Working Offline" message.

**Must not**  
- Block interactions with existing cached data.

**Verification**  
- Manual toggle of connectivity in dev tools.
- Check that the overlay appears and reflects the correct sync time.

---

### T2 - Implement Contextual Exit Guidance Surface
**Goal**  
Surface dispersal guidance when the match ends or when exit pressure is high.

**Files likely involved**  
- `apps/matchflow/src/screens/fan/ExitGuidance.tsx` (New/Refinement)
- `apps/matchflow/src/screens/FanApp.tsx`
- `apps/matchflow/src/screens/fan/MatchCenter.tsx`

**Implementation notes**  
- Create an `ExitGuidance` component that suggests the "Best Exit Gate" based on fan location.
- Add a trigger in `MatchCenter` to "View Exit Plan" when match state is `PostMatch`.
- Ensure it displays safe dispersal instructions.

**Must not**  
- Conflict with Emergency Guidance (Emergency always wins).

**Verification**  
- Simulate `match.status === 'PostMatch'`.
- Check if the Exit Guidance shortcut appears in Match Center.

---

### T3 - Refine Emergency State Coordination & Layout
**Goal**  
Ensure a premium, high-readiness feel for the `EmergencyView` with polished transitions and layout.

**Files likely involved**  
- `apps/matchflow/src/screens/FanApp.tsx`
- `apps/matchflow/src/screens/fan/EmergencyView.tsx`

**Implementation notes**  
- Wrap the emergency takeover in a high-impact transition.
- Ensure the `EmergencyView` uses the full viewport and removes normal navigation.
- Add "SOS Call" and "First Aid" quick actions clearly.

**Must not**  
- Allow any way to navigate back to normal tabs while emergency is active.

**Verification**  
- Trigger `emergencyActive = true` in context.
- Verify transition and complete replacement of the app shell.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] Fluid tab transitions verified
- [ ] Offline overlay appears correctly on network loss
- [ ] Emergency takeover works reliably
- [ ] Exit guidance appears contextually

---

## Risks / Edge Cases
- **Persistence**: Fans refreshing the page while offline.
- **Stale Data**: Fans following a "preferred route" that is now stale due to offline state.
- **Visual Glare**: Bright outdoor conditions making "Weak Connectivity" banners hard to see.

---

## Change Log

### v1
- Initial draft based on PRD and Screen Flows.
- Focused on Shell integrity: Navigation, Offline, Exit, and Emergency.
