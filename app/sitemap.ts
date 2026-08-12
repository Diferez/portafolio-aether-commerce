import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/config";
import { legalHref, legalPaths, type LegalDocumentKey } from "@/content/legal-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages: MetadataRoute.Sitemap = locales.map((locale) => ({
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

  const legalPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    (Object.keys(legalPaths[locale]) as LegalDocumentKey[]).map((key) => ({
      url: `${siteConfig.siteUrl}${legalHref(locale, key)}`,
      lastModified: new Date("2026-08-12"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: {
        languages: {
          es: `${siteConfig.siteUrl}${legalHref("es", key)}`,
          en: `${siteConfig.siteUrl}${legalHref("en", key)}`,
        },
      },
    })),
  );

  return [...landingPages, ...legalPages];
}
