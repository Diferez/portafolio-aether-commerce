export default function OrdersPage() {
  return (
    <main className="aether-shell py-8">
      <h1 className="text-4xl font-semibold">Orders</h1>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
        <p className="text-zinc-600">Authenticated order history is served by `/api/v1/orders` with immutable item snapshots.</p>
      </div>
    </main>
  );
}
