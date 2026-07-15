import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { productQuerySchema } from "@aether/schemas";
import type { AppBindings } from "../types";
import { collection, fail, ok } from "../http";
import { getCatalogProducts, getCategories, getProductBySlug } from "../services/catalog";

export const catalogRoutes = new Hono<AppBindings>();

catalogRoutes.get("/products", zValidator("query", productQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const result = await getCatalogProducts(c.env, query);
  return collection(c, result.data, result.pagination);
});

catalogRoutes.get("/products/:slug", async (c) => {
  const product = await getProductBySlug(c.env, c.req.param("slug"));
  if (!product) {
    return fail(c, 404, "PRODUCT_NOT_FOUND", "Product not found.");
  }
  return ok(c, product);
});

catalogRoutes.get("/categories", async (c) => ok(c, await getCategories(c.env)));
