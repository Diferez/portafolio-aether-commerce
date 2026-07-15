"use client";

import { calculateCartTotals } from "@aether/core";
import type { Cart, CartItem, Product } from "@aether/schemas";
import { apiBaseUrl } from "./config";

const cartIdKey = "aether.cartId";
const localCartKey = "aether.localCartItems";
const cartApiTimeoutMs = 1200;

async function fetchCartApi(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), cartApiTimeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getCartId() {
  const existing = window.localStorage.getItem(cartIdKey);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem(cartIdKey, next);
  return next;
}

function productToCartItem(product: Product): CartItem {
  const variant = product.variants[0];
  const finalUnitPrice = product.finalPrice + (variant?.priceDelta ?? 0);

  return {
    productId: product.id,
    variantId: variant?.id,
    quantity: 1,
    name: product.name,
    slug: product.slug,
    imageUrl: product.images[0]?.url ?? product.thumbnail,
    unitPrice: product.price,
    finalUnitPrice,
    lineTotal: finalUnitPrice,
    currency: "USD"
  };
}

function readLocalItems(): CartItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(localCartKey) || "[]") as CartItem[];
  } catch {
    return [];
  }
}

function writeLocalItems(items: CartItem[]) {
  window.localStorage.setItem(localCartKey, JSON.stringify(items));
}

export function readLocalCartItems() {
  return readLocalItems();
}

export function readLocalCart(cartId = getCartId()): Cart {
  const items = readLocalItems();
  return {
    id: cartId,
    items,
    totals: calculateCartTotals(items),
    updatedAt: new Date().toISOString()
  };
}

function saveLocalCartItem(product: Product) {
  const item = productToCartItem(product);
  const items = readLocalItems();
  const existing = items.find((candidate) => candidate.productId === item.productId && candidate.variantId === item.variantId);
  const nextItems = existing
    ? items.map((candidate) =>
        candidate.productId === item.productId && candidate.variantId === item.variantId
          ? {
              ...candidate,
              quantity: Math.min(25, candidate.quantity + 1),
              lineTotal: candidate.finalUnitPrice * Math.min(25, candidate.quantity + 1)
            }
          : candidate
      )
    : [...items, item];

  writeLocalItems(nextItems);
}

export function removeLocalCartItem(itemId: string) {
  writeLocalItems(
    readLocalItems().filter((item) => item.productId !== itemId && item.variantId !== itemId && item.slug !== itemId)
  );
}

export async function removeProductFromCart(itemId: string) {
  removeLocalCartItem(itemId);
  const id = getCartId();

  try {
    const response = await fetchCartApi(`${apiBaseUrl}/api/v1/cart/${id}/items/${encodeURIComponent(itemId)}`, {
      method: "DELETE"
    });
    const payload = (await response.json()) as { success?: boolean };
    if (!response.ok || !payload.success) {
      throw new Error("Cart API rejected remove.");
    }
    return "synced" as const;
  } catch {
    return "local" as const;
  }
}

export async function addProductToCart(product: Product) {
  const id = getCartId();
  const item = productToCartItem(product);
  saveLocalCartItem(product);

  try {
    const response = await fetchCartApi(`${apiBaseUrl}/api/v1/cart/${id}/items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: item.slug,
        variantId: item.variantId,
        quantity: 1
      })
    });
    const payload = (await response.json()) as { success?: boolean };
    if (!response.ok || !payload.success) {
      throw new Error("Cart API rejected item");
    }
    return "synced" as const;
  } catch {
    return "local" as const;
  }
}

export async function syncLocalCartToApi() {
  const id = getCartId();
  const items = readLocalItems();

  for (const item of items) {
    const response = await fetch(`${apiBaseUrl}/api/v1/cart/${id}/items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productId: item.slug,
        variantId: item.variantId,
        quantity: item.quantity
      })
    });
    const payload = (await response.json()) as { success?: boolean };
    if (!response.ok || !payload.success) {
      throw new Error("Could not sync local cart.");
    }
  }
}
