"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Globe2,
  Menu,
  MessageSquareText,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { localeCookieName, type Locale } from "@/i18n/config";
import type { LandingContent, ProjectItem } from "@/types/content";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";
import { CookieNotice } from "@/components/legal/CookieNotice";
import { legalHref } from "@/content/legal-content";

type LandingPageProps = {
  content: LandingContent;
};

function sectionIds(locale: Locale) {
  return locale === "es"
    ? {
        home: "inicio",
        projects: "proyectos",
        capabilities: "capacidades",
        approach: "enfoque",
        contact: "contacto",
      }
    : {
        home: "home",
        projects: "projects",
        capabilities: "capabilities",
        approach: "approach",
        contact: "contact",
      };
}

export function LandingPage({ content }: LandingPageProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = content.locale;
  const ids = sectionIds(locale);
  const alternateLocale = locale === "es" ? "en" : "es";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.brandName,
      url: `${siteConfig.siteUrl}/${locale}`,
      sameAs: siteConfig.socialLinks.map((link) => link.href),
      jobTitle: "Full-Stack Software Engineer",
      knowsAbout: [
        "Backend engineering",
        "Node.js",
        "TypeScript",
        "Python",
        "Cloud architecture",
        "Payment systems",
        "AI agents",
      ],
    }),
    [locale],
  );

  function switchLanguage() {
    const currentIds = sectionIds(locale);
    const nextIds = sectionIds(alternateLocale);
    const currentHash = window.location.hash.replace("#", "");
    const semanticKey = (Object.keys(currentIds) as Array<keyof typeof currentIds>).find(
      (key) => currentIds[key] === currentHash,
    );
    const nextHash = semanticKey ? `#${nextIds[semanticKey]}` : "";

    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${localeCookieName}=${alternateLocale}; path=/; max-age=31536000; samesite=lax${secure}`;
    router.push(`/${alternateLocale}${nextHash}`);
    setMenuOpen(false);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a className="skip-link" href={`#${ids.projects}`}>
        {content.hero.projectsCta}
      </a>
      <div className="site-shell" id={ids.home}>
        <header className="site-header">
          <a className="brand" href={`#${ids.home}`} aria-label={siteConfig.brandName}>
            <span className="brand-mark" aria-hidden="true">
              DF
            </span>
            <span className="brand-copy">
              <strong>{siteConfig.brandName}</strong>
              <span>{content.nav.role}</span>
            </span>
          </a>

          <nav className="desktop-nav" aria-label={content.nav.primaryLabel}>
            {content.nav.items.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="language-switch"
              type="button"
              onClick={switchLanguage}
              aria-label={content.nav.switchLanguage}
            >
              <Globe2 aria-hidden="true" size={15} />
              {alternateLocale.toUpperCase()}
            </button>
            <a className="header-contact" href={`#${ids.contact}`}>
              {content.nav.cta}
              <ArrowDownRight aria-hidden="true" size={16} />
            </a>
            <button
              className="menu-button"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? content.nav.closeMenu : content.nav.openMenu}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>

          <nav
            className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
            id="mobile-menu"
            aria-label={content.nav.primaryLabel}
            hidden={!menuOpen}
          >
            {content.nav.items.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
            <a href={`#${ids.contact}`} onClick={() => setMenuOpen(false)}>
              <span>{String(content.nav.items.length + 1).padStart(2, "0")}</span>
              {content.nav.cta}
            </a>
            <button type="button" onClick={switchLanguage}>
              <span>↳</span>
              {content.nav.switchLanguage}
            </button>
          </nav>
        </header>

        <main>
          <section className="hero section-frame" aria-labelledby="hero-title">
            <div className="hero-rail" aria-label={content.hero.focusLabel}>
              <span className="rail-index">00</span>
              <p>{content.hero.focusLabel}</p>
              <ul>
                {content.hero.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="hero-main">
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1 id="hero-title">
                <span>{content.hero.titleLead}</span>
                <em>{content.hero.titleEmphasis}</em>
              </h1>
              <p className="hero-description">{content.hero.description}</p>
              <div className="hero-actions">
                <a className="button button-dark" href={`#${ids.projects}`}>
                  {content.hero.projectsCta}
                  <ArrowDownRight aria-hidden="true" size={17} />
                </a>
                <a className="text-link" href={`#${ids.contact}`}>
                  {content.hero.contactCta}
                  <ArrowDownRight aria-hidden="true" size={17} />
                </a>
              </div>
            </div>

            <div className="hero-system">
              <SystemDiagram content={content} />
            </div>

            <div className="hero-status" aria-label={content.hero.availability}>
              <span className="status-indicator" aria-hidden="true" />
              <span>{content.hero.availability}</span>
              <span>{content.hero.location}</span>
            </div>
          </section>

          <Section
            eyebrow={content.expertise.eyebrow}
            title={content.expertise.title}
            description={content.expertise.description}
            className="expertise-section"
          >
            <div className="expertise-list">
              {content.expertise.items.map((item) => (
                <article className="expertise-row" key={item.index}>
                  <span className="row-index">{item.index}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul className="inline-list" aria-label={item.title}>
                    {item.evidence.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Section>

          <Section
            id={ids.projects}
            eyebrow={content.projects.eyebrow}
            title={content.projects.title}
            description={content.projects.description}
            className="projects-section"
          >
            <div className="projects-list">
              {content.projects.items.map((project, index) => (
                <ProjectCase
                  key={project.number}
                  project={project}
                  labels={content.projects}
                  featured={index === 0}
                  reversed={index === 2}
                />
              ))}
            </div>
          </Section>

          <Section
            id={ids.capabilities}
            eyebrow={content.capabilities.eyebrow}
            title={content.capabilities.title}
            description={content.capabilities.description}
            className="capabilities-section"
          >
            <div className="capabilities-table">
              {content.capabilities.items.map((item, index) => (
                <article className="capability-row" key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul className="inline-list">
                    {item.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Section>

          <section className="approach-section" id={ids.approach}>
            <div className="section-frame">
              <Reveal className="approach-intro">
                <p className="eyebrow">{content.approach.eyebrow}</p>
                <h2>{content.approach.title}</h2>
                <p>{content.approach.description}</p>
              </Reveal>
              <div className="execution-line">
                {content.approach.steps.map((step) => (
                  <article key={step.number}>
                    <span>{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
              <Reveal>
                <blockquote>{content.approach.principle}</blockquote>
              </Reveal>
            </div>
          </section>

          <section className="contact-section dark-section" id={ids.contact}>
            <div className="section-frame contact-layout">
              <Reveal className="contact-copy">
                <p className="eyebrow">{content.contact.eyebrow}</p>
                <h2>{content.contact.title}</h2>
                <p>{content.contact.description}</p>
                <div className="direct-links" aria-label={content.contact.directLabel}>
                  <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
                    <MessageSquareText aria-hidden="true" size={17} />
                    {content.contact.whatsappCta}
                    <ArrowUpRight aria-hidden="true" size={15} />
                  </a>
                  {siteConfig.socialLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      <ExternalLink aria-hidden="true" size={17} />
                      {link.label}
                      <ArrowUpRight aria-hidden="true" size={15} />
                    </a>
                  ))}
                </div>
              </Reveal>
              <Reveal>
                <ContactForm content={content.contact} locale={content.locale} />
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="site-footer section-frame">
          <div>
            <span className="brand-mark" aria-hidden="true">
              DF
            </span>
            <p>{content.footer.summary}</p>
          </div>
          <div className="footer-links">
            <a href={siteConfig.storeUrl} target="_blank" rel="noreferrer">
              Aether Commerce <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            {siteConfig.socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label} <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
            <button type="button" onClick={switchLanguage}>
              {alternateLocale.toUpperCase()}
            </button>
            <a href={legalHref(locale, "privacy")}>{content.footer.privacy}</a>
            <a href={legalHref(locale, "cookies")}>{content.footer.cookies}</a>
            <a href={legalHref(locale, "terms")}>{content.footer.terms}</a>
            <a href={`#${ids.home}`}>{content.footer.backToTop} ↑</a>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} {siteConfig.brandName}. {content.footer.rights}
          </p>
        </footer>
        <CookieNotice locale={locale} />
      </div>
    </>
  );
}

function SystemDiagram({ content }: { content: LandingContent }) {
  return (
    <figure className="system-diagram">
      <figcaption>
        <span>{content.hero.diagramKicker}</span>
        <strong>{content.hero.diagramLabel}</strong>
      </figcaption>
      <div className="architecture-graph">
        <div className="graph-link graph-link-horizontal" aria-hidden="true" />
        <div className="graph-link graph-link-vertical" aria-hidden="true" />
        <div className="graph-core">
          <span>Core</span>
          <strong>{content.hero.diagramCoreTitle}</strong>
          <p>{content.hero.diagramCoreDetail}</p>
        </div>
        <ol className="diagram-flow" aria-label={content.hero.diagramLabel}>
          {content.hero.diagramNodes.map((node) => (
            <li className="diagram-step" key={node.phase}>
              <span>{node.phase}</span>
              <strong>{node.title}</strong>
              <p>{node.detail}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className="diagram-caption">{content.hero.diagramCaption}</p>
    </figure>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  className = "",
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`content-section section-frame ${className}`} id={id}>
      <Reveal className="section-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </Reveal>
      {children}
    </section>
  );
}

function ProjectCase({
  project,
  labels,
  featured,
  reversed,
}: {
  project: ProjectItem;
  labels: LandingContent["projects"];
  featured?: boolean;
  reversed?: boolean;
}) {
  const projectHref = project.href === "store" ? siteConfig.storeUrl : project.href;

  return (
    <Reveal>
      <article
        className={`project-case ${featured ? "project-featured" : ""} ${
          reversed ? "project-reversed" : ""
        }`}
      >
        <header className="project-header">
          <span className="project-number">{project.number}</span>
          <p>{project.category}</p>
          <span className={`project-status status-${project.statusTone}`}>
            <i aria-hidden="true" />
            {project.status}
          </span>
        </header>

        <div className="project-summary">
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          {projectHref && project.hrefLabel ? (
            <a href={projectHref} target="_blank" rel="noreferrer">
              {project.hrefLabel}
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          ) : null}
        </div>

        {project.architecture ? (
          <div className="project-architecture">
            <p>{labels.architectureLabel}</p>
            <ol>
              {project.architecture.map((node, index) => (
                <li key={node}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{node}</strong>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <dl className="project-details">
          {project.sections.map((section) => (
            <div key={section.label}>
              <dt>{section.label}</dt>
              <dd>{section.body}</dd>
            </div>
          ))}
        </dl>

        <footer className="project-footer">
          <ul className="inline-list">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          {project.note ? <p>{project.note}</p> : null}
        </footer>
      </article>
    </Reveal>
  );
}
