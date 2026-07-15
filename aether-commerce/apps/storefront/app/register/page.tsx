"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { storefrontPath } from "../../components/config";
import { registerCustomer } from "../../components/customer-client";
import { migrateGuestFavoritesToCustomer } from "../../components/favorites-client";
import { useLanguage } from "../../components/LanguageProvider";

export default function RegisterPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
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
      const customer = registerCustomer({ name, email, password });
      migrateGuestFavoritesToCustomer(customer);
      window.location.href = storefrontPath(nextPath());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.couldNotCreateAccount);
    }
  }

  return (
    <main className="aether-shell py-8">
      <section className="mx-auto max-w-xl rounded-lg border border-zinc-200 bg-white p-6">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
          <UserPlus size={17} aria-hidden />
          {t.customerRegistration}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{t.createAccount}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {t.registerDescription}
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            {t.fullName}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              className="min-h-11 rounded-md border border-zinc-300 px-3 text-zinc-950 outline-none focus:border-teal-700"
            />
          </label>
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
              autoComplete="new-password"
              minLength={6}
              required
              className="min-h-11 rounded-md border border-zinc-300 px-3 text-zinc-950 outline-none focus:border-teal-700"
            />
          </label>
          {error ? <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <button type="submit" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            {t.createCustomerAccount}
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-600">
          {t.alreadyRegistered}{" "}
          <a href={storefrontPath(`/login${typeof window !== "undefined" ? window.location.search : ""}`)} className="font-semibold text-teal-700 hover:text-teal-900">
            {t.signIn}
          </a>
        </p>
      </section>
    </main>
  );
}
