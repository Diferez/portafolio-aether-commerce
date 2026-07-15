"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { storefrontPath } from "../../components/config";
import { loginCustomer } from "../../components/customer-client";
import { migrateGuestFavoritesToCustomer } from "../../components/favorites-client";
import { useLanguage } from "../../components/LanguageProvider";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function nextPath() {
    const next = new URLSearchParams(window.location.search).get("next");
    return next?.startsWith("/") ? next : "/account";
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const customer = loginCustomer({ email, password });
      migrateGuestFavoritesToCustomer(customer);
      window.location.href = storefrontPath(nextPath());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.couldNotSignIn);
    }
  }

  return (
    <main className="aether-shell py-8">
      <section className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-6">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
          <LogIn size={17} aria-hidden />
          {t.customerAccess}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{t.signIn}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {t.loginDescription}
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            {t.email}
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
              className="min-h-11 rounded-md border border-zinc-300 px-3 text-zinc-950 outline-none focus:border-teal-700"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            {t.password}
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
              className="min-h-11 rounded-md border border-zinc-300 px-3 text-zinc-950 outline-none focus:border-teal-700"
            />
          </label>
          {error ? <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <button type="submit" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            {t.signIn}
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-600">
          {t.newCustomer}{" "}
          <a href={storefrontPath(`/register${typeof window !== "undefined" ? window.location.search : ""}`)} className="font-semibold text-teal-700 hover:text-teal-900">
            {t.createAccount}
          </a>
        </p>
      </section>
    </main>
  );
}
