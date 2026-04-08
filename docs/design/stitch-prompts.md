Design the complete UI for a product called MatchFlow in a single pass.

MatchFlow is a challenge-scoped MVP for a cricket-aware smart stadium assistant and operations platform. It helps fans move smarter and helps stadium operators manage surges safely through real-time crowd intelligence, queue-aware guidance, in-seat ordering, and safety-first routing.

IMPORTANT:
- Generate all screens in one coherent pass with one unified design system.
- Prioritize consistency across screens over novelty.
- Do not invent unrelated product areas.
- Do not add features like ticket booking, loyalty, CRM, ads, social feed, fantasy sports, merchandise marketplace, or complex admin back-office tools.
- Keep the design grounded, believable, and demo-ready.
- This is an MVP, not a full production enterprise rollout.
- Use modern Google-quality product design with strong usability and clean hierarchy.

PRIMARY PRODUCT SURFACES
1. Fan PWA
2. Operator Dashboard
3. Steward / Shared Guidance View

CORE PRODUCT IDEA
The product is built for large cricket venues and must feel purpose-built for cricket surge moments:
- innings break rush
- DRS spike
- wicket-related movement spike
- end-of-match exit rush
- emergency closure / reroute

The design must communicate:
- best next action for fans
- crowd hotspot awareness for operators
- emergency states overriding convenience states
- useful behavior under weak connectivity
- zone-based routing and queue guidance rather than precise seat-level live tracking

STADIUM DOMAIN MODEL TO REFLECT IN UI
Use a simplified digital twin / venue graph mental model:
- zones
- paths
- gates
- concessions
- washrooms
- closures
- route graph
- live queue / density / alert state

DESIGN GOALS
Create a polished, high-contrast, modern, mobile-first and operations-ready interface that works in bright, crowded, noisy stadium conditions.

Global UX priorities:
- fast comprehension
- low-friction actions
- strong visual hierarchy
- concise text
- clear state transitions
- realistic stadium usage context
- believable operational control
- accessibility first

ACCESSIBILITY RULES
Must be clearly designed for:
- bright outdoor conditions
- glare
- crowd pressure
- one-handed fan usage
- distracted users
- weak connectivity

Therefore:
- high contrast
- large tap targets
- non-color-only status indicators
- icons plus text labels where useful
- clear offline/loading/error/emergency states
- readable typography
- simple route and queue interpretation
- obvious primary actions

VISUAL LANGUAGE
Create one cohesive design system across all surfaces.

Style direction:
- premium but practical
- confident and clean
- sporty but not gimmicky
- modern real-time operations aesthetic
- strong spatial and status cues
- minimal clutter
- useful, not decorative

Recommended visual personality:
- contemporary stadium-tech product
- clean cards, modular panels, clear chips, meaningful icons
- rounded but not overly playful
- subtle depth, restrained shadows
- status-driven UI with strong contrast

Color approach:
- use a high-contrast base
- use clear status colors for low / moderate / high / emergency
- ensure all status meaning is also shown with text/icon/badge, not color alone
- emergency state must be unmistakable

TYPOGRAPHY:
- clean sans-serif
- large headings where decisions matter
- readable body text
- compact but legible ops tables and panels
- fan UI should feel immediate and scannable in seconds

COMPONENT SYSTEM TO CREATE
Design a reusable system with consistent components across screens:
- app bars / headers
- bottom nav for fan app
- side nav or top + side nav for operator dashboard
- cards
- list rows
- queue status chips
- congestion badges
- freshness pill (“updated 20 sec ago”)
- confidence indicator
- connection / offline badge
- CTA buttons
- emergency banner
- alert cards
- route summary card
- alternate option card
- step-by-step route panel
- amenity cards
- cart summary card
- order status tracker
- heat map legend
- hotspot panel
- scenario selector chips/buttons
- confirmation modal
- closure toggle card
- audit / activity row
- empty state block
- loading skeleton
- pending sync / outbox indicator

INFORMATION ARCHITECTURE

FAN PWA NAVIGATION
Create a compact fan companion app with this navigation:
- Match Center
- Amenities
- Route
- Order
- Alerts

Exit Guidance and Emergency Guidance may be contextual destinations rather than permanent primary tabs.

OPERATOR DASHBOARD NAVIGATION
Create an operator information architecture like:
- Overview
- Zones
- Amenities
- Alerts / Actions
- Simulator
- Emergency Controls

STEWARD VIEW
Simplified instruction-first mobile or compact responsive view for on-ground staff.

FAN EXPERIENCE REQUIREMENTS
The fan experience should feel like a utility-first live stadium companion.

Must communicate:
- live match context
- stand / seat context
- least-crowded nearby amenities
- fast route options
- in-seat ordering alternative
- alerts at cricket moments
- safe exit guidance
- emergency rerouting
- stale or offline status clearly

FAN SCREEN SET TO DESIGN

F-01 Match Center / Home
Purpose:
Primary landing screen for fan decisions during live match attendance.

Must show:
- live match context
- seat / stand context
- quick actions for amenities, route, order, alerts
- smart prompt / recommended next action
- top nearby queue snapshot
- freshness indicator

States to include:
- normal live match state
- innings break surge prompt
- wicket / DRS contextual prompt
- exit rush prompt
- stale live data
- offline degraded state
- emergency takeover banner

F-02 Nearby Amenities
Purpose:
Compare nearby washrooms and concessions quickly.

Must show:
- grouped amenity list by type
- wait band or wait state
- updated time
- walk time or distance hint
- best nearby recommendation
- alternate options

States:
- low / moderate / high queue
- recommendation available
- no clearly better option
- stale data degraded to coarse band
- offline last-known state

F-03 Amenity Detail / Recommendation Detail
Purpose:
Explain why a specific amenity is recommended.

Must show:
- amenity name and type
- current queue condition
- ETA from current context
- reason for recommendation
- alternate nearby option
- freshness and confidence

F-04 Route Guidance
Purpose:
Guide fan to an amenity or exit using simplified venue graph.

Must show:
- destination
- route status
- ETA
- crowd pressure on current route
- alternate route availability
- closure awareness
- freshness
- clear walking CTA

States:
- preferred route
- alternate route available
- no alternate route
- congestion rising
- stale route
- route closed and recomputed
- emergency override

F-05 Order Snacks / Menu
Purpose:
Offer queue-reduction alternative to joining a concession line.

Must show:
- limited MVP menu
- categories
- item availability
- service mode hint
- queue-aware nudge

States:
- normal service
- pickup recommended
- in-seat delivery simulated
- item unavailable

F-06 Cart and Service Mode
Purpose:
Complete lightweight order flow.

Must show:
- selected items
- service mode
- order summary
- place order CTA
- pending sync or network warning where needed

States:
- normal online
- offline queued action
- retry needed
- simulated payment note

F-07 Order Tracking
Purpose:
Track the order after placement.

Must show:
- order reference
- service mode
- order state
- next expected action
- reconnect / retry note if sync delayed

States:
- pending sync
- confirmed
- preparing
- ready for pickup / on the way
- completed
- failed / needs retry

F-08 Alerts Center
Purpose:
Collect all match-aware and operational alerts.

Must show:
- alert list
- priority labels
- time received
- CTA where relevant

Alert types:
- queue recommendation
- innings break move now / move later prompt
- DRS / wicket context prompt
- end-of-match exit guidance
- closure alert
- emergency alert

F-09 Exit Guidance
Purpose:
Guide fan dispersal after match or during exit pressure.

Must show:
- recommended exit
- route status
- crowd condition
- alternate gate if useful
- safe movement wording
- emergency escalation if applicable

F-10 Emergency Guidance
Purpose:
Highest-priority fan screen during safety rerouting.

Must show:
- emergency banner
- blocked zone/path message
- safe route or safe exit
- step-by-step instruction
- acknowledge action
- optional reopen instructions

Must visually override normal convenience flows.

F-11 Offline / Degraded State Overlay / Pattern
Purpose:
Communicate degraded connectivity without making app unusable.

Must show:
- offline or weak network indicator
- last updated timestamp
- downgrade from exact values to queue bands
- queued action message
- retry behavior cue

Apply this pattern across:
- Match Center
- Amenities
- Route Guidance
- Order Flow
- Exit Guidance
- Emergency Guidance

OPERATOR EXPERIENCE REQUIREMENTS
The operator dashboard should feel like a command-and-control interface for crowd flow monitoring and intervention.

Must communicate:
- zone congestion visibility
- hotspot prioritization
- amenity pressure
- alerting and intervention
- simulator-driven state changes
- emergency control seriousness
- confidence / freshness / timestamps
- protected actions

OPERATOR SCREEN SET TO DESIGN

O-01 Operator Login / Protected Entry
Must show:
- secure sign-in
- role / environment context if useful
- clean, trustworthy access screen

O-02 Ops Overview / Heat Map Dashboard
Purpose:
Primary command center screen.

Must show:
- zone heat map
- top hotspots
- amenity pressure summary
- alert summary
- simulator state
- emergency state banner when active
- quick actions

States:
- normal play
- innings break surge
- DRS spike
- wicket surge
- end-match exit rush
- emergency active

O-03 Zone Detail
Must show:
- zone name and type
- congestion band
- trend or movement direction
- nearby amenities
- affected paths
- linked alert / recommendation context
- closure state

O-04 Amenity Pressure Detail
Must show:
- amenity list or map-linked detail
- wait condition
- confidence
- updated time
- nearby alternatives
- whether redirection may help

O-05 Guidance / Alert Action Panel
Must show:
- target audience or target zone
- message type
- prebuilt templates
- priority level
- preview before publish

O-06 Closure and Emergency Control
Must show:
- emergency mode status
- zone/path closure controls
- affected route preview
- confirmation step
- audit note field if useful

Important:
Dangerous actions must not feel casual. They must look high-trust, deliberate, confirmed.

O-07 Simulator Control
Must show:
- scenario choices:
  - innings break rush
  - DRS spike
  - wicket surge
  - end-match exit rush
  - emergency closure
- scenario status
- start / stop / reset controls
- visible impact confirmation

O-08 Incident / Audit View
Must show:
- emergency toggles
- zone / path closures
- operator-issued alerts
- manual overrides
- timestamps

STEWARD SCREEN SET TO DESIGN

S-01 Steward Guidance View
Purpose:
A simplified on-ground staff view.

Must show:
- affected zone/path
- current instruction
- redirected route or gate
- emergency note if active
- timestamp
- quick refresh
- acknowledge action

CROSS-SCREEN STATE REQUIREMENTS
Design these states consistently across the whole system:

1. Loading
- skeletons or placeholders
- never blank or confusing

2. Empty / No Alert
- useful fallback copy
- next likely action

3. Stale Live Data
- “updated X sec/min ago”
- degrade exact value to broad band
- visibly not fresh

4. Offline
- keep last known useful state visible
- show queued actions clearly
- prioritize safety

5. No Better Alternative
- show best available option clearly
- do not fail silently

6. Emergency Override
- visually unmistakable
- overrides convenience prompts

7. Operator Auth Required
- protected controls must look protected

8. Scenario Active
- simulator state visible in ops
- affected fan screens should visibly react

CORE FAN FLOWS TO VISUALIZE
Show these as coherent linked screens, not isolated mockups:

1. Find Least-Crowded Concession
Match Center → Amenities → Recommendation Detail → Route Guidance

2. Find Least-Crowded Washroom
Match Center → Amenities → Filter / Compare → Route Guidance

3. In-Seat Ordering Alternative
Match Center → Order Snacks → Cart → Service Mode → Order Tracking

4. End-of-Match Exit Guidance
Alert → Exit Guidance → Route Guidance

5. Emergency Reroute
Emergency takeover → Emergency Guidance → Safe Route

6. Offline Recovery
Offline indicator → last-known state → queued action → reconnect state

CORE OPERATOR FLOWS TO VISUALIZE
1. Monitor surge conditions
Login → Overview → Zone Detail → Amenity Pressure → Guidance Action

2. Trigger emergency closure
Overview → Emergency Controls → Confirm closure → fan/steward guidance impact

3. Run demo scenario
Overview → Simulator → scenario active → dashboard and fan-facing impact

SCENARIO-DRIVEN DESIGN COVERAGE
The UI must visibly support these scenarios:
- innings break rush
- DRS spike
- wicket surge
- end-match exit rush
- emergency closure
- weak connectivity

Show how the interface changes across scenarios, especially:
- queue bands
- route changes
- alerts
- emergency banners
- operator dashboard emphasis
- simulator active state

DATA / CONTENT REALISM
Use realistic sample content and labels appropriate for a large cricket stadium:
- stands, gates, concourses, snack bays, washrooms
- examples like “North Stand”, “Gate C”, “Snack Bay 1”, “Washroom South”
- live match context
- realistic queue and route language
- realistic operational copy
- concise fan-friendly messaging
- concise operator-focused control language

Avoid fake enterprise jargon and avoid filler screens.

COPY STYLE
Fan copy:
- short
- reassuring
- direct
- action-oriented
- easy to read while walking

Operator copy:
- crisp
- operational
- confidence-building
- fast to scan

Emergency copy:
- calm
- authoritative
- unambiguous
- safety-first

WHAT NOT TO DESIGN
Do not add:
- full ticketing journeys
- account settings rabbit holes
- loyalty or rewards ecosystem
- CRM modules
- generic sports content hub
- social chat
- overbuilt analytics suites beyond what supports current operator screens
- enterprise admin workflows unrelated to crowd flow
- production-complex payment checkout
- unnecessary map complexity that makes routing unreadable

RESPONSIVE EXPECTATIONS
- Fan PWA: mobile-first, optimized for small screens
- Operator dashboard: desktop-first, should also look believable on laptop/tablet
- Steward view: simple compact responsive view

OUTPUT EXPECTATIONS
Generate:
1. One unified design system
2. Complete fan screen set
3. Complete operator screen set
4. Steward screen
5. State variants for loading / offline / stale / emergency
6. Scenario-driven variants where relevant
7. Clear navigation and relationship between screens
8. Consistent reusable components
9. A design that can later be translated into DESIGN.md and implementation specs

MOST IMPORTANT DESIGN PRIORITIES
1. consistency across all screens
2. fast decision-making for users
3. believable real-time stadium utility
4. strong emergency-state handling
5. graceful degraded / offline behavior
6. clear operator hotspot visibility
7. one strong fan “wow” flow
8. one strong operator “wow” flow
9. one strong simulator-driven demo flow

If trade-offs are needed, choose:
- clarity over visual spectacle
- believable utility over decorative features
- clean consistency over too many ideas
- MVP realism over feature sprawl

Produce the full MatchFlow UI screen set in one pass.