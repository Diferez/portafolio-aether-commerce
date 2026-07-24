import { humanizeCategorySlug } from "@aether/core";
import { ProductGrid } from "../../../components/ProductGrid";

// DummyJSON's real category taxonomy plus the couple of custom slugs used by
// Aether's own bonus fallback products (see apps/api/src/services/catalog.ts).
export function generateStaticParams() {
  return [
    "smartphones",
    "laptops",
    "fragrances",
    "skin-care",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
    "mobile-accessories",
    "tablets",
    "sports-accessories",
    "beauty",
    "audio",
    "accessories"
  ].map((slug) => ({ slug }));
}

export default async function CategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryName = humanizeCategorySlug(slug);

  return (
    <main>
      <ProductGrid
        fixedCategory={slug}
        heading={categoryName}
        description="Products filtered by category through the Aether Catalog Adapter."
      />
    </main>
  );
}
