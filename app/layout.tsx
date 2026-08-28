import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Diego Fernando Martinez",
    template: "%s | Diego Fernando Martinez",
  },
  description:
    "Backend-focused full-stack engineering for fintech, payments, cloud products, and applied AI.",
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    images: [
      {
        url: new URL("/og.png", siteConfig.siteUrl),
        width: 1734,
        height: 907,
        alt: "Diego Fernando Martínez — Sistemas reales, de la arquitectura a producción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [new URL("/og.png", siteConfig.siteUrl)],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
