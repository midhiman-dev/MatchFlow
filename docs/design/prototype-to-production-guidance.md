# MatchFlow Prototype-to-Production Guidance for Antigravity

## Document Metadata

| Field | Value |
|---|---|
| Document Title | MatchFlow Prototype-to-Production Guidance for Antigravity |
| Intended Path | `docs/design/prototype-to-production-guidance.md` |
| Source Prototype Path | `docs/design/prototype-src` |
| Product | MatchFlow |
| Version | v1.0 |
| Status | Draft / Working Guidance |
| Date | 2026-04-08 |
| Primary Audience | Architect Agent, Frontend Agent, Realtime & Backend Agent, QA & Review Agent |
| Positioning | Challenge-scoped MVP |

---

## 1. Purpose

This document explains how to convert the current AI Studio prototype code into **maintainable MVP-grade implementation code** under MatchFlow's Spec-Driven Development method.

It is **not** a request to rewrite the whole app in one shot.

It is a practical migration guide for Antigravity so it can:
- salvage useful work from the prototype,
- avoid throwing away good UI and domain scaffolding,
- remove demo-only shortcuts safely,
- and rebuild the prototype into a modular MatchFlow codebase in small, reviewable slices.

This guidance should be read alongside:
- `docs/architecture/architecture-overview.md`
- `docs/design/screen-flows.md`
- `skills.md`
- `agents.md`
- feature specs

---

## 2. MatchFlow Build Framing

MatchFlow should now be treated as a **challenge-scoped MVP**, not just a concept demo.

That means the code must become:
- more modular,
- more explicit,
- easier to test,
- easier to extend,
- and safer for future Firebase / Cloud Run / Pub/Sub integration,

while still preserving:
- demo credibility,
- fast fan utility,
- operator clarity,
- simulator-driven wow moments,
- and offline / emergency behavior.

This is still **MVP code**, not full production hardening.

So the goal is:

**prototype-quality UX -> MVP-quality code structure**

Not:

**prototype -> enterprise overbuild**

---

## 3. Summary Assessment of the Current Prototype

The current prototype already gives us a strong starting point.

### 3.1 What is good and worth keeping
The prototype contains reusable value in these areas:

- React + TypeScript app shell
- clear separation of Fan / Operator / Steward surfaces
- early shared domain model
- seed demo data for zones, amenities, paths, and match state
- central state provider for fast prototype behavior
- basic scenario trigger behavior
- basic route calculation service
- working visual shell for:
  - fan home
  - amenities
  - route guidance
  - ordering
  - emergency guidance
  - operator overview
  - operator simulator
  - steward guidance

### 3.2 What is not good enough yet
The prototype is still too prototype-centric in these areas:

- too much business logic inside one large context
- scenario logic is narrow and partly hardcoded
- routing logic is simplistic and not reusable enough
- no clean distinction between domain layer, app store, and service layer
- some dependencies appear installed but unused
- operator protections are mostly UX-level, not structured command flows
- seed data and UI copy are mixed too close to app behavior
- no clear test harness
- no clear slice boundaries for future specs
- no durable structure for moving from local state to Firebase-backed state

### 3.3 Correct decision
Do **not** discard this prototype.

Do **not** blindly continue from it either.

Use it as a **salvageable starter codebase** and refactor it into a controlled MatchFlow MVP structure.

---

## 4. Current Source Snapshot

The current prototype source appears to contain a compact Vite React app with the following useful files:

### Current top-level structure
- `package.json`
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`
- `src/types.ts`
- `src/constants.ts`
- `src/context/MatchFlowContext.tsx`
- `src/services/routingService.ts`
- `src/components/FanHeader.tsx`
- `src/components/FanBottomNav.tsx`
- `src/components/RoleSwitcher.tsx`
- `src/screens/FanApp.tsx`
- `src/screens/OpsApp.tsx`
- `src/screens/StewardApp.tsx`

### What this means
This is a valid bootstrap structure for a prototype, but not yet the right long-term structure for MatchFlow feature-by-feature implementation.

---

## 5. Non-Negotiable Migration Rules for Antigravity

Antigravity must follow these rules while converting the prototype into MVP-grade code.

### 5.1 Do not rewrite everything at once
No broad “rebuild the app” pass.

Work only as:
- one spec
- one task
- one validation
- one review
- one commit

### 5.2 Preserve working UX unless the spec says otherwise
Do not casually redesign:
- fan home
- amenities
- route shell
- emergency screen
- operator overview
- simulator screen
- steward instruction screen

Keep the prototype visually stable while improving code quality.

### 5.3 Refactor under behavior lock
When modularizing:
- preserve visible working behavior first,
- then improve internal structure,
- then add missing capability.

### 5.4 Separate “prototype artifact” from “approved product behavior”
The source in `docs/design/prototype-src` is:
- a **reference implementation**, not the product source of truth,
- a useful coding baseline, not the requirements document.

Product behavior must continue to come from:
- PRD
- architecture overview
- screen flows
- feature specs

### 5.5 Keep MatchFlow zone-based
Do not introduce:
- seat-level live tracking
- custom heavy realtime infra
- deep mapping complexity
- unnecessary admin workflow sprawl

---

## 6. Recommended Target Architecture for the MVP Codebase

Antigravity should gradually move the prototype toward the following shape.

```text
apps/
  fan-pwa/
  ops-dashboard/

packages/
  domain/
    types/
    constants/
    selectors/
    validation/
  ui/
    components/
    layout/
    feedback/
    navigation/
  state/
    app-store/
    persistence/
    connectivity/
  services/
    routing/
    simulator/
    alerts/
    orders/
    recommendations/
    realtime/
  testing/
    fixtures/
    scenarios/

docs/
  design/
  architecture/
  testing/
```

If the repo is still single-app for MVP speed, keep one app for now, but structure the code **as if** it will later split cleanly.

### Practical near-term target
A realistic intermediate structure is:

```text
src/
  app/
  components/
  features/
    fan/
    ops/
    steward/
  domain/
  services/
  store/
  hooks/
  lib/
  test/
```

This is the recommended short-term migration destination.

---

## 7. Prototype-to-MVP Mapping

## 7.1 Keep and relocate

### `src/types.ts`
**Keep**, but split into:
- `src/domain/types/zone.ts`
- `src/domain/types/amenity.ts`
- `src/domain/types/path.ts`
- `src/domain/types/alert.ts`
- `src/domain/types/order.ts`
- `src/domain/types/match.ts`
- `src/domain/types/scenario.ts`
- `src/domain/types/app-state.ts`

Reason:
The current shared types are useful, but they are too centralized in one file.

---

### `src/constants.ts`
**Keep the data**, but reorganize into:
- `src/domain/constants/seedZones.ts`
- `src/domain/constants/seedAmenities.ts`
- `src/domain/constants/seedPaths.ts`
- `src/domain/constants/seedMatch.ts`
- `src/domain/constants/seedAlerts.ts`
- `src/domain/constants/seedOrders.ts`

Also add:
- `src/domain/constants/seedScenarios.ts`
- `src/domain/constants/seedVenueGraph.ts`

Reason:
Current seed data is valuable, but it should not remain as one mixed constants file.

---

### `src/context/MatchFlowContext.tsx`
**Do not keep as final architecture.**

Use it temporarily, but split it into:
- `src/store/appStore.ts`
- `src/store/reducers/`
- `src/store/selectors/`
- `src/store/persistence/`
- `src/store/providers/MatchFlowProvider.tsx`

Then move behavior into services:
- scenario transition logic -> simulator service
- order creation logic -> order service
- alert creation logic -> alert service
- route derivation -> routing service
- connectivity behavior -> connectivity service

Reason:
The current context is the biggest prototype bottleneck. It mixes:
- persistence
- mutable app state
- scenario logic
- order logic
- emergency logic
- alert creation
- simulation tick behavior

That is acceptable in a prototype, but not in maintainable MVP code.

---

### `src/services/routingService.ts`
**Keep and expand.**

Turn it into:
- `src/services/routing/routeEngine.ts`
- `src/services/routing/routeSelectors.ts`
- `src/services/routing/routePolicies.ts`
- `src/services/routing/routeTypes.ts`

Expected improvements:
- support graph traversal beyond direct / one-hop
- separate normal vs emergency route policy
- consider congestion weights
- consider closures and emergency blocks
- provide explanation metadata
- return alternate route when relevant

Reason:
This is worth reusing, but only as a starter.

---

### `src/screens/FanApp.tsx`
**Keep the screen composition, but split by feature.**

Target structure:
- `src/features/fan/screens/MatchCenterScreen.tsx`
- `src/features/fan/screens/AmenitiesScreen.tsx`
- `src/features/fan/screens/AmenityDetailScreen.tsx`
- `src/features/fan/screens/RouteScreen.tsx`
- `src/features/fan/screens/OrderMenuScreen.tsx`
- `src/features/fan/screens/CartScreen.tsx`
- `src/features/fan/screens/OrderTrackingScreen.tsx`
- `src/features/fan/screens/AlertsScreen.tsx`
- `src/features/fan/screens/ExitGuidanceScreen.tsx`
- `src/features/fan/screens/EmergencyGuidanceScreen.tsx`

Reason:
The fan experience is multiple product flows. It should not stay as one large screen file.

---

### `src/screens/OpsApp.tsx`
**Keep and split.**

Target structure:
- `src/features/ops/screens/OpsOverviewScreen.tsx`
- `src/features/ops/screens/ZoneDetailScreen.tsx`
- `src/features/ops/screens/AmenityPressureScreen.tsx`
- `src/features/ops/screens/ActionPanelScreen.tsx`
- `src/features/ops/screens/EmergencyControlScreen.tsx`
- `src/features/ops/screens/SimulatorScreen.tsx`
- `src/features/ops/screens/AuditLogScreen.tsx`

Reason:
Operator behavior must become modular and action-specific.

---

### `src/screens/StewardApp.tsx`
**Keep but simplify into a narrow slice.**

Target:
- `src/features/steward/screens/StewardGuidanceScreen.tsx`

Reason:
This is a thin surface and should remain thin.

---

### `src/components/FanHeader.tsx`, `FanBottomNav.tsx`, `RoleSwitcher.tsx`
**Keep**, but move under reusable UI:
- `src/components/navigation/`
- `src/components/layout/`
- `src/components/shell/`

RoleSwitcher should likely become:
- demo-only launcher
- not part of final fan or operator product shell

---

## 8. Immediate Code Smells to Fix First

These are the first cleanup targets Antigravity should address before major feature expansion.

### 8.1 Rename package identity
Current package name looks generic.

Update:
- package name
- app title
- metadata
- README framing
to MatchFlow naming consistently.

---

### 8.2 Remove dead or unproven dependencies
Audit and likely remove if unused:
- `@google/genai`
- `express`
- `dotenv`
- `@types/express`

Do not keep dependencies just because AI Studio added them.

Only keep what is used in the current prototype or in the active spec slice.

---

### 8.3 Move persistence out of the main context
Local persistence should become a small adapter:
- read state
- write state
- handle schema-safe fallback
- isolate future migration

Do not keep persistence logic inline in the state provider forever.

---

### 8.4 Normalize scenario implementation
The current scenario logic covers only part of the desired scenario set well.

Required scenario support:
- Normal
- Innings Break
- DRS Spike
- Wicket Surge
- Exit Rush
- Emergency Closure

Each scenario should define:
- zone deltas
- amenity pressure deltas
- alert effects
- recommendation effects
- route effects
- steward instruction effects
- operator log effects

---

### 8.5 Stop mixing random UI text with logic
Pull reusable copy into:
- labels
- scenario descriptors
- alert templates
- emergency copy templates

This will make fan and operator messaging easier to control and test.

---

### 8.6 Introduce selectors
Do not compute everything ad hoc inside screen render logic.

Add selectors such as:
- `selectNearbyAmenities`
- `selectRecommendedAmenity`
- `selectHotspots`
- `selectCurrentFanRoute`
- `selectEmergencyState`
- `selectVisibleAlerts`
- `selectAmenityPressureSummary`

---

## 9. Required MVP-Grade Behavioral Upgrades

These are the major behavior gaps between the current prototype and MVP-grade implementation.

## 9.1 Routing
Current state:
- direct path or one-hop route only

Required upgrade:
- graph traversal across full venue graph
- congestion-weighted path scoring
- normal route vs emergency route policy
- no-route fallback behavior
- alternate route support
- explanation metadata

Good enough for MVP:
- Dijkstra-like weighted route search
- path blocking
- closure-aware reroute
- simple ETA calculation
- route status = Clear / Congested / Blocked / Emergency

Not required now:
- real geolocation
- turn-by-turn map geometry
- indoor positioning

---

## 9.2 Simulation
Current state:
- narrow scenario mutation inside context
- minor fluctuation tick loop

Required upgrade:
- formal simulator service
- scenario configs
- deterministic baseline state
- scenario start
- scenario stop
- scenario reset
- scenario multiplier
- scenario event tick updates
- visible route / alert / queue effects

Good enough for MVP:
- timer-based mocked event engine
- state mutation through centralized reducer or actions
- simple event log output
- consistent visible impact across fan and ops

---

## 9.3 Offline / connectivity
Current state:
- connectivity flag exists
- order “Pending” if offline

Required upgrade:
- stale-while-revalidate behavior
- downgrade from exact queue minutes to queue bands
- outbox for pending actions
- reconnect flush behavior
- explicit last updated / stale UI state
- emergency flow always available
- route uses last known state when offline

---

## 9.4 Operator command flows
Current state:
- mostly visual
- limited structured command model

Required upgrade:
- explicit operator actions:
  - issue reroute
  - send alert
  - close path
  - close zone
  - activate emergency
  - clear emergency
- confirmation modal pattern
- audit log creation
- fan / steward propagation from commands

---

## 9.5 Orders
Current state:
- order placement and status seed are basic

Required upgrade:
- cart state
- service mode
- order lifecycle transitions
- pending sync if offline
- deterministic order reference
- lightweight status progression service
- pickup / in-seat wording consistency

---

## 10. Recommended Productionization Sequence for Antigravity

This is the safest sequence.

## Slice 0 — Prototype salvage baseline
Goal:
Create a clean baseline branch from the prototype.

Tasks:
- import prototype code from `docs/design/prototype-src`
- rename package/app identity to MatchFlow
- remove unused dependencies
- confirm build/typecheck works
- preserve existing visible behavior
- add a short architecture note in code comments only where helpful

Output:
- stable imported prototype baseline

---

## Slice 1 — Domain extraction
Goal:
Pull domain types and seed data into explicit modules.

Tasks:
- split `types.ts`
- split `constants.ts`
- add domain barrel exports
- add basic validators / guards if useful
- keep UI unchanged

Output:
- cleaner domain model with no behavior change

---

## Slice 2 — Store and persistence refactor
Goal:
Remove business logic concentration from the current provider.

Tasks:
- create app store shape
- create actions / reducer
- move local persistence into adapter
- move selectors out of screens
- keep provider thin

Output:
- state remains shared, but architecture becomes maintainable

---

## Slice 3 — Simulator service extraction
Goal:
Turn scenario logic into a real reusable service.

Tasks:
- define scenario configs
- define simulator actions
- implement event tick logic
- connect to store
- verify fan + ops screens react correctly

Output:
- reusable simulator architecture

---

## Slice 4 — Routing engine upgrade
Goal:
Replace heuristic one-hop routing with proper graph routing.

Tasks:
- route graph helpers
- route policies
- congestion weight support
- emergency-safe routing
- blocked path handling
- alternate route support

Output:
- MVP-grade route behavior

---

## Slice 5 — Fan app feature split
Goal:
Split FanApp into feature screens and shared components.

Tasks:
- isolate Match Center
- isolate Amenities
- isolate Recommendation Detail
- isolate Route
- isolate Alerts
- isolate Order flow
- isolate Emergency Guidance
- keep same design language

Output:
- fan flow becomes specable and testable

---

## Slice 6 — Ops feature split
Goal:
Split OpsApp into modular screens/panels.

Tasks:
- overview
- hotspot detail
- amenity pressure
- action panel
- emergency controls
- simulator
- audit log

Output:
- operator workflows become maintainable and traceable

---

## Slice 7 — Steward slice hardening
Goal:
Keep Steward view thin and reliable.

Tasks:
- render current instruction
- connect to emergency and reroute state
- add acknowledge action
- add timestamp and stale state

Output:
- stable low-complexity steward slice

---

## Slice 8 — Tests and demo checks
Goal:
Protect the MVP from regression.

Minimum:
- route engine tests
- selector tests
- scenario mutation tests
- order state transition tests
- emergency propagation tests
- offline pending action tests

Also add:
- manual demo checklist for:
  - innings break rush
  - wicket surge
  - exit rush
  - emergency closure
  - offline order retry

---

## 11. Concrete File-Level Recommendations

## 11.1 `package.json`
Change:
- package name to MatchFlow-specific
- remove unused deps
- add scripts:
  - `typecheck`
  - `test`
  - `test:watch`
  - `lint` if repo supports it

Do not:
- add server dependencies until an actual API slice exists

---

## 11.2 `src/App.tsx`
Keep this thin.
It should become shell orchestration only.

Do:
- mount provider
- mount router/app shell
- mount role launcher only if still needed for demo mode

Do not:
- let App own product logic

---

## 11.3 `src/context/MatchFlowContext.tsx`
Treat as migration target.

Short-term:
- stabilize
- stop adding new behavior here

Medium-term:
- replace with modular store/provider pattern

---

## 11.4 `src/services/routingService.ts`
Upgrade incrementally.
Do not rewrite everything in one go.

Implement:
- graph builder
- weighted traversal
- normal/emergency policy
- explanation metadata

---

## 11.5 `src/screens/*`
Split by product flow.
Keep the current layout and visual design where possible.

Do not mix:
- state mutation
- domain transformation
- visual rendering
in one file.

---

## 11.6 `src/index.css`
Keep as design baseline, but normalize:
- design tokens
- app-wide utility classes
- avoid prototype-only overrides where possible

---

## 12. What Antigravity Must Preserve from the Prototype

These are worth preserving unless a spec says otherwise.

### Fan-side
- Match Center information density and visual priority
- Nearby Services cards
- freshness pill pattern
- bottom nav pattern
- route HUD feel
- emergency takeover treatment
- ordering card and menu feel

### Operator-side
- left navigation shell
- overview dashboard composition
- KPI summary cards
- heat-map visual feel
- simulator card layout
- activity log structure
- emergency button seriousness

### Steward-side
- simple instruction-first screen
- acknowledge action
- concise field presentation

### Shared
- high contrast
- quick scan hierarchy
- clear status chips
- operational visual tone
- strong emergency visual distinction

---

## 13. What Antigravity Must Not Preserve Blindly

These should be treated as provisional.

- random placeholder images and location noise
- generic package naming
- mixed demo copy and behavior logic
- one giant context with everything inside it
- simplistic routing shortcuts
- incomplete scenario handling
- unused dependencies
- implicit business rules hidden in UI files

---

## 14. Acceptance Gates for “MVP-Grade Code”

The migrated code should be considered successful only when all of the following are true.

### Architecture
- domain types are modular
- seed data is modular
- business logic is not trapped in one provider
- routing, simulator, alerts, orders, and connectivity have clear service boundaries
- screens are split by feature slice

### Product behavior
- fan flow is stable
- ops flow is stable
- steward flow is stable
- scenarios visibly change the system
- emergency mode overrides normal guidance
- offline state remains useful

### Code quality
- typecheck passes
- no obviously dead dependency clutter
- files remain focused
- new behavior is specable and testable
- no broad accidental scope creep

### Demo readiness
At minimum these wow moments must stay intact:
- least-crowded amenity recommendation
- live reroute during surge
- smart in-seat ordering alternative
- emergency reroute
- graceful degraded mode

---

## 15. Suggested Antigravity Prompt Pattern for This Migration

Use prompts like this:

> Read `docs/design/prototype-to-production-guidance.md`, `skills.md`, and the active spec.  
> Use the source under `docs/design/prototype-src` as salvageable starter code, not as the source of truth.  
> Implement **TASK [ID] only**.  
> Preserve working visual behavior unless the spec explicitly changes it.  
> Refactor only within the defined boundary.  
> Do not modify unrelated files.  
> Report:
> - files changed
> - what was preserved from the prototype
> - what was refactored
> - what was intentionally not changed
> - verification completed
> - risks / follow-ups

---

## 16. Recommended First Antigravity Tasks

These are the best first tasks to run.

### T1 — Prototype import and dependency cleanup
- import source into app area
- rename package/app to MatchFlow
- remove unused packages
- verify build and typecheck
- no behavior change

### T2 — Domain extraction
- split `types.ts`
- split `constants.ts`
- update imports
- no visible UI changes

### T3 — Store boundary refactor
- create modular store files
- keep provider API stable
- move persistence into adapter
- no visible UI changes

### T4 — Routing engine slice
- improve route calculation
- preserve route screen design
- add alternate route support
- verify blocked path behavior

### T5 — Simulator slice
- formalize scenarios
- improve ops simulator behavior
- propagate visible fan/ops changes
- verify innings break and emergency

---

## 17. Definition of Done for This Guidance

This guidance is considered successfully applied when Antigravity uses it to produce a MatchFlow codebase that:
- keeps the prototype's strongest UX,
- sheds the prototype's biggest structural weaknesses,
- remains modular and demo-ready,
- and can continue through MatchFlow's feature-spec sequence without collapsing into one large AI-generated blob.

---

## 18. Final Instruction to Antigravity

**Treat the AI Studio output as reusable prototype code, not as disposable mockup code and not as final production code. Salvage the good, isolate the risky, refactor under behavior lock, and advance MatchFlow one bounded slice at a time.**
