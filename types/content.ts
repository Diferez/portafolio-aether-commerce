import type { Locale } from "@/i18n/config";

export type IconName =
  | "app"
  | "api"
  | "frontend"
  | "cloud"
  | "payments"
  | "ai"
  | "devops"
  | "maintenance"
  | "consulting"
  | "startup"
  | "business"
  | "commerce"
  | "team"
  | "individual"
  | "database"
  | "shield"
  | "workflow"
  | "rocket"
  | "layers"
  | "server"
  | "globe";

export type NavItem = {
  label: string;
  href: string;
};

export type CardItem = {
  title: string;
  description: string;
  icon?: IconName;
  items?: readonly string[];
};

export type TimelineItem = {
  company: string;
  role: string;
  period: string;
  description?: string;
  highlights?: readonly string[];
  projects?: readonly {
    title: string;
    description: string;
    highlights: readonly string[];
  }[];
};

export type CaseStudy = {
  title: string;
  eyebrow: string;
  summary: string;
  sections: readonly { title: string; body: string }[];
  technologies: readonly string[];
};

export type ContactContent = {
  title: string;
  eyebrow: string;
  description: string;
  fields: {
    name: string;
    company: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
    preferredLanguage: string;
    consent: string;
    website: string;
  };
  placeholders: {
    name: string;
    company: string;
    email: string;
    budget: string;
    message: string;
  };
  projectTypes: readonly string[];
  languageOptions: Record<Locale, string>;
  submit: string;
  sending: string;
  success: string;
  error: string;
  privacy: string;
  validation: {
    required: string;
    email: string;
    message: string;
    consent: string;
  };
};

export type LandingContent = {
  locale: Locale;
  metadata: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
  nav: {
    items: readonly NavItem[];
    cta: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    storeCta: string;
    storeUnavailable: string;
    diagramTitle: string;
    diagramNodes: readonly string[];
  };
  positioning: {
    title: string;
    stages: readonly string[];
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly CardItem[];
  };
  clients: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly CardItem[];
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly TimelineItem[];
  };
  caseStudies: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly CaseStudy[];
  };
  ai: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly CardItem[];
    note: string;
  };
  stack: {
    eyebrow: string;
    title: string;
    description: string;
    categories: readonly { title: string; items: readonly string[] }[];
  };
  cloud: {
    eyebrow: string;
    title: string;
    description: string;
    platforms: readonly string[];
    factors: readonly string[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly { title: string; description: string }[];
  };
  differentiators: {
    eyebrow: string;
    title: string;
    items: readonly string[];
  };
  contact: ContactContent;
  footer: {
    specialties: readonly string[];
    rights: string;
    remote: string;
    privacyLabel: string;
  };
};
