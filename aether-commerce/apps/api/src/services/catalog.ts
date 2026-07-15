import { cleanImageUrls, finalPriceFromDiscount, getInventoryStatus, slugify } from "@aether/core";
import { productSchema, type Product, type ProductQuery } from "@aether/schemas";
import type { Env } from "../types";

type PlatziProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: unknown;
  category?: {
    id?: number;
    name?: string;
    image?: string;
  };
};

const catalogCacheKey = "platzi-products-v3";
const fallbackImageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
const memoryCacheTtlMs = 5 * 60 * 1000;
let memoryCatalogCache: { expiresAt: number; products: Product[] } | null = null;

const fallbackProducts: PlatziProduct[] = [
  {
    id: 9001,
    title: "Aether Arc Laptop",
    price: 1899,
    description: "A magnesium ultrabook with color-accurate display and all-day battery.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"],
    category: { id: 1, name: "Laptops" }
  },
  {
    id: 9002,
    title: "Aether Dock Studio",
    price: 329,
    description: "A compact Thunderbolt dock for creators and desk-first teams.",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"],
    category: { id: 2, name: "Accessories" }
  },
  {
    id: 9003,
    title: "Aether Pulse Headset",
    price: 249,
    description: "A low-latency headset tuned for calls, focus sessions, and travel.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
    category: { id: 3, name: "Audio" }
  }
];

function discountFor(id: number): number {
  if (id % 7 === 0) return 18;
  if (id % 5 === 0) return 12;
  if (id % 3 === 0) return 8;
  return 0;
}

function flagsFor(product: PlatziProduct): Product["flags"] {
  const flags: Product["flags"] = [];
  if (product.id % 2 === 0) flags.push("featured");
  if (product.id % 3 === 0) flags.push("new");
  if (discountFor(product.id) > 0) flags.push("deal");
  if (product.id % 11 === 0) flags.push("limited");
  return flags.length > 0 ? flags : ["featured"];
}

function normalizeCategoryName(name?: string) {
  const candidate = name?.trim();
  if (!candidate) {
    return "Technology";
  }

  const looksLikeError =
    /(error|failed|exception|query|syntax|typeorm|select|insert|update|delete|undefined|null)/i.test(candidate) ||
    candidate.length > 48;

  return looksLikeError ? "Technology" : candidate;
}

function isMeaningfulText(value: string, minWords = 2) {
  const trimmed = value.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const hasVowels = /[aeiou]/i.test(trimmed);
  const repeatedChars = /(.)\1{2,}/i.test(trimmed);
  const mostlySymbols = trimmed.replace(/[a-z0-9\s-]/gi, "").length > trimmed.length / 3;
  return trimmed.length >= 6 && words.length >= minWords && hasVowels && !repeatedChars && !mostlySymbols;
}

function isTrustedImageUrl(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    const allowedHosts = ["images.unsplash.com", "i.imgur.com", "placeimg.com", "api.lorem.space"];
    const blockedPatterns = /(placeholder|dummy|test|example|kkk|undefined|null|\.(svg|gif)$)/i;
    return allowedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)) && !blockedPatterns.test(pathname);
  } catch {
    return false;
  }
}

function isCatalogCandidate(product: PlatziProduct) {
  const images = cleanImageUrls(product.images, fallbackImageUrl).filter(isTrustedImageUrl);
  return (
    Number.isFinite(product.id) &&
    Number(product.price) > 0 &&
    isMeaningfulText(product.title) &&
    isMeaningfulText(product.description, 4) &&
    images.length > 0
  );
}

function normalize(product: PlatziProduct): Product {
  const slug = slugify(product.title || `product-${product.id}`);
  const categoryName = normalizeCategoryName(product.category?.name);
  const categorySlug = slugify(categoryName);
  const price = Math.max(0, Math.round(Number(product.price || 0) * 100));
  const discountPercentage = discountFor(product.id);
  const finalPrice = finalPriceFromDiscount(price, discountPercentage);
  const initialStock = 8 + (product.id % 24);
  const reservedStock = product.id % 4;
  const soldStock = product.id % 9;
  const returnedStock = product.id % 3;
  const adjustedStock = product.id % 2 === 0 ? 2 : 0;
  const available = Math.max(0, initialStock + adjustedStock + returnedStock - reservedStock - soldStock);
  const availabilityStatus = getInventoryStatus(available, 4);
  const images = cleanImageUrls(
    product.images,
    fallbackImageUrl
  ).filter(isTrustedImageUrl).map((url, index): Product["images"][number] => ({
    url,
    alt: `${product.title} image ${index + 1}`,
    source: "platzi"
  }));
  const safeImages = images.length > 0 ? images : cleanImageUrls(
    [fallbackImageUrl],
    fallbackImageUrl
  ).map((url, index): Product["images"][number] => ({
    url,
    alt: `${product.title} image ${index + 1}`,
    source: "fallback"
  }));
  const flags = flagsFor(product);
  const categoryImage = product.category?.image && cleanImageUrls([product.category.image], safeImages[0]?.url ?? fallbackImageUrl).filter(isTrustedImageUrl)[0];
  const shortDescription = (product.description || "Premium technology selected for Aether.").slice(0, 140);
  const sku = `AET-${product.id}-STD`;
  const now = new Date().toISOString();

  return productSchema.parse({
    id: `platzi_${product.id}`,
    externalId: product.id,
    sourceId: String(product.id),
    slug,
    name: product.title,
    shortDescription,
    description: product.description || "Premium technology selected for Aether.",
    price,
    originalPrice: discountPercentage > 0 ? price : null,
    finalPrice,
    discountPercentage,
    currency: "USD",
    category: {
      id: String(product.category?.id ?? "technology"),
      externalId: product.category?.id ?? null,
      slug: categorySlug,
      name: categoryName,
      image: categoryImage ?? null
    },
    sku,
    brand: "Aether",
    tags: [categorySlug, ...flags],
    initialStock,
    reservedStock,
    soldStock,
    returnedStock,
    adjustedStock,
    availableStock: available,
    availabilityStatus: availabilityStatus === "hidden" ? "discontinued" : availabilityStatus,
    thumbnail: safeImages[0]?.url ?? fallbackImageUrl,
    images: safeImages,
    gallery: safeImages.map((image) => image.url),
    specifications: [
      { key: "Source", value: "Platzi Fake Store API" },
      { key: "Warranty", value: "Demo international warranty" },
      { key: "Fulfillment", value: "Simulated Aether fulfillment" }
    ],
    flags,
    seo: {
      title: `${product.title} | Aether`,
      description: (product.description || "Premium technology selected for Aether.").slice(0, 150),
      canonicalPath: `/products/${slug}`
    },
    variants: [
      {
        id: `${slug}-standard`,
        name: "Finish",
        value: "Graphite",
        priceAdjustment: 0,
        stockAdjustment: 0,
        label: "Standard",
        sku,
        priceDelta: 0,
        inventory: available,
        attributes: { finish: "Graphite" }
      },
      {
        id: `${slug}-pro`,
        name: "Bundle",
        value: "Pro bundle",
        priceAdjustment: 9000,
        stockAdjustment: -2,
        label: "Pro bundle",
        sku: `AET-${product.id}-PRO`,
        priceDelta: 9000,
        inventory: Math.max(0, available - 2),
        attributes: { finish: "Titanium", bundle: "Travel kit" }
      }
    ],
    rating: {
      average: Math.round((4.1 + (product.id % 8) / 10) * 10) / 10,
      count: 18 + product.id * 3
    },
    reviewCount: 18 + product.id * 3,
    inventory: {
      sku,
      available,
      reserved: reservedStock,
      lowStockThreshold: 4,
      status: getInventoryStatus(available, 4)
    },
    visibility: "visible",
    featured: flags.includes("featured"),
    newArrival: flags.includes("new"),
    deal: flags.includes("deal"),
    visible: true,
    seoTitle: `${product.title} | Aether`,
    seoDescription: (product.description || "Premium technology selected for Aether.").slice(0, 150),
    createdAt: now,
    updatedAt: now
  });
}

function withAetherProducts(products: Product[]) {
  const aetherProducts = fallbackProducts.map(normalize);
  return [
    ...aetherProducts,
    ...products.filter((product) => !aetherProducts.some((aetherProduct) => aetherProduct.slug === product.slug))
  ];
}

async function readCachedProducts(env: Env): Promise<Product[] | null> {
  if (memoryCatalogCache && memoryCatalogCache.expiresAt > Date.now()) {
    return memoryCatalogCache.products;
  }

  try {
    const row = await env.DB.prepare(
      "select payload_json from products_cache where id = ? and expires_at > datetime('now')"
    )
      .bind(catalogCacheKey)
      .first<{ payload_json: string }>();
    if (!row) {
      return null;
    }
    const products = JSON.parse(row.payload_json) as Product[];
    memoryCatalogCache = { products, expiresAt: Date.now() + memoryCacheTtlMs };
    return products;
  } catch {
    return null;
  }
}

async function writeCachedProducts(env: Env, products: Product[]) {
  try {
    await env.DB.prepare(
      `insert into products_cache (id, source, payload_json, expires_at, created_at, updated_at)
       values (?, 'platzi', ?, datetime('now', '+15 minutes'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       on conflict(id) do update set payload_json = excluded.payload_json, expires_at = excluded.expires_at, updated_at = CURRENT_TIMESTAMP`
    )
      .bind(catalogCacheKey, JSON.stringify(products))
      .run();
    memoryCatalogCache = { products, expiresAt: Date.now() + memoryCacheTtlMs };
  } catch {
    // Cache failures should never block the storefront.
  }
}

async function getCatalogSource(env: Env) {
  const cached = await readCachedProducts(env);
  if (cached) {
    return withAetherProducts(cached).filter((product) => product.visibility === "visible");
  }

  const source = await fetchPlatziProducts(env).then((items) => withAetherProducts(items.filter(isCatalogCandidate).map(normalize)));
  await writeCachedProducts(env, source);
  return source.filter((product) => product.visibility === "visible");
}

async function fetchPlatziProducts(env: Env): Promise<PlatziProduct[]> {
  const baseUrl = env.PLATZI_API_BASE_URL ?? "https://api.escuelajs.co/api/v1";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`${baseUrl}/products?offset=0&limit=40`, {
      signal: controller.signal,
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Platzi API failed with ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? (payload as PlatziProduct[]) : fallbackProducts;
  } catch {
    return fallbackProducts;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCatalogProducts(env: Env, query: ProductQuery) {
  let products = await getCatalogSource(env);

  const search = query.search ?? query.q;
  if (search) {
    const needle = search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle) ||
        product.category.name.toLowerCase().includes(needle)
    );
  }

  if (query.category) {
    products = products.filter((product) => product.category.slug === query.category);
  }

  const flag = query.flag;
  if (flag) {
    products = products.filter((product) => product.flags.includes(flag));
  }
  if (query.featured) {
    products = products.filter((product) => product.featured);
  }
  if (query.deal) {
    products = products.filter((product) => product.deal);
  }
  if (query.newArrival) {
    products = products.filter((product) => product.newArrival);
  }
  if (query.inStock) {
    products = products.filter((product) => product.availableStock > 0);
  }

  const minPrice = query.minPrice;
  if (minPrice !== undefined) {
    products = products.filter((product) => product.finalPrice >= minPrice);
  }

  const maxPrice = query.maxPrice;
  if (maxPrice !== undefined) {
    products = products.filter((product) => product.finalPrice <= maxPrice);
  }

  products = products.sort((a, b) => {
    if (query.sort === "price_asc") return a.finalPrice - b.finalPrice;
    if (query.sort === "price_desc") return b.finalPrice - a.finalPrice;
    if (query.sort === "rating") return b.rating.average - a.rating.average;
    if (query.sort === "name") return a.name.localeCompare(b.name);
    if (query.sort === "discount") return b.discountPercentage - a.discountPercentage;
    if (query.sort === "newest") return Number(b.sourceId) - Number(a.sourceId);
    return Number(b.flags.includes("featured")) - Number(a.flags.includes("featured"));
  });

  const total = products.length;
  const pageSize = query.limit ?? query.pageSize;
  const start = (query.page - 1) * pageSize;
  const data = products.slice(start, start + pageSize);

  return {
    data,
    pagination: {
      page: query.page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize)
    }
  };
}

export async function getProductBySlug(env: Env, slug: string) {
  const data = await getCatalogSource(env);
  return data.find((product) => product.slug === slug);
}

export async function getProductById(env: Env, id: string) {
  const data = await getCatalogSource(env);
  return data.find((product) => product.id === id || String(product.externalId) === id);
}

export async function getCategories(env: Env) {
  const data = await getCatalogSource(env);
  const map = new Map<string, Product["category"]>();
  data.forEach((product) => map.set(product.category.slug, product.category));
  return [...map.values()];
}
