import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import type { AppRole } from "@/lib/auth/guards";
import { requireRole, requireUser } from "@/lib/auth/guards";
import { hasMinimumRole } from "@/lib/auth/role-utils";
import { getMyProjects } from "@/lib/projects/get-my-projects";

export default async function MyProjectsPage() {
  const { authUser, profile } = await requireUser({ activeOnly: true });
  const role = (profile?.role ?? (authUser.app_metadata.role as AppRole | undefined) ?? "viewer") as AppRole;

  if (!hasMinimumRole(role, "editor")) {
    await requireRole("editor");
  }

  const projects = await getMyProjects(authUser.id, role);

  return (
    <section>
      <PageHeader
        title="My Projects"
        description="Projects where you have edit access. Use these entry points for roadmap and project updates."
      />

      {projects.length === 0 ? (
        <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">
          No project edit assignments found.
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <article key={project.id} className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-parchment-green">{project.name}</h2>
                  <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{project.codename}</p>
                </div>
                <Link href={`/projects/${project.id}`} className="text-sm font-semibold text-parchment-green underline">
                  Open Editor
                </Link>
              </div>
              <p className="mt-2 text-sm text-parchment-ink/85">{project.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
