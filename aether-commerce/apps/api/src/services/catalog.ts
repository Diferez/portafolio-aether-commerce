import { cleanImageUrls, finalPriceFromDiscount, getInventoryStatus, humanizeCategorySlug, slugify } from "@aether/core";
import { productSchema, type Product, type ProductQuery } from "@aether/schemas";
import type { Env } from "../types";

type DummyJsonReview = {
  rating?: number;
  comment?: string;
  date?: string;
  reviewerName?: string;
};

type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: { width?: number; height?: number; depth?: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  reviews?: DummyJsonReview[];
  thumbnail?: string;
  images?: unknown;
};

export const catalogCacheKey = "dummyjson-products-v1";
const fallbackImageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
const memoryCacheTtlMs = 5 * 60 * 1000;
let memoryCatalogCache: { expiresAt: number; products: Product[] } | null = null;

// Hand-authored Aether-branded products, always merged into the catalog
// regardless of DummyJSON availability (see withAetherProducts). Category
// values are DummyJSON-style slugs so they flow through the same
// normalize() path as real API data.
const fallbackProducts: DummyJsonProduct[] = [
  {
    id: 9001,
    title: "Aether Arc Laptop",
    price: 1899,
    description: "A magnesium ultrabook with color-accurate display and all-day battery.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"],
    category: "laptops",
    brand: "Aether"
  },
  {
    id: 9002,
    title: "Aether Dock Studio",
    price: 329,
    description: "A compact Thunderbolt dock for creators and desk-first teams.",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"],
    category: "mobile-accessories",
    brand: "Aether"
  },
  {
    id: 9003,
    title: "Aether Pulse Headset",
    price: 249,
    description: "A low-latency headset tuned for calls, focus sessions, and travel.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
    category: "audio",
    brand: "Aether"
  },
  {
    id: 9004,
    title: "Nordic Lounge Chair",
    price: 489,
    description: "A sculpted lounge chair with warm textile upholstery for home studios and reading corners.",
    images: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80"],
    category: "furniture",
    brand: "Aether"
  },
  {
    id: 9005,
    title: "Canvas Weekender Bag",
    price: 138,
    description: "A durable travel bag with structured compartments for short trips and daily carry.",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80"],
    category: "womens-bags",
    brand: "Aether"
  },
  {
    id: 9006,
    title: "Everyday Runner Sneakers",
    price: 119,
    description: "Lightweight sneakers built for daily movement, casual outfits, and weekend walks.",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"],
    category: "womens-shoes",
    brand: "Aether"
  },
  {
    id: 9007,
    title: "Minimal Desk Lamp",
    price: 86,
    description: "A compact LED desk lamp with focused lighting for workspaces, bedrooms, and studios.",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"],
    category: "home-decoration",
    brand: "Aether"
  },
  {
    id: 9008,
    title: "Ceramic Coffee Set",
    price: 64,
    description: "A balanced ceramic coffee set for slow mornings, small kitchens, and thoughtful gifting.",
    images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80"],
    category: "home-decoration",
    brand: "Aether"
  },
  {
    id: 9009,
    title: "Wireless Travel Speaker",
    price: 156,
    description: "A portable speaker with clear audio, compact build, and battery life for everyday trips.",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80"],
    category: "audio",
    brand: "Aether"
  },
  {
    id: 9010,
    title: "Leather Card Wallet",
    price: 58,
    description: "A slim leather wallet with clean stitching and quick access for essential cards.",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80"],
    category: "mobile-accessories",
    brand: "Aether"
  },
  {
    id: 9011,
    title: "Classic Denim Jacket",
    price: 132,
    description: "A versatile denim jacket with a structured fit for layered everyday styling.",
    images: ["https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80"],
    category: "mens-shirts",
    brand: "Aether"
  },
  {
    id: 9012,
    title: "Modern Side Table",
    price: 174,
    description: "A compact side table with clean lines for living rooms, bedrooms, and small apartments.",
    images: ["https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1200&q=80"],
    category: "furniture",
    brand: "Aether"
  }
];

function discountFor(id: number): number {
  if (id % 7 === 0) return 18;
  if (id % 5 === 0) return 12;
  if (id % 3 === 0) return 8;
  return 0;
}

function flagsFor(product: DummyJsonProduct): Product["flags"] {
  const flags: Product["flags"] = [];
  if (product.id % 2 === 0) flags.push("featured");
  if (product.id % 3 === 0) flags.push("new");
  if (discountFor(product.id) > 0) flags.push("deal");
  if (product.id % 11 === 0) flags.push("limited");
  return flags.length > 0 ? flags : ["featured"];
}

function isMeaningfulText(value: string, minWords = 2) {
  const trimmed = value.trim();
  const blockedTitles = /^(new product|test product|sample product|demo product|kkk|aaa|asd|asdf|qwerty)$/i;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const hasVowels = /[aeiou]/i.test(trimmed);
  const repeatedChars = /(.)\1{2,}/i.test(trimmed);
  const mostlySymbols = trimmed.replace(/[a-z0-9\s-]/gi, "").length > trimmed.length / 3;
  return trimmed.length >= 6 && words.length >= minWords && hasVowels && !repeatedChars && !mostlySymbols && !blockedTitles.test(trimmed);
}

function isTrustedImageUrl(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    const allowedHosts = ["cdn.dummyjson.com", "images.unsplash.com", "i.imgur.com"];
    const blockedPatterns = /(placeholder|test|example|kkk|undefined|null|\.(svg|gif)$)/i;
    return allowedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)) && !blockedPatterns.test(pathname);
  } catch {
    return false;
  }
}

function isCatalogCandidate(product: DummyJsonProduct) {
  const images = cleanImageUrls(product.images, fallbackImageUrl).filter(isTrustedImageUrl);
  return (
    Number.isFinite(product.id) &&
    Number(product.price) > 0 &&
    isMeaningfulText(product.title) &&
    isMeaningfulText(product.description, 4) &&
    images.length > 0
  );
}

function normalizeReviews(reviews: DummyJsonReview[] | undefined, fallbackDate: string): Product["reviews"] {
  if (!Array.isArray(reviews)) {
    return [];
  }

  return reviews
    .filter((review) => typeof review.comment === "string" && review.comment.trim().length > 0)
    .slice(0, 20)
    .map((review) => ({
      rating: Math.min(5, Math.max(0, Number(review.rating) || 0)),
      comment: review.comment!.trim(),
      date: (() => {
        const parsed = review.date ? new Date(review.date) : null;
        return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : fallbackDate;
      })(),
      // reviewerEmail is intentionally dropped - never surface it to the client.
      reviewerName: review.reviewerName?.trim() || "Aether Customer"
    }));
}

function normalize(product: DummyJsonProduct): Product {
  const slug = slugify(product.title || `product-${product.id}`);
  const categorySlug = slugify(product.category || "technology") || "technology";
  const categoryName = humanizeCategorySlug(categorySlug);
  const price = Math.max(0, Math.round(Number(product.price || 0) * 100));
  const discountPercentage = discountFor(product.id);
  const finalPrice = finalPriceFromDiscount(price, discountPercentage);

  // Effective-stock rule: the deterministic per-id formula below is the
  // source of truth for what the storefront sells (stable across catalog
  // syncs, immune to upstream demo-data flicker). DummyJSON's own `stock`
  // field is preserved separately as `externalStock` for admin visibility
  // only - it never overwrites a computed/local stock value. There is no
  // wired-up local override table yet (see docs/adr - product_overrides is
  // currently write-only), so `localInventoryOverride` is not present in
  // this chain; when it exists, it must take priority above both.
  const initialStock = 8 + (product.id % 24);
  const reservedStock = product.id % 4;
  const soldStock = product.id % 9;
  const returnedStock = product.id % 3;
  const adjustedStock = product.id % 2 === 0 ? 2 : 0;
  const available = Math.max(0, initialStock + adjustedStock + returnedStock - reservedStock - soldStock);
  const availabilityStatus = getInventoryStatus(available, 4);
  const externalStock = Number.isFinite(product.stock) ? Math.max(0, Math.round(Number(product.stock))) : null;

  const images = cleanImageUrls(
    [product.thumbnail, ...(Array.isArray(product.images) ? (product.images as unknown[]) : [])],
    fallbackImageUrl
  ).filter(isTrustedImageUrl).map((url, index): Product["images"][number] => ({
    url,
    alt: `${product.title} image ${index + 1}`,
    source: "dummyjson"
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
  const shortDescription = (product.description || "Premium technology selected for Aether.").slice(0, 140);
  const sku = product.sku?.trim() || `AET-${product.id}-STD`;
  const now = new Date().toISOString();
  const dimensions =
    product.dimensions &&
    Number.isFinite(product.dimensions.width) &&
    Number.isFinite(product.dimensions.height) &&
    Number.isFinite(product.dimensions.depth)
      ? {
          width: Number(product.dimensions.width),
          height: Number(product.dimensions.height),
          depth: Number(product.dimensions.depth)
        }
      : null;
  const reviews = normalizeReviews(product.reviews, now);
  const rating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
      : Math.round((4.1 + (product.id % 8) / 10) * 10) / 10;

  return productSchema.parse({
    id: `dummyjson_${product.id}`,
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
      id: categorySlug,
      externalId: null,
      slug: categorySlug,
      name: categoryName,
      image: safeImages[0]?.url ?? null
    },
    sku,
    brand: product.brand?.trim() || "Aether",
    tags: [categorySlug, ...(Array.isArray(product.tags) ? product.tags.filter((tag) => typeof tag === "string") : []), ...flags],
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
      { key: "SKU", value: sku },
      { key: "Warranty", value: product.warrantyInformation?.trim() || "Demo international warranty" },
      { key: "Fulfillment", value: product.shippingInformation?.trim() || "Simulated Aether fulfillment" },
      ...(dimensions ? [{ key: "Dimensions", value: `${dimensions.width} x ${dimensions.height} x ${dimensions.depth} cm` }] : []),
      ...(Number.isFinite(product.weight) ? [{ key: "Weight", value: `${product.weight} kg` }] : [])
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
      average: rating,
      count: reviews.length > 0 ? reviews.length : 18 + product.id * 3
    },
    reviewCount: reviews.length > 0 ? reviews.length : 18 + product.id * 3,
    reviews,
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
    catalogSource: "dummyjson",
    externalStock,
    lastSyncedAt: now,
    shippingInformation: product.shippingInformation?.trim() || null,
    warrantyInformation: product.warrantyInformation?.trim() || null,
    returnPolicy: product.returnPolicy?.trim() || null,
    minimumOrderQuantity: Number.isFinite(product.minimumOrderQuantity) ? Math.max(1, Math.round(Number(product.minimumOrderQuantity))) : null,
    weight: Number.isFinite(product.weight) ? Number(product.weight) : null,
    dimensions,
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
       values (?, 'dummyjson', ?, datetime('now', '+15 minutes'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       on conflict(id) do update set source = 'dummyjson', payload_json = excluded.payload_json, expires_at = excluded.expires_at, updated_at = CURRENT_TIMESTAMP`
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

  const source = await fetchDummyJsonProducts(env).then((items) => withAetherProducts(items.filter(isCatalogCandidate).map(normalize)));
  await writeCachedProducts(env, source);
  return source.filter((product) => product.visibility === "visible");
}

async function fetchDummyJsonProducts(env: Env): Promise<DummyJsonProduct[]> {
  const baseUrl = env.DUMMYJSON_API_BASE_URL ?? "https://dummyjson.com";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`${baseUrl}/products?limit=100&skip=0`, {
      signal: controller.signal,
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`DummyJSON API failed with ${response.status}`);
    }

    const payload: unknown = await response.json();
    const products = payload && typeof payload === "object" ? (payload as { products?: unknown }).products : undefined;
    return Array.isArray(products) ? (products as DummyJsonProduct[]) : fallbackProducts;
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
        product.category.name.toLowerCase().includes(needle) ||
        (product.brand ?? "").toLowerCase().includes(needle)
    );
  }

  if (query.category) {
    products = products.filter((product) => product.category.slug === query.category);
  }

  if (query.brand) {
    const needle = query.brand.toLowerCase();
    products = products.filter((product) => (product.brand ?? "").toLowerCase() === needle);
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
  if (query.hasDiscount) {
    products = products.filter((product) => product.discountPercentage > 0);
  }

  const minPrice = query.minPrice;
  if (minPrice !== undefined) {
    products = products.filter((product) => product.finalPrice >= minPrice);
  }

  const maxPrice = query.maxPrice;
  if (maxPrice !== undefined) {
    products = products.filter((product) => product.finalPrice <= maxPrice);
  }

  const minRating = query.minRating;
  if (minRating !== undefined) {
    products = products.filter((product) => product.rating.average >= minRating);
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

export async function clearCatalogCache(env: Env) {
  memoryCatalogCache = null;
  try {
    await env.DB.prepare("delete from products_cache where id = ?").bind(catalogCacheKey).run();
  } catch {
    // Best-effort - a stale cache row just means a slower next read, not a failure.
  }
}

export async function getBrands(env: Env) {
  const data = await getCatalogSource(env);
  const brands = new Set<string>();
  data.forEach((product) => {
    if (product.brand) {
      brands.add(product.brand);
    }
  });
  return [...brands].sort((a, b) => a.localeCompare(b));
}

// Exported for characterization tests only - not part of the public catalog API surface.
export const __testables = {
  normalize,
  discountFor,
  flagsFor,
  isCatalogCandidate,
  isTrustedImageUrl,
  isMeaningfulText,
  normalizeReviews,
  fallbackProducts
};
