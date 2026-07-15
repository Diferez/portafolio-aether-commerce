import { demoProducts } from "../../../components/demo-products";
import { ProductGrid } from "../../../components/ProductGrid";
import { formatUsd } from "@aether/core";
import { storefrontPath } from "../../../components/config";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = demoProducts.find((candidate) => candidate.slug === params.slug) ?? demoProducts[0]!;

  return (
    <main className="aether-shell py-8">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <img src={product.thumbnail} alt={product.name} className="aspect-[4/3] w-full rounded-lg object-cover" />
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase text-cyan-300">{product.category.name}</p>
          <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">{product.description}</p>
          <p className="mt-5 text-3xl font-semibold text-zinc-950">{formatUsd(product.finalPrice)}</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between"><dt>SKU</dt><dd>{product.sku}</dd></div>
            <div className="flex justify-between"><dt>Availability</dt><dd>{product.availabilityStatus.replaceAll("_", " ")}</dd></div>
            <div className="flex justify-between"><dt>Rating</dt><dd>{product.rating.average} / 5</dd></div>
          </dl>
          <a href={storefrontPath("/cart")} className="focus-ring mt-6 inline-flex min-h-11 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            Add to cart
          </a>
        </div>
      </section>
      <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Specifications</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {product.specifications.map((spec) => (
            <div key={spec.key} className="rounded-md border border-zinc-200 p-3">
              <p className="text-sm text-zinc-500">{spec.key}</p>
              <p className="font-semibold">{spec.value}</p>
            </div>
          ))}
        </div>
      </section>
      <ProductGrid compact heading="Related products" description="More products from the normalized Aether catalog." />
    </main>
  );
}
