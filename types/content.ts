import type { Locale } from "@/i18n/config";

export type NavItem = {
  label: string;
  href: string;
};

export type ExpertiseItem = {
  index: string;
  title: string;
  description: string;
  evidence: readonly string[];
};

export type ProjectSection = {
  label: string;
  body: string;
};

export type ProjectItem = {
  number: string;
  category: string;
  title: string;
  summary: string;
  status: string;
  statusTone: "live" | "validated" | "private";
  sections: readonly ProjectSection[];
  architecture?: readonly string[];
  technologies: readonly string[];
  href?: string;
  hrefLabel?: string;
  note?: string;
};

export type CapabilityItem = {
  title: string;
  description: string;
  tools: readonly string[];
};

export type DiagramNode = {
  phase: string;
  title: string;
  detail: string;
};

export type NarrativeContent = {
  eyebrow: string;
  title: string;
  descriptionOne: string;
  descriptionTwo: string;
  firstStatement: string;
  secondStatement: string;
  projectTitle: string;
  projectDescription: string;
  projectPreviewAlt: string;
};

export type AetherNarrativeStep = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  emphasis?: string;
};

export type AetherNarrativeContent = {
  intro: AetherNarrativeStep;
  storefront: AetherNarrativeStep;
  customerAssistant: AetherNarrativeStep;
  administration: AetherNarrativeStep;
  operationalAssistant: AetherNarrativeStep;
  closing: AetherNarrativeStep;
  visuals: {
    sequenceLabel: string;
    storefrontAlt: string;
    storefrontAssistantAlt: string;
    administrationAlt: string;
    administrationAssistantAlt: string;
  };
};

export type ContactContent = {
  title: string;
  eyebrow: string;
  description: string;
  directLabel: string;
  fields: {
    name: string;
    company: string;
    email: string;
    projectType: string;
    message: string;
    preferredLanguage: string;
    consent: string;
    privacyLink: string;
    website: string;
  };
  placeholders: {
    name: string;
    company: string;
    email: string;
    message: string;
  };
  projectTypes: readonly string[];
  languageOptions: Record<Locale, string>;
  submit: string;
  whatsappCta: string;
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
    role: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    primaryLabel: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    description: string;
    secondaryDescription: string;
    projectsCta: string;
    contactCta: string;
    availability: string;
    location: string;
    focusLabel: string;
    focus: readonly string[];
    diagramLabel: string;
    diagramKicker: string;
    diagramCoreTitle: string;
    diagramCoreDetail: string;
    diagramNodes: readonly DiagramNode[];
    diagramCaption: string;
  };
  narrative: NarrativeContent;
  aetherNarrative: AetherNarrativeContent;
  expertise: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly ExpertiseItem[];
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    problemLabel: string;
    decisionLabel: string;
    responsibilityLabel: string;
    resultLabel: string;
    architectureLabel: string;
    items: readonly ProjectItem[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly CapabilityItem[];
  };
  approach: {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly { number: string; title: string; description: string }[];
    principle: string;
  };
  contact: ContactContent;
  footer: {
    summary: string;
    rights: string;
    backToTop: string;
    privacy: string;
    cookies: string;
    terms: string;
  };
};
