# Design System Documentation

## 1. Overview & Creative North Star
**The Creative North Star: "The Tactical Spectator"**

This design system moves away from the "cluttered dashboard" trope of sports management. Instead, it adopts the persona of a **Tactical Spectator**: an experience that is as authoritative and serious as a match referee, but as high-velocity as a T20 innings. 

We break the "template" look through **Intentional Asymmetry**. Navigation and utility elements are grounded in rigid, authoritative blocks, while live data and "action" cards use overlapping layers and "frosted glass" depth to feel like a heads-up display (HUD). This system is designed for high-glare stadium environments, prioritizing high-contrast legibility without sacrificing the premium, editorial feel of a high-end sports publication.

---

## 2. Colors & Surface Architecture

### The Palette
We utilize a sophisticated Material-based palette to ensure tonal consistency across all states.

*   **Primary (Deep Cricket Blue):** `#0b193c` (Primary) / `#222e52` (Container). This is the "Anchor." It represents the pitch, the rules, and the authority of the platform.
*   **Secondary (Safety Orange):** `#b02f00` (Secondary) / `#ff5722` (Container). Used for "Live" moments—wickets, crowd alerts, and high-priority operations.
*   **Tertiary (Vibrant Teal):** `#001f1f` / `#42a6a5` (On-Tertiary Container). Reserved for "Utility" and "Flow"—logistics, staff movement, and cooling systems.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through background shifts.
*   Use `surface-container-low` (`#f2f4f7`) for the global canvas.
*   Use `surface-container-lowest` (`#ffffff`) for primary cards.
*   The contrast between these two hex codes provides enough visual separation for the eye without creating "grid fatigue" in bright sunlight.

### Signature Textures & Glassmorphism
To create "visual soul," hero elements (like a Match Summary card) should utilize a linear gradient from `primary` (`#0b193c`) to `primary_container` (`#222e52`). 
*   **The Glass Rule:** For floating action buttons or over-content overlays, use `surface` colors at 80% opacity with a `20px` backdrop-blur. This ensures the stadium’s vibrant data "bleeds" through the UI, making the app feel alive.

---

## 3. Typography: The Editorial Scale

We pair **Manrope** (Display/Headlines) with **Inter** (UI/Body). Manrope provides a slightly wider, more modern "sporty" geometric feel, while Inter ensures maximum readability for rapid operations.

| Token | Font | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **display-lg** | Manrope | 3.5rem | 700 | Score/Crowd Counts |
| **headline-md** | Manrope | 1.75rem | 600 | Section Headers |
| **title-lg** | Inter | 1.375rem | 600 | Card Titles |
| **body-md** | Inter | 0.875rem | 400 | General Data/Logs |
| **label-md** | Inter | 0.75rem | 700 | All-Caps Status Badges |

**Hierarchy Note:** High-contrast color usage is our primary tool. Use `on_surface` (`#191c1e`) for body text, but reserve `primary` (`#0b193c`) for secondary headers to maintain the brand’s authoritative voice.

---

## 4. Elevation & Depth: Tonal Layering

We convey hierarchy through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Stack `surface_container_lowest` (`#ffffff`) cards on a `surface_container_low` (`#f2f4f7`) background. This creates a soft, natural lift visible even in direct sunlight.
*   **Ambient Shadows:** For critical floating elements (e.g., an Emergency Alert), use a shadow with a `32px` blur and `6%` opacity. The shadow color must be a tinted version of `primary` (`#0b193c`), never pure black, to maintain a natural, ambient light feel.
*   **Ghost Borders:** If a border is required for high-glare accessibility, use `outline_variant` (`#c6c5d4`) at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components & Modular Intelligence

### Buttons (Tactile Operations)
*   **Primary:** Background: `primary` (`#0b193c`), Text: `on_primary` (`#ffffff`). 
*   **Secondary/Action:** Background: `secondary_container` (`#ff5722`), Text: `on_secondary_container` (`#541100`).
*   **Shape:** 12px (`xl`) rounded corners to invite touch interaction.

### Modular Data Cards
*   **Rule:** Forbid divider lines within cards.
*   **Implementation:** Separate the "Innings Progress" from "Security Alerts" using `1.5rem` (`xl`) vertical spacing or a subtle shift to `surface_variant`.
*   **Status Badges:** Use "Solid-State" badges. A "Critical" badge uses `error` (`#ba1a1a`) background with `on_error` (`#ffffff`) text. No outlines.

### Smart Assistant Input
*   **Interaction:** Text inputs must use `surface_container_highest` (`#e0e3e6`) background with a `0px` border. Upon focus, transition the background to `surface_lowest` and apply a `2px` "Ghost Border" of `primary`.

### Stadium-Specific Components
*   **Zone Heatmaps:** Use `tertiary_fixed` (`#93f2f2`) for low-occupancy zones and `secondary` (`#b02f00`) for high-congestion zones.
*   **Live Incident Chips:** Small, floating chips that use Glassmorphism (`surface` at 70% + blur) to indicate real-time issues without blocking the map view.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use white space as a structural element. If an element feels cramped, increase the padding; do not add a border.
*   **DO** use `display-lg` typography for vital metrics (e.g., "124 BPM" or "45,000 Fans"). Let the numbers tell the story.
*   **DO** test all layouts in "Outdoor High Contrast" mode—ensure `on_surface` text maintains a 7:1 contrast ratio against `surface` backgrounds.

### Don’t
*   **DON'T** use pure black (`#000000`). Our "Deep Cricket Blue" provides more depth and feels more premium.
*   **DON'T** use 8-bit style "Alert" colors. Stick to the refined Material tokens (e.g., `error_container` instead of "Neon Red") to keep the platform professional.
*   **DON'T** use standard "Drop Shadows" (0, 2, 4, 0). They look cheap. Use wide, diffused ambient glows that mimic the stadium’s floodlights.