import { notFound } from "next/navigation";
import { LandingPage } from "@/components/sections/LandingPage";
import { content } from "@/content/site-content";
import { isLocale, locales } from "@/i18n/config";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LandingPage content={content[locale]} />;
}
