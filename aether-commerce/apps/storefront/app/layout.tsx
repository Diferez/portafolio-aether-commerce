import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { FloatingCart } from "../components/FloatingCart";
import { SiteHeader } from "../components/SiteHeader";
import { AssistantWidget } from "../components/AssistantWidget";

export const metadata: Metadata = {
  title: "Aether | Premium Commerce Demo",
  description: "A bilingual premium technology commerce demo powered by a Cloudflare Worker API.",
  metadataBase: new URL("https://aether-demo.example"),
  openGraph: {
    title: "Aether Premium Commerce Demo",
    description: "Premium technology shopping demo with static storefront and Worker API.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SiteHeader />
          {children}
          <AssistantWidget />
          <FloatingCart />
        </LanguageProvider>
      </body>
    </html>
  );
}
