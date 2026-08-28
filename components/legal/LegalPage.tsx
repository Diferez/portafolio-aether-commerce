import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import {
  legalContent,
  legalHref,
  legalUi,
  privacyVersion,
  type LegalDocumentKey,
} from "@/content/legal-content";
import { CookieNotice } from "./CookieNotice";

export function LegalPage({ locale, documentKey }: { locale: Locale; documentKey: LegalDocumentKey }) {
  const document = legalContent[locale][documentKey];
  const ui = legalUi[locale];
  const alternateLocale: Locale = locale === "es" ? "en" : "es";

  return (
    <div className="legal-shell">
      <header className="legal-header section-frame">
        <a className="brand" href={`/${locale}`} aria-label={siteConfig.brandName}>
          <span className="brand-mark" aria-hidden="true">DF</span>
          <span className="brand-copy">
            <strong>{siteConfig.brandName}</strong>
            <span>{ui.navigation}</span>
          </span>
        </a>
        <nav aria-label={ui.navigation}>
          <a href={legalHref(locale, "privacy")}>{ui.privacy}</a>
          <a href={legalHref(locale, "cookies")}>{ui.cookies}</a>
          <a href={legalHref(locale, "terms")}>{ui.terms}</a>
          <a href={legalHref(alternateLocale, documentKey)}>{ui.language}</a>
        </nav>
      </header>

      <main className="legal-main section-frame">
        <a className="legal-back" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" size={16} /> {ui.home}
        </a>
        <header className="legal-intro">
          <p className="eyebrow">Legal / {document.key}</p>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <time dateTime={privacyVersion}>
            {document.updatedLabel}: {document.updatedAt}
          </time>
        </header>

        <div className="legal-content">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items ? (
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>

      <footer className="legal-footer section-frame">
        <p>© {new Date().getFullYear()} {siteConfig.brandName}.</p>
        <a href={`/${locale}`}>
          {ui.home} <ArrowUpRight aria-hidden="true" size={14} />
        </a>
      </footer>
      <CookieNotice locale={locale} />
    </div>
  );
}
