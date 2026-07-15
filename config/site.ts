export const siteConfig = {
  brandName:
    process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Full Stack Software Engineer",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://portfolio.example.com",
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL?.trim() || "",
  availability: {
    es: "Disponible para nuevos proyectos",
    en: "Available for selected projects",
  },
  socialLinks: [] as Array<{ label: string; href: string }>,
} as const;
