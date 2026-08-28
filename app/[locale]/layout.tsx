import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { content } from "@/content/site-content";
import { isLocale, locales, type Locale } from "@/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dictionary = content[locale];
  const alternateLocale = locale === "es" ? "en" : "es";
  const localizedPath = `/${locale}`;
  const socialImage = new URL("/og.png", siteConfig.siteUrl);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    keywords: [...dictionary.metadata.keywords],
    alternates: {
      canonical: localizedPath,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": `/${alternateLocale}`,
      },
    },
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      url: `${siteConfig.siteUrl}${localizedPath}`,
      siteName: siteConfig.brandName,
      locale: locale === "es" ? "es_CO" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_CO"],
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1734,
          height: 907,
          alt: "Diego Fernando Martínez — Sistemas reales, de la arquitectura a producción",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      images: [socialImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return children;
}
