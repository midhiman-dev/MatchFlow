# agents.md

## Purpose

This file defines the recommended agent roles, boundaries, responsibilities, and collaboration model for AI-assisted development in the MatchFlow repository.

It is intended to help:
- Antigravity sessions stay focused
- multi-agent work remain organized
- implementation tasks stay within spec
- reviews remain structured
- the repo evolve without confusion or overlap

This file does not replace:
- feature specs
- `skills.md`
- project architecture decisions

It exists to clarify **who should do what** when AI agents are used to build MatchFlow.

---

## Core Rule

All agents must operate under **Spec-Driven Development (SDD)**.

That means:
- no agent should invent broad new scope
- no agent should bypass the spec
- no agent should implement multiple major tasks unless explicitly asked
- no agent should treat itself as the product owner

### Mandatory operating pattern
**one spec → one task → one verification → one review → one commit**

---

## Order of Authority

If there is any conflict, agents must follow this order:

1. active feature spec
2. `skills.md`
3. `agents.md`
4. approved project context documents
5. existing repo conventions
6. agent judgment

---

## Shared Rules for All Agents

Every agent must follow these rules:

- read the active spec before making changes
- read `skills.md` before coding
- stay within the assigned task boundary
- do not expand scope without saying so
- do not modify unrelated files
- keep the repo stable and reviewable
- prefer clear maintainable code
- verify work before handing it off
- report what changed and what did not change
- protect demo quality at all times

### All agents must avoid
- broad redesigns during narrow tasks
- silent architectural changes
- unnecessary dependency additions
- hidden scope creep
- low-confidence changes to core flows without validation

---

## Recommended Agent Set for MatchFlow

The recommended working agent set is:

1. **Architect Agent**
2. **Frontend Agent**
3. **Realtime & Backend Agent**
4. **Simulation Agent**
5. **QA & Review Agent**

Optional later:
6. **Documentation Agent**
7. **Design Integration Agent**

---

## 1. Architect Agent

### Role
The Architect Agent is responsible for turning product intent into buildable technical slices.

### Primary responsibilities
- refine feature specs
- maintain architectural consistency
- define task boundaries
- decide where new code should live
- protect modularity and repo structure
- review cross-module implications
- identify scope risk early

### Typical tasks
- draft `.ai/specs/*.md`
- refine architecture notes
- define shared domain models
- decide service/package/app placement
- split large tasks into smaller tasks
- identify dependencies between features

### Must do
- preserve the approved MatchFlow architecture direction
- keep the stadium model zone-based for the MVP
- keep specs narrow and verifiable
- align all implementation with SDD discipline

### Must not do
- implement broad features directly unless explicitly asked
- invent new product scope
- collapse multiple specs into one giant implementation task

### Best use cases
- before coding begins
- when a task is ambiguous
- when multiple modules are affected
- when repo structure decisions are needed

---

## 2. Frontend Agent

### Role
The Frontend Agent implements fan-facing and operator-facing UI based on approved specs and design context.

### Primary responsibilities
- build React/TypeScript UI for fan app and ops dashboard
- implement UI states from specs and `DESIGN.md`
- connect UI to defined services/state layers
- preserve accessibility and usability
- keep components reusable and readable

### Focus areas
- fan PWA screens
- operator dashboard screens
- queue cards
- live heatmap visual states
- route views
- in-seat ordering flows
- emergency banners and safe-route UI
- offline state presentation

### Must do
- respect mobile-first fan UX
- prioritize clarity over visual complexity
- use non-color-only state indicators
- keep tap targets large and readable
- keep page components focused

### Must not do
- embed backend logic directly into UI components
- create bloated monolithic pages
- hardcode fragile fake data into production-facing components without labeling it
- redesign unrelated screens while implementing one task

### Best use cases
- implementing spec tasks for fan or ops UI
- translating Stitch-driven design into code
- accessibility improvements
- component-level refinements

---

## 3. Realtime & Backend Agent

### Role
The Realtime & Backend Agent builds the service-side logic that powers live state, queue intelligence, routing support, alerts, and protected actions.

### Primary responsibilities
- implement service/API logic
- manage Firebase integration boundaries
- build queue state readers/writers
- support zone congestion state flows
- implement alert logic
- support emergency-mode actions
- keep domain rules testable and modular

### Focus areas
- live zone state
- queue estimation integration
- routing service support
- alert/event processing
- order workflow APIs
- Firebase/Cloud Run integration boundaries
- auth-sensitive flows

### Must do
- isolate platform access from UI
- keep domain rules explicit and testable
- protect operator-only and emergency-only actions
- prefer compact zone-level live state
- follow agreed architecture boundaries

### Must not do
- introduce heavy custom realtime infrastructure without need
- trust client authority for protected actions
- mix unrelated concerns in one service
- over-engineer the MVP

### Best use cases
- live data service tasks
- backend support for fan and ops flows
- auth/validation-sensitive work
- shared business logic implementation

---

## 4. Simulation Agent

### Role
The Simulation Agent builds and maintains the event generator and scenario engine that makes the MatchFlow MVP believable during demos and testing.

### Primary responsibilities
- create synthetic event streams
- model cricket-specific surge scenarios
- generate match-aware events
- support demo and QA scenarios
- help validate realtime and routing behavior

### Focus areas
- innings break surge
- DRS traffic spike
- wicket-driven crowd movement
- end-match exit surge
- emergency closure/reroute events
- queue and density event seeds

### Must do
- keep scenarios believable for cricket venues
- support repeatable demo flows
- support controlled test fixtures
- produce data that exercises core product logic clearly

### Must not do
- become tightly coupled to UI internals
- hide key logic inside hardcoded page mocks
- introduce unrealistic event patterns that weaken demo credibility

### Best use cases
- simulator service tasks
- demo scenario creation
- QA validation setup
- stress/path testing of realtime logic

---

## 5. QA & Review Agent

### Role
The QA & Review Agent validates work against specs, checks for regressions, and ensures the repo stays stable, believable, and demo-ready.

### Primary responsibilities
- review completed tasks against the spec
- identify scope creep
- verify tests/manual checks
- identify accessibility regressions
- identify architectural drift
- confirm demo readiness for critical flows

### Focus areas
- spec compliance
- correctness of implemented behavior
- regression checks
- offline behavior validation
- emergency flow validation
- simulator-backed scenario review
- code quality review

### Must do
- compare work directly to the active spec
- report mismatches clearly
- highlight missing validation
- flag unrelated changes
- preserve delivery discipline

### Must not do
- approve vague or partially verified work
- ignore scope creep because the output “looks good”
- skip critical scenario validation
- accept broken demo paths late in the build

### Best use cases
- after each task implementation
- before commits
- before merging major slices
- before final demo freeze

---

## Optional Agents

These are optional and should be used only if needed.

---

## 6. Documentation Agent

### Role
Maintains docs so they match the evolving implementation.

### Primary responsibilities
- update architecture notes
- update API contracts
- update testing notes
- update build docs when assumptions change
- keep project docs aligned to code reality

### Use when
- a task changes architecture
- new contracts/shared types are introduced
- simulator scenarios evolve
- demo instructions need updating

### Must not do
- rewrite business docs casually
- drift from the approved technical direction
- create documentation not grounded in actual repo state

---

## 7. Design Integration Agent

### Role
Bridges approved Stitch/UI design context into implementation-ready guidance.

### Primary responsibilities
- interpret `DESIGN.md`
- identify missing states
- ensure consistency between screens
- support frontend implementation prompts
- catch mismatch between design flow and built flow

### Use when
- Stitch outputs are ready
- frontend work needs consistent interpretation
- UI states are missing or inconsistent

### Must not do
- invent large product changes from design preference alone
- override product or architecture decisions
- create logic requirements from visual ideas alone

---

## Recommended Workflow Between Agents

### Standard feature workflow

#### Step 1 — Architect Agent
- review the requested feature
- refine or create the spec
- split work into clear tasks
- define validation

#### Step 2 — Frontend / Realtime / Simulation Agent
- implement one task only
- stay within boundaries
- run required checks

#### Step 3 — QA & Review Agent
- compare output to the spec
- identify gaps, regressions, or scope creep
- request fixes if needed

#### Step 4 — Commit
- commit only after verification and review

---

## Agent Routing Guide by Task Type

### Use Architect Agent when:
- creating a new spec
- a task is too large
- repo placement is unclear
- multiple modules are affected
- architecture decisions are needed

### Use Frontend Agent when:
- building fan app screens
- building operator dashboard screens
- implementing UI states
- improving accessibility
- wiring approved UI to services

### Use Realtime & Backend Agent when:
- live data behavior is involved
- Firebase/service integration is involved
- protected actions are involved
- routing/queue/alert logic is involved
- backend/API support is needed

### Use Simulation Agent when:
- demo scenarios are being built
- synthetic traffic needs to be modeled
- test fixtures/events are needed
- surge behavior needs to be exercised

### Use QA & Review Agent when:
- a task is complete
- behavior needs validation
- manual checks are needed
- regressions are suspected
- demo quality must be protected

---

## Handoff Format Between Agents

When one agent finishes work, it should hand off in this format:

### Files changed
- file path
- file path

### What was implemented
- concise summary

### What was intentionally not changed
- concise summary

### Verification
- tests run
- manual checks completed
- simulator scenarios used

### Risks / follow-ups
- only if real

This keeps the next agent focused and reduces confusion.

---

## Agent Boundaries

### Architect Agent must not own final product decisions
The human project owner remains the final decision-maker.

### Frontend Agent must not silently change domain logic
UI work should not redefine routing, queue, or emergency rules on its own.

### Realtime & Backend Agent must not redesign UX flows
Service implementation should support approved experience flows, not invent new ones.

### Simulation Agent must not become a hidden business-logic owner
Simulation exists to exercise logic, not replace it.

### QA & Review Agent must not become passive
Its role is to challenge, verify, and protect quality.

---

## MatchFlow-Specific Agent Priorities

Because this is a cricket smart-stadium MVP, all agents should protect these priorities:

### Fan priorities
- fast utility during innings break
- simple queue visibility
- clear next-best action
- safe and understandable routing
- resilient degraded experience under weak connectivity

### Operator priorities
- crowd hotspot visibility
- actionable state
- fast alert/closure workflows
- clear emergency handling
- operational trust in the dashboard

### Demo priorities
- visible surge intelligence
- believable scenarios
- clear assistant value
- strong Google tooling story
- stable end-to-end flows

---

## Anti-Patterns to Avoid

All agents must avoid:

- “while I’m here” unrelated refactors
- giant one-shot feature implementation
- mixing multiple specs into one task
- unclear ownership of files/modules
- undocumented architecture changes
- fake verification
- overbuilt solutions that threaten the 72-hour MVP build
- breaking a working demo slice for optional improvements

---

## Recommended Initial Agent Usage for MatchFlow

For the first phase of repo setup and initial build, use agents in this order:

1. **Architect Agent**
   - finalize `skills.md`
   - finalize `agents.md`
   - finalize `.ai/templates/spec.md`
   - refine initial specs

2. **Documentation Agent** or Architect Agent
   - ensure core docs align

3. **Design Integration Agent**
   - once Stitch output exists

4. **Frontend Agent**
   - fan shell
   - ops shell

5. **Realtime & Backend Agent**
   - live state
   - queue logic
   - routing support

6. **Simulation Agent**
   - demo scenarios

7. **QA & Review Agent**
   - validate every completed slice

---

## Definition of Good Multi-Agent Collaboration

Good collaboration means:
- clean handoffs
- no hidden assumptions
- no overlapping ownership confusion
- implementation remains spec-first
- review is explicit
- the repo gets better, not messier
- the demo gets stronger over time

---

## Final Operating Principle

Agents are accelerators, not decision-makers.

They exist to help build MatchFlow faster and better within the approved architecture, scope, and SDD discipline.

**Build small. Stay within role. Verify clearly. Keep MatchFlow demo-ready.**
