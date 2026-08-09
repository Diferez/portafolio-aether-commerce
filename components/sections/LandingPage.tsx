"use client";

import {
  BadgeCheck,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Cloud,
  Code2,
  CreditCard,
  Database,
  ExternalLink,
  Gauge,
  Globe2,
  Layers3,
  Menu,
  MessageSquareText,
  Rocket,
  ServerCog,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { localeCookieName, type Locale } from "@/i18n/config";
import type { CardItem, IconName, LandingContent } from "@/types/content";
import { ContactForm } from "./ContactForm";
import { GlowCard } from "../ui/GlowCard";
import { Reveal } from "../ui/Reveal";

type LandingPageProps = {
  content: LandingContent;
};

const iconMap: Record<IconName, LucideIcon> = {
  app: Boxes,
  api: ServerCog,
  frontend: Code2,
  cloud: Cloud,
  payments: CreditCard,
  ai: BrainCircuit,
  devops: Gauge,
  maintenance: Wrench,
  consulting: MessageSquareText,
  startup: Rocket,
  business: Building2,
  commerce: ShoppingCart,
  team: Layers3,
  individual: BadgeCheck,
  database: Database,
  shield: ShieldCheck,
  workflow: Bot,
  rocket: Rocket,
  layers: Layers3,
  server: ServerCog,
  globe: Globe2,
};

function sectionIds(locale: Locale) {
  return locale === "es"
    ? {
        home: "inicio",
        services: "servicios",
        projects: "proyectos",
        technologies: "tecnologias",
        ai: "ia",
        contact: "contacto",
      }
    : {
        home: "home",
        services: "services",
        projects: "projects",
        technologies: "technologies",
        ai: "ai",
        contact: "contact",
      };
}

export function LandingPage({ content }: LandingPageProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = content.locale;
  const ids = sectionIds(locale);
  const alternateLocale = locale === "es" ? "en" : "es";
  const storeIsExternal = /^https?:\/\//.test(siteConfig.storeUrl);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: siteConfig.brandName,
      url: `${siteConfig.siteUrl}/${locale}`,
      areaServed: ["United States", "Europe", "Colombia", "Latin America"],
      serviceType: [
        "Full stack software development",
        "Cloud architecture",
        "Payment integrations",
        "AI automation",
        "Technical consulting",
      ],
    }),
    [locale],
  );

  function switchLanguage() {
    const hash = window.location.hash;
    document.cookie = `${localeCookieName}=${alternateLocale}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${alternateLocale}${hash}`);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="site-shell">
        <BackgroundTexture />
        <header className="site-header">
          <a className="brand" href={`#${ids.home}`} aria-label={siteConfig.brandName}>
            <span className="brand-mark">DM</span>
            <span>{siteConfig.brandName}</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {content.nav.items.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={siteConfig.storeUrl}>{content.hero.storeCta}</a>
          </nav>

          <div className="header-actions">
            <button
              className="language-switch"
              type="button"
              onClick={switchLanguage}
              aria-label={content.nav.switchLanguage}
            >
              <Globe2 aria-hidden="true" size={16} />
              {alternateLocale.toUpperCase()}
            </button>
            <a className="nav-cta" href={`#${ids.contact}`}>
              {content.nav.cta}
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

          <div
            className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
            id="mobile-menu"
            hidden={!menuOpen}
          >
            {content.nav.items.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href={siteConfig.storeUrl} onClick={() => setMenuOpen(false)}>
              {content.hero.storeCta}
            </a>
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
              {content.contact.whatsappCta}
            </a>
            <button type="button" onClick={switchLanguage}>
              {content.nav.switchLanguage}
            </button>
          </div>
        </header>

        <main>
          <section className="hero-section" id={ids.home}>
            <div className="hero-copy">
              <Reveal>
                <p className="availability">
                  <Sparkles aria-hidden="true" size={16} />
                  {content.hero.eyebrow}
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h1>{content.hero.title}</h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="hero-description">{content.hero.description}</p>
              </Reveal>
              <Reveal className="hero-actions" delay={0.24}>
                <a className="secondary-button" href={`#${ids.contact}`}>
                  {content.hero.secondaryCta}
                </a>
                {siteConfig.storeUrl ? (
                  <a
                    className="primary-button"
                    href={siteConfig.storeUrl}
                    target={storeIsExternal ? "_blank" : undefined}
                    rel={storeIsExternal ? "noreferrer" : undefined}
                  >
                    {content.hero.storeCta}
                    <ExternalLink aria-hidden="true" size={16} />
                  </a>
                ) : (
                  <span className="ghost-button is-disabled" aria-disabled="true">
                    {content.hero.storeUnavailable}
                  </span>
                )}
              </Reveal>
            </div>

            <Reveal className="hero-visual" delay={0.16}>
              <ArchitectureDiagram content={content} />
            </Reveal>
          </section>

          <Reveal>
            <section className="positioning-strip" aria-label={content.positioning.title}>
              <h2>{content.positioning.title}</h2>
              <div>
                {content.positioning.stages.map((stage, index) => (
                  <span key={stage}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {stage}
                  </span>
                ))}
              </div>
            </section>
          </Reveal>

          <CardGridSection
            id={ids.services}
            eyebrow={content.services.eyebrow}
            title={content.services.title}
            description={content.services.description}
            items={content.services.items}
            columns="three"
          />

          <CardGridSection
            eyebrow={content.clients.eyebrow}
            title={content.clients.title}
            description={content.clients.description}
            items={content.clients.items}
            columns="five"
          />

          <CaseStudiesSection content={content} id={ids.projects} />
          <AISection content={content} id={ids.ai} />
          <TechStackSection content={content} id={ids.technologies} />
          <CloudSection content={content} />
          <ProcessSection content={content} />
          <DifferentiatorsSection content={content} />
          <ContactSection content={content} id={ids.contact} />
        </main>

        <footer className="site-footer">
          <div>
            <a className="brand" href={`#${ids.home}`}>
              <span className="brand-mark">DM</span>
              <span>{siteConfig.brandName}</span>
            </a>
            <p>{content.footer.remote}</p>
          </div>
          <div className="footer-specialties">
            {content.footer.specialties.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="footer-links">
            {content.nav.items.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            {siteConfig.socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            <a href={siteConfig.storeUrl}>{content.hero.storeCta}</a>
            <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
              {content.contact.whatsappCta}
            </a>
            <a href="#privacidad">{content.footer.privacyLabel}</a>
            <button type="button" onClick={switchLanguage}>
              {alternateLocale.toUpperCase()}
            </button>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} {siteConfig.brandName}. {content.footer.rights}
          </p>
        </footer>
      </div>
    </>
  );
}

function BackgroundTexture() {
  return (
    <div className="background-texture" aria-hidden="true">
      <div className="light-beam beam-one" />
      <div className="light-beam beam-two" />
    </div>
  );
}

function ArchitectureDiagram({ content }: { content: LandingContent }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="architecture" aria-label={content.hero.diagramTitle}>
      <div className="architecture-panel web-panel">
        <span>{content.hero.diagramNodes[0]}</span>
        <div className="mock-window">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="architecture-core">
        <motion.div
          className="core-ring"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
        <div className="core-node">
          <Layers3 aria-hidden="true" />
          <span>{content.hero.diagramTitle}</span>
        </div>
      </div>
      {content.hero.diagramNodes.slice(1).map((node, index) => (
        <div className={`architecture-node node-${index + 1}`} key={node}>
          <span>{node}</span>
        </div>
      ))}
      <div className="connection connection-a" />
      <div className="connection connection-b" />
      <div className="connection connection-c" />
      <div className="connection connection-d" />
      <div className="connection connection-e" />
    </div>
  );
}

type CardGridSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  items: readonly CardItem[];
  columns: "three" | "five";
};

function CardGridSection({
  id,
  eyebrow,
  title,
  description,
  items,
  columns,
}: CardGridSectionProps) {
  return (
    <SectionShell id={id} eyebrow={eyebrow} title={title} description={description}>
      <div className={`card-grid card-grid-${columns}`}>
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.025}>
            <InfoCard item={item} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function InfoCard({ item }: { item: CardItem }) {
  const Icon = item.icon ? iconMap[item.icon] : CheckCircle2;

  return (
    <GlowCard className="info-card">
      <div className="icon-tile">
        <Icon aria-hidden="true" size={20} />
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.items ? (
        <div className="mini-tags">
          {item.items.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
    </GlowCard>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="section-shell" id={id}>
      <Reveal className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </Reveal>
      {children}
    </section>
  );
}

function CaseStudiesSection({ content, id }: { content: LandingContent; id: string }) {
  return (
    <SectionShell
      id={id}
      eyebrow={content.caseStudies.eyebrow}
      title={content.caseStudies.title}
      description={content.caseStudies.description}
    >
      <div className="case-grid">
        {content.caseStudies.items.map((study, index) => (
          <Reveal key={study.title} delay={index * 0.05}>
            <GlowCard className="case-card">
              <p className="eyebrow">{study.eyebrow}</p>
              <h3>{study.title}</h3>
              <p>{study.summary}</p>
              <div className="case-sections">
                {study.sections.map((section) => (
                  <div key={section.title}>
                    <strong>{section.title}</strong>
                    <span>{section.body}</span>
                  </div>
                ))}
              </div>
              <div className="tech-pills">
                {study.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function AISection({ content, id }: { content: LandingContent; id: string }) {
  return (
    <SectionShell
      id={id}
      eyebrow={content.ai.eyebrow}
      title={content.ai.title}
      description={content.ai.description}
    >
      <div className="ai-layout">
        <Reveal>
          <div className="ai-map">
            <div className="ai-map-center">
              <BrainCircuit aria-hidden="true" />
              <span>LLM</span>
            </div>
            <span className="ai-path path-one" />
            <span className="ai-path path-two" />
            <span className="ai-path path-three" />
            {content.ai.items.map((item, index) => (
              <div className={`ai-node ai-node-${index + 1}`} key={item.title}>
                {item.title}
              </div>
            ))}
          </div>
        </Reveal>
        <div className="ai-cards">
          {content.ai.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <InfoCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal>
        <p className="ai-note">{content.ai.note}</p>
      </Reveal>
    </SectionShell>
  );
}

function TechStackSection({ content, id }: { content: LandingContent; id: string }) {
  return (
    <SectionShell
      id={id}
      eyebrow={content.stack.eyebrow}
      title={content.stack.title}
      description={content.stack.description}
    >
      <div className="stack-grid">
        {content.stack.categories.map((category, index) => (
          <Reveal key={category.title} delay={index * 0.02}>
            <div className="stack-category">
              <h3>{category.title}</h3>
              <div>
                {category.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function CloudSection({ content }: { content: LandingContent }) {
  return (
    <SectionShell
      eyebrow={content.cloud.eyebrow}
      title={content.cloud.title}
      description={content.cloud.description}
    >
      <Reveal>
        <div className="cloud-panel">
          <div className="cloud-platforms">
            {content.cloud.platforms.map((platform) => (
              <span key={platform}>{platform}</span>
            ))}
          </div>
          <div className="cloud-factors">
            {content.cloud.factors.map((factor) => (
              <div key={factor}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {factor}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function ProcessSection({ content }: { content: LandingContent }) {
  return (
    <SectionShell
      eyebrow={content.process.eyebrow}
      title={content.process.title}
      description={content.process.description}
    >
      <div className="process-grid">
        {content.process.steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.04}>
            <div className="process-step">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function DifferentiatorsSection({ content }: { content: LandingContent }) {
  return (
    <SectionShell
      eyebrow={content.differentiators.eyebrow}
      title={content.differentiators.title}
    >
      <div className="differentiators">
        {content.differentiators.items.map((item, index) => (
          <Reveal key={item} delay={index * 0.035}>
            <div>
              <ShieldCheck aria-hidden="true" size={20} />
              <p>{item}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ContactSection({ content, id }: { content: LandingContent; id: string }) {
  return (
    <section className="contact-section section-shell" id={id}>
      <Reveal className="contact-copy">
        <p className="eyebrow">{content.contact.eyebrow}</p>
        <h2>{content.contact.title}</h2>
        <p>{content.contact.description}</p>
        <div className="contact-links">
          <a className="whatsapp-button" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
            <MessageSquareText aria-hidden="true" size={16} />
            {content.contact.whatsappCta}
          </a>
          {siteConfig.socialLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" size={16} />
              {link.label}
            </a>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <ContactForm content={content.contact} locale={content.locale} />
      </Reveal>
    </section>
  );
}
