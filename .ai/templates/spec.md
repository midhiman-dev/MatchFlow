# [Spec ID] - [Feature Name]

## Status
- Draft / Approved / In Progress / Complete

## Owner
- Human owner: [name]
- Primary implementing agent: [Architect / Frontend / Realtime & Backend / Simulation / QA & Review]

## Why

Describe why this feature exists and why it matters to MatchFlow now.

Answer:
- What user or operator problem does this solve?
- Why is it important for the 72-hour MVP build?
- What business/demo value does it unlock?
- Why should it be built now instead of later?

### Example prompts for writing this section
- During innings break, fans face long queues and confusion about where to go next.
- Operators need quick visibility into pressure hotspots to make better decisions.
- This feature strengthens the live demo by making surge intelligence visible and useful.

---

## What

Describe the concrete output of this spec.

This section must define the feature in a way that is:
- specific
- bounded
- testable
- small enough to implement incrementally

### Include
- what the user will see or be able to do
- what the operator will see or be able to do
- what services or domain behavior must exist
- what the expected output/state is

### Must not be
- vague
- multi-featured without boundaries
- a whole product area with no slicing

---

## Success Criteria

List the specific outcomes that make this spec successful.

### Example format
- Fan can see the nearest low-queue washroom suggestion.
- Ops dashboard reflects queue band changes from simulated surge events.
- UI shows freshness timestamp for queue data.
- Offline mode shows last known useful state instead of blank failure.

---

## Scope

### In Scope
- [item]
- [item]
- [item]

### Out of Scope
- [item]
- [item]
- [item]

### Explicit Non-Goals
Use this section to prevent scope creep.

Examples:
- No payment gateway integration
- No full indoor positioning
- No full CAD/BIM digital twin integration
- No seat-level live tracking
- No redesign of unrelated screens

---

## Constraints

Describe the hard boundaries the agent must follow.

### Product Constraints
- Must fit MatchFlow MVP scope
- Must preserve demo credibility
- Must prioritize usability and accessibility
- Must support cricket-stadium use cases where relevant

### Technical Constraints
- Use existing repo structure and patterns
- Prefer approved stack and services
- Do not add dependencies unless justified
- Keep implementation modular and testable
- Do not introduce broad architectural changes unless explicitly required

### Delivery Constraints
- Keep tasks small
- Keep repo runnable/reviewable
- Verify before moving on
- Do not change unrelated files

---

## Dependencies

List what this spec depends on.

### Upstream dependencies
- [spec / package / service / design doc]
- [spec / package / service / design doc]

### Downstream dependencies
- [future spec or module that will rely on this]

---

## Current State

Describe what already exists in the repo and what assumptions are safe.

### Relevant files
- `path/to/file`
- `path/to/file`

### Existing patterns to follow
- [pattern]
- [pattern]

### Existing behavior
- [what already works]
- [what does not exist yet]

### Relevant design references
- `docs/design/DESIGN.md`
- `docs/design/screen-flows.md`
- Stitch outputs if available

### Notes
- [important assumption]
- [important limitation]
- [known gap]

---

## Proposed Approach

Describe the recommended implementation approach at a high level.

Keep this section practical and short.

### Should include
- where the code should live
- how responsibilities should be split
- any shared types/contracts needed
- how UI/service/domain boundaries should work
- how this feature will remain testable

### Should avoid
- unnecessary low-level code detail
- over-architecting
- unrelated future ideas

---

## Data / Domain Model Impact

Document any new or changed domain concepts.

### New types / entities
- [type/entity name]
- [type/entity name]

### Updated contracts
- [contract]
- [contract]

### Notes
- Keep domain concepts explicit
- Prefer shared types for cross-app or cross-service concepts
- Avoid generic blobs when explicit models are better

---

## UX / UI Notes

Only include this if the spec affects UI or experience.

### Fan UX expectations
- [item]
- [item]

### Operator UX expectations
- [item]
- [item]

### Accessibility expectations
- high contrast
- readable text
- non-color-only states
- large touch targets
- clear loading/offline/error states

### Design references
- `docs/design/DESIGN.md`
- [screen name / flow name]

---

## Realtime / Offline / Security Notes

Only include what applies.

### Realtime
- [update cadence / live state expectations / subscriptions]

### Offline
- [what must be cached]
- [what degrades gracefully]
- [what last-known state should be shown]

### Security
- [auth requirements]
- [protected actions]
- [validation rules]

---

## Tasks

Break the work into small implementation tasks.

### Task sizing rules
Each task should:
- be narrow
- have a clear boundary
- be verifiable
- avoid touching unrelated areas
- usually be understandable in one short read

If a task feels too large, split it.

---

### T1 - [Task Title]

**Goal**  
Describe the exact outcome of this task.

**Files likely involved**  
- `path/to/file`
- `path/to/file`

**Implementation notes**  
- [note]
- [note]

**Must not**  
- [boundary]
- [boundary]

**Verification**  
- [test / typecheck / manual check / simulator scenario]

---

### T2 - [Task Title]

**Goal**  
Describe the exact outcome of this task.

**Files likely involved**  
- `path/to/file`
- `path/to/file`

**Implementation notes**  
- [note]
- [note]

**Must not**  
- [boundary]
- [boundary]

**Verification**  
- [test / typecheck / manual check / simulator scenario]

---

### T3 - [Task Title]

**Goal**  
Describe the exact outcome of this task.

**Files likely involved**  
- `path/to/file`
- `path/to/file`

**Implementation notes**  
- [note]
- [note]

**Must not**  
- [boundary]
- [boundary]

**Verification**  
- [test / typecheck / manual check / simulator scenario]

---

## Validation

Define how the full spec will be checked once all tasks are complete.

### Required validation
- [ ] Typecheck/build passes
- [ ] Relevant tests pass
- [ ] Manual verification completed
- [ ] No unrelated regressions observed
- [ ] Accessibility expectations checked where applicable
- [ ] Docs updated if behavior/contracts changed

### Manual verification checklist
- [ ] [manual step]
- [ ] [manual step]
- [ ] [manual step]

### Simulator validation
If relevant:
- [ ] innings break scenario
- [ ] DRS spike scenario
- [ ] wicket movement scenario
- [ ] end-match exit scenario
- [ ] emergency closure/reroute scenario

---

## Risks / Edge Cases

List the real risks, not hypothetical noise.

### Examples
- stale queue state may confuse users if freshness is not visible
- route recomputation may fail when a zone is closed unexpectedly
- simulator data may not match new domain contracts
- UI may become too dense on small screens

---

## Rollback / Safe Failure Notes

Describe how this feature can fail safely.

Examples:
- if live data is missing, show last known useful state
- if queue estimate is stale, downgrade to broad queue band
- if route generation fails, show a fallback nearby amenity list
- if protected action fails, do not show successful state prematurely

---

## Documentation Updates Required

List docs that must be updated if this spec is implemented.

- `docs/architecture/decisions.md`
- `docs/api/contracts.md`
- `docs/testing/demo-scenarios.md`
- `docs/design/DESIGN.md`
- [other relevant doc]

---

## Suggested Commit Strategy

Recommended commit approach:
- one meaningful completed task per commit
- clear commit message tied to task id

### Example
- `feat(queue-alerts): add shared queue state types`
- `feat(queue-alerts): render fan queue cards with freshness`
- `test(queue-alerts): add simulator-backed validation`

---

## Implementation Prompt Template

Use this prompt format with Antigravity or another coding agent:

> Read this spec and `skills.md`. Implement **[TASK ID] only**.  
> Stay within the defined scope and constraints.  
> Do not modify unrelated files.  
> Follow existing repo patterns.  
> Complete the listed verification steps and report:
> - files changed
> - what was implemented
> - what was intentionally not changed
> - verification performed
> - risks / follow-ups

---

## Review Prompt Template

Use this after implementation:

> Review the implementation of **[TASK ID]** against this spec and `skills.md`.  
> Check for:
> - spec compliance
> - scope creep
> - missing validation
> - regressions
> - accessibility issues
> - demo risk
> Report mismatches clearly.

---

## Definition of Done

This spec is done only when:
- all required tasks are complete
- validation has been performed
- code remains maintainable
- no unrelated scope was introduced
- any required docs/tests are updated
- the resulting slice is demo-ready or safely reviewable

---

## Change Log

### v1
- Initial draft

### v2
- [update note]

### v3
- [update note]
