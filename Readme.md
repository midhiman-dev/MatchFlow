# MatchFlow

MatchFlow is a smart stadium assistant for large cricket venues, designed to help manage innings-break surges, end-of-match exits, fan utility journeys, and safety-first crowd movement.

Live demo: [https://matchflow-972157503709.us-west1.run.app](https://matchflow-972157503709.us-west1.run.app)

---

## 🏟️ Problem Statement
Design a solution that improves the physical event experience for attendees at large-scale sporting venues. The system should address challenges such as crowd movement, waiting times, and real-time coordination, while ensuring a seamless and enjoyable experience.

## 🎯 Chosen Vertical
**Large-Scale Cricket Stadiums** (e.g., Narendra Modi Stadium, Eden Gardens).
Cricket venues are unique due to intense, predictable "surge moments":
- Innings breaks
- Decision Review (DRS) intervals
- Wickets and momentum swings
- End-of-match exit surges

## 🧠 Approach and Logic
MatchFlow uses a **Spec-Driven Development (SDD)** approach to build a modular, believable MVP in a high-velocity timeframe. 

The logic centers on a **Zone-Based Digital Twin**:
- **Granularity**: The stadium is modeled at the zone/stand level (rather than individual seats) to provide actionable crowd flow data.
- **Real-time State**: A shared live state layer tracks density, flow pressure, and amenity wait times.
- **Intelligent Rerouting**: Instead of just showing simple maps, MatchFlow provides "next-best-action" suggestions (e.g., "Use Washroom B instead of A to save 12 mins").
- **Simulation-First**: For the MVP, a cricket-aware event simulator generates believable traffic patterns to exercise the routing and alerting logic.

## ⚙️ How the Solution Works
1. **Event Ingestion**: The system consumes live stadium data (emulated via the Simulator) including gate entries, concourse sensors, and concession queue lengths.
2. **State Processing**: Data is synchronized via **Firebase Realtime Database** to provide sub-second updates to all clients.
3. **Fan Application**: Fans access a mobile-first PWA that provides:
   - **Match Center**: Context-aware match updates and seat info.
   - **Smart Amenities**: Live wait times and "best bet" recommendations.
   - **Dynamic Routing**: Congestion-aware paths and emergency-safe exits.
   - **In-Seat Ordering**: Frictionless ordering to reduce concourse congestion.
4. **Operator Dashboard**: Stadium staff see a "Heat Map" of the venue, allowing them to identify hotspots, trigger emergency reroutes, and manage amenity statuses.

## 📝 Assumptions Made
- **Connectivity**: Users have access to at least intermittent mobile data/stadium Wi-Fi (the app includes lightweight offline fallback).
- **Zone Authority**: Zone-level density tracking is sufficient for effective crowd management (seat-level live tracking is out of scope).
- **Layout Graph**: The stadium concourse and exit structure is modeled as a known directed graph of connected zones.
- **User Cooperation**: A significant portion of fans will follow assistant prompts if they clearly save time or improve safety.

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
```
