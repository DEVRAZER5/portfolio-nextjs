import { projects, getProjectBySlug } from "../../../data/projects";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({ params }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-ink mb-8">{project.name}</h1>

      <h2 className="text-lg font-semibold text-ink mt-6 mb-2">Problem</h2>
      <p className="text-muted">{project.problem}</p>

      <h2 className="text-lg font-semibold text-ink mt-6 mb-2">
        What I Did
      </h2>
      <p className="text-muted">{project.whatIDid}</p>

      <h2 className="text-lg font-semibold text-ink mt-6 mb-2">
        What Came Of It
      </h2>
      <p className="text-muted">{project.outcome}</p>
    </article>
  );
}
