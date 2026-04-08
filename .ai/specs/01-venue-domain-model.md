# MatchFlow Project Context

**Version:** v1.0  
**Date:** 2026-04-08  
**Project Name:** MatchFlow  
**Project Type:** Smart stadium enterprise solution / challenge-scoped MVP  
**Status:** Active working context

---

## 1. Purpose of this file

This file is the root project-context document for MatchFlow.

It captures the most important business, product, technical, and delivery decisions made so far so future work stays consistent across:

- BRD, PRD, SRS, and SDD artifacts
- Antigravity implementation sessions
- Google Stitch design work
- AI Studio prototyping
- feature specs, prompts, reviews, and demos

Use this file as the first reference before creating specs, prompts, tasks, or new project documents.

---

## 2. Project snapshot

MatchFlow is a cricket-aware smart stadium assistant and operations platform designed for large cricket venues such as Narendra Modi Stadium, Eden Gardens, or similar high-capacity stadiums.

The project is being developed as a **72-hour challenge-scoped MVP** and is intentionally focused on a believable, usable product slice rather than a fully production-complete platform.

### Core problem
Cricket venues face intense but predictable crowd surges during moments such as:

- innings breaks
- DRS moments
- wickets / momentum shifts
- end-of-match exits

These surges lead to:

- long queues at concessions and washrooms
- concourse bottlenecks
- missed concession revenue
- poor crowd distribution
- safety and evacuation risk
- degraded fan experience

### MatchFlow response
MatchFlow addresses this through:

- real-time crowd flow awareness
- queue alerts and least-crowded recommendations
- fan rerouting guidance
- in-seat ordering options
- emergency routing support
- match-aware engagement notifications

---

## 3. Product vision

MatchFlow should work as a **smart, dynamic assistant for both fans and stadium operators**.

### Fan-side vision
A mobile-first stadium companion that helps fans:

- avoid long queues
- find the best route to amenities
- order snacks without entering crowded zones
- receive match-aware alerts and guidance
- get safe exit instructions during congestion or emergencies

### Operator-side vision
A control interface that helps stadium teams:

- monitor zone congestion in near real time
- identify crowd pressure hotspots
- push rerouting or queue alerts
- manage emergency closures and route changes
- improve utilization of concessions and washrooms

### Strategic positioning
**MatchFlow is a cricket-aware smart stadium assistant that helps major venues manage fan surges during innings breaks and match exits through real-time crowd intelligence, queue-aware routing, in-seat ordering, and safety-first digital twin guidance.**

---

## 4. MVP scope boundaries

The MVP must remain challenge-ready, believable, and demo-friendly.

### In scope
- fan-facing PWA
- operator dashboard
- real-time zone heat mapping
- queue alerts for washrooms and concessions
- cached wait times
- innings-break rerouting
- end-of-match exit guidance
- in-seat snack ordering
- match engagement notifications
- emergency rerouting using a simplified digital twin
- offline-first behavior for congested networks
- synthetic event simulation for demo scenarios

### Explicitly out of scope
- full CCTV / computer vision implementation
- full CAD/BIM digital twin integration
- production-grade indoor positioning
- full payment gateway integration
- real sensor hardware dependency
- seat-level live tracking
- complex enterprise back-office workflows beyond the challenge need

### Modeling decision
For the MVP, the stadium is modeled as:

- zones
- paths
- gates
- amenity nodes
- capacity values
- route graph

This simplified digital twin is enough for congestion logic, routing, and emergency demonstrations.

---

## 5. Key users

### Primary user groups
1. **Fans / attendees**
   - want fast, low-friction guidance in a crowded stadium
   - need quick interpretation of queue and route information
   - may be operating under weak connectivity and low attention

2. **Stadium operations team**
   - wants real-time visibility into crowd hotspots
   - needs fast control actions during surge or emergency scenarios
   - requires clear, low-clutter operational views

3. **Stewards / event staff**
   - benefit from emergency routing visibility and operational direction
   - may act as assisted operational users during incident flows

4. **Challenge judges / reviewers**
   - not product end-users, but an important audience for the MVP
   - must clearly see Google-services usage, code quality, usability, security, testing, and practical value

---

## 6. Preferred technical direction

### Frontend
- React
- TypeScript
- PWA architecture
- mobile-first UX for fans
- dashboard UX for operators

### Backend / platform
- Firebase Realtime Database for live state
- Cloud Firestore for durable structured data
- Cloud Run for services and APIs
- Pub/Sub for event ingestion and simulation pipeline
- Firebase Cloud Messaging for notifications
- Firebase Auth for access control
- Firebase App Check for client protection

### AI / Google services direction
- Google Antigravity for spec-driven build execution
- Google Stitch for UI generation and design exploration
- Google AI Studio for functional prototyping and Gemini-backed flow exploration
- Gemini for assistant and reasoning capabilities

### Optional / later
- BigQuery for analytics or replay
- Memorystore / Redis if advanced caching becomes necessary

---

## 7. Core product modules identified so far

1. **Venue Domain Model**
   - zones
   - paths
   - gates
   - concessions
   - washrooms
   - event types
   - route graph

2. **Fan App Shell**
   - match center
   - seat / stand context
   - map and utility navigation
   - live alerts

3. **Live Heat Map**
   - zone density state
   - congestion bands
   - operator heat view

4. **Queue Alerts**
   - amenity wait times
   - queue status cards
   - least-crowded suggestions
   - queue-aware redirection

5. **In-Seat Ordering**
   - snack ordering
   - pickup / delivery flow
   - order tracking
   - queue-aware service choice

6. **Emergency Rerouting**
   - zone closure logic
   - safe path display
   - emergency banners
   - operator overrides

7. **Offline Sync**
   - cached last-known state
   - offline-friendly route guidance
   - pending actions / outbox
   - network recovery behavior

8. **Demo Simulator**
   - innings-break surge
   - DRS event
   - wicket-driven crowd shift
   - end-match exit surge
   - emergency scenario

---

## 8. Core architecture and experience decisions

### Realtime approach
Heat mapping should stay at **zone level**, not seat-level live tracking.

Realtime zone state may include:
- density score
- flow direction
- entry rate
- exit rate
- queue pressure
- green / amber / red status band
- timestamp
- confidence

### Queue alert approach
Queue alerts should be driven by centrally computed amenity wait-time state, not constant client polling.

### Event sources for the MVP
Use synthetic or mocked streams representing:
- entry / exit scans
- amenity activity
- steward or operator input
- match event triggers
- emergency events

### Update behavior
Use higher-frequency updates during surge windows like innings break, and lower cadence during normal play.

---

## 9. Caching and offline-first decisions

Because stadium connectivity can degrade under crowd load, MatchFlow must be **offline-first for key user journeys**.

### Core caching approach
- use a central queue estimation service
- publish cached amenity wait-time objects
- let fan clients subscribe to cached live state

### Cache object examples
Each amenity queue object may include:
- wait time estimate
- wait band
- queue length estimate
- confidence
- updated timestamp
- expiry timestamp

### Fan UX freshness model
Use **stale-while-revalidate** behavior:
- show last known state if still recent
- degrade from exact times to coarse queue bands when stale
- clearly show freshness like “updated X sec ago”

### Must remain usable offline or under degraded connectivity
- app shell
- venue map basics
- seat / stand context
- saved routes
- last known nearby amenity data
- order cart / pending actions
- emergency guidance
- last known queue / routing snapshot

### Degraded-mode UX rules
When network quality drops:
- switch from exact minutes to low / moderate / high bands
- preserve last known guidance
- show freshness status clearly
- prioritize safety instructions over optional live features

---

## 10. Safety and digital twin decisions

Safety is a first-class requirement.

### Safety scope for the MVP
- operator-triggered emergency mode
- digital closure of zones or paths
- recomputed safe exits
- fan-facing emergency instructions
- steward / operator rerouted-flow view

### Digital twin approach
Use a simplified graph-based model of:
- zones
- paths
- entry / exit gates
- amenity points
- closure states
- capacity constraints

No full CAD/BIM integration is needed in the MVP.

---

## 11. Design principles

### Primary design tool
Google Stitch is the primary UI design accelerator.

### Fan UX principles
- current best action should be obvious
- queue and routing information must be quickly understandable
- large touch targets
- high contrast
- no color-only status communication
- usable in glare, noise, crowd pressure, and one-handed scenarios

### Ops UX principles
- immediate visibility into hotspot zones
- clear risk levels
- fast action controls
- minimal clutter
- incident-ready workflows

### Design-to-build flow
1. create screens in Stitch
2. export / consolidate design context into `DESIGN.md`
3. use that approved design context during implementation
4. do not implement from memory of screenshots alone

---

## 12. Delivery methodology

### Approved method
**Spec-Driven Development (SDD)**

### What this means
MatchFlow must not be built through large vague prompts.

Every feature should be built as:
- one focused spec
- bounded tasks
- explicit constraints
- clear validation steps
- small reviews and commits

### Mandatory execution pattern
**one spec → one task → one verification → one review → one commit**

### SDD expectations
- the spec is the source of truth
- the human decides scope and architecture
- the agent implements within boundaries
- fresh sessions are preferred when practical
- verify before moving forward
- keep the app demo-ready at all times

---

## 13. Build guardrails

### Core philosophy
MatchFlow is a focused, modular, believable 72-hour MVP — not an over-engineered production platform.

### Non-negotiable rules
- do not ask the AI to “build the whole app”
- keep tasks small and reviewable
- do not introduce unrelated changes
- prefer reuse over reinvention
- keep the repo runnable whenever practical
- protect demo credibility in every implementation choice

### Trade-off priorities
When trade-offs arise, prioritize:
1. MVP clarity
2. working demo quality
3. clean modular code
4. usability and accessibility
5. reliability under simulated stadium congestion
6. Google services integration
7. feature depth
8. future extensibility

### Working motto
**Build small. Validate fast. Stay believable. Keep MatchFlow demo-ready.**

---

## 14. Documentation operating model

The project should keep a clear separation between documentation layers.

### Business / stakeholder documents
- BRD
- PRD
- SRS
- SDD / architecture note

### Agent-facing execution documents
- feature specs
- task lists
- validation checklists
- prompt packs

### Design source-of-truth documents
- `DESIGN.md`
- Stitch exports
- screen flow notes

### Build governance documents
- `skills.md`
- `agents.md`
- project-context.md
- build rules / SDD working method

---

## 15. Initial feature spec sequence

Recommended implementation order:

1. `01-venue-domain-model`
2. `02-fan-app-shell`
3. `03-live-heatmap`
4. `04-queue-alerts`
5. `05-in-seat-ordering`
6. `06-emergency-reroute`
7. `07-offline-sync`
8. `08-demo-simulator`

This order should be changed only deliberately.

---

## 16. 72-hour working direction

### Day 1
- lock scope
- set architecture
- establish repo and specs
- create venue model
- create simulator base
- produce initial UI design

### Day 2
- build realtime crowd and queue behavior
- implement fan and ops live flows
- build assistant logic
- connect simulator to the UI

### Day 3
- implement offline-first and emergency mode
- polish the demo
- run tests
- script the pitch / demo flow
- fix usability issues

---

## 17. Judging and evaluation alignment

The project should clearly demonstrate:
- smart dynamic assistant behavior
- context-aware decision-making
- effective Google services usage
- practical real-world usability
- clean and maintainable code
- secure and responsible implementation
- efficient resource usage
- testing and validation
- accessibility and inclusion

This means MatchFlow should be presented as more than a fan app. It should read and behave like a **smart stadium assistant with operational intelligence**.

---

## 18. Definition of done for a task

A MatchFlow task is done only when:
- implementation matches the approved spec
- validation has been completed
- the code is readable and maintainable
- no unrelated scope has been introduced
- tests or manual checks are complete as required
- the slice is reviewable
- the repo remains stable

---

## 19. Immediate next artifacts

The agreed near-term artifact sequence is:

1. BRD
2. PRD
3. SRS
4. SDD / architecture note
5. `skills.md`
6. `agents.md`
7. `.ai/templates/spec.md`
8. initial feature specs
9. Stitch master design prompt
10. `DESIGN.md`

---

## 20. Current status summary

At this stage, MatchFlow has:
- a confirmed name and positioning
- a clear problem statement
- defined MVP boundaries
- a preferred Google-native architecture direction
- core feature slices
- real-time, caching, offline, and safety decisions
- a Spec-Driven Development method
- a working documentation model
- a staged implementation sequence

The next step is to use this file as the baseline context for all implementation-facing work.

---

## 21. Recommended usage instructions

Before starting any new feature or prompt:

1. read `project-context.md`
2. read the build rules / SDD method note
3. confirm the relevant spec or create one
4. define a small task with validation
5. implement only that bounded task
6. review before moving to the next slice

This file should be updated whenever there is a meaningful change in:
- scope
- architecture
- core feature direction
- build methodology
- toolchain decisions
- delivery priorities
