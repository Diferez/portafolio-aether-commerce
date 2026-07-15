"use client";

import { useEffect, useState } from "react";
import { CreditCard, RotateCcw, Ticket, Trash2 } from "lucide-react";
import { formatUsd } from "@aether/core";
import type { Cart } from "@aether/schemas";
import { apiBaseUrl, storefrontPath } from "../../components/config";
import {
  getCartId,
  readLocalCart,
  readLocalCartItems,
  removeProductFromCart,
  syncLocalCartToApi
} from "../../components/cart-client";
import { getCurrentCustomer } from "../../components/customer-client";
import { useLanguage } from "../../components/LanguageProvider";

type CheckoutPayload = {
  success: boolean;
  data?: { checkoutUrl: string };
  error?: { code: string; message: string };
};

export default function CartPage() {
  const { locale, t } = useLanguage();
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<string>(t.loadingCart);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    const id = getCartId();
    const localCart = readLocalCart(id);
    const hasLocalItems = localCart.items.length > 0;

    if (hasLocalItems) {
      setCart(localCart);
      setStatus(t.cartSavedLocal);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/cart/${id}`);
      const payload = (await response.json()) as { success: boolean; data?: Cart };
      const nextCart = payload.data?.items.length ? payload.data : localCart.items.length ? localCart : payload.data;
      setCart(nextCart ?? null);
      setStatus(payload.data?.items.length ? t.cartSynced : localCart.items.length ? t.cartSavedLocal : t.cartUnavailable);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh().catch(() => {
      const localCart = readLocalCart();
      setCart(localCart);
      setStatus(localCart.items.length ? t.cartSavedLocal : t.startApiSyncCart);
      setIsLoading(false);
    });
  }, [t.cartSavedLocal, t.startApiSyncCart]);

  async function applyCoupon() {
    const id = getCartId();
    try {
      await fetch(`${apiBaseUrl}/api/v1/cart/${id}/coupon`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "AETHER10" })
      });
      await refresh();
    } catch {
      setStatus(t.startApiApplyCoupon);
    }
  }

  async function createCheckoutSession() {
    const id = getCartId();
    const response = await fetch(`${apiBaseUrl}/api/v1/checkout/session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cartId: id })
    });
    return (await response.json()) as CheckoutPayload;
  }

  async function checkout() {
    if (!getCurrentCustomer()) {
      window.location.href = storefrontPath("/register?next=/cart&checkout=1");
      return;
    }

    setStatus(t.preparingCheckout);

    try {
      let payload = await createCheckoutSession();

      if (!payload.success && payload.error?.code === "EMPTY_CART" && readLocalCartItems().length > 0) {
        setStatus(t.syncingCartCheckout);
        await syncLocalCartToApi();
        payload = await createCheckoutSession();
      }

      if (payload.success && payload.data?.checkoutUrl) {
        window.location.href = payload.data.checkoutUrl;
        return;
      }

      setStatus(payload.error?.message ?? t.addProductsBeforeCheckout);
    } catch {
      setStatus(t.startApiCheckout);
    }
  }

  async function removeItem(itemId: string, itemName: string) {
    const result = await removeProductFromCart(itemId);
    const localCart = readLocalCart();
    setCart(localCart);
    setStatus(`${itemName} ${result === "synced" ? t.removedFromCart : t.removedLocally}`);
  }

  return (
    <main className="aether-shell py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">{status}</p>
          <h1 className="mt-1 text-4xl font-semibold text-zinc-950">{t.cart}</h1>
        </div>
        <button
          onClick={() => void refresh()}
          disabled={isLoading}
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
        >
          <RotateCcw size={17} aria-hidden />
          {isLoading ? t.refreshing : t.refresh}
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-zinc-200 bg-white">
          {isLoading ? (
            <div className="grid gap-4 p-4" aria-label={t.loadingCart}>
              {[0, 1].map((item) => (
                <div key={item} className="flex animate-pulse gap-4">
                  <div className="h-20 w-20 rounded-md bg-zinc-200" />
                  <div className="min-w-0 flex-1 space-y-3 py-2">
                    <div className="h-4 w-2/3 rounded bg-zinc-200" />
                    <div className="h-3 w-24 rounded bg-zinc-200" />
                  </div>
                  <div className="h-4 w-16 rounded bg-zinc-200" />
                </div>
              ))}
            </div>
          ) : (cart?.items.length ?? 0) === 0 ? (
            <p className="p-5 text-zinc-600">{t.emptyCart}</p>
          ) : (
            cart?.items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 border-b border-zinc-200 p-4 last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-zinc-950">{item.name}</h2>
                  <p className="text-sm text-zinc-500">{t.qty} {item.quantity}</p>
                </div>
                <div className="grid justify-items-end gap-3">
                  <strong>{formatUsd(item.lineTotal, locale === "es" ? "es-CO" : "en-US")}</strong>
                  <button
                    type="button"
                    onClick={() => void removeItem(item.slug, item.name)}
                    className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                    aria-label={locale === "es" ? `Eliminar ${item.name} del carrito` : `Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} aria-hidden />
                    {t.remove}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
        <aside className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">{t.summary}</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between"><dt>{t.subtotal}</dt><dd>{formatUsd(cart?.totals.subtotal ?? 0, locale === "es" ? "es-CO" : "en-US")}</dd></div>
            <div className="flex justify-between"><dt>{t.discount}</dt><dd>{formatUsd(cart?.totals.discount ?? 0, locale === "es" ? "es-CO" : "en-US")}</dd></div>
            <div className="flex justify-between"><dt>{t.shipping}</dt><dd>{formatUsd(cart?.totals.shipping ?? 0, locale === "es" ? "es-CO" : "en-US")}</dd></div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold"><dt>{t.total}</dt><dd>{formatUsd(cart?.totals.total ?? 0, locale === "es" ? "es-CO" : "en-US")}</dd></div>
          </dl>
          <div className="mt-5 grid gap-3">
            <button onClick={() => void applyCoupon()} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 px-4 text-sm font-semibold">
              <Ticket size={17} aria-hidden />
              {t.applyCoupon}
            </button>
            <button onClick={() => void checkout()} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              <CreditCard size={17} aria-hidden />
              {t.checkoutSandbox}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
