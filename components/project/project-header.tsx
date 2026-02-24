import { PrintButton } from "@/components/project/print-button";
import type { ProjectHeaderModel } from "@/lib/projects/types";

type ProjectHeaderProps = {
  project: ProjectHeaderModel;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-parchment-green">{project.name}</h1>
          <p className="mt-1 text-sm uppercase tracking-wide text-parchment-ink/70">Codename: {project.codename}</p>
          {project.isCore ? (
            <p className="mt-2 inline-block rounded border border-parchment-gold bg-parchment-gold/10 px-2 py-1 text-xs font-semibold text-parchment-gold">
              Core Initiative
            </p>
          ) : null}
        </div>
        <PrintButton />
      </div>
    </header>
  );
}
