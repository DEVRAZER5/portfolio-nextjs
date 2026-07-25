async function getHealthData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch health data");
  }

  return res.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-ink mb-6">Health Check</h1>
      <p className="text-muted mb-4">
        This page confirms the deployment can reach an external API and
        render server-fetched data.
      </p>
      <pre className="bg-white rounded-lg p-4 text-sm text-ink overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="text-sm text-green-600 mt-4">✓ Fetch succeeded</p>
    </section>
  );
}
