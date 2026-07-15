import { Hono } from "hono";
import type { AppBindings } from "../types";
import { fail, ok } from "../http";
import { verifyStripeSignature } from "../services/stripe";

export const webhookRoutes = new Hono<AppBindings>();

webhookRoutes.post("/stripe", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("stripe-signature");

  if (!c.env.STRIPE_WEBHOOK_SECRET || !signature) {
    return fail(c, 401, "WEBHOOK_NOT_CONFIGURED", "Stripe webhook secret is not configured.");
  }

  const valid = await verifyStripeSignature(c.env.STRIPE_WEBHOOK_SECRET, body, signature);
  if (!valid) {
    return fail(c, 401, "INVALID_SIGNATURE", "Invalid Stripe webhook signature.");
  }

  const payload = JSON.parse(body) as { id: string; type: string };
  await c.env.DB.prepare(
    `insert into webhook_events
      (id, provider, provider_event_id, payload_json, processed_at, created_at, updated_at)
     values (?, 'stripe', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     on conflict(provider_event_id) do nothing`
  )
    .bind(crypto.randomUUID(), payload.id, body)
    .run();

  return ok(c, { received: true, type: payload.type });
});
