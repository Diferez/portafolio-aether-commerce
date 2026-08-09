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

  assert.match(es, /Diseño sistemas/);
  assert.match(es, /Los llevo a producción/);
  assert.match(en, /I design systems/);
  assert.match(en, /I take them to production/);
  assert.doesNotMatch(es, /I design systems/);
  assert.doesNotMatch(en, /Diseño sistemas/);
});

test("includes localized navigation, hreflang, and production project link", async () => {
  const es = await text("/es");

  assert.match(es, /href="#proyectos"/);
  assert.match(es, /href="#experiencia"/);
  assert.match(es, /href="#contacto"/);
  assert.match(es, /hrefLang="es"/);
  assert.match(es, /hrefLang="en"/);
  assert.match(es, /https:\/\/aether-storefront\.pickofwow\.workers\.dev/);
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
});

test("renders honest case-study status and the validated AI architecture", async () => {
  const es = await text("/es");

  assert.match(es, /Aether Commerce/);
  assert.match(es, /FastAPI\/LangGraph está validada en Docker/);
  assert.match(es, /PostgreSQL y Redis permanece documentado como siguiente etapa/);
  assert.match(es, /tokens de carrito e idempotencia/);
  assert.doesNotMatch(es, /99%|10x|millones de usuarios/i);
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
