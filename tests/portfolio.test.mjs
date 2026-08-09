import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));

async function render(pathname, headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", ...headers },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function text(pathname) {
  const response = await render(pathname);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("renders Spanish and English without mixing hero copy", async () => {
  const [es, en] = await Promise.all([text("/es"), text("/en")]);

  assert.match(es, /Construyo sistemas para productos reales/);
  assert.match(es, /De la arquitectura a producción/);
  assert.match(en, /I build systems for real products/);
  assert.match(en, /From architecture to production/);
  assert.doesNotMatch(es, /I build systems for real products/);
  assert.doesNotMatch(en, /Construyo sistemas para productos reales/);
});

test("includes localized navigation, hreflang, and production project link", async () => {
  const es = await text("/es");
  const expectedStoreUrl =
    process.env.NEXT_PUBLIC_STORE_URL?.trim() ||
    "https://aether-storefront.pickofwow.workers.dev";

  assert.match(es, /href="#proyectos"/);
  assert.doesNotMatch(es, /href="#experiencia"/);
  assert.match(es, /href="#contacto"/);
  assert.match(es, /hrefLang="es"/);
  assert.match(es, /hrefLang="en"/);
  assert.ok(es.includes(expectedStoreUrl));
  assert.doesNotMatch(es, /href=""/);
});

test("renders accessible contact form fields and privacy copy", async () => {
  const en = await text("/en");

  assert.match(en, /name="name"/);
  assert.match(en, /name="email"/);
  assert.match(en, /name="projectType"/);
  assert.match(en, /name="message"/);
  assert.match(en, /name="website"/);
  assert.doesNotMatch(en, /name="budget"/);
  assert.match(en, /https:\/\/www\.linkedin\.com\/in\/diferez\//);
  assert.match(en, /aria-live="polite"/);
  assert.match(en, /used only to respond/);
  assert.match(en, /href="https:\/\/github\.com\/Diferez"/);
  assert.match(en, />GitHub</);
  assert.doesNotMatch(en, /View professional profile[^]*https:\/\/github\.com\/Diferez/);
});

test("renders honest case-study status and the validated AI architecture", async () => {
  const es = await text("/es");

  assert.match(es, /Aether Commerce/);
  assert.match(es, /Proyectos reales, explicados desde sus decisiones/);
  assert.match(es, /Entiendo el dominio antes de proponer arquitectura/);
  assert.match(es, /Mapa de responsabilidad/);
  assert.match(es, /Lo visible es solo la entrada/);
  assert.match(es, /Servicios que validan, calculan, autorizan y coordinan/);
  assert.match(es, /Diseño la interfaz como la puerta de un sistema/);
  assert.doesNotMatch(es, /SYS \/ 01/);
  assert.doesNotMatch(es, /Sistema \/ producto/);
  assert.match(es, /FastAPI\/LangGraph está validada en Docker/);
  assert.match(es, /PostgreSQL y Redis permanece documentado como siguiente etapa/);
  assert.match(es, /tokens de carrito e idempotencia/);
  assert.doesNotMatch(es, /99%|10x|millones de usuarios/i);
});

test("hero architecture graph uses a non-overlapping grid layout", async () => {
  const css = await readFile(path.join(root, "app", "globals.css"), "utf8");

  assert.match(css, /\.architecture-graph\s*{[^}]*display:\s*grid/s);
  assert.match(css, /\.diagram-flow\s*{[^}]*grid-template-areas:/s);
  assert.match(css, /"operation \. rules"/);
  assert.match(css, /\.diagram-step:nth-child\(1\)\s*{[^}]*grid-area:\s*entry/s);
  assert.match(css, /\.diagram-step:nth-child\(2\)\s*{[^}]*grid-area:\s*rules/s);
  assert.match(css, /\.diagram-step:nth-child\(3\)\s*{[^}]*grid-area:\s*state/s);
  assert.match(css, /\.diagram-step:nth-child\(4\)\s*{[^}]*grid-area:\s*operation/s);
  assert.doesNotMatch(css, /\.diagram-step:nth-child\([1-4]\)\s*{[^}]*(?:top|right|bottom|left):/s);
});

test("proxy keeps browser language detection and saved preference", async () => {
  const middleware = await readFile(path.join(root, "proxy.ts"), "utf8");

  assert.match(middleware, /accept-language/);
  assert.match(middleware, /localeCookieName/);
  assert.match(middleware, /NextResponse\.redirect/);
});

test("private project labels are absent from source, public files, and build output", async () => {
  const forbidden = [
    ["Wa", "ge", "Up"].join(""),
    ["Str", "etch", "bill"].join(""),
  ];
  const scannedRoots = [
    "app",
    "components",
    "config",
    "content",
    "i18n",
    "lib",
    "public",
    "tests",
    "dist",
    ".next/server",
    "proxy.ts",
  ];

  for (const relativeRoot of scannedRoots) {
    const absoluteRoot = path.join(root, relativeRoot);
    for await (const file of walk(absoluteRoot)) {
      const body = await readFile(file, "utf8").catch(() => "");
      for (const phrase of forbidden) {
        assert.equal(
          body.includes(phrase),
          false,
          `${phrase} should not appear in ${path.relative(root, file)}`,
        );
      }
    }
  }
});

async function* walk(directory) {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    if (/\.(?:js|mjs|ts|tsx|html|json|css|txt|xml|svg)$/.test(directory)) {
      yield directory;
    }
    return;
  }

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(absolute);
    } else if (/\.(?:js|mjs|ts|tsx|html|json|css|txt|xml|svg)$/.test(entry.name)) {
      yield absolute;
    }
  }
}
