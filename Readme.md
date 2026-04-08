# MatchFlow

MatchFlow is a smart stadium assistant for large cricket venues, designed to help manage innings-break surges, end-of-match exits, fan utility journeys, and safety-first crowd movement.

The project is being built as a high-velocity, challenge-scoped 72-hour MVP focused on practical, real-world usability for cricket venues such as Narendra Modi Stadium, Eden Gardens, and similar high-capacity stadium environments.

Live demo: https://matchflow-972157503709.us-west1.run.app

---

## Vision

MatchFlow aims to improve both the **fan experience** and **stadium operations** by combining:

- real-time crowd flow awareness
- queue alerts for washrooms and concessions
- smart fan rerouting during peak surges
- in-seat snack ordering
- emergency routing support
- live match-aware engagement

At a high level, MatchFlow is intended to function as:

- a **fan-facing mobile/PWA experience**
- an **operator dashboard**
- a **simulation/event layer**
- an **assistant/recommendation layer**
- a simplified **digital twin routing model**

---

## Problem We Are Solving

Cricket stadiums experience strong but predictable surge moments, especially during:

- innings breaks
- Decision Review (DRS) moments
- wickets and momentum swings
- end-of-match exits

These moments often create:

- long queues at concessions and washrooms
- concourse bottlenecks
- poor crowd distribution
- missed concession revenue
- safety concerns
- frustrating fan experiences

MatchFlow is being designed to reduce these problems through smarter routing, better live visibility, and context-aware digital assistance.

---

## MVP Scope

### In scope
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
- Synthetic event simulation for demos

### Out of scope for the MVP
- Full CCTV/computer vision implementation
- Full CAD/BIM digital twin integration
- Production-grade indoor positioning
- Full payment gateway integration
- Real hardware dependency
- Seat-level live location tracking
- Complex enterprise back-office workflows

---

## Architecture Direction

### Frontend
- React
- TypeScript
- PWA-first approach
- Mobile-first fan experience
- Dashboard UI for operators

### Backend / Platform
- Firebase Realtime Database for live state
- Cloud Firestore for durable structured data
- Cloud Run for service/API logic
- Pub/Sub for event ingestion and simulation
- Firebase Cloud Messaging for alerts
- Firebase Auth for access control
- Firebase App Check for client protection

### AI / Google Services
- Google Antigravity for development workflow
- Google Stitch for UI design
- Google AI Studio for functional prototyping/demo behavior
- Gemini for assistant behavior and reasoning

---

## Core Product Modules

The initial MatchFlow module plan includes:

1. Venue Domain Model
2. Fan App Shell
3. Live Heat Map
4. Queue Alerts
5. In-Seat Ordering
6. Emergency Rerouting
7. Offline Sync
8. Demo Simulator

---

## Working Method

MatchFlow is being built using **Spec-Driven Development (SDD)**.

That means:

- every feature starts with a written spec
- specs define scope, constraints, tasks, and validation
- implementation happens in small, reviewable units
- tasks should be verified before moving forward
- commits should stay small and meaningful

### Core execution rule

**one spec → one task → one verification → one review → one commit**

### Build philosophy
- keep the MVP believable
- prefer modular code
- protect demo quality
- avoid unnecessary complexity
- keep the repository runnable and reviewable

---

## Repo Structure

```text
.ai/                 # Specs, templates, and agent task files
apps/                # Fan PWA and ops dashboard
services/            # Realtime, routing, queue, assistant, simulator services
packages/            # Shared types, utilities, UI components
docs/                # Product, architecture, design, API, and testing docs
tests/               # Unit, integration, e2e, and fixtures
scripts/             # Setup and seed scripts
