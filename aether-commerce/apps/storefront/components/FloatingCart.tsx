"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ShoppingCart, Trash2, X } from "lucide-react";
import { formatUsd } from "@aether/core";
import type { Cart } from "@aether/schemas";
import { readLocalCart, removeProductFromCart } from "./cart-client";
import { storefrontPath } from "./config";
import { useLanguage } from "./LanguageProvider";

export function FloatingCart() {
  const { locale, t } = useLanguage();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function syncCart() {
    const nextCart = readLocalCart();
    setCart(nextCart.items.length > 0 ? nextCart : null);
    if (nextCart.items.length === 0) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    syncCart();
    window.addEventListener("aether-cart-changed", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("aether-cart-changed", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const itemCount = useMemo(
    () => cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [cart]
  );

  async function removeItem(itemId: string) {
    await removeProductFromCart(itemId);
    syncCart();
  }

  if (!cart || itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div
          className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl"
          role="dialog"
          aria-label={locale === "es" ? "Carrito rapido" : "Quick cart"}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 bg-slate-950 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">{locale === "es" ? "Carrito rapido" : "Quick cart"}</p>
              <p className="text-xs text-slate-300">
                {itemCount} {itemCount === 1 ? t.product.toLowerCase() : locale === "es" ? "productos" : "products"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="focus-ring grid h-9 w-9 place-items-center rounded-md text-slate-200 hover:bg-white/10"
              aria-label={locale === "es" ? "Cerrar carrito" : "Close cart"}
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-3">
            {cart.items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? "default"}`} className="flex gap-3 border-b border-zinc-100 py-3 last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-950">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    {t.qty} {item.quantity} · {formatUsd(item.lineTotal, locale === "es" ? "es-CO" : "en-US")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeItem(item.slug)}
                  className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  aria-label={locale === "es" ? `Eliminar ${item.name}` : `Remove ${item.name}`}
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-600">{t.total}</span>
              <strong className="text-lg text-zinc-950">
                {formatUsd(cart.totals.total, locale === "es" ? "es-CO" : "en-US")}
              </strong>
            </div>
            <a
              href={storefrontPath("/cart")}
              className="focus-ring mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white"
            >
              {locale === "es" ? "Ver carrito" : "View cart"}
              <ChevronRight size={17} aria-hidden />
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="focus-ring group flex min-h-14 items-center gap-3 rounded-full bg-zinc-950 px-4 text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-zinc-900"
        aria-expanded={isOpen}
        aria-label={locale === "es" ? "Abrir carrito rapido" : "Open quick cart"}
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-teal-600">
          <ShoppingCart size={18} aria-hidden />
          <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-cyan-300 px-1 text-xs font-bold text-zinc-950">
            {itemCount}
          </span>
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs text-slate-300">{locale === "es" ? "Carrito" : "Cart"}</span>
          <span className="block text-sm font-semibold">
            {formatUsd(cart.totals.total, locale === "es" ? "es-CO" : "en-US")}
          </span>
        </span>
      </button>
    </div>
  );
}
