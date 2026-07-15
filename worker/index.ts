/** Cloudflare Worker entry point for the portfolio landing. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  AETHER_STOREFRONT_ORIGIN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

function storeAssetCandidates(pathname: string) {
  const candidates = [pathname];

  if (pathname === "/store") {
    candidates.push("/store/index.html");
  } else if (pathname.endsWith("/")) {
    candidates.push(`${pathname}index.html`);
  } else {
    const lastSegment = pathname.split("/").pop() ?? "";
    if (!lastSegment.includes(".")) {
      candidates.push(`${pathname}/index.html`);
    }
  }

  return [...new Set(candidates)];
}

async function fetchStoreAsset(request: Request, env: Env) {
  const url = new URL(request.url);

  for (const candidate of storeAssetCandidates(url.pathname)) {
    const assetUrl = new URL(request.url);
    assetUrl.pathname = candidate;
    const response = env?.ASSETS
      ? await env.ASSETS.fetch(new Request(assetUrl, request))
      : await fetchLocalClientAsset(candidate);

    if (response && response.status !== 404) {
      return response;
    }
  }

  return null;
}

async function fetchLocalClientAsset(pathname: string) {
  if (typeof process === "undefined" || !process.versions?.node) {
    return null;
  }

  try {
    const [{ readFile }, { extname, join, normalize }] = await Promise.all([
      import("node:fs/promises"),
      import("node:path")
    ]);
    const root = join(process.cwd(), "dist", "client");
    const filePath = normalize(join(root, pathname));

    if (!filePath.startsWith(root)) {
      return null;
    }

    const body = await readFile(filePath);
    const contentType =
      extname(filePath) === ".html"
        ? "text/html; charset=utf-8"
        : extname(filePath) === ".css"
          ? "text/css; charset=utf-8"
          : extname(filePath) === ".js"
            ? "text/javascript; charset=utf-8"
            : extname(filePath) === ".json"
              ? "application/json; charset=utf-8"
              : "application/octet-stream";

    return new Response(body, { headers: { "content-type": contentType } });
  } catch {
    return null;
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (!env?.ASSETS && (url.pathname.startsWith("/assets/") || url.pathname === "/favicon.svg")) {
      const localAssetResponse = await fetchLocalClientAsset(url.pathname);
      if (localAssetResponse) {
        return localAssetResponse;
      }
    }

    if (url.pathname === "/store" || url.pathname.startsWith("/store/")) {
      const localStoreResponse = await fetchStoreAsset(request, env);
      if (localStoreResponse) {
        return localStoreResponse;
      }

      if (!env.AETHER_STOREFRONT_ORIGIN) {
        return new Response("Aether storefront files were not found in this deployment.", {
          status: 404,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }

      const storeOrigin = new URL(env.AETHER_STOREFRONT_ORIGIN);
      const storeUrl = new URL(request.url);
      storeUrl.protocol = storeOrigin.protocol;
      storeUrl.host = storeOrigin.host;
      storeUrl.pathname = storeUrl.pathname.replace(/^\/store(?=\/|$)/, "") || "/";
      return fetch(new Request(storeUrl, request));
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
