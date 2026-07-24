"use client";

import { Check, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@aether/schemas";
import { formatUsd } from "@aether/core";
import { Badge, Skeleton } from "@aether/ui";
import { storefrontPath } from "./config";
import { useLanguage } from "./LanguageProvider";
import { getLocalizedProduct } from "./product-localization";

export function ProductCard({
  product,
  isFavorite,
  isAdding,
  isAdded,
  onToggleFavorite,
  onAddToCart
}: {
  product: Product;
  isFavorite: boolean;
  isAdding: boolean;
  isAdded: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  const { locale, t } = useLanguage();
  const localized = getLocalizedProduct(product, locale);
  const detailHref = storefrontPath(`/products/detail?slug=${encodeURIComponent(product.slug)}`);
  const outOfStock = product.availableStock <= 0;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition ${
        isAdded ? "border-accent ring-2 ring-accent-soft" : "border-zinc-200 hover:border-border-strong"
      }`}
    >
      <a href={detailHref} className="relative block aspect-square shrink-0 bg-zinc-50">
        <img
          src={product.thumbnail}
          alt={product.images[0]?.alt || product.name}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition group-hover:scale-[1.03]"
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=60";
          }}
        />
        {product.discountPercentage > 0 ? (
          <Badge tone="accent" className="absolute left-2 top-2">
            -{product.discountPercentage}%
          </Badge>
        ) : null}
        {outOfStock ? (
          <Badge tone="danger" className="absolute right-2 top-2">
            {t.availability.out_of_stock}
          </Badge>
        ) : product.availabilityStatus === "low_stock" ? (
          <Badge tone="warning" className="absolute right-2 top-2">
            {t.availability.low_stock}
          </Badge>
        ) : null}
      </a>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-accent">
          {product.brand && product.brand !== "Aether" ? product.brand : localized.category}
        </p>
        <a href={detailHref} className="line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-tight text-zinc-950 hover:text-accent">
          {product.name}
        </a>
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <Star size={13} className="fill-amber-400 text-amber-400" aria-hidden />
          <span>{product.rating.average.toFixed(1)}</span>
          <span className="text-zinc-500">({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-zinc-950">
              {formatUsd(product.finalPrice, locale === "es" ? "es-CO" : "en-US")}
            </p>
            {product.originalPrice ? (
              <p className="truncate text-xs text-zinc-500 line-through">
                {formatUsd(product.originalPrice, locale === "es" ? "es-CO" : "en-US")}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onToggleFavorite(product);
              }}
              className={`focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-md border transition hover:bg-zinc-100 ${
                isFavorite ? "border-rose-300 bg-rose-50 text-rose-700" : "border-zinc-300"
              }`}
              aria-label={locale === "es" ? `Guardar ${product.name}` : `Save ${product.name}`}
              aria-pressed={isFavorite}
            >
              <Heart size={17} fill={isFavorite ? "currentColor" : "none"} aria-hidden />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                if (!outOfStock) onAddToCart(product);
              }}
              disabled={isAdding || outOfStock}
              className={`focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-md text-white transition ${
                isAdded ? "scale-105 bg-emerald-600" : outOfStock ? "cursor-not-allowed bg-zinc-400" : isAdding ? "bg-accent-hover" : "bg-accent hover:bg-accent-hover"
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
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-16" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <Skeleton className="h-6 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
