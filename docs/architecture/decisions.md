# MatchFlow Architecture Decisions

## Document Metadata

| Field | Value |
|---|---|
| Document Title | MatchFlow Architecture Decisions |
| Product | MatchFlow |
| Version | v1.0 |
| Status | Draft |
| Date | 2026-04-08 |
| Audience | Product owner, solution architect, developers, AI coding agents, challenge reviewers |
| Related Documents | Project Context and Decisions, BRD, PRD, Build Rules and SDD Working Method, Architecture Overview, feature specs |
|

## 1. Purpose

This document records the major decisions already taken for MatchFlow and explains why they were taken.

It exists so future specs, implementation slices, reviews, and demo preparations can rely on one stable reference for:

- what has already been decided
- why the decision was made
- what implication that decision has on design and implementation
- what should not be casually changed during the 72-hour build

This is not a speculative wishlist. It is a practical decision log for the current MatchFlow MVP direction.

---

## 2. How to Use This Document

Use this note when:

- writing or reviewing new feature specs
- checking whether a proposed change conflicts with approved direction
- deciding between multiple implementation options
- explaining architecture choices to reviewers or judges
- onboarding a coding agent or collaborator

If a new implementation materially changes one of these decisions, this document should be updated intentionally rather than drift silently.

---

## 3. Decision Status Legend

- **Confirmed** — agreed and should be treated as current source of truth
- **Deferred** — intentionally postponed beyond the current MVP cut
- **Open** — not fully locked yet and should be resolved in later specs

This document focuses mainly on **Confirmed** decisions.

---

## 4. Confirmed Decisions

## D-001 — Product name and identity

**Status:** Confirmed  
**Decision:** The approved product/app name is **MatchFlow**.

**Why this decision was taken**
- The project needed one stable identity across docs, specs, screens, architecture notes, and demo material.
- A single name reduces drift while multiple artifacts are being created quickly.

**Implementation implication**
- Use **MatchFlow** consistently in product docs, UI labels, architecture notes, specs, and presentation assets.
- Do not mix older working names into the repo or demo narrative.

---

## D-002 — Build a 72-hour, believable smart stadium MVP, not a production platform

**Status:** Confirmed  
**Decision:** MatchFlow will be built as a focused, modular, believable 72-hour MVP rather than a full production-grade platform.

**Why this decision was taken**
- The challenge is time-bounded.
- Demo credibility matters more than enterprise breadth in this phase.
- A smaller, stable solution is more valuable than a fragile, overbuilt one.

**Implementation implication**
- Prefer believable end-to-end flows over broad scope.
- Avoid heavy production-only complexity unless it is essential to the core story.
- Protect demo readiness continuously.

---

## D-003 — Target cricket-specific surge problems, not a generic venue use case

**Status:** Confirmed  
**Decision:** MatchFlow is intentionally designed around cricket-specific crowd patterns such as innings breaks, DRS spikes, wickets, and end-of-match exits.

**Why this decision was taken**
- The core pain in large cricket venues is synchronized, event-driven crowd movement.
- Product differentiation becomes stronger when the system feels sport-aware rather than generic.

**Implementation implication**
- Simulator scenarios, alerts, routing, and fan prompts should reflect cricket moments.
- Generic venue abstractions are acceptable internally, but the user-facing story should remain cricket-aware.

---

## D-004 — Serve both fans and operators in one coherent solution

**Status:** Confirmed  
**Decision:** MatchFlow will include both a fan-facing mobile/PWA experience and an operator dashboard.

**Why this decision was taken**
- The business problem spans both sides: fans need better utility, while operators need better visibility and intervention capability.
- The strongest demo story comes from showing one shared system improving both experience and operations.

**Implementation implication**
- Architecture, live-state design, and specs should support both fan and operator journeys.
- Shared domain/state models should be reused where possible, while access and UI remain role-appropriate.

---

## D-005 — Keep the MVP scope tightly bounded to high-value, demoable features

**Status:** Confirmed  
**Decision:** The MVP scope includes fan PWA, operator dashboard, zone heat map, queue alerts, cached wait times, dynamic rerouting, end-of-match exit guidance, in-seat ordering, match engagement notifications, emergency rerouting, offline-first behavior, and synthetic event simulation.

**Why this decision was taken**
- These features directly address the most visible fan-friction, revenue, and safety pain points.
- Together they create a compelling and coherent demo narrative.

**Implementation implication**
- Treat these as the primary value slices for the MVP.
- New ideas outside this set should usually be recorded, not built immediately.

---

## D-006 — Explicitly defer heavyweight capabilities

**Status:** Confirmed  
**Decision:** The MVP will not depend on full CCTV/computer vision, CAD/BIM integration, production indoor positioning, real hardware dependency, seat-level live tracking, full payment integration, or broad enterprise back-office workflows.

**Why this decision was taken**
- These capabilities would increase build time, integration risk, and demo fragility.
- They are not necessary to prove the core value of MatchFlow in the first cut.

**Implementation implication**
- Do not let feature specs or coding tasks expand into these areas unless the project direction is intentionally revised.
- Keep references to such capabilities future-facing only.

---

## D-007 — Model the stadium at zone level, not seat-tracking level

**Status:** Confirmed  
**Decision:** The stadium must be modeled as a simplified digital twin made of zones, paths, gates, amenities, capacities, and a route graph.

**Why this decision was taken**
- Zone-level modeling is sufficient for congestion guidance, rerouting, queue management, and emergency flows.
- It avoids privacy, complexity, and infra overhead associated with precise seat-level or individual live tracking.
- It is the right balance between realism and speed for the MVP.

**Implementation implication**
- Domain types, routing logic, simulator behavior, and live heat state should all anchor to stable zone/gate/amenity identifiers.
- Seat-level live tracking should not appear as a hidden dependency anywhere in the core architecture.

---

## D-008 — Keep the venue model structural first, and layer live state later

**Status:** Confirmed  
**Decision:** The venue domain model is a durable structural foundation. Live density, queue pressure, closures, and emergency state must be layered on top of stable entity IDs rather than baked into the static topology model too early.

**Why this decision was taken**
- Separating stable topology from live overlays keeps the architecture clean.
- It prevents the foundation model from becoming tangled with transient operational state.
- It makes later specs for heat maps, queue alerts, simulator events, and emergency routing easier to build.

**Implementation implication**
- Treat venue topology as durable shared domain data.
- Keep runtime state in separate live objects/services that reference stable IDs.

---

## D-009 — Use a Google-native architecture path

**Status:** Confirmed  
**Decision:** MatchFlow will prefer Google-native services and tooling where practical.

**Why this decision was taken**
- The challenge context benefits from a coherent Google-services story.
- Managed services reduce build and ops overhead during a fast-moving MVP build.
- The stack supports rapid delivery without excessive custom infrastructure.

**Implementation implication**
- Prefer the agreed Google/Firebase path before considering custom alternatives.
- Keep architecture explanations aligned to that platform story.

---

## D-010 — Use React + TypeScript + PWA-first frontend surfaces

**Status:** Confirmed  
**Decision:** The frontend direction is React with TypeScript, with a PWA-first, mobile-first fan experience and a dashboard UI for operators.

**Why this decision was taken**
- The fan flow must work quickly on mobile devices inside a stadium.
- React + TypeScript supports fast iteration, shared components, and strong type discipline.
- The operator dashboard still fits naturally into the same frontend ecosystem.

**Implementation implication**
- Frontend work should preserve mobile-first fan UX and clear operator scanning UX.
- Shared domain types and UI patterns should be reused across surfaces where sensible.

---

## D-011 — Realtime Database is the preferred home for shared live state

**Status:** Confirmed  
**Decision:** Firebase Realtime Database is preferred for fast-changing live state such as zone, route, amenity, alert, and scenario state.

**Why this decision was taken**
- The MVP needs simple, fast fan/ops subscriptions.
- Compact live updates fit the needs of a demo-oriented crowd-intelligence product.
- Platform-native live state is preferable to building custom realtime infrastructure.

**Implementation implication**
- Use Realtime Database for fast-changing operational objects.
- Keep live payloads compact and subscription-friendly.
- Avoid excessive client polling for state that should be published centrally.

---

## D-012 — Firestore is the preferred home for durable structured records

**Status:** Confirmed  
**Decision:** Cloud Firestore is preferred for durable structured data such as venue metadata, configuration, orders, catalogs, audit records, and simulator definitions.

**Why this decision was taken**
- Some data must remain durable, queryable, and not tied only to transient live updates.
- A clean separation between live operational state and durable application records simplifies reasoning.

**Implementation implication**
- Store configuration, metadata, menus, orders, logs, and other durable records in Firestore.
- Avoid misusing live-state storage for records that should persist beyond the current session.

---

## D-013 — Cloud Run is the primary backend execution layer

**Status:** Confirmed  
**Decision:** Cloud Run is the primary backend layer for APIs and service logic.

**Why this decision was taken**
- The product needs server-side service boundaries for routing, queue estimation, alerts, ordering, simulator control, and protected operator actions.
- Cloud Run offers a practical managed execution layer without requiring complex custom infrastructure.

**Implementation implication**
- Backend/service responsibilities should be centered in Cloud Run-compatible services.
- Protected actions and central decision logic should not be pushed into client-only behavior.

---

## D-014 — Pub/Sub and simulator-driven eventing are first-class architectural components

**Status:** Confirmed  
**Decision:** Synthetic event simulation is a core part of the architecture, and Pub/Sub is the preferred event-ingestion/fan-out mechanism for simulator and match-like event flows.

**Why this decision was taken**
- The MVP cannot rely on real hardware or live stadium telemetry.
- A believable simulator is necessary both for demo storytelling and for testing critical behaviors.
- Event-driven simulation better mirrors the surge behavior MatchFlow is meant to handle.

**Implementation implication**
- Treat the simulator as a real architectural slice, not a throwaway script.
- Keep scenario generation, event publishing, and live-state updates modular.

---

## D-015 — Centralize queue estimation and cache the result

**Status:** Confirmed  
**Decision:** Amenity wait state should be centrally computed and cached, then published to clients, rather than repeatedly calculated on each client through polling.

**Why this decision was taken**
- Queue recommendations must be consistent across fan and operator views.
- Central estimation improves efficiency and keeps the product easier to reason about.
- This supports freshness indicators and graceful degradation.

**Implementation implication**
- Build queue estimation as a shared service/output model.
- Fan clients should subscribe to cached queue state instead of driving frequent direct polling.

---

## D-016 — Use zone-level live state instead of precise individual tracking

**Status:** Confirmed  
**Decision:** Live crowd awareness should be expressed as zone-level state, including density score, flow direction, entry rate, exit rate, queue pressure, status band, timestamp, and confidence.

**Why this decision was taken**
- This level of detail is enough to support routing, hotspot awareness, and operator decisions.
- It keeps realtime payloads lighter and avoids unnecessary tracking sensitivity.

**Implementation implication**
- Heat maps, hotspot cards, and downstream routing logic should consume zone-level state objects.
- Do not introduce precise live user tracking as a hidden assumption.

---

## D-017 — Offline-first behavior is mandatory for critical fan flows

**Status:** Confirmed  
**Decision:** MatchFlow must remain usable under weak or degraded stadium connectivity for critical user journeys.

**Why this decision was taken**
- Stadium Wi-Fi and mobile networks can degrade precisely during the moments MatchFlow matters most.
- A crowd-utility product that fails under congestion would undermine its core value proposition.

**Implementation implication**
- Preserve app shell, map basics, seat/stand context, saved routes, last known queue state, emergency guidance, and pending actions locally.
- Support local cache, stale-state handling, and an outbox/retry model for applicable user actions.

---

## D-018 — Degrade gracefully from exact values to coarse bands

**Status:** Confirmed  
**Decision:** When live precision becomes stale or connectivity weakens, the UI should degrade from exact wait-time minutes to coarse bands such as low, moderate, and high, while clearly showing freshness.

**Why this decision was taken**
- Some guidance is better than a blank or misleading screen during network pressure.
- Users need to understand both usefulness and freshness of what they are seeing.

**Implementation implication**
- Use stale-while-revalidate behavior for queue and route state where applicable.
- Surface “updated X seconds ago” or similar freshness messaging prominently.

---

## D-019 — Safety and emergency routing are first-class product capabilities

**Status:** Confirmed  
**Decision:** Safety is a core pillar of MatchFlow. The MVP must support operator-triggered emergency mode, digital closure of zones/paths, recomputed safe exits, and updated fan/steward guidance.

**Why this decision was taken**
- Crowd safety is a major stadium operations concern and one of the strongest practical use cases for a digital twin.
- Emergency behavior strengthens both operational credibility and business value.

**Implementation implication**
- Emergency routing should be built on the same venue graph foundation as normal routing, with different policy behavior.
- Fan and operator flows must remain consistent when emergency state changes.

---

## D-020 — Protected operator authority must be enforced server-side

**Status:** Confirmed  
**Decision:** Sensitive actions such as emergency activation, path/zone closure, high-priority alert issuance, and operational overrides must require authenticated, server-validated operator authority.

**Why this decision was taken**
- Even as an MVP, safety-sensitive workflows must remain credible.
- Client-only authority would weaken trust and create an unrealistic security posture.

**Implementation implication**
- Operator actions should flow through protected service endpoints.
- Fan surfaces must not expose protected operational actions.
- Audit logging should exist for major interventions where practical.

---

## D-021 — Gemini is assistive, not authoritative

**Status:** Confirmed  
**Decision:** Gemini may support fan guidance, recommendation explanation, and operator summaries, but it must sit on top of authoritative system state rather than replace routing, safety, or operational logic.

**Why this decision was taken**
- The product wants smart assistance without turning core operational behavior into opaque AI behavior.
- Safety and routing decisions need deterministic, reviewable system foundations.

**Implementation implication**
- Use Gemini for explanation, summarization, and contextual assistance.
- Do not let AI become the system of record for routes, closures, or critical operations.

---

## D-022 — Use Stitch for design generation, but keep product logic outside design tools

**Status:** Confirmed  
**Decision:** Google Stitch is the primary design-generation tool, but Stitch outputs must not become the source of product logic.

**Why this decision was taken**
- Stitch helps accelerate UI creation and consistency.
- Visual outputs alone are not sufficient to define behavior, data rules, or state transitions.

**Implementation implication**
- Consolidate approved design output into `DESIGN.md` or equivalent design source-of-truth notes.
- Implement against approved design context, not against screenshots alone.

---

## D-023 — AI Studio may accelerate functional prototyping, but not become an uncontrolled parallel build track

**Status:** Confirmed  
**Decision:** AI Studio is approved for assistant behavior exploration and rapid functional prototyping, but it must remain aligned to MatchFlow specs and architecture decisions.

**Why this decision was taken**
- AI Studio can accelerate prototyping, especially around assistant-like behavior.
- Uncontrolled parallel implementation would create drift and reduce architecture discipline.

**Implementation implication**
- Treat AI Studio outputs as exploratory or supportive unless grounded back into approved specs and repo structure.

---

## D-024 — Use Spec-Driven Development as the mandatory delivery method

**Status:** Confirmed  
**Decision:** MatchFlow will be built under Spec-Driven Development.

**Why this decision was taken**
- The project is moving fast and needs clear boundaries to avoid scope creep.
- SDD improves reviewability, keeps work modular, and helps AI-assisted implementation stay disciplined.

**Implementation implication**
- Work in the pattern: one spec → one task → one verification → one review → one commit.
- The active spec is the source of truth for implementation.
- Broad “build the whole app” prompts are not allowed.

---

## D-025 — Human decisions override agent invention

**Status:** Confirmed  
**Decision:** Architectural, product, and scope decisions must be intentionally made by the human owner rather than silently invented by coding agents.

**Why this decision was taken**
- Fast AI-assisted development can drift unless key choices are explicitly governed.
- The project needs stable direction while many artifacts are being produced rapidly.

**Implementation implication**
- If a task is unclear, refine the spec rather than letting the agent expand scope.
- Reviews should explicitly check for architectural drift and hidden extra scope.

---

## D-026 — Keep tasks small, verifiable, and repo-safe

**Status:** Confirmed  
**Decision:** Tasks must be intentionally small, bounded, and easy to verify.

**Why this decision was taken**
- Smaller tasks reduce risk, improve review quality, and keep the app runnable.
- This is especially important in a short MVP build using AI-assisted implementation.

**Implementation implication**
- Split large work before coding.
- Each task should have clear validation.
- Avoid touching unrelated files or modules without explicit approval.

---

## D-027 — Maintain a modular repo and document operating model

**Status:** Confirmed  
**Decision:** MatchFlow should maintain clear separation between business docs, architecture/build docs, design source-of-truth files, specs, apps, services, packages, tests, and simulation logic.

**Why this decision was taken**
- Clear structure reduces confusion for both humans and agents.
- It supports spec-driven delivery, testing, and long-term maintainability.

**Implementation implication**
- Keep domain types centralized.
- Isolate routing, queue, simulator, and Firebase access from UI code.
- Update architecture and related docs when major assumptions change.

---

## D-028 — Accessibility is a first-class requirement, not a polish task

**Status:** Confirmed  
**Decision:** Accessibility must be treated as a core design and architecture requirement.

**Why this decision was taken**
- Fans use the app in bright, crowded, distracting conditions with limited attention and often one-handed use.
- Operators need fast scanning and clear prioritization under pressure.

**Implementation implication**
- Use high contrast, readable text, large touch targets, non-color-only status communication, and clear offline/loading/emergency states.
- Accessibility checks should appear in specs, reviews, and validation steps.

---

## D-029 — Keep testing and simulator-backed validation mandatory

**Status:** Confirmed  
**Decision:** Testing is required even in the fast MVP build, and simulator-backed scenario validation is a central testing method.

**Why this decision was taken**
- Routing, queue logic, offline behavior, emergency flows, and demo stability are too important to leave unverified.
- The simulator is needed not just for presentation, but also for realistic scenario validation.

**Implementation implication**
- Prioritize testing for venue graph integrity, routing, queue state, emergency rerouting, offline sync/outbox behavior, order transitions, and simulator-to-live-state propagation.
- If automation is impractical in a slice, record explicit manual verification steps.

---

## D-030 — Preserve one stable fan flow, one stable ops flow, one stable simulator flow, and one wow moment

**Status:** Confirmed  
**Decision:** Demo readiness is a continuous architectural priority.

**Why this decision was taken**
- A challenge demo is judged on visible usefulness, stability, and coherence.
- The product must preserve a few reliable high-impact flows rather than chase too many unstable features.

**Implementation implication**
- Do not jeopardize working demo slices for optional late-stage improvements.
- Strong wow moments include live queue rerouting, least-crowded recommendations, in-seat ordering alternatives, emergency reroute, and graceful degraded behavior.

---

## D-031 — Follow the agreed implementation sequence

**Status:** Confirmed  
**Decision:** The preferred implementation order is:

1. `01-venue-domain-model`
2. `02-fan-app-shell`
3. `03-live-heatmap`
4. `04-queue-alerts`
5. `05-in-seat-ordering`
6. `06-emergency-reroute`
7. `07-offline-sync`
8. `08-demo-simulator`

**Why this decision was taken**
- The sequence builds from shared foundations into visible user value and then into resilience/demo control.
- It reduces dependency confusion and supports incremental validation.

**Implementation implication**
- Change this order only deliberately.
- Downstream specs should assume the venue model and app shell foundations exist before richer live behavior is added.

---

## 5. Deferred Decisions / Future-Facing Areas

The following areas are intentionally deferred beyond the current MatchFlow commitment unless later approved:

- real sensor ingestion
- CCTV/computer vision adapters
- full CAD/BIM digital twin integration
- production indoor positioning
- seat-level live tracking
- full payment gateway integration
- BigQuery-backed richer analytics/replay
- deeper order fulfillment and operations tooling
- venue-to-venue configuration templates
- premium personalization layers

These may be revisited later, but they are not part of the current build commitment.

---

## 6. Open Decisions Still to Resolve in Later Specs

These are important, but not fully locked yet:

1. exact venue graph schema/file format in code
2. final operator role depth for the MVP
3. whether fan and ops live in one deployable app shell or separate deployables
4. pickup-only vs pickup + in-seat delivery simulation detail
5. final alert prioritization policy
6. whether FCM push is fully implemented or only modeled in-app
7. how much Gemini functionality makes the final demo cut
8. whether BigQuery is omitted entirely from the first implementation cut

These should be finalized in feature specs or build-time architecture notes, not improvised in code.

---

## 7. Change Control Guidance

A decision in this document should be revised only when:

- a later approved spec explicitly changes it
- the architecture overview is intentionally updated
- the owner makes a deliberate product/architecture call
- build reality proves the original decision unsafe or unworkable

When that happens:
- update this document
- update the related architecture/spec docs
- call out the change clearly in the next relevant implementation prompt or review

---

## 8. Summary

The current MatchFlow direction is intentionally pragmatic:

- cricket-aware rather than generic
- zone-based rather than seat-tracking-based
- simulator-first rather than hardware-dependent
- Google-native rather than custom-infrastructure-heavy
- offline-resilient rather than connectivity-assuming
- safety-aware rather than convenience-only
- spec-driven rather than prompt-driven
- modular and demo-ready rather than overbuilt

That combination is the core architectural posture of MatchFlow for this MVP.
