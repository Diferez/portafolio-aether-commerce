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
- FastAPI/LangGraph sales assistant service in `apps/ai-assistant`.
- Shared contracts, business rules, config, i18n, API client, testing helpers, and UI primitives in
  `packages/*`.
- D1 schema and seed data under `apps/api/migrations`.
- OpenAPI 3 contracts in `docs/openapi/aether.v1.yaml` and `docs/ai-assistant/openapi.yaml`.
- CI workflow, security notes, ADRs, deployment guide, observability artifacts, and troubleshooting docs.

## Functional scope

- Public catalog routes: products, categories, search, featured, deals, new arrivals, reviews, and shipping options.
- Customer routes: profile, cart, coupons, favorites, compare, addresses, orders, returns, refund requests, and reviews.
- Commerce routes: Stripe sandbox checkout and signed webhook handling.
- Admin routes: dashboard, products, overrides, cache refresh, inventory, movements, orders, users, coupons, reviews, refunds, audit, settings, and exports.
- Public demo admin blocks mutations and displays the required bilingual notice.
- D1 schema includes the requested commerce tables, including inventory reservations, order snapshots, shipment events, coupon redemptions, audit logs, email events, and idempotency keys.
- AI assistant scope starts with grounded catalog discovery, controlled cart actions, Gemini-ready graph orchestration, structured responses, and a storefront widget enabled by configuration.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and fill only the values you need locally.
3. Run the API with `pnpm dev:api`.
4. Run the storefront with `pnpm dev:storefront`.
5. Run the admin with `pnpm dev:admin`.
6. Optionally run the AI assistant from `apps/ai-assistant` with Python 3.12:

```bash
cd apps/ai-assistant
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8090
```

Local SQLite storage initializes itself. For PostgreSQL environments, run `DATABASE_URL=postgresql://... python -m app.migrate` before enabling traffic.

To show the storefront assistant widget, set:

```env
NEXT_PUBLIC_AETHER_AI_URL=http://localhost:8090
```

For shared rate limiting, cache and concurrency across replicas, set `REDIS_URL`.
Leave it empty only for local in-memory development. Disable the assistant with
`AI_ASSISTANT_ENABLED=false`; disable cart mutations only with
`AI_MUTATIONS_ENABLED=false`.

The apps work in demo mode without live credentials. Stripe remains in test mode
only, and emails should be sent through Resend only after a verified sender is
configured.

Local URLs after starting the dev servers:

- Storefront: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Public demo admin: `http://localhost:3001/demo/`
- Worker API: `http://localhost:8787/api/v1/health`
- AI assistant: `http://localhost:8090/healthz`

## Validation

```bash
pnpm validate
pnpm test:e2e
```

The lightweight Node tests can also run without installing the full workspace:

```bash
node --test tests/*.test.mjs
```

AI assistant validation:

```bash
cd apps/ai-assistant
python -m compileall app tests scripts
python scripts/security_scan.py
python -m app.evaluation
python tests/run_direct.py
```

Real Gemini evaluation is manual and quota-capped:

```bash
cd apps/ai-assistant
GEMINI_API_KEY=... AI_EVAL_MAX_CASES=10 python -m app.gemini_evaluation
```

A separate GitHub Actions workflow, `AI Gemini evaluation`, can run the same real-model evaluation manually or on its weekly schedule when `GEMINI_API_KEY` is configured.

Assistant observability templates are in `docs/ai-assistant/observability/`:

- `prometheus-alerts.yml`
- `grafana-dashboard.json`

Current assistant acceptance evidence and remaining deployment checks are tracked in
`docs/ai-assistant/acceptance-status.md`.

## Deployment model

- `apps/storefront` and `apps/admin` export static assets for Cloudflare Pages.
- `apps/api` deploys as a Cloudflare Worker with D1 binding `DB`.
- `apps/ai-assistant` deploys separately as a Python service with a multi-stage Docker image and non-root runtime; Gemini, database, and Redis secrets stay server-side.
- Assistant migrations are normally run before traffic with `python -m app.migrate`. `AI_RUN_MIGRATIONS_ON_STARTUP=true` is available only for controlled one-replica migration tasks.
- Secrets stay in Cloudflare Worker secrets and are never shipped to the client.
- D1 migrations are checked in and can be applied with Wrangler.

Read `docs/deployment.md` before deploying.
