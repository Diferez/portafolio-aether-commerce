export const apiBaseUrl = process.env.NEXT_PUBLIC_AETHER_API_URL || "http://localhost:8787";

export const storefrontBasePath = (process.env.NEXT_PUBLIC_AETHER_BASE_PATH || "").replace(/\/$/, "");

export function storefrontPath(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${storefrontBasePath}${normalizedPath}` || "/";
}

const configuredPortfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.trim();

export const portfolioUrl = configuredPortfolioUrl || (storefrontBasePath ? "/" : "");
