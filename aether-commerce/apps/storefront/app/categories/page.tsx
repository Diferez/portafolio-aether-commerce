"use client";

import { Laptop, Sofa, Shirt, Sparkles } from "lucide-react";
import { storefrontPath } from "../../components/config";
import { useLanguage } from "../../components/LanguageProvider";

const categoryIcons = [Laptop, Sofa, Sparkles, Shirt];

export default function CategoriesPage() {
  const { t } = useLanguage();
  return (
    <main className="aether-shell py-8">
      <p className="text-sm font-semibold uppercase text-teal-700">{t.categories}</p>
      <h1 className="mt-2 text-4xl font-semibold">{t.shopByCategory}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {t.categoryCards.map(([name, body, slug], index) => {
          const Icon = categoryIcons[index] ?? Shirt;
          return (
          <a key={slug} href={storefrontPath(`/categories/${slug}`)} className="rounded-lg border border-zinc-200 bg-white p-5 hover:border-teal-700">
            <Icon aria-hidden className="text-teal-700" />
            <h2 className="mt-4 text-xl font-semibold">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
          </a>
        );})}
      </div>
    </main>
  );
}
