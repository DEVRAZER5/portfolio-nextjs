import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-ink mb-4">
        Frontend developer who ships real projects.
      </h1>
      <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
        I'm Rifet Mehić, an Informatics Engineer building clean, functional
        websites and learning in public — one real project at a time.
      </p>
      <Link
        href="/projects"
        className="inline-block bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
      >
        See my work
      </Link>
    </section>
  );
}
