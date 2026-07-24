import { cors } from "hono/cors";
import type { Context } from "hono";
import type { AppBindings } from "../types";

export function aetherCors() {
  return cors({
    origin(origin, c: Context<AppBindings>) {
      const allowed = [c.env.APP_ORIGIN_STORE, c.env.APP_ORIGIN_ADMIN].filter(Boolean);
      if (!origin || allowed.length === 0 || allowed.includes(origin)) {
        return origin || "*";
      }
      return "";
    },
    allowHeaders: [
      "authorization",
      "content-type",
      "x-request-id",
      "x-idempotency-key",
      "x-aether-customer-email",
      "x-aether-cart-token"
    ],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 600
  });
}
