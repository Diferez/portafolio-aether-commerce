# Design system — Diego Fernando Martínez

## Direction

This portfolio presents Diego as a systems engineer who connects the visible product to rules, data, integrations, and operations. Its visual register is editorial and technical, never dashboard-like. The memorable device is the **architecture corridor**: real system layers recede toward a product core, translating the depth and visual rhythm of the Melius reference into Diego's own subject matter.

The page should feel composed, calm, exact, and confident. Large typography and negative space carry the hierarchy; diagrams and project plates provide the visual storytelling. Decoration without technical meaning is excluded.

## Durable tokens

### Color

- `--canvas: #e9ebe5` — cool mineral page background.
- `--surface: #f7f8f3` — raised editorial surface.
- `--ink: #10120f` — primary text and dark fields.
- `--muted: #62675f` — supporting copy.
- `--line: #c5c9bf` — structural rules and grid lines.
- `--signal: #334cff` — the single brand signal for actions, focus, and system flow.
- `--night: #111713` — high-contrast project/contact surface.
- `--live: #2c8f5b` and `--danger: #b93434` — semantic states only.

Runtime owner: these values are defined once in `app/globals.css` and consumed by every route and component.

### Type

- Display: Newsreader variable, 300–800. Used for hero and major editorial statements.
- Body: Manrope variable, 400–800. Used for navigation, copy, controls, and case-study reading.
- Utility: IBM Plex Mono 500. Used sparingly for indices, states, architecture labels, and technical metadata.

Fonts are self-hosted from `public/fonts` to avoid late external requests and layout instability.

### Scale

- Display: `clamp(4.2rem, 9.4vw, 10.4rem)`.
- Section title: `clamp(3.1rem, 6.2vw, 7rem)`.
- Project title: `clamp(3.2rem, 7.2vw, 8rem)`.
- Body lead: `clamp(1.02rem, 1.35vw, 1.28rem)`.
- Utility: `0.62rem–0.74rem`, uppercase only when it encodes metadata.

### Layout

- Maximum composition width: `1560px`.
- Page padding: `clamp(20px, 4.4vw, 72px)`.
- Grid: 12 columns with fluid gaps; components may use asymmetric spans.
- Section rhythm: `clamp(104px, 13vw, 210px)`.
- Project cases are full-width folio plates, never a repeated card grid.
- Mobile preserves hierarchy and intentional whitespace; the architecture corridor becomes an explicit horizontal sequence with visible scrolling.

### Shape

- Default radius: `2px`; geometry is mostly square and structural.
- Buttons may use a compact `3px` radius; badges are not decorative pills.
- Shadows are reserved for the architecture corridor's depth cue and the cookie notice.
- Borders and ruled lines encode grouping, sequence, and system flow.

### Motion

- Standard duration: `180ms`; reveal duration: `760ms`.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- One orchestrated hero entrance, restrained intersection reveals, and small hover lifts on meaningful system panels.
- `prefers-reduced-motion: reduce` removes transforms, animated scrolling, and transition delays.

## Content and interaction rules

- Projects appear immediately after the hero because proof is the page's primary job.
- All original projects, claims, bilingual routes, legal pages, links, and form behavior remain.
- Aether Commerce is the only public featured case and receives the highest visual emphasis.
- Native selects remain intentional: their short option sets and platform familiarity outweigh owning popup geometry.
- Every action uses semantic HTML, visible keyboard focus, a minimum 44px touch target, and a non-color cue.
- Form errors remain inline, focus moves to the first invalid field, entered values are preserved, and submit is protected from duplicates.
- Scrollbars stay visible and inherit a global themed baseline.

## Anti-patterns

- No generic card grids, logo walls, glass effects, invented metrics, decorative pills, or AI-style gradient backdrops.
- No unrelated stock imagery or fabricated project screenshots.
- No motion that competes with project reading.
- No local token copies: update this file and `app/globals.css` together when a durable visual decision changes.
