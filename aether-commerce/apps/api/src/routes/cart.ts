import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { cartItemInputSchema } from "@aether/schemas";
import type { AppBindings } from "../types";
import { fail, ok } from "../http";
import { addItem, applyCoupon, readCart, removeItem } from "../services/cart";

export const cartRoutes = new Hono<AppBindings>();

cartRoutes.get("/:id", async (c) => ok(c, await readCart(c.env, c.req.param("id"))));

cartRoutes.post("/:id/items", zValidator("json", cartItemInputSchema), async (c) => {
  try {
    return ok(c, await addItem(c.env, c.req.param("id"), c.req.valid("json")), 201);
  } catch {
    return fail(c, 404, "PRODUCT_NOT_FOUND", "Product not found.");
  }
});

cartRoutes.post(
  "/:id/coupon",
  zValidator("json", z.object({ code: z.string().min(3).max(32) })),
  async (c) => ok(c, await applyCoupon(c.env, c.req.param("id"), c.req.valid("json").code))
);

cartRoutes.delete("/:id/items/:itemId", async (c) =>
  ok(c, await removeItem(c.env, c.req.param("id"), decodeURIComponent(c.req.param("itemId"))))
);
