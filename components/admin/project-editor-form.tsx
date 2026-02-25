import { createProjectAction, updateProjectAdminAction } from "@/app/(protected)/admin/projects/actions";
import { TeamAssignmentManager } from "@/components/admin/team-assignment-manager";
import type { AdminProject, AdminTeam } from "@/lib/admin/types";

type ProjectEditorFormProps = {
  projects: AdminProject[];
  teams: AdminTeam[];
  projectTeams: Array<{ projectId: string; teamId: string }>;
};

export function ProjectEditorForm({ projects, teams, projectTeams }: ProjectEditorFormProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Create Project</h2>

        <form action={createProjectAction} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-parchment-green">Name</span>
              <input name="name" required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-parchment-green">Codename</span>
              <input name="codename" required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2" />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-parchment-green">Description</span>
            <textarea name="description" required rows={3} className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2" />
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-semibold text-parchment-green">
            <input type="checkbox" name="isCore" /> Core project
          </label>

          <div>
            <p className="mb-2 text-sm font-semibold text-parchment-green">Assign Teams</p>
            <TeamAssignmentManager teams={teams} selectedTeamIds={new Set()} />
          </div>

          <button
            type="submit"
            className="rounded border border-parchment-green bg-parchment-green px-4 py-2 text-sm font-semibold text-parchment-base"
          >
            Create Project
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-parchment-green">Edit Projects</h2>
        {projects.length === 0 ? (
          <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">
            No projects found.
          </p>
        ) : (
          projects.map((project) => {
            const selectedTeams = new Set(
              projectTeams.filter((assignment) => assignment.projectId === project.id).map((assignment) => assignment.teamId)
            );

            return (
              <form key={project.id} action={updateProjectAdminAction} className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
                <input type="hidden" name="projectId" value={project.id} />

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold text-parchment-green">Name</span>
                    <input
                      name="name"
                      defaultValue={project.name}
                      required
                      className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold text-parchment-green">Codename</span>
                    <input
                      name="codename"
                      defaultValue={project.codename}
                      required
                      className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                    />
                  </label>
                </div>

                <label className="mt-3 block text-sm">
                  <span className="mb-1 block font-semibold text-parchment-green">Description</span>
                  <textarea
                    name="description"
                    defaultValue={project.description}
                    required
                    rows={3}
                    className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                  />
                </label>

                <label className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-parchment-green">
                  <input type="checkbox" name="isCore" defaultChecked={project.isCore} /> Core project
                </label>

                <div className="mt-3">
                  <p className="mb-2 text-sm font-semibold text-parchment-green">Assign Teams</p>
                  <TeamAssignmentManager teams={teams} selectedTeamIds={selectedTeams} />
                </div>

                <button
                  type="submit"
                  className="mt-3 rounded border border-parchment-green bg-parchment-green px-4 py-2 text-sm font-semibold text-parchment-base"
                >
                  Save Project
                </button>
              </form>
            );
          })
        )}
      </section>
    </div>
  );
}
