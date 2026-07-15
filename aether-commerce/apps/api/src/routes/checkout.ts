import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppBindings } from "../types";
import { fail, ok } from "../http";
import { readCart } from "../services/cart";
import { createCheckoutSession } from "../services/stripe";

export const checkoutRoutes = new Hono<AppBindings>();

checkoutRoutes.post(
  "/session",
  zValidator("json", z.object({ cartId: z.string().min(1) })),
  async (c) => {
    const cart = await readCart(c.env, c.req.valid("json").cartId);
    if (cart.items.length === 0) {
      return fail(c, 422, "EMPTY_CART", "Add at least one item before checkout.");
    }

    try {
      return ok(c, await createCheckoutSession(c.env, cart), 201);
    } catch {
      return fail(
        c,
        500,
        "STRIPE_CHECKOUT_FAILED",
        "Stripe checkout could not be started. Check STRIPE_SECRET_KEY and network access."
      );
    }
  }
);
