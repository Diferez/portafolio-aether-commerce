import { ProductGrid } from "../../../components/ProductGrid";

export function generateStaticParams() {
  return ["electronics", "furniture", "shoes", "miscellaneous", "laptops", "accessories", "audio"].map((slug) => ({ slug }));
}

export default async function CategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main>
      <ProductGrid heading={`Category: ${slug}`} description="Products filtered by category through the Aether API contract." />
    </main>
  );
}
