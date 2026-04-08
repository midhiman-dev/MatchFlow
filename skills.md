# skills.md

## Purpose

This file defines the default engineering behavior, coding rules, architecture guardrails, and execution discipline for all AI-assisted development in the MatchFlow repository.

It should be treated as the **repo-level implementation guide** for:
- Antigravity
- AI coding agents
- implementation prompts
- code review prompts
- test generation prompts
- refactor/fix prompts

This file does not replace a feature spec.  
It exists to make sure all feature work happens consistently and safely.

---

## Project Identity

**Project Name:** MatchFlow

**Project Type:** Smart stadium assistant / operations platform for large cricket venues

**MVP Context:** 72-hour challenge-scoped MVP build

**Core Product Intent:**  
MatchFlow helps cricket venues manage innings-break surges, end-of-match exits, queue pressure at washrooms and concessions, in-seat ordering, and safety-first crowd movement.

**Primary Product Surfaces:**
- fan-facing mobile/PWA experience
- operator dashboard
- simulator/event layer
- assistant/recommendation layer
- simplified digital twin routing model

---

## Default Working Mode

This repository uses **Spec-Driven Development (SDD)**.

### Mandatory execution pattern
Always work in this order:

**one spec → one task → one verification → one review → one commit**

### SDD operating rules
- Never implement a feature without reading its spec first.
- Never implement more than one explicit task unless asked.
- Never expand scope beyond the task/spec.
- If the requested task is too large, split it.
- If the spec is unclear, improve the spec before coding.
- If a task introduces risk to unrelated areas, stop and narrow the change.

### Default assumption
If there is any conflict:
1. the feature spec wins
2. then `skills.md`
3. then existing repo patterns
4. then agent judgment

---

## Project Priorities

When making trade-offs, optimize in this order:

1. MVP clarity
2. working demo quality
3. clean modular code
4. usability and accessibility
5. reliability during simulated stadium surges
6. meaningful Google services usage
7. feature depth
8. extensibility

### Practical interpretation
- A smaller working feature is better than a larger fragile feature.
- A believable simulation is better than an unfinished real integration.
- Clear architecture is better than clever complexity.
- Protecting the demo matters.

---

## Approved Stack

### Frontend
- React
- TypeScript
- PWA-first approach
- Mobile-first fan experience
- Separate operator dashboard UI

### Backend / Platform
- Firebase Realtime Database for live state
- Firestore for durable structured data
- Cloud Run for services/APIs
- Pub/Sub for event ingestion and simulator pipelines
- Firebase Cloud Messaging for alerts
- Firebase Auth for authenticated flows
- Firebase App Check where applicable

### AI / Google Tooling
- Antigravity for spec-driven implementation
- Stitch for UI design generation
- AI Studio for functional prototypes and assistant logic exploration
- Gemini for assistant/recommendation behavior

### Optional / later
- BigQuery
- Redis / Memorystore
- additional observability tooling

### Dependency rule
Do not introduce a new dependency unless:
- the current task clearly needs it
- the benefit is meaningful
- it does not create unnecessary build/demo risk

---

## Architecture Guardrails

### Stadium modeling rule
For this MVP, the stadium is modeled at **zone level**, not seat-level live tracking.

Use a graph-based stadium model with:
- zones
- paths
- gates
- amenities
- capacities
- closures
- route graph edges

### Realtime rule
Do not build custom heavy realtime infrastructure unless required.  
Prefer lightweight platform-native realtime patterns.

### Fan app rule
The fan app should prioritize:
- speed
- clarity
- low cognitive load
- route guidance
- queue visibility
- offline resilience
- large touch-friendly controls

### Operator dashboard rule
The operator dashboard should prioritize:
- hotspot visibility
- rapid decision support
- alerting control
- route/zone closure actions
- clear system state over decorative UI

### Simulation rule
The simulator is first-class.  
It is not a throwaway script.  
It must support believable demo scenarios such as:
- innings break surge
- DRS traffic spike
- wicket-driven crowd movement
- end-match exit surge
- emergency closure/reroute scenario

---

## Repo Shape Expectations

Assume this general repo layout unless a spec states otherwise:

- `.ai/` for specs/templates/tasks
- `apps/` for fan-pwa and ops-dashboard
- `services/` for realtime, queue, routing, assistant, simulator
- `packages/` for shared types, utilities, UI
- `docs/` for product, design, testing, architecture, API docs
- `tests/` for unit/integration/e2e/fixtures
- `scripts/` for setup/seed helpers

### Placement rule
Put code where future contributors would logically expect it.  
Do not hide important logic in random folders.

---

## Coding Standards

### General code quality
- Prefer readable, boring, maintainable code.
- Use clear naming.
- Keep functions focused.
- Keep files focused.
- Avoid deeply nested logic when simpler structures exist.
- Avoid speculative abstractions.
- Remove dead code and commented-out blocks.
- Do not leave placeholder hacks without labeling them clearly.

### TypeScript rules
- Use strict typing.
- Prefer explicit shared domain types.
- Avoid `any` unless unavoidable and justified.
- Type external data boundaries carefully.
- Keep shared domain types centralized.

### React rules
- Prefer functional components.
- Keep components small and composable.
- Separate view concerns from data/service concerns.
- Avoid monolithic page components.
- Prefer predictable state flow.
- Lift state only when necessary.
- Reuse shared UI primitives where it improves consistency.

### Service rules
- Keep Firebase/API access isolated from UI.
- Keep routing logic isolated from rendering.
- Keep queue estimation logic isolated from pages/components.
- Keep simulation/event generation isolated from product UI.
- Keep business rules testable outside the UI.

### Domain rules
Keep domain concepts explicit:
- zone
- route
- amenity
- queue state
- alert
- order
- incident
- emergency mode
- match event
- simulator event

Do not collapse unrelated concepts into generic blobs.

---

## UI / UX Rules

### Global UX priorities
- fast comprehension
- low-friction actions
- strong visual hierarchy
- mobile practicality
- clear state transitions
- outdoor readability

### Accessibility requirements
- high contrast
- readable text
- large tap targets
- non-color-only state indicators
- icons paired with labels when helpful
- clear loading/offline/error states
- keyboard/screen-reader friendliness where practical

### Fan experience rules
Assume the user may be:
- walking
- in glare
- in a crowd
- using one hand
- distracted by the match
- on weak connectivity

Therefore:
- show the best next action clearly
- avoid dense information walls
- favor status bands and concise text
- keep routes and alerts immediately understandable

### Operator dashboard rules
Assume the operator needs:
- fast scanning
- rapid prioritization
- low ambiguity
- action confidence under pressure

Therefore:
- prioritize clarity over visual flair
- make red/amber/green states obvious but not color-only
- make closures/overrides explicit and safe

---

## Testing Rules

Testing is mandatory even for the MVP.

### Every task must include at least one of:
- unit tests
- integration tests
- simulator-backed validation
- manual verification checklist

### Must-test areas
Prioritize test coverage for:
- zone congestion scoring
- queue state logic
- route recomputation
- emergency rerouting
- offline sync / outbox behavior
- alert generation
- order flow state transitions
- simulator event processing

### Manual verification rule
If automated testing is not practical in the current slice:
- define exact manual steps
- define expected result
- confirm the outcome before marking the task done

### Regression rule
If touching a shared domain, service, or critical flow, verify existing behavior still works.

---

## Security Rules

Even as an MVP, MatchFlow must be credible.

### Always
- keep secrets out of source files
- use environment variables/config separation
- gate protected actions
- validate important actions server-side
- assume client input is untrusted
- protect operator-only and emergency-only flows

### Never
- hardcode secrets into repo files
- trust client authority for emergency actions
- expose internal admin behavior directly from UI without protection
- fake security-sensitive flows in a way that looks unsafe

---

## Performance Rules

### Realtime efficiency
- prefer compact zone-level payloads
- avoid frequent client polling if subscription/state sync is available
- centralize queue estimation
- deliver cached live state to fan experiences where possible

### Frontend efficiency
- avoid unnecessary rerenders
- avoid oversized objects in component state
- lazy-load when it improves the experience
- keep mobile rendering practical

### Demo efficiency
The app must remain responsive during surge simulations.  
Do not introduce complexity that threatens demo stability.

---

## Offline-First Rules

Offline-first is a core MVP requirement.

### Preserve usability for:
- app shell
- venue map basics
- last known route context
- last known queue state
- seat/stand context
- order cart / pending actions
- emergency instructions

### Offline behavior principles
- show last known useful state
- clearly indicate freshness
- degrade gracefully
- queue pending actions when appropriate
- retry safely when connectivity returns

### UX rule
When live precision becomes unreliable:
- downgrade to broader status bands
- do not pretend stale data is fresh
- keep the user informed

---

## Documentation Rules

Documentation is part of delivery.

### Update docs when:
- architecture changes
- feature scope changes
- new shared types/contracts are introduced
- simulator behavior changes
- important assumptions change

### Important source-of-truth files
- `MatchFlow-Project-Context-and-Decisions-v1.md`
- `MatchFlow-Build-Rules-and-SDD-Working-Method-v1.md`
- `skills.md`
- `agents.md`
- `.ai/templates/spec.md`
- `.ai/specs/*`
- `docs/design/DESIGN.md`

### Rule
If code changes behavior materially, relevant docs should not stay stale.

---

## Spec Execution Rules for Agents

When asked to implement a task:

1. Read the relevant spec first.
2. Read this `skills.md`.
3. Identify the exact task boundary.
4. Change only the files needed.
5. Verify the task.
6. Summarize:
   - what changed
   - what was not changed
   - how it was verified
   - any risks or follow-ups

### If a prompt is vague
Do not silently expand into a large feature.  
Instead, constrain the work to the smallest reasonable interpretation.

### If a task is too big
Split it into smaller tasks and say so.

### If current repo patterns conflict with the prompt
Prefer preserving repo consistency unless the prompt explicitly authorizes a broader change.

---

## What Not to Do

### Never do these by default
- do not redesign the whole app while implementing a small feature
- do not rename broad domain concepts casually
- do not move files around unless necessary
- do not add large infra layers without need
- do not introduce production-only complexity for a 72-hour MVP build
- do not implement multiple specs in one pass
- do not touch unrelated files “while here”
- do not weaken accessibility to save time
- do not break demo-ready flows for optional improvements

---

## Definition of Good Task Output

A good implementation task result should be:
- spec-aligned
- scoped correctly
- readable
- testable
- reviewable
- runnable
- believable in the demo
- safe for the next task to build upon

---

## Definition of Done

A task is done only if:
- it matches the requested spec/task
- validation was performed
- unrelated scope was not introduced
- code remains maintainable
- the repo remains stable
- any necessary docs/tests were updated

If these are not true, the task is not done.

---

## Preferred Agent Response Format

When reporting completed work, use this structure:

### Files changed
- file path
- file path

### What was implemented
- concise summary

### What was intentionally not changed
- concise summary

### Verification
- tests run / manual checks performed

### Risks / follow-ups
- only if real

---

## Working Motto

**Build small. Validate fast. Stay believable. Keep MatchFlow demo-ready.**
