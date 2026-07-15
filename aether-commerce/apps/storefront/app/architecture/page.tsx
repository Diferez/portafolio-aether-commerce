import { Blocks, Cloud, Database, GitBranch, KeyRound, Mail, ServerCog, ShieldCheck, ShoppingCart, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: "Unified static front",
    body: "The portfolio and Aether storefront are shipped together as a static front. Pages stay fast, cacheable, and independent from server-side rendering.",
    Icon: Blocks
  },
  {
    title: "Cloudflare Worker API",
    body: "Hono routes own catalog, carts, contact messages, checkout, webhooks, request IDs, secure errors, and the API boundary used by the static front.",
    Icon: ServerCog
  },
  {
    title: "Cloudflare D1 data layer",
    body: "SQLite-backed D1 stores carts, orders, products, contact messages, webhook events, email events, and operational records for the demo.",
    Icon: Database
  },
  {
    title: "Secrets boundary",
    body: "Stripe, Clerk-ready auth, Resend, and Cloudinary configuration stay server-side in Worker secrets or deployment variables.",
    Icon: KeyRound
  }
];

const flows = [
  {
    title: "Catalog flow",
    body: "External product data is normalized into Aether contracts, filtered for usable images and names, merged with local overrides, then exposed through paginated API responses.",
    Icon: Workflow
  },
  {
    title: "Cart and checkout",
    body: "The browser keeps the cart responsive, while the Worker recalculates prices, validates quantities, creates Stripe test checkout sessions, and records orders after confirmed payment events.",
    Icon: ShoppingCart
  },
  {
    title: "Contact and notifications",
    body: "Portfolio and store contact forms post to the same Worker API. D1 keeps the message history and Resend can deliver email notifications when credentials are configured.",
    Icon: Mail
  },
  {
    title: "Deployment pipeline",
    body: "GitHub Actions, Cloudflare Workers, Cloudflare Pages-compatible output, Wrangler, and environment-specific variables keep production deploys repeatable.",
    Icon: GitBranch
  },
  {
    title: "Operational controls",
    body: "The demo uses public-safe behavior, protected checkout, API validation, idempotent webhook handling, and server-side secrets to avoid exposing sensitive keys in the client bundle.",
    Icon: ShieldCheck
  },
  {
    title: "Free-tier conscious design",
    body: "The architecture favors static assets, Worker endpoints, D1, cached catalog reads, and sandbox payments so the project can run within practical Cloudflare demo constraints.",
    Icon: Cloud
  }
];

export default function ArchitecturePage() {
  return (
    <main className="aether-shell py-8">
      <p className="text-sm font-semibold uppercase text-teal-700">Architecture</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Aether system design</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
        Aether is built as a portfolio-connected commerce demo: a static customer experience backed by a Worker API, D1 persistence, Stripe sandbox payments, and deployment automation designed for a small production footprint.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map(({ title, body, Icon }) => (
          <section key={title} className="rounded-lg border border-zinc-200 bg-white p-5">
            <Icon className="text-teal-700" aria-hidden />
            <h2 className="mt-3 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
          </section>
        ))}
      </div>
      <section className="mt-8 rounded-lg border border-zinc-200 bg-zinc-950 p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-cyan-300">Runtime map</p>
            <h2 className="mt-2 text-2xl font-semibold">Clear boundaries between UI, API, data, and third-party services.</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              The front never owns secrets or final commerce decisions. It renders the experience, sends intent to the Worker, and receives normalized responses that are safe for the browser.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Static portfolio + store", "Hono Worker API", "D1 database", "Stripe sandbox", "Resend email events", "GitHub Actions + Wrangler"].map((label) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flows.map(({ title, body, Icon }) => (
          <section key={title} className="rounded-lg border border-zinc-200 bg-white p-5">
            <Icon className="text-teal-700" aria-hidden />
            <h2 className="mt-3 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
