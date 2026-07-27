import type { Metadata } from "next";
import "./globals.css";
import { ClerkAuthProvider } from "../components/ClerkAuthProvider";
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

const themeInitScript = `
(function () {
  try {
    if (window.localStorage.getItem("aether.theme.v1") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ClerkAuthProvider>
          <LanguageProvider>
            <SiteHeader />
            {children}
            <AssistantWidget />
            <FloatingCart />
          </LanguageProvider>
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
