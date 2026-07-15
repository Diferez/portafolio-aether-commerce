"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, Download, PackageCheck, Shield, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiBaseUrl } from "./config";

type Summary = {
  mode: "private" | "demo";
  revenue: number;
  orders: number;
  conversionRate: number;
  lowStock: number;
  notice?: { en: string; es: string };
};

type AdminModule = [title: string, body: string, rows: string[]];

const fallback: Summary = {
  mode: "demo",
  revenue: 1842500,
  orders: 128,
  conversionRate: 4.8,
  lowStock: 7,
  notice: {
    en: "Public demo mode. Changes are disabled.",
    es: "Modo de demostracion publica. Los cambios estan deshabilitados."
  }
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function AdminDashboard({ demo = false }: { demo?: boolean }) {
  const [summary, setSummary] = useState<Summary>(fallback);
  const [status, setStatus] = useState(demo ? "Demo data" : "Private admin");

  useEffect(() => {
    const path = demo ? "/api/v1/admin/demo/summary" : "/api/v1/admin/summary";
    fetch(`${apiBaseUrl}${path}`)
      .then((response) => response.json())
      .then((payload: { success: boolean; data?: Summary }) => {
        if (payload.success && payload.data) {
          setSummary(payload.data);
          setStatus(payload.data.mode === "demo" ? "Public demo" : "Live private admin");
        }
      })
      .catch(() => setStatus("Offline demo"));
  }, [demo]);

  const metrics: Array<[string, string, LucideIcon]> = [
    ["Revenue", money(summary.revenue), PackageCheck],
    ["Orders", String(summary.orders), Boxes],
    ["Conversion", `${summary.conversionRate}%`, UsersRound],
    ["Low stock", String(summary.lowStock), AlertTriangle]
  ];

  return (
    <main className="admin-shell py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">{status}</p>
          <h1 className="mt-1 text-4xl font-semibold text-zinc-950">
            {demo ? "Public demo admin" : "Private admin dashboard"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Monitor catalog health, order operations, customer support, coupons, reviews, and audit events.
          </p>
        </div>
        <button disabled={demo} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400">
          <Download size={17} aria-hidden />
          Export CSV
        </button>
      </div>

      {summary.notice ? (
        <section className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <div className="flex gap-3">
            <Shield size={18} aria-hidden />
            <div>
              <p className="font-semibold">{summary.notice.en}</p>
              <p>{summary.notice.es}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Metrics">
        {metrics.map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg border border-zinc-200 bg-white p-5">
            <Icon className="text-teal-700" aria-hidden />
            <p className="mt-4 text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-950">{value}</p>
          </article>
        ))}
      </section>

      <section id="products" className="mt-6 rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 p-4">
          <h2 className="text-lg font-semibold">Catalog overrides</h2>
          <p className="text-sm text-zinc-500">Use private admin to update flags, visibility, copy, and inventory rules.</p>
        </div>
        {["Aether Arc Laptop", "Aether Dock Studio", "Aether Pulse Headset"].map((product, index) => (
          <div key={product} className="grid gap-3 border-b border-zinc-200 p-4 last:border-b-0 md:grid-cols-[1fr_180px_180px] md:items-center">
            <div>
              <h3 className="font-semibold">{product}</h3>
              <p className="text-sm text-zinc-500">Override status: {index === 1 ? "featured" : "standard"}</p>
            </div>
            <span className="text-sm text-zinc-600">{index === 2 ? "Low stock" : "In stock"}</span>
            <button disabled={demo} className="focus-ring min-h-10 rounded-md border border-zinc-300 px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
              Edit override
            </button>
          </div>
        ))}
      </section>

      <section id="orders" className="mt-6 rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 p-4">
          <h2 className="text-lg font-semibold">Order operations</h2>
        </div>
        {["reserved", "paid", "fulfillment_pending", "shipped"].map((state, index) => (
          <div key={state} className="grid gap-3 border-b border-zinc-200 p-4 last:border-b-0 md:grid-cols-[140px_1fr_160px]">
            <strong>AET-{20260700 + index}</strong>
            <span className="text-zinc-600">{state.replaceAll("_", " ")}</span>
            <button disabled={demo} className="focus-ring min-h-10 rounded-md border border-zinc-300 px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
              Advance state
            </button>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {([
          ["Inventory", "Reservations, movements, returns and low-stock alerts.", ["AET-ARC-STD: 12 available", "AET-PULSE-STD: low stock", "Expired reservations: 0"]],
          ["Users", "Commerce profiles synced from Clerk without storing credentials.", ["customer@example.com", "admin@example.com", "Local status: active"]],
          ["Coupons", "Case-insensitive coupons with usage and subtotal rules.", ["AETHER10: 10% off", "FREESHIP: simulated", "Usage logged in D1"]],
          ["Reviews", "Moderation queue for verified or seeded demo reviews.", ["2 approved", "1 pending", "Helpful votes tracked"]],
          ["Audit", "Every privileged action records actor, entity and request ID.", ["products.write", "orders.write", "settings.manage"]],
          ["Settings", "Shipping, countries, reservation TTL, SEO and portfolio link.", ["Free shipping threshold: USD 150", "Reservation TTL: 15 minutes", "Maintenance: off"]]
        ] as AdminModule[]).map(([title, body, rows]) => (
          <section key={title} className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
            <div className="mt-4 grid gap-2">
              {rows.map((row) => (
                <div key={row} className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-600">
                  {row}
                </div>
              ))}
            </div>
            <button disabled={demo} className="focus-ring mt-4 min-h-10 rounded-md border border-zinc-300 px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
              Open module
            </button>
          </section>
        ))}
      </section>
    </main>
  );
}
