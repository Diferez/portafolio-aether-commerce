"use client";

import { useEffect, useMemo, useState } from "react";
import { Glasses, Headphones, Laptop, Lamp, Smartphone, Sofa, Sparkles, Tablet, Timer, Watch } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiBaseUrl, storefrontPath } from "./config";
import { useLanguage } from "./LanguageProvider";

const categoryIcons: Record<string, LucideIcon> = {
  smartphones: Smartphone,
  laptops: Laptop,
  "mobile-accessories": Headphones,
  tablets: Tablet,
  "mens-watches": Watch,
  "womens-watches": Watch,
  sunglasses: Glasses,
  furniture: Sofa,
  "home-decoration": Lamp,
  "sports-accessories": Timer
};

export function CategoryGrid({ limit }: { limit?: number }) {
  const { t } = useLanguage();
  const cards = useMemo(() => (limit ? t.categoryCards.slice(0, limit) : t.categoryCards), [t, limit]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    void Promise.all(
      cards.map(([, , slug]) =>
        fetch(`${apiBaseUrl}/api/v1/catalog/products?category=${encodeURIComponent(slug)}&pageSize=1`)
          .then((response) => response.json())
          .then((payload: { pagination?: { total?: number } }) => [slug, payload.pagination?.total ?? 0] as const)
          .catch(() => [slug, 0] as const)
      )
    ).then((entries) => {
      if (!cancelled) setCounts(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [cards]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(([name, body, slug]) => {
        const Icon = categoryIcons[slug] ?? Sparkles;
        const count = counts[slug] ?? 0;
        return (
          <a
            key={slug}
            href={storefrontPath(`/categories/${slug}`)}
            className="group rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-accent hover:shadow-md"
          >
            <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
              <Icon size={20} aria-hidden />
            </span>
            <h3 className="mt-4 text-base font-semibold text-zinc-950 group-hover:text-accent">{name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{body}</p>
            {/* Reserves the count line's height up front - the 10 count
                fetches below resolve independently over time, and since
                these cards sit in a CSS grid, any card growing taller
                shifts the whole row (and everything below it) each time
                one more count pops in. */}
            <div className="mt-3 min-h-[1rem]">
              {count > 0 ? <p className="text-xs font-medium text-zinc-500">{t.productsCount.replace("{count}", String(count))}</p> : null}
            </div>
          </a>
        );
      })}
    </div>
  );
}
