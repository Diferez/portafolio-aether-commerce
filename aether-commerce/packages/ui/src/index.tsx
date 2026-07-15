import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { formatUsd } from "@aether/core";
import { clsx } from "clsx";

export function Button({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { children: ReactNode }) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"a"> & { children: ReactNode }) {
  return (
    <a
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function Surface({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={clsx("rounded-lg border border-zinc-200 bg-white p-5", className)}>{children}</section>;
}

export function Price({
  cents,
  locale = "en-US",
  className
}: {
  cents: number;
  locale?: string;
  className?: string;
}) {
  return <span className={className}>{formatUsd(cents, locale)}</span>;
}
