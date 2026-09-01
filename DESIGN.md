# Design system — Diego Fernando Martínez

## Direction

This portfolio presents Diego as a systems engineer who connects the visible product to rules, data, integrations, and operations. Its visual register is a precise dark systems composition. The supplied desktop and mobile reference canvases own the first viewport so the public landing page can match the approved visual pixel-for-pixel at their respective breakpoints.

The page should feel composed, calm, exact, and confident. Large typography and negative space carry the hierarchy; diagrams and project plates provide the visual storytelling. Decoration without technical meaning is excluded.

## Durable tokens

### Color

- `--canvas: #05070a` — near-black page background.
- `--surface: #0a0d11` — dark raised surface.
- `--ink: #f2f0eb` — primary warm-white text.
- `--muted: #92959d` — supporting copy.
- `--line: #292d35` — structural rules and grid lines.
- `--signal: #974cff` — violet signal for actions, focus, and system flow.
- `--night: #07090c` — high-contrast contact surface.
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
- All original projects, claims, bilingual routes, legal pages, and links remain.
- Aether Commerce is the only public featured case and receives the highest visual emphasis.
- Contact is intentionally direct: email, WhatsApp, and social links are the available channels; there is no embedded form.
- Every action uses semantic HTML, visible keyboard focus, a minimum 44px touch target, and a non-color cue.
- Scrollbars stay visible and inherit a global themed baseline.

## Anti-patterns

- No generic card grids, logo walls, glass effects, invented metrics, decorative pills, or AI-style gradient backdrops.
- No unrelated stock imagery or fabricated project screenshots.
- No motion that competes with project reading.
- No local token copies: update this file and `app/globals.css` together when a durable visual decision changes.
