import Link from "next/link";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-ink mb-8">Projects</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-ink mb-2">
              {project.name}
            </h2>
            <p className="text-sm text-muted">{project.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
