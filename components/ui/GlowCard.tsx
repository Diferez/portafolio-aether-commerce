"use client";

import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <article className={`glow-card ${className}`}>
      {children}
    </article>
  );
}
