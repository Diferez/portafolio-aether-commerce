# Aether Premium Commerce Demo

Aether is a bilingual premium tech commerce demo designed for free-tier-friendly
deployment on Cloudflare Pages, Cloudflare Workers, D1, Clerk, Stripe test mode,
Resend, Cloudinary, and the Platzi Fake Store API.

This folder is intentionally self-contained and does not replace the portfolio
site in the repository root.

## What is included

- Static Next.js storefront in `apps/storefront`.
- Static Next.js admin in `apps/admin`.
- Cloudflare Worker API in `apps/api`.
- Shared contracts, business rules, config, i18n, API client, testing helpers, and UI primitives in
  `packages/*`.
- D1 schema and seed data under `apps/api/migrations`.
- OpenAPI 3 contract in `docs/openapi/aether.v1.yaml`.
- CI workflow, security notes, ADRs, deployment guide, and troubleshooting docs.

## Functional scope

- Public catalog routes: products, categories, search, featured, deals, new arrivals, reviews, and shipping options.
- Customer routes: profile, cart, coupons, favorites, compare, addresses, orders, returns, refund requests, and reviews.
- Commerce routes: Stripe sandbox checkout and signed webhook handling.
- Admin routes: dashboard, products, overrides, cache refresh, inventory, movements, orders, users, coupons, reviews, refunds, audit, settings, and exports.
- Public demo admin blocks mutations and displays the required bilingual notice.
- D1 schema includes the requested commerce tables, including inventory reservations, order snapshots, shipment events, coupon redemptions, audit logs, email events, and idempotency keys.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and fill only the values you need locally.
3. Run the API with `pnpm dev:api`.
4. Run the storefront with `pnpm dev:storefront`.
5. Run the admin with `pnpm dev:admin`.

The apps work in demo mode without live credentials. Stripe remains in test mode
only, and emails should be sent through Resend only after a verified sender is
configured.

Local URLs after starting the dev servers:

- Storefront: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Public demo admin: `http://localhost:3001/demo/`
- Worker API: `http://localhost:8787/api/v1/health`

## Validation

```bash
pnpm validate
pnpm test:e2e
```

The lightweight Node tests can also run without installing the full workspace:

```bash
node --test tests/*.test.mjs
```

## Deployment model

- `apps/storefront` and `apps/admin` export static assets for Cloudflare Pages.
- `apps/api` deploys as a Cloudflare Worker with D1 binding `DB`.
- Secrets stay in Cloudflare Worker secrets and are never shipped to the client.
- D1 migrations are checked in and can be applied with Wrangler.

Read `docs/deployment.md` before deploying.
