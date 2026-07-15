import { ProductGrid } from "../../../components/ProductGrid";

export function generateStaticParams() {
  return ["electronics", "furniture", "shoes", "miscellaneous", "laptops", "accessories", "audio"].map((slug) => ({ slug }));
}

export default function CategoryProductsPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <ProductGrid heading={`Category: ${params.slug}`} description="Products filtered by category through the Aether API contract." />
    </main>
  );
}
