Build a working interactive prototype for MatchFlow in Google AI Studio.

IMPORTANT CONTEXT
MatchFlow is a challenge-scoped MVP for a cricket-aware smart stadium assistant and operations platform. It helps fans move smarter and helps operators manage surges safely through real-time crowd intelligence, queue-aware guidance, in-seat ordering, simulator-driven operations visibility, and safety-first routing.

This is NOT a full production rollout.
This IS a believable, demo-ready MVP with simulated inputs where needed.
Favor a strong end-to-end prototype over deep enterprise complexity.

PRIMARY GOAL
Turn the existing Stitch-generated UI into a genuinely working prototype with clickable navigation, shared live state, scenario simulation, route recomputation, order flow, alerts, offline/degraded behavior, and emergency override behavior.

Do not return another static mockup.
Build a functional prototype with working interactions and believable demo logic.

GENERAL BUILD APPROACH
- Build one coherent prototype app with modular internal structure.
- Use React + TypeScript.
- Keep the code readable, well-structured, and easy to split into later specs.
- Preserve demo credibility at all times.
- Keep it small, believable, and stable.
- Do not invent unrelated product areas.
- Use simulated/mock services for live state and backend-like behavior.
- Structure code so that real Firebase / Cloud Run / Pub/Sub / Gemini integrations can be added later without major rewrites.
- No secrets, no real cloud dependency, no production auth setup required in this pass.
- Use a local in-memory + local persistence demo architecture if needed.
- It is acceptable to implement this as a single app shell with mode switching between Fan / Operator / Steward for demo convenience.

NON-NEGOTIABLE PRODUCT RULES
- Stadium model must be zone-based, not seat-level live tracking.
- Routing must be based on zones, paths, gates, amenities, closures, and route weights.
- Realtime state must be centrally derived and shared across screens.
- Operator-only actions must be treated as protected flows in UX, even if auth is mocked.
- Emergency guidance must override convenience guidance.
- Offline/degraded mode must remain useful, not blank.
- MatchFlow should feel purpose-built for cricket stadium surge moments:
  - innings break rush
  - DRS spike
  - wicket surge
  - end-of-match exit rush
  - emergency closure

DESIGN / UI INSTRUCTION
Use the Stitch-exported UI as the visual source of truth and preserve its design language:
- high-contrast MatchFlow visual style
- premium but practical stadium-tech feel
- strong hierarchy
- Manrope/Inter style typography
- mobile-first fan experience
- desktop-first operator experience
- clear emergency red/orange treatment
- freshness pills
- queue badges
- congestion bands
- operator heat overlays
- large touch targets
- non-color-only state indicators

IMPORTANT CLEANUP
The current export contains a few placeholder/demo artifacts. Normalize them in the working prototype:
- replace irrelevant location placeholders with generic large cricket venue language
- keep stadium naming consistent and believable
- remove random geography-specific noise
- keep all sample content aligned to a large cricket venue demo

WHAT TO BUILD

1) APP STRUCTURE
Create a working prototype with these surfaces:
- Fan PWA
- Operator Dashboard
- Steward Guidance View

Provide a visible top-level way to access them for demo:
- either a mode switcher on load
- or a role launcher screen
- or separate route entry points

Recommended routes:
- /fan
- /fan/amenities
- /fan/route
- /fan/order
- /fan/alerts
- /fan/emergency
- /ops
- /ops/simulator
- /ops/emergency
- /steward

2) CORE DOMAIN MODEL
Implement a small but explicit shared domain model for the prototype.

Create demo data for:
- zones
- paths
- gates
- amenities
- closures
- alerts
- orders
- match state
- scenario state
- connectivity state

Suggested venue scope for demo:
- 8 to 12 zones
- 4 gates
- 8 to 12 amenities
  - concessions
  - washrooms
  - one first-aid point
- route graph connecting stands, concourses, gates, and amenities

Each zone should have believable fields like:
- id
- name
- type
- capacity
- congestionBand
- densityScore
- entryRate
- exitRate
- status
- updatedAt

Each amenity should have:
- id
- name
- type
- zoneId
- walkMinutes
- queueMinutes
- queueBand
- confidence
- isRecommended
- status
- updatedAt

Each path should have:
- id
- fromZoneId
- toZoneId
- baseWeight
- isClosed
- emergencyBlocked
- label

3) STATE ARCHITECTURE
Implement a central prototype state layer.

Recommended structure:
- app shell state
- fan context state
- operator context state
- match state
- zone state
- amenity state
- scenario state
- connectivity state
- alerts state
- order state
- route state

Use one shared state store so operator actions visibly affect fan and steward screens.

4) SIMULATION ENGINE
Create a working simulator engine, not just buttons.

Supported scenarios:
- innings break rush
- DRS spike
- wicket surge
- end-of-match exit rush
- emergency closure

Simulator behavior:
- changes zone density values
- changes amenity queue pressure
- changes recommended amenities
- changes suggested routes
- creates alerts
- updates fan match center prompts
- updates ops heat map / hotspot cards
- updates steward instruction screen when relevant

Include:
- start scenario
- stop scenario
- reset state
- scenario active indicator
- simple event tick loop
- visible state changes every few seconds while active

Keep the simulator believable and visually obvious.

5) ROUTING ENGINE
Build a simple but working route engine based on the zone/path graph.

Requirements:
- calculate a preferred route from current fan location to chosen destination
- support alternative route when one exists
- adjust route weights based on congestion and closures
- recompute routes when:
  - scenario changes
  - emergency closure happens
  - operator closes a path/zone
- support two route policies:
  - convenience route
  - emergency-safe route

Show on UI:
- destination
- ETA
- step-by-step guidance
- route status
- alternate route
- route freshness
- explanation like:
  - faster now
  - lower crowd
  - route changed due to closure

The route engine can be simple heuristic logic. It does not need advanced mapping.

6) FAN EXPERIENCE
Implement these working fan screens and interactions.

FAN SCREEN: Match Center
Must work as actual home screen.
Include:
- live match header
- seat / stand context
- quick actions
- nearby queue snapshot
- smart next action card
- freshness pill
- navigation to amenities / route / order / alerts
- scenario-reactive prompts
Examples:
- innings break soon → suggest pre-order
- wicket surge → advise wait 2 mins before moving
- exit rush → recommend exit route
- emergency active → show takeover banner and redirect option

FAN SCREEN: Nearby Amenities
Make this interactive:
- filter by food / washroom / first aid
- sort by best option
- mark recommended option
- show queue band and walk time
- clicking an amenity opens detail/recommendation state
- clicking route starts route guidance

FAN SCREEN: Amenity Recommendation Detail
Must show:
- why this is recommended
- queue band
- walk ETA
- confidence/freshness
- alternate option
- CTA to start route
- CTA to switch to order when concession queues are too high

FAN SCREEN: Route Guidance
Must be interactive:
- show current route
- step list
- ETA
- route status
- alternate route if available
- allow switching to alternate
- allow return to home
- react to scenario and closure changes

FAN SCREEN: Order Snacks
Must be interactive:
- menu categories
- add to cart
- quantity update
- order summary preview
- pickup or in-seat service mode
- simulated payment/confirmation
- queue-aware suggestion such as pickup is faster / in-seat available

FAN SCREEN: Cart / Checkout / Tracking
Implement a lightweight but working flow:
- cart state
- place order
- order reference generation
- order status states:
  - pending sync
  - confirmed
  - preparing
  - ready for pickup / on the way
  - completed
  - failed / retry
- visible recovery if connectivity is poor

FAN SCREEN: Alerts Center
Must aggregate:
- queue recommendation alerts
- match-aware move-now / wait-now prompts
- route change alerts
- exit guidance alerts
- emergency alerts
Clicking an alert should deep-link into the related screen.

FAN SCREEN: Exit Guidance
Must show:
- recommended exit gate
- route status
- crowd condition
- alternate gate if needed
- start route action

FAN SCREEN: Emergency Guidance
Must be unmistakable and override normal convenience UI.
Must show:
- emergency banner
- blocked zone/path
- safe route / safe gate
- step-by-step action
- acknowledge action
- support info if needed
- safety-first copy

7) OFFLINE / DEGRADED MODE
Implement a visible connectivity mode that can be toggled for demo.

Connectivity states:
- connected
- weak network
- offline

Behavior rules:
- connected: show live precise values
- weak network: degrade from exact minutes to queue bands where needed
- offline: keep last known useful state visible
- order placement while offline should go to a pending sync / outbox state
- route screen should still show last known route + stale indicator
- emergency screen must remain usable
- freshness labels must always be visible

Include a developer/demo toggle to force:
- connected
- weak
- offline

8) OPERATOR EXPERIENCE
Implement these working operator screens.

OPS SCREEN: Overview
Must include:
- KPI summary cards
- heat map or zone map view
- hotspot list
- amenity pressure summary
- live activity log
- scenario badge
- emergency state badge
- operator actions
The heat map can be stylized, but it must react to live zone state.

OPS SCREEN: Zone Detail
When clicking a zone:
- open detail panel or page
- show congestion band
- density direction
- impacted amenities
- affected paths
- recommendation context
- closure controls if relevant

OPS SCREEN: Amenity Pressure
Must show:
- live amenity cards/table
- queue conditions
- confidence
- updated time
- identify where redirection may help

OPS SCREEN: Guidance / Alert Actions
Create an operator action panel where the user can:
- issue fan reroute guidance
- publish informational alert
- preview alert text
- choose target zone or audience
- confirm action
Published alerts must show up in fan alerts.

OPS SCREEN: Closure / Emergency Controls
This must be a serious protected flow in UX.
Allow operator to:
- close path
- close zone
- activate emergency mode
- clear emergency mode
- preview impact
- confirm action in modal
These actions must immediately affect fan route and emergency guidance.

OPS SCREEN: Simulator
Must already exist visually, but make it truly functional:
- scenario cards
- active scenario state
- start/stop/reset
- impact log
- health indicators
- variable control like crowd multiplier
When a scenario runs, fan and steward views must change.

OPS SCREEN: Audit / Incident Log
Implement lightweight audit visibility:
- emergency toggles
- closure actions
- scenario start/stop
- manual alert sends
- timestamps

9) STEWARD VIEW
Build a simple working steward guidance screen.

Must show:
- current instruction
- affected area
- target gate/path
- current priority state
- acknowledge
- refresh
- timestamp
- emergency context if active

This should reflect operator-driven instructions during closures or emergency mode.

10) MATCH-AWARE BEHAVIOR
Add a minimal match context model:
- teams
- score
- overs/session
- match moment
- time to innings break or break active

This should influence copy and prompts, such as:
- order now before innings break rush
- crowd spike expected after wicket
- exit guidance active after match end

11) ASSISTANT / RECOMMENDATION LAYER
Implement a lightweight prototype recommendation system.
Do NOT depend on real Gemini calls in this pass.

Use rules-based or local logic to generate helpful guidance such as:
- best nearby concession
- best washroom now
- wait 2 minutes before moving
- switch to alternate route
- pre-order now
- use Gate D due to closure

Architect it so a future Gemini adapter could replace or enhance the explanation layer later.
Gemini-style behavior is assistive, not authoritative.

12) MOCK BACKEND / SERVICE LAYER
Even if fully local, structure the prototype with service modules resembling:
- venue service
- queue service
- routing service
- alerts service
- order service
- simulator service
- connectivity service
- recommendation service

Keep business logic out of UI components where practical.

13) PERSISTENCE
For demo continuity, persist key prototype state locally.
Use simple browser persistence for:
- selected role / last screen
- seat / stand context
- order cart
- last known route
- last known connectivity state
- last selected scenario if useful

Do not overbuild persistence. Keep it pragmatic.

14) DESIGN CONSISTENCY TO PRESERVE
Preserve the exported Stitch system and make it consistent across all implemented screens:
- Match Center cards
- freshness pill
- bottom nav
- queue bars and badges
- route HUD cards
- emergency shimmer / emergency banner feel
- operator left nav
- simulator cards
- steward instruction card

Do not redesign the product.
Make the existing design work.

15) DEMO SCENARIOS TO SUPPORT END TO END
Make these demo flows actually work:

FLOW A — Least-Crowded Concession
Fan home → nearby amenities → recommended concession → route guidance

FLOW B — Least-Crowded Washroom
Fan home → amenities → compare → recommended washroom → route

FLOW C — In-Seat Ordering Alternative
Fan home → pre-order prompt → menu → cart → confirmation → order tracking

FLOW D — End-of-Match Exit Guidance
Operator runs exit surge → fan gets exit alert → exit guidance screen → route to gate

FLOW E — Emergency Closure
Operator activates emergency closure → fan screen shows emergency override → route changes → steward sees diversion instruction

FLOW F — Offline Recovery
Switch network to weak/offline → fan still sees last-known guidance → place order creates pending sync → reconnect syncs order state

16) ACCESSIBILITY REQUIREMENTS
Respect these throughout:
- high contrast
- large tap targets
- readable text
- non-color-only status communication
- concise labels
- visible loading / offline / stale / error states
- emergency state must be unmistakable

17) OUT OF SCOPE
Do NOT add:
- ticketing
- loyalty
- CRM
- fantasy/social features
- enterprise back office modules
- real payments
- real hardware integrations
- seat-level live tracking
- CCTV/computer vision
- heavy analytics beyond current ops needs
- complex auth/permissions infra
- microservice sprawl

18) CODE QUALITY EXPECTATIONS
- readable code
- clear names
- focused components
- modular services
- minimal duplication
- no giant monolithic file if avoidable
- keep it stable and demo-ready
- keep mock data explicit and believable

19) DELIVERABLE EXPECTATIONS
Return a working prototype codebase or runnable app output that includes:
- all core screens wired together
- shared live state
- scenario simulation
- route recomputation
- alert propagation
- emergency override
- offline/degraded mode
- order flow
- steward instructions
- realistic sample data
- stable navigation
- no broken placeholder screens

20) DEFINITION OF DONE
This prototype is only done if:
- fan flow works end to end
- operator flow works end to end
- simulator visibly changes the app state
- emergency mode overrides fan convenience flows
- offline/degraded mode is believable
- at least one wow moment works reliably:
  - least-crowded recommendation
  - live reroute during innings break
  - smart ordering alternative
  - emergency reroute
  - graceful offline degradation

Now build the working MatchFlow prototype from the existing Stitch screens and preserve the approved MatchFlow scope and architecture.