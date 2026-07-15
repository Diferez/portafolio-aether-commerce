import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { productQuerySchema } from "@aether/schemas";
import { defaultShippingSettings } from "@aether/core";
import type { AppBindings } from "../types";
import { collection, fail, ok } from "../http";
import { getCatalogProducts, getCategories, getProductById, getProductBySlug } from "../services/catalog";

export const publicRoutes = new Hono<AppBindings>();

publicRoutes.get("/products", zValidator("query", productQuerySchema), async (c) => {
  const result = await getCatalogProducts(c.env, c.req.valid("query"));
  return collection(c, result.data, result.pagination);
});

publicRoutes.get("/products/:id", async (c) => {
  const product = await getProductById(c.env, c.req.param("id"));
  return product ? ok(c, product) : fail(c, 404, "PRODUCT_NOT_FOUND", "Product not found.");
});

publicRoutes.get("/products/slug/:slug", async (c) => {
  const product = await getProductBySlug(c.env, c.req.param("slug"));
  return product ? ok(c, product) : fail(c, 404, "PRODUCT_NOT_FOUND", "Product not found.");
});

publicRoutes.get("/categories", async (c) => ok(c, await getCategories(c.env)));

publicRoutes.get("/categories/:slug/products", async (c) => {
  const result = await getCatalogProducts(c.env, {
    page: Number(c.req.query("page") ?? 1),
    pageSize: Number(c.req.query("limit") ?? 12),
    category: c.req.param("slug"),
    sort: "featured"
  });
  return collection(c, result.data, result.pagination);
});

publicRoutes.get("/search", async (c) => {
  const result = await getCatalogProducts(c.env, {
    page: Number(c.req.query("page") ?? 1),
    pageSize: Number(c.req.query("limit") ?? 12),
    search: c.req.query("q") ?? c.req.query("search") ?? "",
    sort: "featured"
  });
  return collection(c, result.data, result.pagination);
});

publicRoutes.get("/featured-products", async (c) => {
  const result = await getCatalogProducts(c.env, { page: 1, pageSize: 12, featured: true, sort: "featured" });
  return collection(c, result.data, result.pagination);
});

publicRoutes.get("/deals", async (c) => {
  const result = await getCatalogProducts(c.env, { page: 1, pageSize: 12, deal: true, sort: "discount" });
  return collection(c, result.data, result.pagination);
});

publicRoutes.get("/new-arrivals", async (c) => {
  const result = await getCatalogProducts(c.env, { page: 1, pageSize: 12, newArrival: true, sort: "newest" });
  return collection(c, result.data, result.pagination);
});

publicRoutes.get("/products/:id/reviews", async (c) => {
  const rows = await c.env.DB.prepare(
    "select id, rating, title, body, status, created_at from reviews where product_id = ? and status = 'approved' order by created_at desc"
  )
    .bind(c.req.param("id"))
    .all<Record<string, unknown>>();
  return collection(c, rows.results, {
    page: 1,
    pageSize: rows.results.length,
    total: rows.results.length,
    pageCount: rows.results.length > 0 ? 1 : 0
  });
});

publicRoutes.get("/shipping/options", async (c) => {
  const row = await c.env.DB.prepare("select value_json from application_settings where key = 'shipping'").first<{
    value_json: string;
  }>();
  return ok(c, row ? JSON.parse(row.value_json) : defaultShippingSettings);
});
