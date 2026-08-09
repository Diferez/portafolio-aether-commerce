export const siteConfig = {
  brandName:
    process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Diego Fernando",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://portafolio-aether-commerce.pickofwow.workers.dev",
  storeUrl:
    process.env.NEXT_PUBLIC_STORE_URL?.trim() ||
    "https://aether-storefront.pickofwow.workers.dev",
  whatsappUrl: "https://wa.me/message/QUSZJKVQDACUM1",
  availability: {
    es: "Disponible para nuevos proyectos",
    en: "Available for selected projects",
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/diferez/",
    },
    {
      label: "GitHub",
      href: "https://github.com/Diferez",
    },
  ] as Array<{ label: string; href: string }>,
} as const;
