# MatchFlow Project Context and Decisions v1

## 1. Project Overview

**Project Name:** MatchFlow

**Project Type:** Smart Stadium enterprise solution / challenge-scoped MVP

**Primary Context:**  
MatchFlow is being designed as a smart stadium assistant and operations platform for large cricket venues such as Narendra Modi Stadium, Eden Gardens, or similar 50,000+ capacity stadiums.

**Challenge Context:**  
This solution is being built for a rapid coding challenge with a 72-hour MVP build timeline.

**Primary Goal:**  
Design and demonstrate a practical, enterprise-grade smart stadium solution that helps manage cricket-specific fan surge behavior, especially:

- the **15-minute innings break rush**
- the **end-of-match mass exit**
- concourse congestion at **washrooms and concessions**
- the need for **real-time match engagement** to reduce perceived wait times

---

## 2. Problem Statement

Cricket venues experience intense but predictable fan surges during match-specific moments such as:

- innings breaks
- Decision Review (DRS) moments
- wickets / momentum shifts
- end-of-match exits

These surges create operational problems such as:

- long queues at washrooms and concessions
- concourse bottlenecks
- poor crowd distribution
- missed concession revenue
- safety and evacuation challenges
- degraded fan experience

MatchFlow aims to solve this by combining:

- real-time crowd flow awareness
- intelligent queue alerts
- smart fan rerouting
- in-seat ordering
- emergency routing
- match-aware engagement notifications

---

## 3. Product Vision

MatchFlow should function as a **smart, dynamic assistant for both fans and stadium operators**.

### Fan-side vision
A mobile-first stadium companion that helps fans:

- find the best route to amenities
- avoid long queues
- order snacks without joining congested concourses
- receive live match-aware alerts
- get safe exit guidance during emergencies or post-match dispersal

### Operator-side vision
A control interface that helps stadium operations teams:

- monitor zone congestion in near real time
- identify crowd pressure hotspots
- issue queue/rerouting alerts
- manage digital twin zone closures and emergency routing
- optimize concessions and washroom utilization

---

## 4. Branding Decision

**Approved product/app name:** MatchFlow

All future documents, screens, architecture notes, specs, and demos should use **MatchFlow** as the official project/product name.

---

## 5. Key MVP Scope Decisions

The MVP should focus on a believable, usable, challenge-ready slice of the product.

### In scope for the MVP
- Fan-facing PWA
- Operator dashboard
- Real-time zone heat mapping
- Queue alerts for washrooms and concessions
- Cached wait times
- Dynamic rerouting during innings break
- End-of-match exit guidance
- In-seat snack ordering
- Match engagement notifications
- Emergency rerouting using a simplified digital twin
- Offline-first behavior for congested networks
- Synthetic event simulation for demo scenarios

### Explicitly out of scope for the MVP
- Full CCTV/computer vision implementation
- Full CAD/BIM digital twin integration
- Production-grade indoor positioning
- Full payment gateway integration
- Real sensor hardware dependency
- Seat-level live location tracking
- Overly complex enterprise back-office workflows

### Modeling decision
For the MVP, the stadium should be represented as:

- **zones**
- **paths**
- **gates**
- **amenity nodes**
- **capacity values**
- **route graph**

This simplified digital twin is sufficient for intelligent routing and congestion demonstration.

---

## 6. Preferred Technical Architecture

The current preferred stack for MatchFlow is:

### Frontend
- React
- TypeScript
- PWA architecture
- Mobile-first UX for fans
- Dashboard UI for operators

### Backend / Platform
- Firebase Realtime Database for live state
- Cloud Firestore for durable structured app data
- Cloud Run for APIs and backend services
- Pub/Sub for event ingestion and simulation pipeline
- Firebase Cloud Messaging for notifications
- Firebase Auth for operator/user access control
- Firebase App Check for client protection

### AI / Google Services
- Google Antigravity for development workflow
- Google Stitch for UI generation/design
- Google AI Studio for functional app prototyping/demo behavior
- Gemini for assistant and reasoning capabilities

### Optional / later
- BigQuery for analytics or replay
- Memorystore / Redis if advanced caching becomes necessary

---

## 7. Core Feature Modules Identified So Far

The following modules have been identified as the core product slices:

1. **Venue Domain Model**
   - stadium zones
   - paths
   - gates
   - concessions
   - washrooms
   - event types
   - route graph

2. **Fan App Shell**
   - match center
   - seat/stand context
   - map and utility navigation
   - live alerts

3. **Live Heat Map**
   - zone density state
   - color-banded congestion model
   - operator heat view

4. **Queue Alerts**
   - amenity wait times
   - queue status cards
   - least-crowded nearby suggestions
   - queue-aware redirection

5. **In-Seat Ordering**
   - snack ordering
   - pickup/delivery flow
   - order tracking
   - queue-aware service choices

6. **Emergency Rerouting**
   - zone closure logic
   - safe path display
   - emergency banners
   - operator overrides

7. **Offline Sync**
   - cached last-known state
   - offline-friendly route guidance
   - pending actions/outbox
   - network recovery behavior

8. **Demo Simulator**
   - innings break surge
   - DRS event
   - wicket-related crowd shift
   - end-match exit surge
   - emergency scenario

---

## 8. Real-Time Architecture Decisions So Far

### Heat mapping approach
Real-time heat mapping should not rely on seat-level or precise individual tracking for the MVP.

Instead, MatchFlow should compute **zone-level live state** such as:

- density score
- flow direction
- entry rate
- exit rate
- queue pressure
- status band (green/amber/red)
- timestamp
- confidence

### Queue alerts approach
Queue alerts should be driven by centrally computed amenity wait-time state, not by direct client-side polling.

### Event sources for the MVP
Use synthetic or mocked event streams representing:

- entry/exit scans
- amenity activity
- steward/operator inputs
- match event triggers
- emergency events

### Update strategy
Use higher-frequency updates during surge windows such as innings break, and reduced cadence during normal play.

---

## 9. Caching Strategy Decisions So Far

The system should avoid frequent client-side API calls for wait-time data.

### Preferred approach
- central queue estimation service
- cached amenity wait-time objects
- fan clients subscribe to cached live state

### Cache content
Each amenity/queue object may include:

- wait time estimate
- wait band
- queue length estimate
- confidence
- updated timestamp
- expiry timestamp

### UX behavior
The fan UI should use a **stale-while-revalidate** pattern:
- show last known state when still recent
- downgrade to coarse queue bands when precise data becomes stale
- clearly show freshness using “updated X sec ago”

---

## 10. Offline-First Strategy Decisions So Far

Because stadium Wi-Fi / 5G may become congested, MatchFlow must be designed as **offline-first** for important user flows.

### Must remain usable offline or under degraded connectivity
- app shell
- venue map basics
- seat/stand context
- saved routes
- last known nearby amenity data
- order cart / pending actions
- emergency guidance
- last known queue/routing snapshot

### Sync strategy
- durable local cache for essential fan context
- outbox pattern for user actions
- server-authoritative live crowd state
- retry when connectivity improves

### UX degradation policy
When connectivity is poor:
- switch from exact minutes to low/moderate/high bands
- keep last known guidance visible
- show clear freshness messaging
- prioritize safety instructions over optional live data

---

## 11. Safety and Digital Twin Decisions

Safety is a major pillar of MatchFlow.

### Safety scope for the MVP
- operator-triggered emergency mode
- digital closure of zones/paths
- recomputed safe exits
- fan-facing emergency instructions
- steward/operator view of rerouted flow

### Digital twin approach for MVP
The digital twin should be simplified to a graph-based model of:

- zones
- paths
- entry/exit gates
- amenity points
- closure states
- capacity constraints

No full CAD/BIM integration is required for the MVP.

---

## 12. Design Strategy Decisions

### Primary design tool
Google Stitch will be used for UI design generation.

### UI design principle
The interface must balance:

- high-intensity cricket data
- real-time utility
- low-friction actions
- accessibility in bright, crowded, noisy environments

### Fan UX priorities
- current best action should be obvious
- queue/wait/routing information should be easy to interpret quickly
- large touch targets
- clean high-contrast design
- non-color-only status indicators

### Ops UX priorities
- immediate visibility into crowd hotspots
- clear zone risk levels
- fast action controls
- minimal clutter
- incident-ready workflows

### Design-to-build flow
Current intended workflow:
1. create screens in Stitch
2. export design context / DESIGN.md
3. use that context in AI Studio / Antigravity
4. implement against the design source of truth

---

## 13. Development Methodology Decision

**Approved development methodology:** Spec-Driven Development

This is a major working decision for the MatchFlow project.

### What this means for MatchFlow
The project will not be built with broad, vague build prompts.

Instead:
- each feature gets its own spec
- each spec defines scope and boundaries
- each task is small and verifiable
- each task should be completed in isolation
- each task should be reviewed before moving on

### Core SDD principles to follow
- spec is source of truth
- human makes architectural decisions
- agent implements within boundaries
- fresh session for each task where possible
- verify before progressing
- commit in small increments

### Important implementation rule
Never ask the agent to “build the whole app.”
Always work as:
- one spec
- one task
- one review
- one commit

---

## 14. Proposed Repo / Documentation Operating Model

The project should maintain a clean separation between:

### Business / stakeholder docs
- BRD
- PRD
- SRS
- SDD

### Agent-facing execution docs
- feature specs
- tasks
- validation steps

### Design source of truth
- DESIGN.md
- screen flow notes
- Stitch exports

### Working rules
- skills.md
- agents.md

---

## 15. Proposed Initial Feature Spec List

These were identified as strong initial specs for MatchFlow:

1. `01-venue-domain-model`
2. `02-fan-app-shell`
3. `03-live-heatmap`
4. `04-queue-alerts`
5. `05-in-seat-ordering`
6. `06-emergency-reroute`
7. `07-offline-sync`
8. `08-demo-simulator`

These should be developed in a modular, testable sequence.

---

## 16. Documentation Strategy Agreed So Far

### BRD focus
- business value for cricket venues
- operational pain points
- revenue and safety outcomes
- user personas
- challenge justification

### PRD focus
- exact user-facing features
- operator actions
- acceptance criteria
- experience definition

### SRS focus
- technical behavior
- functional requirements
- non-functional requirements
- latency, security, availability, accessibility
- data and integration behavior

### SDD focus
- internal component design
- data contracts
- event flows
- module interaction
- deployment and observability approach

---

## 17. 72-Hour Delivery Direction

The earlier working direction for the 3-day build is:

### Day 1
- lock scope
- set architecture
- establish repo and specs
- create venue model
- create simulator base
- produce initial UI design

### Day 2
- build realtime crowd/queue behavior
- implement fan and ops live flows
- build assistant logic
- connect simulator to UI

### Day 3
- implement offline-first and emergency mode
- polish demo
- run tests
- script pitch/demo flow
- fix usability issues

This timeline is still considered the working baseline unless revised later.

---

## 18. Judging Alignment Considerations

The solution is expected to demonstrate:

- smart dynamic assistant behavior
- logical decision-making based on user context
- effective use of Google services
- practical real-world usability
- clean and maintainable code
- secure and responsible implementation
- efficient resource usage
- testing and validation
- accessibility and inclusion

MatchFlow should therefore be positioned not just as a fan app, but as a **context-aware smart stadium assistant with operational intelligence**.

---

## 19. Current Strategic Positioning Statement

Working positioning statement:

**MatchFlow is a cricket-aware smart stadium assistant that helps major venues manage fan surges during innings breaks and match exits through real-time crowd intelligence, queue-aware routing, in-seat ordering, and safety-first digital twin guidance.**

---

## 20. Important Working Constraints

The following constraints should continue to guide all future work:

- 72-hour MVP build timeline
- focus on believable and demoable scope
- prefer modular architecture
- prefer Google-native services where practical
- maintain clean code and testability
- optimize for challenge presentation and implementation speed
- do not overbuild beyond the needs of the MVP
- preserve accessibility and safety as first-class requirements

---

## 21. Immediate Next Recommended Project Artifacts

The following project artifacts should be created next:

1. MatchFlow BRD
2. MatchFlow PRD
3. MatchFlow SRS
4. MatchFlow SDD / architecture note
5. `skills.md`
6. `agents.md`
7. `.ai/templates/spec.md`
8. initial feature specs
9. Stitch master design prompt
10. DESIGN.md once designs are generated

---

## 22. Status of the Project So Far

At this point, the project has:

- a confirmed product name
- a defined problem space
- a recommended technical architecture
- a scoped MVP direction
- a Google tooling strategy
- a Spec-Driven Development approach
- an initial documentation and execution plan

The next stage is to convert this context into formal project artifacts and implementation-ready specs.
