import { applyPercentageDiscount } from "./money";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function cleanImageUrls(input: unknown, fallbackUrl: string): string[] {
  const values = Array.isArray(input) ? input : [];
  const cleaned = values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().replaceAll("[", "").replaceAll("]", "").replace(/^["']+|["']+$/g, ""))
    .filter((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    });

  return cleaned.length > 0 ? [...new Set(cleaned)] : [fallbackUrl];
}

export function finalPriceFromDiscount(price: number, discountPercentage: number): number {
  return applyPercentageDiscount(price, discountPercentage);
}
