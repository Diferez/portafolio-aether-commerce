"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Heart, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import type { Product } from "@aether/schemas";
import { formatUsd } from "@aether/core";
import { apiBaseUrl, storefrontPath } from "./config";
import { addProductToCart } from "./cart-client";
import { demoProducts } from "./demo-products";
import { readFavoriteProducts, toggleFavoriteProduct } from "./favorites-client";
import { useLanguage } from "./LanguageProvider";
import { getLocalizedProduct } from "./product-localization";

type ApiPagination = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

type ApiProducts = {
  success: true;
  data: Product[];
  pagination?: ApiPagination;
};

type CatalogStatus = "demo" | "live" | "offline";

const filterOptions: Array<{ value: "featured" | "deal" | "new" | ""; labelKey: "all" | "featured" | "deals" | "new" }> = [
  { value: "", labelKey: "all" },
  { value: "featured", labelKey: "featured" },
  { value: "deal", labelKey: "deals" },
  { value: "new", labelKey: "new" }
];

const catalogApiTimeoutMs = 12000;

export function ProductGrid({
  compact = false,
  initialFlag = "",
  heading,
  eyebrow,
  description
}: {
  compact?: boolean;
  initialFlag?: "featured" | "deal" | "new" | "";
  heading?: string;
  eyebrow?: string;
  description?: string;
}) {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [query, setQuery] = useState("");
  const [flag, setFlag] = useState<"featured" | "deal" | "new" | "">(initialFlag);
  const [status, setStatus] = useState<CatalogStatus>("demo");
  const [statusMessage, setStatusMessage] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [addingIds, setAddingIds] = useState<string[]>([]);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination>({
    page: 1,
    pageSize: 6,
    total: demoProducts.length,
    pageCount: 1
  });
  const { locale, t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), catalogApiTimeoutMs);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "6",
      sort: flag === "new" ? "newest" : flag === "deal" ? "discount" : "featured"
    });
    if (query.trim()) params.set("search", query.trim());
    if (flag) params.set("flag", flag);

    fetch(`${apiBaseUrl}/api/v1/catalog/products?${params.toString()}`, {
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((payload: ApiProducts) => {
        if (payload.success) {
          setProducts(payload.data);
          setPagination(
            payload.pagination ?? {
              page,
              pageSize: 6,
              total: payload.data.length,
              pageCount: 1
            }
          );
          setStatus("live");
          setStatusMessage("");
        }
      })
      .catch(() => {
        setStatus("offline");
        setStatusMessage("");
      });
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [compact, flag, page, query]);

  useEffect(() => {
    setPage(1);
  }, [compact, flag, query]);

  useEffect(() => {
    const syncFavorites = () => setFavoriteIds(readFavoriteProducts().map((product) => product.id));
    syncFavorites();
    window.addEventListener("aether-favorites-changed", syncFavorites);
    window.addEventListener("aether-customer-changed", syncFavorites);
    return () => {
      window.removeEventListener("aether-favorites-changed", syncFavorites);
      window.removeEventListener("aether-customer-changed", syncFavorites);
    };
  }, []);

  const filtered = useMemo(() => products, [products]);

  async function addToCart(product: Product) {
    if (addingIds.includes(product.id)) {
      return;
    }

    setAddingIds((current) => [...current, product.id]);
    try {
      const result = await addProductToCart(product);
      setAddedProduct(product);
      setStatusMessage(
        locale === "es"
          ? result === "synced"
            ? `${product.name} agregado al carrito`
            : `${product.name} guardado localmente`
          : result === "synced"
            ? `${product.name} added to cart`
            : `${product.name} saved locally`
      );
      window.setTimeout(() => setAddedProduct((current) => (current?.id === product.id ? null : current)), 3200);
    } finally {
      setAddingIds((current) => current.filter((id) => id !== product.id));
    }
  }

  function goToPage(nextPage: number) {
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      document.getElementById("catalog-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleFavorite(product: Product) {
    const result = toggleFavoriteProduct(product);
    setFavoriteIds(readFavoriteProducts().map((candidate) => candidate.id));
    setStatusMessage(
      locale === "es"
        ? result === "added"
          ? `${product.name} guardado en favoritos`
          : `${product.name} eliminado de favoritos`
        : result === "added"
          ? `${product.name} saved to favorites`
          : `${product.name} removed from favorites`
    );
  }

  return (
    <section className="aether-shell py-8" aria-labelledby="catalog-heading">
      <div className="mb-5">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">
            {eyebrow ??
              (statusMessage ||
                (status === "live" ? t.liveCatalog : status === "offline" ? t.offlineCatalog : t.demoReady))}
          </p>
          <h1 id="catalog-heading" className="mt-1 text-3xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
            {heading ?? t.premiumCatalog}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            {description ?? t.catalogDescription}
          </p>
        </div>
        <div className="mt-5 grid gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-center">
          <label className="focus-within:ring-3 flex min-h-11 items-center gap-2 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-sm">
            <Search size={17} aria-hidden />
            <span className="sr-only">{t.searchProducts}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full min-w-0 border-0 bg-transparent text-zinc-950 outline-none placeholder:text-zinc-500"
              placeholder={t.searchPlaceholder}
            />
          </label>
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-1 text-sm text-slate-100 lg:justify-end">
            <span className="grid h-9 w-9 shrink-0 place-items-center text-slate-300">
              <SlidersHorizontal size={17} aria-hidden />
            </span>
            <span className="sr-only">{t.filterCatalog}</span>
            {filterOptions.map((option) => {
              const label =
                option.labelKey === "all" ? t.all : option.labelKey === "new" ? t.new : t[option.labelKey];
              const active = flag === option.value;
              return (
                <button
                  key={option.value || "all"}
                  type="button"
                  onClick={() => setFlag(option.value)}
                  className={`focus-ring min-h-9 shrink-0 rounded px-3 text-xs font-semibold ${
                    active ? "bg-cyan-400 text-zinc-950" : "text-slate-200 hover:bg-white/10"
                  }`}
                  aria-pressed={active}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => {
          const localized = getLocalizedProduct(product, locale);
          const isAdding = addingIds.includes(product.id);
          const isAdded = addedProduct?.id === product.id;

          return (
            <article
              key={product.id}
              className={`overflow-hidden rounded-lg border bg-white shadow-sm transition ${
                isAdded ? "border-teal-400 ring-2 ring-teal-100" : "border-zinc-200"
              }`}
            >
              <a href={storefrontPath(`/products/detail?slug=${encodeURIComponent(product.slug)}`)} className="block">
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt || product.name}
                  className="aspect-[4/3] w-full bg-zinc-100 object-cover"
                />
              </a>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-amber-700">{localized.category}</p>
                    <a href={storefrontPath(`/products/detail?slug=${encodeURIComponent(product.slug)}`)} className="mt-1 block text-lg font-semibold text-zinc-950 hover:text-cyan-300">
                      {product.name}
                    </a>
                  </div>
                  <span className="rounded-md bg-teal-50 px-2 py-1 text-sm font-semibold text-teal-800">
                    {formatUsd(product.finalPrice, locale === "es" ? "es-CO" : "en-US")}
                  </span>
                </div>
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-zinc-600">{localized.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-500">
                    {product.rating.average} {t.stars} | {t.availability[product.inventory.status]}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product)}
                      className={`focus-ring grid h-10 w-10 place-items-center rounded-md border hover:bg-zinc-100 ${
                        favoriteIds.includes(product.id) ? "border-rose-300 bg-rose-50 text-rose-700" : "border-zinc-300"
                      }`}
                      aria-label={locale === "es" ? `Guardar ${product.name}` : `Save ${product.name}`}
                      aria-pressed={favoriteIds.includes(product.id)}
                    >
                      <Heart size={17} fill={favoriteIds.includes(product.id) ? "currentColor" : "none"} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => void addToCart(product)}
                      disabled={isAdding}
                      className={`focus-ring grid h-10 w-10 place-items-center rounded-md text-white transition ${
                        isAdded
                          ? "scale-105 bg-teal-700"
                          : isAdding
                            ? "bg-zinc-700"
                            : "bg-zinc-950 hover:bg-zinc-800"
                      }`}
                      aria-label={locale === "es" ? `Agregar ${product.name} al carrito` : `Add ${product.name} to cart`}
                      aria-busy={isAdding}
                    >
                      {isAdded ? (
                        <Check size={18} className="animate-[bounce_0.7s_ease-in-out_1]" aria-hidden />
                      ) : (
                        <ShoppingBag size={17} className={isAdding ? "animate-pulse" : ""} aria-hidden />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {addedProduct ? (
        <div
          className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-teal-200 bg-white p-4 shadow-xl"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
              <Check size={18} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-950">
                {locale === "es" ? "Agregado al carrito" : "Added to cart"}
              </p>
              <p className="truncate text-sm text-zinc-600">{addedProduct.name}</p>
            </div>
            <a
              href={storefrontPath("/cart")}
              className="focus-ring shrink-0 rounded-md bg-zinc-950 px-3 py-2 text-sm font-semibold text-white"
            >
              {t.cart}
            </a>
          </div>
        </div>
      ) : null}
      <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          {locale === "es"
            ? t.pageOf
                .replace("{page}", String(pagination.page))
                .replace("{pageCount}", String(Math.max(1, pagination.pageCount)))
            : t.pageOf
                .replace("{page}", String(pagination.page))
                .replace("{pageCount}", String(Math.max(1, pagination.pageCount)))}
        </p>
        <div className="flex gap-3">
          {pagination.page > 1 ? (
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, page - 1))}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-950 bg-white px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              {t.previousPage}
            </button>
          ) : null}
          {pagination.page < pagination.pageCount ? (
            <button
              type="button"
              onClick={() => goToPage(Math.min(Math.max(1, pagination.pageCount), page + 1))}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              {t.nextPage}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
