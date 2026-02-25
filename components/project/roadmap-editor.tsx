import {
  createRoadmapItemAction,
  deleteRoadmapItemAction,
  updateRoadmapItemAction
} from "@/app/(protected)/projects/[projectId]/actions";
import type { ProjectDetailModel } from "@/lib/projects/types";

type RoadmapEditorProps = {
  projectId: string;
  roadmap: ProjectDetailModel["roadmap"];
  teamOptions: ProjectDetailModel["teamOptions"];
  personOptions: ProjectDetailModel["personOptions"];
};

const HORIZONS: Array<{ value: "now" | "next" | "later"; label: string }> = [
  { value: "now", label: "Now" },
  { value: "next", label: "Next" },
  { value: "later", label: "Later" }
];

export function RoadmapEditor({ projectId, roadmap, teamOptions, personOptions }: RoadmapEditorProps) {
  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Roadmap Editing</h2>
      <p className="mt-1 text-sm text-parchment-ink/80">Create, update, and remove roadmap items.</p>

      <form action={createRoadmapItemAction} className="mt-4 grid gap-3 rounded border border-parchment-border bg-parchment-base/70 p-4">
        <input type="hidden" name="projectId" value={projectId} />

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-parchment-green">Title</span>
          <input name="title" required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2" />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-parchment-green">Body</span>
          <textarea name="body" required rows={3} className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2" />
        </label>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-parchment-green">Horizon</span>
            <select name="horizon" defaultValue="now" className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2">
              {HORIZONS.map((horizon) => (
                <option key={horizon.value} value={horizon.value}>
                  {horizon.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-parchment-green">Team</span>
            <select name="teamId" defaultValue="" className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2">
              <option value="">Unassigned</option>
              {teamOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-parchment-green">Owner</span>
            <select
              name="ownerPersonId"
              defaultValue=""
              className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
            >
              <option value="">Unassigned</option>
              {personOptions.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="rounded border border-parchment-green bg-parchment-green px-4 py-2 text-sm font-semibold text-parchment-base"
          >
            Add Roadmap Item
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {roadmap.length === 0 ? (
          <p className="text-sm text-parchment-ink/80">No existing roadmap items to edit.</p>
        ) : (
          roadmap.map((item) => (
            <form
              key={item.id}
              action={updateRoadmapItemAction}
              className="grid gap-3 rounded border border-parchment-border bg-parchment-base/70 p-4"
            >
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="roadmapItemId" value={item.id} />

              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-parchment-green">Title</span>
                <input
                  name="title"
                  required
                  defaultValue={item.title}
                  className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-parchment-green">Body</span>
                <textarea
                  name="body"
                  required
                  rows={3}
                  defaultValue={item.body}
                  className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-parchment-green">Horizon</span>
                  <select
                    name="horizon"
                    defaultValue={item.horizon}
                    className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                  >
                    {HORIZONS.map((horizon) => (
                      <option key={horizon.value} value={horizon.value}>
                        {horizon.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-parchment-green">Team</span>
                  <select
                    name="teamId"
                    defaultValue={item.teamId ?? ""}
                    className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                  >
                    <option value="">Unassigned</option>
                    {teamOptions.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-parchment-green">Owner</span>
                  <select
                    name="ownerPersonId"
                    defaultValue={item.ownerPersonId ?? ""}
                    className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
                  >
                    <option value="">Unassigned</option>
                    {personOptions.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="rounded border border-parchment-green bg-parchment-green px-4 py-2 text-sm font-semibold text-parchment-base"
                >
                  Save Item
                </button>

                <button
                  formAction={deleteRoadmapItemAction}
                  type="submit"
                  className="rounded border border-red-700 bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete Item
                </button>
              </div>
            </form>
          ))
        )}
      </div>
    </section>
  );
}
