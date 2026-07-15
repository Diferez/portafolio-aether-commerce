"use client";

import type { Product } from "@aether/schemas";
import { getCurrentCustomer, type CustomerSession } from "./customer-client";

const guestFavoritesKey = "aether.favoritesItems.guest";

function favoritesKey(customer: CustomerSession | null = getCurrentCustomer()) {
  return customer ? `aether.favoritesItems.${customer.id}` : guestFavoritesKey;
}

function readProductsFromKey(key: string): Product[] {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]") as Product[];
  } catch {
    return [];
  }
}

function writeProductsToKey(key: string, products: Product[]) {
  window.localStorage.setItem(key, JSON.stringify(products));
}

export function readFavoriteProducts() {
  return readProductsFromKey(favoritesKey());
}

export function isFavoriteProduct(productId: string) {
  return readFavoriteProducts().some((product) => product.id === productId);
}

export function toggleFavoriteProduct(product: Product) {
  const key = favoritesKey();
  const products = readProductsFromKey(key);
  const exists = products.some((candidate) => candidate.id === product.id);
  const nextProducts = exists ? products.filter((candidate) => candidate.id !== product.id) : [product, ...products];
  writeProductsToKey(key, nextProducts);
  window.dispatchEvent(new Event("aether-favorites-changed"));
  return exists ? "removed" : "added";
}

export function removeFavoriteProduct(productId: string) {
  const key = favoritesKey();
  writeProductsToKey(
    key,
    readProductsFromKey(key).filter((product) => product.id !== productId)
  );
  window.dispatchEvent(new Event("aether-favorites-changed"));
}

export function migrateGuestFavoritesToCustomer(customer: CustomerSession) {
  const guestProducts = readProductsFromKey(guestFavoritesKey);
  if (guestProducts.length === 0) return;

  const key = favoritesKey(customer);
  const customerProducts = readProductsFromKey(key);
  const merged = [
    ...customerProducts,
    ...guestProducts.filter((product) => !customerProducts.some((candidate) => candidate.id === product.id))
  ];

  writeProductsToKey(key, merged);
  writeProductsToKey(guestFavoritesKey, []);
  window.dispatchEvent(new Event("aether-favorites-changed"));
}
