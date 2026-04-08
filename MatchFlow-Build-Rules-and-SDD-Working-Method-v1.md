# MatchFlow Build Rules and SDD Working Method v1

## 1. Purpose of This Note

This document defines the **working rules, engineering discipline, and Spec-Driven Development (SDD) method** for building MatchFlow.

It is intended to be used as a **project-level operating guide** for all future implementation work across:

- Antigravity sessions
- AI Studio-assisted development
- Stitch-driven UI implementation
- feature specs
- coding tasks
- reviews
- commits
- testing and demo preparation

This note is not a business document.  
It is a **build governance and execution rules document**.

---

## 2. Core Build Philosophy

MatchFlow must be built as a **focused, modular, believable 72-hour MVP**, not as an over-engineered production platform.

The guiding philosophy is:

- build only what is needed to demonstrate real value
- keep every feature small enough to reason about
- preserve clarity over cleverness
- favor maintainability over unnecessary complexity
- validate every increment before continuing
- keep the app demo-ready at all times

---

## 3. Approved Development Method

**Approved method:** Spec-Driven Development (SDD)

### What SDD means for MatchFlow
All development must flow through written specs before implementation.

No feature should be built from vague prompts such as:
- "build the fan app"
- "create the dashboard"
- "implement the whole realtime system"

Instead, every feature must be broken into:
- a specific written spec
- clear boundaries
- explicit constraints
- small tasks
- defined validation steps

### Mandatory SDD execution principle
Always work in this pattern:

**one spec → one task → one verification → one review → one commit**

---

## 4. Non-Negotiable Build Rules

The following rules apply to all MatchFlow implementation work.

### Rule 1 — The spec is the source of truth
Implementation must follow the currently approved spec, not agent assumptions.

### Rule 2 — Human decisions override agent invention
Architectural, product, and scope decisions must be made intentionally by the human owner of the project.

### Rule 3 — Small tasks only
If a task feels too broad, touches too many files, or has unclear validation, it must be split before implementation.

### Rule 4 — Build in fresh sessions where possible
Each task should ideally be executed in a fresh Antigravity session to reduce context drift and accidental scope expansion.

### Rule 5 — No “build the whole thing” prompts
Never ask Antigravity or any AI coding tool to build large parts of MatchFlow in one shot.

### Rule 6 — Verify before moving forward
Every task must have a clear verification step:
- compile/typecheck
- test
- manual scenario check
- UI validation
- simulated event flow

### Rule 7 — Keep the app runnable
At the end of each major task or slice, the repo should remain in a runnable, reviewable state whenever practical.

### Rule 8 — No unrelated changes
A task must not modify unrelated modules, files, or architecture without explicit approval.

### Rule 9 — Prefer reuse over reinvention
If shared types, UI patterns, utilities, or architectural conventions already exist, they must be reused.

### Rule 10 — Protect demo credibility
Every implementation choice should strengthen the believability, usability, and stability of the MVP.

---

## 5. MatchFlow Build Priorities

When trade-offs arise, prioritize in this order:

1. **MVP clarity**
2. **working demo quality**
3. **clean modular code**
4. **usability and accessibility**
5. **reliability under simulated stadium congestion**
6. **Google services integration**
7. **feature depth**
8. **future extensibility**

This means:
- a smaller feature that works well is better than a larger feature that is fragile
- a believable simulation is better than unfinished real integration
- a simple architecture with clear rules is better than an ambitious but unstable one

---

## 6. Scope Control Rules

### In scope mindset
Build only the slice required to demonstrate:
- smart assistance
- real-time operational logic
- useful fan experience
- cricket-specific surge handling
- safety-aware behavior
- practical Google tooling integration

### Out-of-scope protection
Do not expand into:
- full hardware integration
- full production payment systems
- full CAD/BIM systems
- advanced computer vision pipelines
- seat-level fan tracking
- enterprise admin complexity unrelated to the challenge
- overbuilt microservices or infra layers

### Rule for scope pressure
If a new idea is attractive but not required for the MVP:
- record it
- do not build it yet
- keep current scope intact

---

## 7. Architecture Guardrails

The following architecture assumptions are currently approved and should remain stable unless intentionally revised.

### Product structure
MatchFlow consists of:
- fan-facing mobile/PWA experience
- operator dashboard
- simulation/event layer
- assistant/recommendation logic
- simplified digital twin routing model

### Preferred technical stack
- React
- TypeScript
- PWA-first frontend approach
- Firebase Realtime Database for live state
- Firestore for durable structured data
- Cloud Run for services/API logic
- Pub/Sub for event ingestion and simulation
- FCM for alerts
- Gemini for assistant behavior
- Stitch for UI design
- AI Studio for functional demo acceleration
- Antigravity for spec-driven execution

### Data modeling guardrail
For the MVP, the stadium must be modeled at **zone level**, not seat-level live tracking.

The digital twin should be simplified into:
- zones
- paths
- gates
- amenities
- capacities
- closures
- route graph

### Realtime guardrail
Do not build raw custom realtime infrastructure unless necessary.  
Use platform-native services and keep payloads lightweight.

### Offline guardrail
Offline-first behavior is required for key flows, but it should remain lightweight and practical:
- cached essential state
- last known guidance
- local pending actions
- graceful degradation

---

## 8. Code Quality Rules

All MatchFlow code should follow these standards.

### General quality
- prefer readable code over dense clever code
- use clear naming
- keep functions focused
- avoid hidden side effects
- keep state flow understandable
- remove dead code promptly
- avoid speculative abstractions

### Type discipline
- use strict TypeScript typing
- centralize shared domain types
- avoid untyped response blobs where possible
- do not bypass type issues with unsafe shortcuts unless explicitly justified

### File discipline
- do not create bloated files
- keep components and services focused
- split responsibilities logically
- colocate tests where appropriate or use consistent test directories

### UI discipline
- keep components reusable
- separate presentational vs stateful concerns where practical
- prefer composability
- do not hardcode brittle mock values in UI components unless clearly marked for demo simulation

### Service discipline
- isolate Firebase/API access
- isolate routing logic
- isolate queue estimation logic
- isolate simulation/event generation
- keep business rules testable outside the UI

---

## 9. Testing Rules

Testing is mandatory, even in a fast MVP build.

### Minimum expectation per task
Each implementation task must include at least one of:
- unit test
- integration test
- mock scenario validation
- manual verification checklist

### Must-test areas
Priority must be given to testing:
- queue status logic
- zone congestion logic
- routing behavior
- emergency rerouting
- offline sync/outbox behavior
- order flow state transitions
- alert generation logic

### Manual testing rule
If automation is not practical within the slice:
- define exact manual validation steps
- record expected outcome
- confirm the result before continuing

### Demo-scenario testing
The simulator must be used to validate:
- innings break rush
- DRS-triggered traffic spikes
- end-match exit surge
- emergency closure/reroute behavior

---

## 10. Accessibility Rules

Accessibility is not optional.

### Core accessibility expectations
- high contrast UI
- large tap targets
- readable text in bright environments
- non-color-only status communication
- icon + label combinations where needed
- sensible keyboard and screen-reader support where feasible
- clear feedback for offline, loading, and alert states

### Fan UX rule
The fan interface must work under:
- crowd pressure
- glare
- limited attention
- one-handed usage
- weak network conditions

### Ops UX rule
The operator interface must favor:
- fast scanning
- clear priorities
- minimal ambiguity
- fast action under pressure

---

## 11. Security Rules

Security must remain proportionate but real.

### Required mindset
Protect the system enough to be credible, even for an MVP.

### Required security practices
- do not expose secrets in code
- keep environment variables separated
- apply authentication to protected actions
- restrict operator-only actions
- validate important commands server-side
- avoid trusting client-generated authority
- protect critical flows such as emergency actions and operator overrides

### MVP realism rule
Even if the app uses simulation, dangerous actions must still look and behave as protected workflows.

---

## 12. Performance and Efficiency Rules

### Realtime efficiency
- prefer zone-level updates over granular high-volume payloads
- keep live state compact
- avoid excessive client polling
- centralize queue estimation
- use cached state for fan delivery

### Frontend efficiency
- do not over-render heavy views
- avoid oversized payloads
- lazy load non-essential modules where useful
- keep mobile experience responsive

### Demo efficiency
The app should remain responsive even when simulator events intensify during innings break scenarios.

---

## 13. Documentation Rules

Documentation is part of delivery, not an afterthought.

### Required documentation layers
MatchFlow should maintain a clean separation between:

#### Business documents
- BRD
- PRD
- SRS
- SDD

#### Build documents
- feature specs
- validation checklists
- testing notes
- architecture notes

#### Design documents
- DESIGN.md
- Stitch exports
- screen flow notes

#### Build governance docs
- skills.md
- agents.md
- this Build Rules and SDD Working Method note

### Rule for new implementation work
If a new slice changes architecture, behavior, or assumptions materially, the relevant docs must be updated.

---

## 14. Spec Writing Rules

Each spec must be narrow, clear, and executable.

### Every spec should contain
- Why
- What
- Constraints
- Current State
- Tasks
- Validation

### Every spec must state
- what is being built
- what is not being built
- which files or modules are relevant
- how success is checked

### Good spec characteristics
- focused
- bounded
- verifiable
- linked to current repo state
- readable by both human and agent

### Bad spec characteristics
- vague
- solutionless
- overly ambitious
- missing validation
- mixing multiple unrelated features

---

## 15. Task Sizing Rules

Each spec task should be intentionally small.

### A task is probably too large if:
- it touches many unrelated files
- it changes UI, backend, data model, and tests at once without a narrow boundary
- it takes long to explain clearly
- it lacks a simple validation method
- it risks breaking many unrelated parts of the app

### Preferred task shape
A good task should usually:
- focus on one technical objective
- affect one bounded slice of the codebase
- be understandable in one short read
- end with a concrete check

### Task splitting rule
When uncertain, split further.

Small tasks are preferred over ambitious tasks.

---

## 16. Antigravity Working Method

Antigravity should be used as the primary implementation accelerator, but under disciplined control.

### Approved Antigravity usage
Use Antigravity for:
- spec drafting/refinement
- repo scaffolding
- feature implementation
- test generation
- code review support
- architecture assistance
- browser validation
- iterative fixing

### Antigravity execution pattern
For each feature:
1. write/refine the spec
2. review and lock scope
3. ask Antigravity to implement **one task only**
4. verify result
5. review mismatches
6. fix if needed
7. commit
8. open a fresh session for the next task where practical

### Prompting rule
Antigravity prompts should always name:
- the exact spec
- the exact task
- the constraints
- the validation requirement
- the “do not touch unrelated files” rule

### Review rule
After Antigravity completes a task, always review:
- whether it actually followed the spec
- whether it introduced extra scope
- whether it broke existing patterns
- whether validation passed

---

## 17. Stitch Working Method

Google Stitch should be used to accelerate UI generation and consistency.

### Approved use
Use Stitch for:
- core screen generation
- design exploration
- consistency across fan and operator experiences
- rapid layout iteration

### Stitch rule
Do not let Stitch-generated UI become the source of product logic.

### Design source-of-truth rule
Design outputs should be consolidated into:
- DESIGN.md
- screen flow notes
- final prompt references

### Implementation rule
Developers and agents should implement against the approved design context, not against memory of screenshots alone.

---

## 18. AI Studio Working Method

AI Studio should be used for functional demo acceleration, assistant behavior testing, and rapid service-backed prototyping.

### Approved use
Use AI Studio for:
- assistant prompt iteration
- feature behavior demos
- quick functional app flows
- exploring Gemini-powered experience logic

### Rule
AI Studio outputs must still be aligned to MatchFlow specs and architecture decisions.  
It must not become a parallel uncontrolled implementation track.

---

## 19. Repo Operating Model

The MatchFlow repo should be structured to support SDD clearly.

### Recommended operating areas
- project/source-of-truth docs
- design source files
- specs
- apps
- services
- packages/shared types
- tests
- simulation scripts

### Repo rule
The repo should make it obvious:
- where domain types live
- where feature specs live
- where simulation logic lives
- where UI code lives
- where validation lives

### Naming rule
Use clear, consistent naming based on MatchFlow domain concepts.

---

## 20. Commit and Review Discipline

### Commit rule
Commit in small increments tied to meaningful completed tasks.

### Good commit behavior
- one completed task or fix
- clear commit message
- validation done
- no hidden unrelated edits

### Review rule
Before accepting work, confirm:
- spec alignment
- task completeness
- no scope creep
- no obvious regressions
- documentation/test updates when needed

---

## 21. Demo-Readiness Rules

Because MatchFlow is challenge-bound, demo quality matters continuously.

### Demo-readiness expectations
At all times, prioritize keeping available:
- one stable fan flow
- one stable ops flow
- one stable simulator flow
- one stable “wow” moment

### MatchFlow “wow” moments should likely include
- live queue rerouting during innings break
- least-crowded amenity recommendation
- smart in-seat ordering alternative
- emergency reroute using the digital twin
- graceful degraded behavior under poor network conditions

### Rule
Never jeopardize a working demo slice for an optional improvement late in the build.

---

## 22. Recommended Initial Working Spec Sequence

The initial spec order for MatchFlow should remain:

1. `01-venue-domain-model`
2. `02-fan-app-shell`
3. `03-live-heatmap`
4. `04-queue-alerts`
5. `05-in-seat-ordering`
6. `06-emergency-reroute`
7. `07-offline-sync`
8. `08-demo-simulator`

This sequence should only be changed deliberately.

---

## 23. Definition of Done for a MatchFlow Task

A task is considered done only when:

- the implementation matches the spec
- validation has been performed
- code remains readable and maintainable
- no unrelated scope was introduced
- any required tests/manual checks are complete
- the slice is reviewable
- the repo remains in a stable state

If these conditions are not met, the task is not done.

---

## 24. Working Motto for the Team

**Build small. Validate fast. Stay believable. Keep MatchFlow demo-ready.**

---

## 25. Immediate Next Application of This Document

This document should be used to guide the creation of:

1. `skills.md`
2. `agents.md`
3. `.ai/templates/spec.md`
4. the first feature specs
5. the Antigravity prompt pack
6. the repo execution rhythm for the 72-hour build

Once these are in place, MatchFlow implementation should proceed strictly under this working method.
