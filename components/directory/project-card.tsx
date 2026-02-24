import Link from "next/link";

import type { ProjectDirectoryItem } from "@/lib/directory/types";

type ProjectCardProps = {
  project: ProjectDirectoryItem;
};

function renderPreview(items: string[]) {
  if (items.length === 0) {
    return "None assigned";
  }

  const preview = items.slice(0, 3).join(", ");
  if (items.length <= 3) {
    return preview;
  }

  return `${preview}, +${items.length - 3} more`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-parchment-border bg-parchment-base/90 p-4 shadow-parchment">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-parchment-green">{project.name}</h3>
          <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{project.codename}</p>
        </div>
        {project.isCore ? (
          <span className="rounded border border-parchment-gold bg-parchment-gold/10 px-2 py-0.5 text-xs font-semibold text-parchment-gold">
            Core
          </span>
        ) : null}
      </div>

      <p className="mb-3 line-clamp-3 text-sm text-parchment-ink/85">{project.description}</p>

      <dl className="space-y-1 text-sm">
        <div>
          <dt className="inline font-semibold text-parchment-green">Teams: </dt>
          <dd className="inline">{renderPreview(project.teamNames)}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-parchment-green">Staffing: </dt>
          <dd className="inline">
            {project.peopleCount} people ({renderPreview(project.peopleNames)})
          </dd>
        </div>
      </dl>

      <Link
        href={`/projects/${project.id}`}
        className="mt-3 inline-block text-sm font-semibold text-parchment-green underline"
      >
        Open project dossier
      </Link>
    </article>
  );
}
