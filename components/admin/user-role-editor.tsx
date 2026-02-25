import {
  addProjectEditorAction,
  removeProjectEditorAction,
  updateUserRoleAction,
  updateUserStatusAction
} from "@/app/(protected)/admin/users/actions";
import type { AdminProject, AdminUser, ProjectEditorAssignment } from "@/lib/admin/types";

type UserRoleEditorProps = {
  users: AdminUser[];
  projects: AdminProject[];
  assignments: ProjectEditorAssignment[];
};

const ROLE_OPTIONS: Array<"viewer" | "editor" | "admin"> = ["viewer", "editor", "admin"];
const STATUS_OPTIONS: Array<"pending" | "active" | "denied"> = ["pending", "active", "denied"];

export function UserRoleEditor({ users, projects, assignments }: UserRoleEditorProps) {
  if (users.length === 0) {
    return (
      <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">No users found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const assignedProjectIds = new Set(
          assignments.filter((assignment) => assignment.userId === user.id).map((assignment) => assignment.projectId)
        );

        return (
          <section key={user.id} className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
            <header className="mb-3">
              <h3 className="text-lg font-semibold text-parchment-green">{user.name ?? user.email}</h3>
              <p className="text-sm text-parchment-ink/80">{user.email}</p>
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
              <form action={updateUserRoleAction} className="rounded border border-parchment-border bg-parchment-base/70 p-3">
                <input type="hidden" name="userId" value={user.id} />
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-parchment-green">Role</span>
                  <select name="role" defaultValue={user.role} className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2">
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="mt-3 rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base"
                >
                  Save Role
                </button>
              </form>

              <form action={updateUserStatusAction} className="rounded border border-parchment-border bg-parchment-base/70 p-3">
                <input type="hidden" name="userId" value={user.id} />
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-parchment-green">Status</span>
                  <select
                    name="status"
                    defaultValue={user.status}
                    className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="mt-3 rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base"
                >
                  Save Status
                </button>
              </form>
            </div>

            <div className="mt-4 rounded border border-parchment-border bg-parchment-base/70 p-3">
              <h4 className="text-sm font-semibold text-parchment-green">Project Edit Rights</h4>
              {projects.length === 0 ? (
                <p className="mt-2 text-sm text-parchment-ink/80">No projects available.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {projects.map((project) => {
                    const assigned = assignedProjectIds.has(project.id);
                    return (
                      <li key={`${user.id}-${project.id}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>
                          {project.name} <span className="text-parchment-ink/70">({project.codename})</span>
                        </span>
                        {assigned ? (
                          <form action={removeProjectEditorAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="projectId" value={project.id} />
                            <button type="submit" className="rounded border border-red-700 bg-red-700 px-2 py-1 text-xs font-semibold text-white">
                              Remove
                            </button>
                          </form>
                        ) : (
                          <form action={addProjectEditorAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="projectId" value={project.id} />
                            <button
                              type="submit"
                              className="rounded border border-parchment-green bg-parchment-green px-2 py-1 text-xs font-semibold text-parchment-base"
                            >
                              Assign
                            </button>
                          </form>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
