"use client";

import { ContactForm } from "../components/ContactForm";
import { ProductGrid } from "../components/ProductGrid";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main>
      <ProductGrid />
      <section className="border-y border-zinc-200 bg-white py-8">
        <div className="aether-shell grid gap-4 md:grid-cols-3">
          {t.homeHighlights.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-zinc-200 p-4">
              <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <ContactForm />
    </main>
  );
}
