/** Cloudflare Worker entry point for the portfolio landing. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
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
