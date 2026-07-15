"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { formatUsd } from "@aether/core";
import type { Product } from "@aether/schemas";
import { storefrontPath } from "../../../components/config";
import { getCurrentCustomer, type CustomerSession } from "../../../components/customer-client";
import { readFavoriteProducts, removeFavoriteProduct } from "../../../components/favorites-client";
import { useLanguage } from "../../../components/LanguageProvider";
import { getLocalizedProduct } from "../../../components/product-localization";

export default function FavoritesPage() {
  const { locale, t } = useLanguage();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [favorites, setFavorites] = useState<Product[]>([]);

  function syncFavorites() {
    setCustomer(getCurrentCustomer());
    setFavorites(readFavoriteProducts());
  }

  useEffect(() => {
    syncFavorites();
    window.addEventListener("aether-favorites-changed", syncFavorites);
    window.addEventListener("aether-customer-changed", syncFavorites);
    return () => {
      window.removeEventListener("aether-favorites-changed", syncFavorites);
      window.removeEventListener("aether-customer-changed", syncFavorites);
    };
  }, []);

  function remove(productId: string) {
    removeFavoriteProduct(productId);
    syncFavorites();
  }

  return (
    <main className="aether-shell py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
            <Heart size={17} aria-hidden />
            {t.favorites}
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{t.savedProducts}</h1>
          <p className="mt-2 text-zinc-600">
            {customer ? t.savedFor.replace("{name}", customer.name) : t.favoritesSignInHint}
          </p>
        </div>
        {!customer ? (
          <a href={storefrontPath("/login")} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            {t.signIn}
          </a>
        ) : null}
      </div>

      {favorites.length === 0 ? (
        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="text-zinc-600">{t.noFavorites}</p>
          <a href={storefrontPath("/products")} className="focus-ring mt-5 inline-flex min-h-11 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            {t.browseProducts}
          </a>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product) => {
            const localized = getLocalizedProduct(product, locale);
            return (
            <article key={product.id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <a href={storefrontPath(`/products/detail?slug=${encodeURIComponent(product.slug)}`)} className="block">
                <img src={product.images[0]?.url ?? product.thumbnail} alt={product.name} className="aspect-[4/3] w-full object-cover" />
              </a>
              <div className="grid gap-3 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-amber-700">{localized.category}</p>
                  <a href={storefrontPath(`/products/detail?slug=${encodeURIComponent(product.slug)}`)} className="mt-1 block text-lg font-semibold text-zinc-950 hover:text-cyan-300">
                    {product.name}
                  </a>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-zinc-600">{localized.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <strong>{formatUsd(product.finalPrice, locale === "es" ? "es-CO" : "en-US")}</strong>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-zinc-300 hover:bg-zinc-100"
                    aria-label={t.removeFavorite.replace("{name}", product.name)}
                  >
                    <Trash2 size={17} aria-hidden />
                  </button>
                </div>
              </div>
            </article>
          );})}
        </section>
      )}
    </main>
  );
}
