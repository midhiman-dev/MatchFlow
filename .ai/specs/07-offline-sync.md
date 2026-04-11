# 07-offline-sync - Offline & Sync Behavior

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Architect

## Why

Cricket stadiums are notoriously difficult environments for mobile connectivity. During peak surge moments (innings breaks, DRS, end-match), network congestion often causes real-time updates to fail or lag significantly.

MatchFlow must remain useful even when "the bars are low." If a fan cannot see the latest live data, they should see the most recent reliable state, clearly labeled as such, so they can still make movement decisions instead of facing a blank screen or a loading spinner.

### Value
- **Fan Confidence**: Users don't feel "blind" when the network drops.
- **Safety**: Emergency instructions must be cached and available even if the connection is lost immediately after the alert is sent.
- **Operational Trust**: Stale data is better than no data, provided it is labeled honestly.
- **Revenue**: In-seat orders can be captured and synced as soon as a brief window of connectivity opens.

---

## What

This spec defines the robust offline-first behavior for the MatchFlow Fan PWA.

It implements a "Resilient Degraded Mode" that:
1. **Caches essential state**: Home context, nearby amenities, and active routes.
2. **Handles staleness**: Automatically degrades precise metrics (e.g., "12 mins wait") to broader bands (e.g., "Moderate") as data ages.
3. **Manages an Outbox**: Captures user intents (like orders) while offline and flushes them upon reconnection.
4. **Prioritizes Safety**: Ensures emergency banners and reroute guidance are the most aggressively cached and visible assets.

---

## Success Criteria

- Fan can open the app with zero connectivity and see their seat/stand context (if previously loaded).
- Amenity wait times show "Checked X mins ago" when connectivity is lost.
- Precise wait times (e.g., "8 mins") transition to queue bands (e.g., "Low") after 5 minutes of staleness.
- A "Place Order" action while offline is stored in a pending state and automatically sent when the network returns.
- Emergency alerts received just before a drop remain visible and accessible in the "Alerts" tab.
- Reconnect "Flash" effect: UI briefly indicates sync success when returning online.

---

## Scope

### In Scope
- Persistent local caching of shared state (Match Center, Amenities, Routes, Alerts).
- Staleness logic (Minutes -> Bands).
- Pending action outbox for order placement.
- Reconnection detection and auto-flush logic.
- UI state indicators for "Offline" and "Stale/Cached".

### Out of Scope
- Full Service Worker implementation (handled by app shell/Vite PWA defaults usually, this spec focuses on data sync).
- Conflict resolution (MVP assumes last-write-wins or simple append for orders).
- Large media/video caching.
- Operator dashboard offline mode (Operators are assumed to have stable stadium-grade backhaul).

### Explicit Non-Goals
- No "Syncing" spinner that blocks the UI; the app must remain interactive.
- No complex background synchronization API (keep it simple for the 72-hour MVP).

---

## Constraints

### Product Constraints
- Safety instructions must NEVER be hidden due to "staleness."
- Deceiving the user with old data without a label is unacceptable.

### Technical Constraints
- Use `localStorage` or `IndexedDB` (via a library like `localforage` or simple wrapper) for persistence.
- Minimize payload size for sync flush.
- Follow the existing `live-state` patterns in the repository.

---

## Dependencies

### Upstream dependencies
- [02-fan-app-shell.md](file:///c:/Dhiman/P/portfolio/MatchFlow/.ai/specs/02-fan-app-shell.md) (Base UI)
- [04-queue-alerts.md](file:///c:/Dhiman/P/portfolio/MatchFlow/.ai/specs/04-queue-alerts.md) (Queue data structure)
- [05-in-seat-ordering.md](file:///c:/Dhiman/P/portfolio/MatchFlow/.ai/specs/05-in-seat-ordering.md) (Order action source)

---

## Current State

### Relevant files
- `src/services/state`: Current logic for subscribing to Firebase.
- `src/hooks/useQueueState.ts`: (Assumed) Hook for amenity data.
- `src/components/common/StatusIndicator.tsx`: Existing UI for connectivity.

### Existing behavior
- The app currently relies on active Firebase subscriptions. If the connection drops, state might become "frozen" or clear depending on implementation.
- No unified way to label data as "stale."

---

## Proposed Approach

### Caching Strategy
- Use a **Stale-While-Revalidate (SWR)** pattern for all Realtime DB data.
- Whenever a subscription updates, write the value to a local persistent store (e.g., `matchflow_cache`).
- On app load, hydrate the UI from `matchflow_cache` first, then start subscriptions.

### Staleness Tiers
- **Tier 1 (0-3 mins)**: Show exact data (e.g., "12 mins").
- **Tier 2 (3-10 mins)**: Degrade to Band (e.g., "Moderate") + "X mins ago".
- **Tier 3 (10+ mins)**: Show "Stale" warning + Band only.
- **Safety**: Emergency state has no staleness tier; it always shows until retracted by the server.

---

## Data / Domain Model Impact

### New types / entities
- `OfflineAction`: `{ id, type: 'PLACE_ORDER', payload, timestamp }`
- `CachedState`: `{ key, value, lastUpdated }`

### Updated contracts
- UI components must now accept `isStale: boolean` and `lastUpdated: number` props.

---

## UX / UI Notes

### Degraded UI
- A subtle "Working Offline" banner or icon in the header.
- Amenities cards should change text color or add a "clock" icon when stale.
- Emergency messages gain a "Cached" badge if the connection is dead.

---

## Tasks

### T1 - Core Persistence & SWR Hook

**Goal**  
Implement the underlying persistence layer and a wrapper hook for state that pulls from cache before online data arrives.

**Files likely involved**  
- `src/services/storage.ts` (New)
- `src/hooks/usePersistentState.ts` (New)
- `src/services/realtime.ts` (Update)

**Implementation notes**  
- Create a standard `storage` utility.
- Update realtime service to "pipe" all incoming messages to local storage.
- Ensure the app component hydrates from storage on mount.

**Verification**  
- Load app, disconnect network, refresh. Match center should still show previous team/match info.

---

### T2 - Staleness Logic (Minutes to Bands)

**Goal**  
Implement the logic that transforms a timestamped wait-time into a coarse band based on age.

**Files likely involved**  
- `src/utils/staleness.ts` (New)
- `src/components/amenities/QueueCard.tsx` (Update)

**Implementation notes**  
- `function getDisplayState(waitMinutes, lastUpdated, currentTime)`
- Logic:
  - Age < 300s (5m): `format(waitMinutes)`
  - Age > 300s: `getBand(waitMinutes)` + "Stale" flag.
- Apply this to all amenity listings.

**Verification**  
- Simulate a 6-minute gap in data updates. The UI should switch from "12 mins" to "Moderate (6 mins ago)".

---

### T3 - Action Outbox & Reconnect Flush

**Goal**  
Capture orders and other intents while offline and replay them once online.

**Files likely involved**  
- `src/services/outbox.ts` (New)
- `src/hooks/useSync.ts` (New)
- `src/components/orders/OrderButton.tsx` (Update)

**Implementation notes**  
- `pushToOutbox(action)`
- `window.addEventListener('online', flushOutbox)`
- UI should show "Order will be sent when connection returns" in a toast or status line.

**Verification**  
- Disconnect network. Place an order. Reconnect. Verify the order appears in the Firebase backend.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] Manual verification: Refresh while offline shows cached match center.
- [ ] Manual verification: Outbox flushes automatically on 'online' event.
- [ ] Manual verification: Queue bands replace exact minutes after time threshold.

### Manual verification checklist
1. Load app with internet.
2. Go to "Amenities". See exact times.
3. Turn off Wi-Fi. Wait 6 minutes.
4. Verify exact times are replaced by bands + staleness label.
5. Place an order. Verify it says "Pending".
6. Turn on Wi-Fi. Verify order syncs and "Pending" becomes "Confirmed".

---

## Risks / Edge Cases

- **Storage Limit**: Modern browsers give plenty of space for small JSON blobs, but we should prune old caches.
- **Conflicting Orders**: If a user places 5 orders while offline, the backend needs to handle them (MVP allows this as it's a simple snack buy).
- **Clock Drift**: Using `Date.now()` vs server timestamps. Prefer server-anchored staleness if available, but local `Date.now()` is acceptable for the MVP.

---

## Rollback / Safe Failure Notes

- If local storage is corrupted or full, clear it and fall back to standard "blank while loading" behavior.
- If outbox flush fails, keep the items and retry on next `online` event (do not discard intent).

---

## Documentation Updates Required

- `docs/architecture/decisions.md`: Document the staleness thresholds (3m/10m).
- `docs/api/contracts.md`: Document `OfflineAction` format.

---

## Suggested Commit Strategy

- `feat(sync): add persistence layer for live state`
- `feat(sync): implement staleness logic for queue bands`
- `feat(sync): add outbox for offline order capture`
- `feat(sync): add connectivity status UI and reconnect flush`

---

## Change Log

### v1
- Initial draft based on PRD and Architecture inputs.
