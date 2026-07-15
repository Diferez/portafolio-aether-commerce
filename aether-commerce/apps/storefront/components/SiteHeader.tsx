 "use client";

import { useEffect, useState } from "react";
import { BadgeDollarSign, Box, FileCode2, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { portfolioUrl, storefrontPath } from "./config";
import { getCurrentCustomer, type CustomerSession } from "./customer-client";
import { useLanguage } from "./LanguageProvider";

type NavLabelKey = "shop" | "cart" | "account" | "architecture";

const nav: Array<{ href: string; labelKey: NavLabelKey; icon: LucideIcon }> = [
  { href: "/products", labelKey: "shop", icon: Box },
  { href: "/cart", labelKey: "cart", icon: ShoppingCart },
  { href: "/account", labelKey: "account", icon: UserRound },
  { href: "/architecture", labelKey: "architecture", icon: FileCode2 }
];

export function SiteHeader() {
  const { locale, setLocale, t } = useLanguage();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncCustomer = () => setCustomer(getCurrentCustomer());
    syncCustomer();
    window.addEventListener("aether-customer-changed", syncCustomer);
    return () => window.removeEventListener("aether-customer-changed", syncCustomer);
  }, []);

  const accountHref = customer ? "/account" : "/login";
  const accountLabel = customer ? customer.name.split(" ")[0] : t.signIn;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-slate-950/90 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="aether-shell flex min-h-16 items-center justify-between gap-4">
        <a className="flex items-center gap-3 font-semibold" href={storefrontPath("/")}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-700 text-white">
            <BadgeDollarSign size={19} aria-hidden />
          </span>
          <span>
            <span className="block text-base leading-tight">Aether</span>
            <span className="block text-xs font-normal text-slate-300">{t.tagline}</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={storefrontPath(item.href)}
              className="focus-ring inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              <item.icon size={16} aria-hidden />
              {t[item.labelKey]}
            </a>
          ))}
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
          onClick={() => setMenuOpen((value) => !value)}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 text-slate-100 hover:bg-white/10 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="aether-mobile-menu"
          aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={19} aria-hidden /> : <Menu size={19} aria-hidden />}
        </button>
      </div>
      {menuOpen ? (
        <div id="aether-mobile-menu" className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="aether-shell grid gap-3 py-4">
            <div className="flex w-fit items-center rounded-md border border-slate-700 bg-slate-900 p-1" aria-label={locale === "es" ? "Idioma" : "Language"}>
              <LanguageButtons locale={locale} setLocale={setLocale} />
            </div>
            <nav className="grid gap-2" aria-label="Mobile primary">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={storefrontPath(item.href)}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring inline-flex min-h-11 items-center gap-3 rounded-md border border-slate-800 px-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
                >
                  <item.icon size={17} aria-hidden />
                  {t[item.labelKey]}
                </a>
              ))}
            </nav>
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={storefrontPath(accountHref)}
                onClick={() => setMenuOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-400 px-3 text-sm font-semibold text-zinc-950"
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
          className={`min-h-8 rounded px-2 text-xs font-semibold ${locale === option ? "bg-cyan-400 text-zinc-950" : "text-zinc-300"}`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </>
  );
}
