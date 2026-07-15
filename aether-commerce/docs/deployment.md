# Deployment Guide

## Required services

- Cloudflare account with Pages, Workers, and D1.
- Clerk application.
- Resend API key and verified sender.
- Stripe account in test mode.
- Cloudinary cloud.

## Cloudflare D1

Create one D1 database for Aether and bind it to the Worker as `DB`.

```bash
wrangler d1 create aether-demo
pnpm --filter @aether/api db:migrate:local
pnpm --filter @aether/api db:migrate:remote
```

After Cloudflare returns the D1 database ID, replace
`replace-with-cloudflare-d1-id` in `apps/api/wrangler.toml`.

## Worker secrets

Set secrets with Wrangler or the Cloudflare dashboard:

```bash
wrangler secret put CLERK_SECRET_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put CLOUDINARY_API_SECRET
```

Use only Stripe test keys for this project. Do not configure live Stripe keys.

## Migrations and seeds

Apply all migrations before exposing the storefront to traffic:

```bash
pnpm --filter @aether/api db:migrate:local
pnpm --filter @aether/api db:seed
pnpm --filter @aether/api db:migrate:remote
pnpm --filter @aether/api db:seed:remote
```

For production, use the same migration files with a real D1 database ID in
`apps/api/wrangler.toml` and Cloudflare-managed secrets.

## Pages projects

Deploy `apps/storefront` and `apps/admin` as static exports. Use:

If the Pages project root is the repository root:

- Storefront build command: `pnpm --filter @aether/storefront build`
- Storefront output directory: `apps/storefront/out`
- Admin build command: `pnpm --filter @aether/admin build`
- Admin output directory: `apps/admin/out`

If the Pages project root is `apps/storefront` or `apps/admin`:

- Build command: `pnpm build`
- Output directory: `out`

Set `NEXT_PUBLIC_AETHER_API_URL` to the Worker URL.

To publish the storefront inside the portfolio Cloudflare front at `/store`,
use the root portfolio build. It builds Aether with:

- `NEXT_PUBLIC_AETHER_BASE_PATH=/store`
- `NEXT_PUBLIC_PORTFOLIO_URL=https://your-portfolio-domain.com`

The portfolio front should use:

- `NEXT_PUBLIC_STORE_URL=/store`
- `NEXT_PUBLIC_AETHER_API_URL=https://your-aether-api-worker.your-subdomain.workers.dev`

`AETHER_STOREFRONT_ORIGIN` is optional fallback only if you deploy the
storefront as a separate Pages project. The recommended Cloudflare flow copies
the static storefront into the portfolio deployment and serves it from `/store`.

## Free-tier defaults

- Keep assets below Cloudflare Pages limits.
- Avoid paid Cloudflare Queues, Durable Objects, and paid R2 features.
- Use Stripe test mode only.
- Use Resend within the free daily sending limit.
- Use Cloudinary transformations that are available on the free plan.
