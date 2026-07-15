import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteConfig.siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "es" ? 1 : 0.9,
    alternates: {
      languages: {
        es: `${siteConfig.siteUrl}/es`,
        en: `${siteConfig.siteUrl}/en`,
      },
    },
  }));
}
