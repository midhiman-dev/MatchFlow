# Spec 05 - In-Seat Ordering

## Status
- Draft

## Owner
- Human owner: [name]
- Primary implementing agent: Architect / Frontend Agent

## Why

In-seat ordering is a critical "convenience" feature of MatchFlow that serves two purposes:
1. **Fan Experience**: Allows fans to avoid missing key match moments by ordering snacks from their seats.
2. **Operations**: Reduces concourse congestion during high-pressure surge moments (like wickets or DRS) by encouraging fans to stay seated rather than flooding the food courts.

Answer:
- **What user or operator problem does this solve?** Fans miss the action while standing in line; operators face dangerous bottlenecks when everyone leaves their seats at the same time.
- **Why is it important for the 72-hour MVP build?** It's a high-value "wow" feature for the demo and exercises the "MatchFlow" utility beyond simple routing.
- **What business/demo value does it unlock?** Demonstrates a modern, end-to-end fan service flow and integrates with the venue's "congestion-aware" guidance.
- **Why should it be built now instead of later?** It requires careful state coordination between the fan app and the order service, which is a core part of the MVP platform.

---

## What

A lightweight, end-to-end ordering flow within the Fan App.

### Include
- **Limited Menu**: A curated list of 5-8 snack items with images, prices, and categories.
- **Quick Cart**: Add/remove items, quantity control, and subtotal calculation.
- **Service Mode Selection**: Choice between 'In-Seat Delivery' (using stand/block/seat) or 'Express Pickup'.
- **Mocked Payment**: A credible "payment processing" step that simulates a gateway without real financial integration.
- **Order Tracking**: A live status tracker showing 'Pending', 'Preparing', 'Ready/En Route', and 'Delivered'.
- **Offline Outbox Hooks**: Logic to "queue" an order intent if the network is `Offline` or `Weak`, with a reconciliation step.

### Must not be
- A full-featured POS (Point of Sale) system.
- Integrated with actual payment gateways (Stripe/PayPal/etc).
- Managing inventory or complex kitchen workflows.

---

## Success Criteria
- Fan can browse the limited menu and see item details.
- Fan can manage a cart and see the total amount.
- Fan can "place" an order and see a credible processing animation.
- Order appears in the "Order Tracking" view with a real-time status updating from the service.
- If the fan goes offline during placement, the app shows a "Pending Sync" state and retries once back online.

---

## Scope

### In Scope
- `OrderSnacks.tsx` screen implementation.
- `CartProvider.tsx` or similar for client-side state.
- `menuService.ts`: Static menu data provider.
- `orderService.ts`: Mocked service for order placement and status updates.
- Refinement of `Order` type in `types.ts`.
- `OrderSyncService`: Logic for handling pending orders in the local outbox.

### Out of Scope
- Real payment processing.
- Multi-currency support.
- Complex discounts or promo codes.
- Operator "Kitchen/Fulfillment" dashboard (handled by simulating status changes).

### Explicit Non-Goals
- No seat-level validation (assume the user enters correct seat info).
- No integration with external delivery services.

---

## Constraints

### Product Constraints
- Limited selection: focus on 5-8 "believable" stadium snacks.
- Service mode must be consistent with the venue model (zones/stands).

### Technical Constraints
- Use `localStorage` or `IndexedDB` for mocking the offline outbox.
- Status updates should be simulated via the `Simulator Service` or a simple timer-based mock for the demo.
- App state must update reactively via `MatchFlowContext`.

### Delivery Constraints
- T1 focus on data and browse.
- T2 focus on cart and placement.
- T3 focus on tracking and offline resilience.

---

## Dependencies

### Upstream dependencies
- `01-venue-domain-model` (for Stand/Seat context).
- `02-fan-app-shell` (for navigation container).

### Downstream dependencies
- `08-demo-simulator` (for triggering "Order Ready" notifications).

---

## Current State

### Relevant files
- `apps/matchflow/src/types.ts`: Simple `Order` interface exists.
- `apps/matchflow/src/screens/fan/OrderSnacks.tsx`: Placeholder screen.

### Existing behavior
- The "Order" tab exists but does not have content.
- `AppState` includes an `orders` array.

---

## Proposed Approach

- **Catalog**: Define a static `MENU_ITEMS` constant.
- **Cart State**: Use a dedicated React Context or simple state within `OrderSnacks` if it stays single-page.
- **Mock Service**: Create a `placeOrder` function in `orderService.ts` that returns a promise (simulating network delay).
- **Offline Support**: When `placeOrder` fails due to `connectivity === 'Offline'`, push the order to a `pendingOrders` array in `AppState` (outbox). The `OrderSyncService` (useEffect or worker) watches for `Connected` state to "flush" the outbox.
- **Simulated Lifecycle**: Once an order is placed, a background process (or simulator script) moves it from `Preparing` -> `Ready` -> `Completed` every ~30-60 seconds for the demo.

---

## Data / Domain Model Impact

### New types / entities
- `MenuProduct`: `{ id, name, description, price, category, imageUrl }`
- `CartItem`: `MenuProduct & { quantity }`
- `OrderIntent`: `Order` data without an ID (yet).

### Updated contracts
- `Order` type expansion: Add `statusHistory` or `deliveryNotes`.

---

## UX / UI Notes
- **Aesthetic**: Premium "Food Delivery" feel, using glassmorphism for item cards.
- **Feedback**: Immediate haptic/visual feedback when adding to cart.
- **Status Tracker**: A vertical stepper or a high-impact "Status Bubble" (e.g., "Preparing your Samosas...").
- **Offline Banner**: Clear "Offline: Order will be sent when back online" notice during checkout.

---

## Realtime / Offline / Security Notes
- **Realtime**: Use Realtime DB for order status if possible, otherwise mock with a local timer.
- **Offline**: `localStorage` persistence for the cart and outbox.
- **Security**: Basic validation that quantities are positive and seat info is provided for 'In-Seat' mode.

---

## Tasks

### T1 - Define Menu and Order Domain Types
**Goal**  
Establish the data structures and static catalog for the ordering system.

**Files likely involved**  
- `apps/matchflow/src/types.ts`
- `apps/matchflow/src/services/menuService.ts` (New)
- `apps/matchflow/src/constants/menu.ts` (New)

**Implementation notes**  
- Define `MenuProduct` and refine `Order`.
- Create a static list of 5-8 products (e.g., Masala Chai, Samosas, Popcorn, Cold Drink).
- Add helper to get products by category.

**Verification**  
- Typecheck passes.
- Unit test to ensure `menuService` returns the correct list.

---

### T2 - Implement Menu Browse and Cart UI
**Goal**  
Build the user interface for browsing the menu and managing the shopping cart.

**Files likely involved**  
- `apps/matchflow/src/screens/fan/OrderSnacks.tsx`
- `apps/matchflow/src/components/OrderItemCard.tsx` (New)
- `apps/matchflow/src/components/OrderCartOverlay.tsx` (New)

**Implementation notes**  
- Grid/List view of menu items with "Add" buttons.
- Sticky or floating "View Cart" button showing total count/price.
- Cart overlay/modal for adjusting quantities and removing items.

**Must not**  
- Implement the final checkout/payment logic yet.

**Verification**  
- Manual check: items can be added and quantities updated.
- Verify subtotal calculation.

---

### T3 - Order Placement, Mock Payment, and Tracking
**Goal**  
Complete the flow with placement logic, a simulated payment step, and order status tracking.

**Files likely involved**  
- `apps/matchflow/src/services/orderService.ts` (New)
- `apps/matchflow/src/screens/fan/OrderTracking.tsx` (New)
- `apps/matchflow/src/services/OrderSyncService.ts` (New)

**Implementation notes**  
- `orderService.submitOrder` handles the "Mock Payment" delay.
- Implement the "Order Tracking" screen with a status visualizer.
- Wire up the `Offline` outbox logic: if submission fails due to network, store locally.
- Add a "Simulator Hook" to auto-advance order status for demo purposes.

**Verification**  
- Place an order while online -> Verify tracking starts.
- Place an order while offline -> Verify "Pending Sync" message.
- Reconnect -> Verify order is "submitted" automatically.

---

## Validation

### Required validation
- [ ] Typecheck/build passes
- [ ] Cart subtotals are accurate
- [ ] Order placement shows "Processing" state
- [ ] Status updates work (simulated)
- [ ] Offline outbox persists across refreshes (localStorage)

### Manual verification checklist
1. Add 3 items to cart -> Subtotal correct.
2. Place 'In-Seat' order -> Fill seat B12 -> Submit.
3. Observe status transition from 'Pending' to 'Preparing'.
4. Turn off network -> Attempt order -> Verify "Queued" state.

---

## Risks / Edge Cases
- **Stale Menu**: Prices or availability changing (Mocked for now, so low risk).
- **Seat Entry**: Users entering invalid locations (Mitigated by simple required fields).
- **Persistence**: Cart being lost on refresh (Mitigated by `localStorage` sync).

---

## Documentation Updates Required
- `docs/api/contracts.md`: Document `Order` and `MenuProduct` models.
- `docs/design/DESIGN.md`: Update with "Ordering" UI patterns.

---

## Change Log

### v1
- Initial draft based on 72-hour MVP requirements.
- Focused on limited menu, cart, tracking, and offline resilience.
