const productionApiBaseUrl = "https://aether-api.pickofwow.workers.dev";

function resolveApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_AETHER_API_URL?.trim();
  if (configured) return configured;

  if (typeof window !== "undefined" && window.location.hostname.endsWith("pickofwow.workers.dev")) {
    return productionApiBaseUrl;
  }

  return "http://localhost:8787";
}

export const apiBaseUrl = resolveApiBaseUrl();

export const storefrontBasePath = (process.env.NEXT_PUBLIC_AETHER_BASE_PATH || "").replace(/\/$/, "");

export function storefrontPath(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${storefrontBasePath}${normalizedPath}` || "/";
}

const configuredPortfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.trim();

export const portfolioUrl = configuredPortfolioUrl || (storefrontBasePath ? "/" : "");
