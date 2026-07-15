"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@aether/schemas";
import { formatUsd } from "@aether/core";
import { apiBaseUrl, storefrontPath } from "../../../components/config";
import { addProductToCart } from "../../../components/cart-client";
import { demoProducts } from "../../../components/demo-products";
import { useLanguage } from "../../../components/LanguageProvider";
import { ProductGrid } from "../../../components/ProductGrid";
import { getLocalizedProduct } from "../../../components/product-localization";

function useSlug() {
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const syncSlug = () => setSlug(new URLSearchParams(window.location.search).get("slug") ?? "");
    syncSlug();
    const interval = window.setInterval(syncSlug, 150);
    window.addEventListener("popstate", syncSlug);
    window.addEventListener("pageshow", syncSlug);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("popstate", syncSlug);
      window.removeEventListener("pageshow", syncSlug);
    };
  }, []);

  return slug;
}

export default function ProductDetailByQueryPage() {
  const { locale, t } = useLanguage();
  const slug = useSlug();
  const fallback = useMemo(() => demoProducts.find((candidate) => candidate.slug === slug) ?? null, [slug]);
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"loading" | "demo" | "live" | "offline" | "not-found">("loading");
  const [isAdding, setIsAdding] = useState(false);
  const localized = product ? getLocalizedProduct(product, locale) : null;

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    setProduct(null);
    setStatus("loading");
    fetch(`${apiBaseUrl}/api/v1/products/slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload: { success: boolean; data?: Product }) => {
        if (controller.signal.aborted) return;
        if (payload.success && payload.data) {
          setProduct(payload.data);
          setStatus("live");
          return;
        }
        setProduct(fallback);
        setStatus(fallback ? "demo" : "not-found");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setProduct(fallback);
        setStatus(fallback ? "offline" : "not-found");
      });
    return () => controller.abort();
  }, [fallback, slug]);

  async function addToCart() {
    if (!product) return;
    setIsAdding(true);
    try {
      await addProductToCart(product);
      window.location.assign(storefrontPath("/cart"));
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <main className="aether-shell py-8">
      {status === "not-found" ? (
        <section className="mx-auto max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 text-center">
          <p className="text-sm font-semibold uppercase text-teal-700">
            {locale === "es" ? "Producto no disponible" : "Product unavailable"}
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-950">
            {locale === "es" ? "Este producto fue filtrado" : "This product was filtered"}
          </h1>
          <p className="mt-4 text-zinc-600">
            {locale === "es"
              ? "El catalogo descarta productos sin imagen confiable, nombre claro o datos utiles."
              : "The catalog excludes products without a trusted image, clear name, or useful product data."}
          </p>
          <a
            href={storefrontPath("/products")}
            className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white"
          >
            {t.browseProducts}
          </a>
        </section>
      ) : status === "loading" || !product || !localized ? (
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" aria-label={locale === "es" ? "Cargando producto" : "Loading product"}>
          <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-zinc-200" />
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="h-4 w-36 animate-pulse rounded bg-teal-100" />
            <div className="mt-4 h-11 w-4/5 animate-pulse rounded bg-zinc-200" />
            <div className="mt-6 grid gap-3">
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
            </div>
            <div className="mt-6 h-9 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="mt-6 h-11 w-36 animate-pulse rounded bg-zinc-950/20" />
          </div>
        </section>
      ) : (
        <section className="grid animate-[fadeIn_0.22s_ease-out] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <img src={product.thumbnail} alt={product.name} className="aspect-[4/3] w-full rounded-lg object-cover" />
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase text-teal-700">
              {status === "live" ? t.liveProductDetail : status === "offline" ? t.offlineProductDetail : t.demoProduct}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{product.name}</h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">{localized.description}</p>
            <p className="mt-5 text-3xl font-semibold text-zinc-950">{formatUsd(product.finalPrice, locale === "es" ? "es-CO" : "en-US")}</p>
            <dl className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between"><dt>SKU</dt><dd>{product.sku}</dd></div>
              <div className="flex justify-between"><dt>{t.category}</dt><dd>{localized.category}</dd></div>
              <div className="flex justify-between"><dt>{t.availabilityLabel}</dt><dd>{t.availability[product.inventory.status]}</dd></div>
            </dl>
            <button
              type="button"
              onClick={() => void addToCart()}
              disabled={isAdding}
              className="focus-ring mt-6 inline-flex min-h-11 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:cursor-wait disabled:bg-zinc-500"
            >
              {isAdding ? t.adding : t.addToCart}
            </button>
          </div>
        </section>
      )}
      <ProductGrid compact heading={t.relatedProducts} description={t.relatedDescription} />
    </main>
  );
}
