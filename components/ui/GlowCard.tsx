"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
};

type GlowStyle = CSSProperties & {
  "--glow-x"?: string;
  "--glow-y"?: string;
};

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const [style, setStyle] = useState<GlowStyle>({
    "--glow-x": "50%",
    "--glow-y": "0%",
  });

  return (
    <article
      className={`glow-card ${className}`}
      style={style}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        setStyle({ "--glow-x": `${x}%`, "--glow-y": `${y}%` });
      }}
    >
      {children}
    </article>
  );
}
