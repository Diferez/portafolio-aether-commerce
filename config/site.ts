export const siteConfig = {
  brandName:
    process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Diego Fernando Martinez",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://portfolio.example.com",
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL?.trim() || "",
  availability: {
    es: "Disponible para nuevos proyectos",
    en: "Available for selected projects",
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/diferez/",
    },
  ] as Array<{ label: string; href: string }>,
} as const;
