import { describe, expect, it } from "vitest";
import { __testables } from "./catalog";

const { normalize, discountFor, flagsFor, isCatalogCandidate, isTrustedImageUrl, isMeaningfulText, normalizeReviews, fallbackProducts } =
  __testables;

function makeDummyJsonProduct(overrides: Partial<Parameters<typeof normalize>[0]> = {}) {
  return {
    id: 42,
    title: "Premium Wireless Mouse",
    description: "A precise wireless mouse built for long work sessions.",
    category: "mobile-accessories",
    price: 59.99,
    discountPercentage: 12.5,
    stock: 34,
    tags: ["wireless", "office"],
    brand: "Logitech",
    sku: "LOG-MW-42",
    weight: 0.12,
    dimensions: { width: 6.5, height: 3.8, depth: 11.2 },
    warrantyInformation: "2 year warranty",
    shippingInformation: "Ships in 1 business day",
    returnPolicy: "90 days return policy",
    minimumOrderQuantity: 1,
    reviews: [
      { rating: 5, comment: "Excellent tracking and battery life.", date: "2026-01-15T00:00:00.000Z", reviewerName: "Test User", reviewerEmail: "test@example.com" }
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/mobile-accessories/mouse/thumbnail.png",
    images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/mouse/1.png"],
    ...overrides
  };
}

describe("catalog.normalize", () => {
  it("maps a DummyJSON product onto the Aether Product contract", () => {
    const product = normalize(makeDummyJsonProduct());

    expect(product.id).toBe("dummyjson_42");
    expect(product.externalId).toBe(42);
    expect(product.sourceId).toBe("42");
    expect(product.slug).toBe("premium-wireless-mouse");
    expect(product.catalogSource).toBe("dummyjson");
    expect(product.brand).toBe("Logitech");
    expect(product.sku).toBe("LOG-MW-42");
    expect(product.category.slug).toBe("mobile-accessories");
    expect(product.category.name).toBe("Mobile Accessories");
  });

  it("converts a decimal dollar price into integer cents", () => {
    const product = normalize(makeDummyJsonProduct({ price: 59.99 }));
    expect(product.price).toBe(5999);
    expect(Number.isInteger(product.price)).toBe(true);
  });

  it("derives discountPercentage from the deterministic id formula, not the source field", () => {
    // id=42 -> 42 % 3 === 0 -> 8% (see discountFor); the raw DummyJSON
    // discountPercentage (12.5%) must never leak through.
    const product = normalize(makeDummyJsonProduct({ id: 42, discountPercentage: 12.5 }));
    expect(product.discountPercentage).toBe(discountFor(42));
    expect(product.discountPercentage).not.toBe(12.5);
  });

  it("stores the raw DummyJSON stock as externalStock without using it for availableStock", () => {
    const product = normalize(makeDummyJsonProduct({ id: 42, stock: 999 }));
    expect(product.externalStock).toBe(999);
    expect(product.availableStock).not.toBe(999);
    expect(product.availableStock).toBeGreaterThanOrEqual(0);
  });

  it("tags every image with source dummyjson when the URL is trusted", () => {
    const product = normalize(makeDummyJsonProduct());
    expect(product.images.length).toBeGreaterThan(0);
    expect(product.images.every((image) => image.source === "dummyjson")).toBe(true);
  });

  it("falls back to a fallback-sourced image when no trusted image is present", () => {
    const product = normalize(makeDummyJsonProduct({ images: ["https://evil.example.com/x.png"], thumbnail: "https://evil.example.com/y.png" }));
    expect(product.images[0]?.source).toBe("fallback");
  });

  it("carries shipping/warranty/return fields through untouched", () => {
    const product = normalize(makeDummyJsonProduct());
    expect(product.shippingInformation).toBe("Ships in 1 business day");
    expect(product.warrantyInformation).toBe("2 year warranty");
    expect(product.returnPolicy).toBe("90 days return policy");
    expect(product.dimensions).toEqual({ width: 6.5, height: 3.8, depth: 11.2 });
    expect(product.weight).toBe(0.12);
  });

  it("normalizes every hand-authored fallback product without throwing", () => {
    for (const product of fallbackProducts) {
      expect(() => normalize(product)).not.toThrow();
    }
  });
});

describe("catalog.normalizeReviews", () => {
  it("maps rating/comment/date/reviewerName and drops reviewerEmail", () => {
    const [review] = normalizeReviews(
      [{ rating: 4.6, comment: "Great value.", date: "2026-02-01T00:00:00.000Z", reviewerName: "Jamie", reviewerEmail: "jamie@example.com" } as never],
      "2026-01-01T00:00:00.000Z"
    );
    if (!review) throw new Error("expected a normalized review");
    expect(review.reviewerName).toBe("Jamie");
    expect(review.comment).toBe("Great value.");
    expect(review).not.toHaveProperty("reviewerEmail");
  });

  it("clamps out-of-range ratings and skips reviews without a comment", () => {
    const reviews = normalizeReviews(
      [
        { rating: 9, comment: "Too high a rating.", reviewerName: "A" } as never,
        { rating: -3, comment: "Too low a rating.", reviewerName: "B" } as never,
        { rating: 4, comment: "", reviewerName: "C" } as never
      ],
      "2026-01-01T00:00:00.000Z"
    );
    expect(reviews).toHaveLength(2);
    expect(reviews[0]?.rating).toBe(5);
    expect(reviews[1]?.rating).toBe(0);
  });

  it("returns an empty array for missing or non-array input", () => {
    expect(normalizeReviews(undefined, "2026-01-01T00:00:00.000Z")).toEqual([]);
    expect(normalizeReviews([] as never, "2026-01-01T00:00:00.000Z")).toEqual([]);
  });
});

describe("catalog.discountFor / flagsFor", () => {
  it("is deterministic for a given id", () => {
    expect(discountFor(21)).toBe(discountFor(21));
    expect(discountFor(7)).toBe(18);
    expect(discountFor(10)).toBe(12);
    expect(discountFor(9)).toBe(8);
    expect(discountFor(1)).toBe(0);
  });

  it("always returns at least one flag", () => {
    for (let id = 1; id <= 30; id += 1) {
      expect(flagsFor(makeDummyJsonProduct({ id })).length).toBeGreaterThan(0);
    }
  });
});

describe("catalog.isCatalogCandidate", () => {
  it("accepts a well-formed product", () => {
    expect(isCatalogCandidate(makeDummyJsonProduct())).toBe(true);
  });

  it("rejects a product with zero price", () => {
    expect(isCatalogCandidate(makeDummyJsonProduct({ price: 0 }))).toBe(false);
  });

  it("rejects a product with no trusted images", () => {
    const product = makeDummyJsonProduct({ images: [] });
    delete (product as { thumbnail?: string }).thumbnail;
    expect(isCatalogCandidate(product)).toBe(false);
  });

  it("rejects a product with a low-quality title", () => {
    expect(isCatalogCandidate(makeDummyJsonProduct({ title: "asdf" }))).toBe(false);
  });
});

describe("catalog.isMeaningfulText", () => {
  it("accepts a normal sentence", () => {
    expect(isMeaningfulText("A precise wireless mouse", 2)).toBe(true);
  });

  it("rejects keyboard-mash and repeated-character strings", () => {
    expect(isMeaningfulText("qwerty")).toBe(false);
    expect(isMeaningfulText("aaaaaaaa")).toBe(false);
  });
});

describe("catalog.isTrustedImageUrl", () => {
  it("trusts DummyJSON's CDN", () => {
    expect(isTrustedImageUrl("https://cdn.dummyjson.com/products/images/laptops/1.png")).toBe(true);
  });

  it("trusts the Unsplash fallback host", () => {
    expect(isTrustedImageUrl("https://images.unsplash.com/photo-1")).toBe(true);
  });

  it("rejects an untrusted host", () => {
    expect(isTrustedImageUrl("https://evil.example.com/1.png")).toBe(false);
  });

  it("rejects a malformed URL", () => {
    expect(isTrustedImageUrl("not-a-url")).toBe(false);
  });
});
