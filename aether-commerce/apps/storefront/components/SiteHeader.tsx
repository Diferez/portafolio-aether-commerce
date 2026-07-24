"use client";

import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingCart, Sparkles, UserRound, X } from "lucide-react";
import { Badge } from "@aether/ui";
import { portfolioUrl, storefrontPath } from "./config";
import { readLocalCartItems } from "./cart-client";
import { getCurrentCustomer, type CustomerSession } from "./customer-client";
import { readFavoriteProducts } from "./favorites-client";
import { useLanguage } from "./LanguageProvider";
import { migrateLegacyAetherStorage } from "./legacy-storage";

function useQueryParam(name: string) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const sync = () => setValue(new URLSearchParams(window.location.search).get(name) ?? "");
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [name]);
  return value;
}

export function SiteHeader() {
  const { locale, setLocale, t } = useLanguage();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [legacyNotice, setLegacyNotice] = useState(false);
  const initialQuery = useQueryParam("q");
  const [searchValue, setSearchValue] = useState(initialQuery);

  useEffect(() => {
    setSearchValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (migrateLegacyAetherStorage()) {
      setLegacyNotice(true);
    }
  }, []);

  useEffect(() => {
    const syncCustomer = () => setCustomer(getCurrentCustomer());
    syncCustomer();
    window.addEventListener("aether-customer-changed", syncCustomer);
    return () => window.removeEventListener("aether-customer-changed", syncCustomer);
  }, []);

  useEffect(() => {
    const syncCart = () => setCartCount(readLocalCartItems().reduce((sum, item) => sum + item.quantity, 0));
    const syncFavorites = () => setFavoriteCount(readFavoriteProducts().length);
    syncCart();
    syncFavorites();
    window.addEventListener("aether-cart-changed", syncCart);
    window.addEventListener("aether-favorites-changed", syncFavorites);
    window.addEventListener("aether-customer-changed", syncFavorites);
    return () => {
      window.removeEventListener("aether-cart-changed", syncCart);
      window.removeEventListener("aether-favorites-changed", syncFavorites);
      window.removeEventListener("aether-customer-changed", syncFavorites);
    };
  }, []);

  const accountHref = customer ? "/account" : "/login";
  const accountLabel = customer ? customer.name.split(" ")[0] : t.signIn;

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const target = new URL(storefrontPath("/search"), window.location.origin);
    if (searchValue.trim()) target.searchParams.set("q", searchValue.trim());
    window.location.assign(`${target.pathname}${target.search}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-slate-950/90 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      {legacyNotice ? (
        <div className="border-b border-accent/30 bg-accent-soft px-3 py-2 text-center text-xs text-slate-100">
          {t.legacyDataClearedNotice}
          <button type="button" onClick={() => setLegacyNotice(false)} aria-label="Dismiss" className="focus-ring ml-3 rounded px-1 text-slate-300 hover:text-white">
            <X size={13} className="inline" aria-hidden />
          </button>
        </div>
      ) : null}
      <div className="aether-shell flex min-h-16 items-center justify-between gap-3">
        <a className="flex shrink-0 items-center gap-3 font-semibold" href={storefrontPath("/")}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-white">
            <Sparkles size={18} aria-hidden />
          </span>
          <span className="hidden sm:block">
            <span className="block text-base leading-tight">{t.brand}</span>
            <span className="block text-xs font-normal text-slate-300">{t.tagline}</span>
          </span>
        </a>

        <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 max-w-lg lg:flex">
          <label className="focus-within:ring-3 flex min-h-11 w-full items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm">
            <Search size={16} aria-hidden className="shrink-0 text-slate-400" />
            <span className="sr-only">{t.searchProducts}</span>
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full min-w-0 border-0 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            />
          </label>
        </form>

        <nav className="hidden shrink-0 items-center gap-1 md:flex" aria-label="Primary">
          <a href={storefrontPath("/products")} className="focus-ring inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-slate-200 hover:bg-white/10">
            {t.shop}
          </a>
          <a href={storefrontPath("/categories")} className="focus-ring inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-slate-200 hover:bg-white/10">
            {t.categories}
          </a>
          <a
            href={storefrontPath("/account/favorites")}
            className="focus-ring relative inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-200 hover:bg-white/10"
            aria-label={t.favorites}
          >
            <Heart size={17} aria-hidden />
            {favoriteCount > 0 ? <Badge tone="accent">{favoriteCount}</Badge> : null}
          </a>
          <a
            href={storefrontPath("/cart")}
            className="focus-ring relative inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-200 hover:bg-white/10"
            aria-label={t.cart}
          >
            <ShoppingCart size={17} aria-hidden />
            {cartCount > 0 ? <Badge tone="accent">{cartCount}</Badge> : null}
          </a>
        </nav>

        <div className="hidden shrink-0 items-center rounded-md border border-slate-700 bg-slate-900 p-1 sm:flex" aria-label={locale === "es" ? "Idioma" : "Language"}>
          <LanguageButtons locale={locale} setLocale={setLocale} />
        </div>
        <a
          href={storefrontPath(accountHref)}
          className="focus-ring hidden min-h-10 items-center gap-2 rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10 lg:inline-flex"
        >
          <UserRound size={16} aria-hidden />
          {accountLabel}
        </a>
        {portfolioUrl ? (
          <a
            href={portfolioUrl}
            className="focus-ring hidden rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 sm:inline-flex"
          >
            {t.portfolio}
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => setSearchOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-700 text-slate-100 hover:bg-white/10 lg:hidden"
          aria-expanded={searchOpen}
          aria-label={t.searchProducts}
        >
          <Search size={19} aria-hidden />
        </button>
        <a
          href={storefrontPath("/cart")}
          className="focus-ring relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-700 text-slate-100 hover:bg-white/10 md:hidden"
          aria-label={t.cart}
        >
          <ShoppingCart size={19} aria-hidden />
          {cartCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          ) : null}
        </a>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-700 text-slate-100 hover:bg-white/10 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="aether-mobile-menu"
          aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={19} aria-hidden /> : <Menu size={19} aria-hidden />}
        </button>
      </div>

      {searchOpen ? (
        <div className="border-t border-slate-800 bg-slate-950 px-3 py-3 lg:hidden">
          <form onSubmit={submitSearch} className="aether-shell">
            <label className="focus-within:ring-3 flex min-h-11 w-full items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm">
              <Search size={16} aria-hidden className="shrink-0 text-slate-400" />
              <span className="sr-only">{t.searchProducts}</span>
              <input
                autoFocus
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full min-w-0 border-0 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
              />
            </label>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <div id="aether-mobile-menu" className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="aether-shell grid gap-3 py-4">
            <div className="flex w-fit items-center rounded-md border border-slate-700 bg-slate-900 p-1" aria-label={locale === "es" ? "Idioma" : "Language"}>
              <LanguageButtons locale={locale} setLocale={setLocale} />
            </div>
            <nav className="grid gap-2" aria-label="Mobile primary">
              <a
                href={storefrontPath("/products")}
                onClick={() => setMenuOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center gap-3 rounded-md border border-slate-800 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                {t.shop}
              </a>
              <a
                href={storefrontPath("/categories")}
                onClick={() => setMenuOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center gap-3 rounded-md border border-slate-800 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                {t.categories}
              </a>
              <a
                href={storefrontPath("/account/favorites")}
                onClick={() => setMenuOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center justify-between gap-3 rounded-md border border-slate-800 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <Heart size={17} aria-hidden />
                  {t.favorites}
                </span>
                {favoriteCount > 0 ? <Badge tone="accent">{favoriteCount}</Badge> : null}
              </a>
              <a
                href={storefrontPath("/cart")}
                onClick={() => setMenuOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center justify-between gap-3 rounded-md border border-slate-800 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart size={17} aria-hidden />
                  {t.cart}
                </span>
                {cartCount > 0 ? <Badge tone="accent">{cartCount}</Badge> : null}
              </a>
            </nav>
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={storefrontPath(accountHref)}
                onClick={() => setMenuOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-white"
              >
                <UserRound size={17} aria-hidden />
                {accountLabel}
              </a>
              {portfolioUrl ? (
                <a
                  href={portfolioUrl}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-slate-700 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  {t.portfolio}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function LanguageButtons({
  locale,
  setLocale
}: {
  locale: "en" | "es";
  setLocale: (locale: "en" | "es") => void;
}) {
  return (
    <>
      {(["en", "es"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-label={option === "en" ? "Switch to English" : "Cambiar a espanol"}
          className={`min-h-8 rounded px-2 text-xs font-semibold ${locale === option ? "bg-accent-2 text-zinc-950" : "text-zinc-300"}`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </>
  );
}
