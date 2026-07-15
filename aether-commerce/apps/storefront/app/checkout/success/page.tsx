export default function CheckoutSuccessPage() {
  return (
    <main className="aether-shell py-12">
      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase text-cyan-300">Payment confirmed</p>
        <h1 className="mt-2 text-4xl font-semibold">Sandbox checkout completed</h1>
        <p className="mt-4 text-zinc-600">The webhook flow is idempotent and stores payment/order events in D1.</p>
      </section>
    </main>
  );
}
