"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Product } from "@aether/schemas";
import { apiBaseUrl, storefrontPath } from "./config";
import { useLanguage } from "./LanguageProvider";

export function Hero() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/v1/catalog/products?featured=true&pageSize=4&sort=rating`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload: { success: boolean; data?: Product[] }) => {
        if (payload.success && payload.data) setProducts(payload.data);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <section className="border-b border-zinc-200/60 py-12 sm:py-16">
      <div className="aether-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{t.heroEyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">{t.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">{t.heroDescription}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={storefrontPath("/products")}
              className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              {t.heroCtaPrimary}
              <ArrowRight size={16} aria-hidden />
            </a>
            <a
              href={storefrontPath("/products")}
              className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              <MessageCircle size={16} aria-hidden />
              {t.heroCtaSecondary}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(products.length > 0 ? products : Array.from<Product | undefined>({ length: 4 })).slice(0, 4).map((product, index) => (
            <a
              key={product?.id ?? index}
              href={product ? storefrontPath(`/products/detail?slug=${encodeURIComponent(product.slug)}`) : undefined}
              className={`relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 ${
                index === 0 ? "col-span-2 aspect-[2/1]" : ""
              }`}
            >
              {product ? (
                <img src={product.thumbnail} alt={product.name} loading="lazy" className="h-full w-full object-contain p-3" />
              ) : (
                <div className="skeleton h-full w-full" />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
