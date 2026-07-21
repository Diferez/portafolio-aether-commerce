import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { addressSchema, cartItemInputSchema, contactMessageSchema } from "@aether/schemas";
import type { AppBindings } from "../types";
import { collection, fail, ok } from "../http";
import { addItem, applyCoupon, readCart, updateItemQuantity, writeCart } from "../services/cart";

const profileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  locale: z.enum(["en", "es"]).optional()
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  body: z.string().min(10).max(1200)
});

function actorId(c: Context<AppBindings>) {
  const actor = c.get("actor");
  return actor.userId ?? c.req.header("x-aether-anonymous-id") ?? "anonymous-demo";
}

export const userRoutes = new Hono<AppBindings>();

userRoutes.get("/me", (c) => ok(c, c.get("actor")));

userRoutes.patch("/me", zValidator("json", profileSchema), async (c) => {
  const actor = c.get("actor");
  if (!actor.userId) return fail(c, 401, "AUTH_REQUIRED", "Sign in to update your profile.");
  await c.env.DB.prepare(
    `insert into users (id, clerk_id, email, name, roles_json, created_at, updated_at)
     values (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     on conflict(id) do update set name = excluded.name, updated_at = CURRENT_TIMESTAMP`
  )
    .bind(actor.userId, actor.userId, actor.email ?? "user@example.com", c.req.valid("json").name ?? null, JSON.stringify(actor.roles))
    .run();
  return ok(c, { id: actor.userId, ...c.req.valid("json") });
});

userRoutes.get("/cart", async (c) => ok(c, await readCart(c.env, actorId(c))));

userRoutes.post("/cart/items", zValidator("json", cartItemInputSchema), async (c) => {
  try {
    return ok(c, await addItem(c.env, actorId(c), c.req.valid("json")), 201);
  } catch {
    return fail(c, 404, "PRODUCT_NOT_FOUND", "Product not found.");
  }
});

userRoutes.patch(
  "/cart/items/:id",
  zValidator("json", z.object({ quantity: z.number().int().min(1).max(25) })),
  async (c) => {
    const itemId = c.req.param("id");
    const quantity = c.req.valid("json").quantity;
    return ok(c, await updateItemQuantity(c.env, actorId(c), itemId, quantity));
  }
);

userRoutes.delete("/cart/items/:id", async (c) => {
  const cart = await readCart(c.env, actorId(c));
  const itemId = c.req.param("id");
  return ok(c, await writeCart(c.env, { ...cart, items: cart.items.filter((item) => item.productId !== itemId && item.variantId !== itemId) }));
});

userRoutes.delete("/cart", async (c) => ok(c, await writeCart(c.env, { ...(await readCart(c.env, actorId(c))), items: [] })));

userRoutes.post(
  "/cart/coupon",
  zValidator("json", z.object({ code: z.string().min(3).max(32) })),
  async (c) => ok(c, await applyCoupon(c.env, actorId(c), c.req.valid("json").code))
);

userRoutes.get("/favorites", async (c) => {
  const rows = await c.env.DB.prepare("select product_id from favorites where user_id = ? order by created_at desc")
    .bind(actorId(c))
    .all<{ product_id: string }>();
  return ok(c, rows.results.map((row) => row.product_id));
});

userRoutes.post("/favorites/:productId", async (c) => {
  await c.env.DB.prepare("insert or ignore into favorites (id, user_id, product_id) values (?, ?, ?)")
    .bind(crypto.randomUUID(), actorId(c), c.req.param("productId"))
    .run();
  return ok(c, { productId: c.req.param("productId"), saved: true }, 201);
});

userRoutes.delete("/favorites/:productId", async (c) => {
  await c.env.DB.prepare("delete from favorites where user_id = ? and product_id = ?").bind(actorId(c), c.req.param("productId")).run();
  return ok(c, { productId: c.req.param("productId"), saved: false });
});

userRoutes.get("/compare", async (c) => {
  const row = await c.env.DB.prepare("select product_ids_json from product_comparisons where id = ?")
    .bind(actorId(c))
    .first<{ product_ids_json: string }>();
  return ok(c, row ? JSON.parse(row.product_ids_json) : []);
});

userRoutes.post("/compare/:productId", async (c) => {
  const row = await c.env.DB.prepare("select product_ids_json from product_comparisons where id = ?")
    .bind(actorId(c))
    .first<{ product_ids_json: string }>();
  const ids = new Set<string>(row ? (JSON.parse(row.product_ids_json) as string[]) : []);
  ids.add(c.req.param("productId"));
  const next = [...ids].slice(0, 4);
  await c.env.DB.prepare(
    `insert into product_comparisons (id, user_id, anonymous_id, product_ids_json, created_at, updated_at)
     values (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     on conflict(id) do update set product_ids_json = excluded.product_ids_json, updated_at = CURRENT_TIMESTAMP`
  )
    .bind(actorId(c), c.get("actor").userId ?? null, c.get("actor").userId ? null : actorId(c), JSON.stringify(next))
    .run();
  return ok(c, next, 201);
});

userRoutes.delete("/compare/:productId", async (c) => {
  const row = await c.env.DB.prepare("select product_ids_json from product_comparisons where id = ?")
    .bind(actorId(c))
    .first<{ product_ids_json: string }>();
  const next = (row ? (JSON.parse(row.product_ids_json) as string[]) : []).filter((id) => id !== c.req.param("productId"));
  await c.env.DB.prepare("update product_comparisons set product_ids_json = ?, updated_at = CURRENT_TIMESTAMP where id = ?")
    .bind(JSON.stringify(next), actorId(c))
    .run();
  return ok(c, next);
});

userRoutes.get("/addresses", async (c) => {
  const rows = await c.env.DB.prepare("select payload_json from user_addresses where user_id = ? and deleted_at is null")
    .bind(actorId(c))
    .all<{ payload_json: string }>();
  return collection(c, rows.results.map((row) => JSON.parse(row.payload_json) as Record<string, unknown>), {
    page: 1,
    pageSize: rows.results.length,
    total: rows.results.length,
    pageCount: rows.results.length > 0 ? 1 : 0
  });
});

userRoutes.post("/addresses", zValidator("json", addressSchema), async (c) => {
  const id = crypto.randomUUID();
  const address = { id, ...c.req.valid("json") };
  await c.env.DB.prepare(
    `insert into user_addresses (id, user_id, label, full_name, country, payload_json, created_at, updated_at)
     values (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  )
    .bind(id, actorId(c), "Default", address.fullName, address.country, JSON.stringify(address))
    .run();
  return ok(c, address, 201);
});

userRoutes.patch("/addresses/:id", zValidator("json", addressSchema.partial()), async (c) => {
  await c.env.DB.prepare("update user_addresses set payload_json = json_patch(payload_json, ?), updated_at = CURRENT_TIMESTAMP where id = ? and user_id = ?")
    .bind(JSON.stringify(c.req.valid("json")), c.req.param("id"), actorId(c))
    .run();
  return ok(c, { id: c.req.param("id"), updated: true });
});

userRoutes.delete("/addresses/:id", async (c) => {
  await c.env.DB.prepare("update user_addresses set deleted_at = CURRENT_TIMESTAMP where id = ? and user_id = ?")
    .bind(c.req.param("id"), actorId(c))
    .run();
  return ok(c, { id: c.req.param("id"), deleted: true });
});

userRoutes.get("/orders", async (c) => {
  const rows = await c.env.DB.prepare("select payload_json from orders where user_id = ? order by created_at desc")
    .bind(actorId(c))
    .all<{ payload_json: string }>();
  return collection(c, rows.results.map((row) => JSON.parse(row.payload_json) as Record<string, unknown>), {
    page: 1,
    pageSize: rows.results.length,
    total: rows.results.length,
    pageCount: rows.results.length > 0 ? 1 : 0
  });
});

userRoutes.get("/orders/:id", async (c) => {
  const row = await c.env.DB.prepare("select payload_json from orders where id = ? and user_id = ?")
    .bind(c.req.param("id"), actorId(c))
    .first<{ payload_json: string }>();
  return row ? ok(c, JSON.parse(row.payload_json)) : fail(c, 404, "ORDER_NOT_FOUND", "Order not found.");
});

for (const action of ["cancel", "return", "refund-request"] as const) {
  userRoutes.post(`/orders/:id/${action}`, (c) => ok(c, { orderId: c.req.param("id"), action, status: "requested" }, 201));
}

userRoutes.post("/products/:id/reviews", zValidator("json", reviewSchema), async (c) => {
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    "insert into reviews (id, user_id, product_id, rating, title, body, status, created_at, updated_at) values (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
  )
    .bind(id, actorId(c), c.req.param("id"), c.req.valid("json").rating, c.req.valid("json").title, c.req.valid("json").body)
    .run();
  return ok(c, { id, status: "pending" }, 201);
});

userRoutes.patch("/reviews/:id", zValidator("json", reviewSchema.partial()), async (c) => {
  await c.env.DB.prepare("update reviews set title = coalesce(?, title), body = coalesce(?, body), updated_at = CURRENT_TIMESTAMP where id = ? and user_id = ?")
    .bind(c.req.valid("json").title ?? null, c.req.valid("json").body ?? null, c.req.param("id"), actorId(c))
    .run();
  return ok(c, { id: c.req.param("id"), updated: true });
});

userRoutes.delete("/reviews/:id", async (c) => {
  await c.env.DB.prepare("update reviews set status = 'hidden', updated_at = CURRENT_TIMESTAMP where id = ? and user_id = ?")
    .bind(c.req.param("id"), actorId(c))
    .run();
  return ok(c, { id: c.req.param("id"), deleted: true });
});

userRoutes.post("/contact-preview", zValidator("json", contactMessageSchema), (c) => ok(c, { accepted: true, message: c.req.valid("json") }));
