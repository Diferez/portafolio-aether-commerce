import { Blocks, Database, KeyRound, ServerCog } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: "Static Next storefront",
    body: "Cloudflare Pages hosts static assets with no Node runtime in the browser tier.",
    Icon: Blocks
  },
  {
    title: "Worker API",
    body: "Hono routes own auth, RBAC, checkout, webhooks, rate limits, and secure errors.",
    Icon: ServerCog
  },
  {
    title: "D1 database",
    body: "SQLite-backed D1 stores carts, orders, overrides, coupons, audit logs, and events.",
    Icon: Database
  },
  {
    title: "Secrets boundary",
    body: "Stripe, Clerk, Resend, and Cloudinary secrets remain server-side only.",
    Icon: KeyRound
  }
];

export default function ArchitecturePage() {
  return (
    <main className="aether-shell py-8">
      <p className="text-sm font-semibold uppercase text-teal-700">Architecture</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">Aether system design</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map(({ title, body, Icon }) => (
          <section key={title} className="rounded-lg border border-zinc-200 bg-white p-5">
            <Icon className="text-teal-700" aria-hidden />
            <h2 className="mt-3 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
