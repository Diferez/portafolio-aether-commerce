"use client";

import { Blocks, Cloud, Database, GitBranch, KeyRound, Mail, ServerCog, ShieldCheck, ShoppingCart, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";

type ArchitectureCopy = {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ title: string; body: string; Icon: LucideIcon }>;
  runtime: {
    eyebrow: string;
    title: string;
    body: string;
    labels: string[];
  };
  flows: Array<{ title: string; body: string; Icon: LucideIcon }>;
};

const copy: Record<"en" | "es", ArchitectureCopy> = {
  en: {
    eyebrow: "Architecture",
    title: "Aether system design",
    description:
      "Aether is built as a portfolio-connected commerce demo: a static customer experience backed by a Worker API, D1 persistence, Stripe sandbox payments, and deployment automation designed for a small production footprint.",
    items: [
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
    ],
    runtime: {
      eyebrow: "Runtime map",
      title: "Clear boundaries between UI, API, data, and third-party services.",
      body: "The front never owns secrets or final commerce decisions. It renders the experience, sends intent to the Worker, and receives normalized responses that are safe for the browser.",
      labels: ["Static portfolio + store", "Hono Worker API", "D1 database", "Stripe sandbox", "Resend email events", "GitHub Actions + Wrangler"]
    },
    flows: [
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
    ]
  },
  es: {
    eyebrow: "Arquitectura",
    title: "Diseno del sistema Aether",
    description:
      "Aether esta construido como una demo de comercio conectada al portafolio: una experiencia estatica para clientes, respaldada por una API Worker, persistencia en D1, pagos de prueba con Stripe y despliegues automatizables con una huella operativa pequena.",
    items: [
      {
        title: "Front estatico unificado",
        body: "El portafolio y la tienda Aether se publican juntos como un front estatico. Las paginas se mantienen rapidas, cacheables e independientes de renderizado en servidor.",
        Icon: Blocks
      },
      {
        title: "API en Cloudflare Worker",
        body: "Las rutas con Hono manejan catalogo, carritos, mensajes de contacto, checkout, webhooks, identificadores de request, errores seguros y el limite entre front y backend.",
        Icon: ServerCog
      },
      {
        title: "Capa de datos con Cloudflare D1",
        body: "D1, basado en SQLite, guarda carritos, ordenes, productos, mensajes de contacto, eventos de webhook, eventos de correo y registros operativos de la demo.",
        Icon: Database
      },
      {
        title: "Separacion de secretos",
        body: "Stripe, autenticacion preparada para Clerk, Resend y la configuracion de Cloudinary permanecen del lado del servidor en secretos del Worker o variables de despliegue.",
        Icon: KeyRound
      }
    ],
    runtime: {
      eyebrow: "Mapa de ejecucion",
      title: "Limites claros entre UI, API, datos y servicios externos.",
      body: "El front no posee secretos ni toma decisiones finales de comercio. Renderiza la experiencia, envia intenciones al Worker y recibe respuestas normalizadas seguras para el navegador.",
      labels: ["Portafolio + tienda estatica", "API Worker con Hono", "Base de datos D1", "Stripe sandbox", "Eventos de correo con Resend", "GitHub Actions + Wrangler"]
    },
    flows: [
      {
        title: "Flujo de catalogo",
        body: "Los datos externos de productos se normalizan al contrato de Aether, se filtran por imagenes y nombres utiles, se combinan con reglas locales y se exponen en respuestas paginadas.",
        Icon: Workflow
      },
      {
        title: "Carrito y checkout",
        body: "El navegador mantiene el carrito fluido, mientras el Worker recalcula precios, valida cantidades, crea sesiones de checkout de prueba con Stripe y registra ordenes despues de eventos de pago confirmados.",
        Icon: ShoppingCart
      },
      {
        title: "Contacto y notificaciones",
        body: "Los formularios del portafolio y la tienda publican en la misma API Worker. D1 conserva el historial y Resend puede enviar notificaciones cuando las credenciales estan configuradas.",
        Icon: Mail
      },
      {
        title: "Pipeline de despliegue",
        body: "GitHub Actions, Cloudflare Workers, salida compatible con Cloudflare Pages, Wrangler y variables por entorno mantienen despliegues repetibles.",
        Icon: GitBranch
      },
      {
        title: "Controles operativos",
        body: "La demo usa comportamiento seguro para publico, checkout protegido, validacion en API, webhooks idempotentes y secretos del lado del servidor para evitar exponer claves en el cliente.",
        Icon: ShieldCheck
      },
      {
        title: "Diseno consciente del free tier",
        body: "La arquitectura favorece assets estaticos, endpoints Worker, D1, lecturas cacheadas de catalogo y pagos sandbox para operar dentro de restricciones practicas de una demo en Cloudflare.",
        Icon: Cloud
      }
    ]
  }
};

export default function ArchitecturePage() {
  const { locale } = useLanguage();
  const page = copy[locale];

  return (
    <main className="aether-shell py-8">
      <p className="text-sm font-semibold uppercase text-teal-700">{page.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{page.title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">{page.description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {page.items.map(({ title, body, Icon }) => (
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
            <p className="text-sm font-semibold uppercase text-cyan-300">{page.runtime.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold">{page.runtime.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{page.runtime.body}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.runtime.labels.map((label) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {page.flows.map(({ title, body, Icon }) => (
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
