import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import {
  legalContent,
  legalHref,
  legalKeyFromSlug,
  legalPaths,
  type LegalDocumentKey,
} from "@/content/legal-content";
import { isLocale, locales, type Locale } from "@/i18n/config";

type LegalPageProps = {
  params: Promise<{ locale: string; document: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    (Object.keys(legalPaths[locale]) as LegalDocumentKey[]).map((key) => ({
      locale,
      document: legalPaths[locale][key],
    })),
  );
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { locale: rawLocale, document: slug } = await params;
  if (!isLocale(rawLocale)) return {};

  const locale = rawLocale as Locale;
  const key = legalKeyFromSlug(locale, slug);
  if (!key) return {};

  const document = legalContent[locale][key];
  const socialImage = new URL("/og.png", siteConfig.siteUrl);
  return {
    title: document.title,
    description: document.description,
    alternates: {
      canonical: legalHref(locale, key),
      languages: {
        es: legalHref("es", key),
        en: legalHref("en", key),
        "x-default": legalHref("es", key),
      },
    },
    openGraph: {
      title: document.title,
      description: document.description,
      url: `${siteConfig.siteUrl}${legalHref(locale, key)}`,
      siteName: siteConfig.brandName,
      locale: locale === "es" ? "es_CO" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_CO"],
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: document.title,
      description: document.description,
      images: [socialImage],
    },
  };
}

export default async function LegalDocumentPage({ params }: LegalPageProps) {
  const { locale: rawLocale, document: slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const key = legalKeyFromSlug(locale, slug);
  if (!key) notFound();

  return <LegalPage locale={locale} documentKey={key} />;
}
