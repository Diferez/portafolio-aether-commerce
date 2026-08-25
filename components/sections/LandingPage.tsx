"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Box,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Globe2,
  Menu,
  MessageSquareText,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Zap,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
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
    document.documentElement.classList.add("has-js");
    return () => document.documentElement.classList.remove("has-js");
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
          <div className="header-inner section-frame">
            <a className="brand" href={`#${ids.home}`} aria-label={siteConfig.brandName}>
              <span className="brand-copy">
                <strong>Diego Martinez</strong>
                <span>{content.nav.role}</span>
              </span>
            </a>
            <p className="header-availability">
              <span className="status-indicator" aria-hidden="true" />
              {content.hero.availability}
            </p>

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
          </div>
        </header>

        <main>
          <section className="hero section-frame" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow"><span className="status-indicator" aria-hidden="true" />{content.hero.availability}</p>
              <h1 id="hero-title">
                <span>I turn complex</span>
                <span>ideas into</span>
                <span>products that work<span className="headline-dot">.</span></span>
              </h1>
            </div>

            <aside className="hero-aside">
              <p className="hero-lead">Digital products, commerce experiences and business systems designed to sell, automate and scale.</p>
              <p className="hero-description">I design and build digital systems that connect products, payments, operations and people.</p>
              <div className="hero-actions">
                <a className="button button-signal" href={`#${ids.projects}`}>
                  {content.hero.projectsCta}
                  <ArrowDownRight aria-hidden="true" size={17} />
                </a>
                <a className="text-link" href={`#${ids.contact}`}>
                  {content.hero.contactCta}
                  <ArrowRight aria-hidden="true" size={17} />
                </a>
              </div>
            </aside>

            <ArchitectureCorridor content={content} />

            <div className="hero-meta">
              <div className="availability" aria-label={content.hero.availability}>
                <span className="status-indicator" aria-hidden="true" />
                <span>{content.hero.availability}</span>
                <span>Software Engineer / Product Builder — Colombia</span>
              </div>
              <div className="focus-list" aria-label={content.hero.focusLabel}>
                <span>{content.hero.focusLabel}</span>
                <ul>
                  {content.hero.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

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
                  index={index}
                />
              ))}
            </div>
          </Section>

          <Section
            eyebrow={content.expertise.eyebrow}
            title={content.expertise.title}
            description={content.expertise.description}
            className="expertise-section"
          >
            <div className="expertise-list">
              {content.expertise.items.map((item, index) => (
                <Reveal delay={index * 70} key={item.index}>
                  <article className="expertise-row">
                    <span className="row-index">{item.index}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul className="inline-list" aria-label={item.title}>
                      {item.evidence.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
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
                <Reveal delay={(index % 3) * 55} key={item.title}>
                  <article className="capability-row">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul className="inline-list" aria-label={item.title}>
                      {item.tools.map((tool) => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
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
                {content.approach.steps.map((step, index) => (
                  <Reveal delay={index * 75} key={step.number}>
                    <article>
                      <span>{step.number}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </article>
                  </Reveal>
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
          <div className="footer-signature">
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

function ArchitectureCorridor({ content }: { content: LandingContent }) {
  return (
    <figure className="architecture-corridor" aria-label={content.hero.diagramLabel}>
      <div className="system-phases" aria-hidden="true">
        <span>Problem<small>Ambiguity<br />&amp; complexity</small></span>
        <span>System<small>Structured<br />&amp; connected</small></span>
        <span>Product<small>Functional<br />&amp; valuable</small></span>
        <span>Growth<small>Impact<br />&amp; scale</small></span>
      </div>

      <div className="system-board" aria-hidden="true">
        <div className="system-rail" />
        <div className="system-card commerce-card">
          <div className="mug-art"><i /><b /></div>
          <div className="commerce-copy">
            <div className="card-label">Ceramic Mug <ShoppingCart size={15} /></div>
            <strong>$48.00</strong>
            <div className="quantity"><Minus size={12} /> <span>1</span> <Plus size={12} /></div>
            <span className="add-cart">Add to cart</span>
          </div>
        </div>

        <div className="system-card payment-card">
          <div className="payment-number"><small>Payment</small><strong>•••• 4242</strong><em>VISA</em></div>
          <div className="payment-success"><CheckCircle2 size={22} /><span><strong>Payment successful</strong><small>Order #9821 &nbsp;&nbsp; $96.00</small></span></div>
        </div>

        <div className="fulfillment-flow">
          <span><ShoppingCart size={17} />Order<br />received</span><b>→</b>
          <span className="active"><CheckCircle2 size={17} />Validate<br />inventory</span><b>→</b>
          <span><CreditCard size={17} />Charge<br />payment</span><b>→</b>
          <span><Box size={17} />Fulfill<br />order</span>
        </div>

        <div className="operations-card">
          <small>Operations overview</small>
          <div className="operations-grid"><div><span>Orders</span><strong>1,240</strong><em>+18%</em><span>Revenue</span><strong>$96,420</strong><em>+24%</em><span>Conversion</span><strong>2.8%</strong><em>+0.6%</em></div><div className="chart"><i /><i /><i /><i /><i /><i /></div><div><span>Top products</span><strong>Ceramic Mug &nbsp; 1,240</strong><strong>Pour Over Kit &nbsp; 842</strong><strong>Coffee Beans &nbsp; 612</strong></div></div>
        </div>
      </div>

      <div className="system-outcomes" aria-hidden="true">
        <div><ShoppingBag /><span><strong>Commerce</strong><small>Sell products and<br />manage operations.</small></span></div>
        <div><CreditCard /><span><strong>Payments</strong><small>Reliable payment<br />flows and integrations.</small></span></div>
        <div><Zap /><span><strong>Automation</strong><small>Reduce repetitive<br />operational work.</small></span></div>
        <div><Box /><span><strong>Platforms</strong><small>Turn complex workflows into<br />usable software.</small></span></div>
      </div>
      <figcaption>{content.hero.diagramCaption}</figcaption>
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
    <section className={`content-section ${className}`} id={id}>
      <div className="section-frame">
        <Reveal className="section-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function ProjectCase({
  project,
  labels,
  index,
}: {
  project: ProjectItem;
  labels: LandingContent["projects"];
  index: number;
}) {
  const projectHref = project.href === "store" ? siteConfig.storeUrl : project.href;

  return (
    <Reveal>
      <article className={`project-case project-tone-${(index % 4) + 1}`}>
        <header className="project-header">
          <span className="project-number">{project.number}</span>
          <p>{project.category}</p>
          <span className={`project-status status-${project.statusTone}`}>
            <i aria-hidden="true" />
            {project.status}
          </span>
        </header>

        <div className="project-heading">
          <h3>{project.title}</h3>
        </div>

        <ProjectVisual project={project} labels={labels} index={index} />

        <div className="project-overview">
          <p>{project.summary}</p>
          {projectHref && project.hrefLabel ? (
            <a href={projectHref} target="_blank" rel="noreferrer">
              {project.hrefLabel}
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          ) : null}
        </div>

        <dl className="project-details">
          {project.sections.map((section) => (
            <div key={section.label}>
              <dt>{section.label}</dt>
              <dd>{section.body}</dd>
            </div>
          ))}
        </dl>

        <footer className="project-footer">
          <ul className="inline-list" aria-label={project.title}>
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

function ProjectVisual({
  project,
  labels,
  index,
}: {
  project: ProjectItem;
  labels: LandingContent["projects"];
  index: number;
}) {
  const nodes = project.architecture ?? project.technologies.slice(0, 4);

  return (
    <figure className={`project-visual visual-${(index % 4) + 1}`}>
      <figcaption>
        <span>{project.architecture ? labels.architectureLabel : project.category}</span>
        <strong>{project.title}</strong>
      </figcaption>
      <div className="project-canvas">
        <span className="project-watermark" aria-hidden="true">
          {project.number}
        </span>
        <ol>
          {nodes.map((node, nodeIndex) => (
            <li
              key={node}
              style={{ "--node-index": nodeIndex } as CSSProperties}
            >
              <span>{String(nodeIndex + 1).padStart(2, "0")}</span>
              <strong>{node}</strong>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
