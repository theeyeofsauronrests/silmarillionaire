import {
  createKeyMilestoneAction,
  deleteKeyMilestoneAction,
  updateKeyMilestoneAction
} from "@/app/(protected)/projects/[projectId]/actions";
import type { ProjectKeyMilestone } from "@/lib/projects/types";

type KeyMilestonesEditorProps = {
  projectId: string;
  milestones: ProjectKeyMilestone[];
};

const CATEGORIES: Array<ProjectKeyMilestone["category"]> = ["event", "release", "exercise", "other"];

export function KeyMilestonesEditor({ projectId, milestones }: KeyMilestonesEditorProps) {
  return (
    <section id="milestones-editor" className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Milestones Editing</h2>
      <p className="mt-1 text-sm text-parchment-ink/80">Add upcoming events, releases, exercises, and major checkpoints.</p>

      <form action={createKeyMilestoneAction} className="mt-4 grid gap-2 rounded border border-parchment-border bg-parchment-base/70 p-4">
        <input type="hidden" name="projectId" value={projectId} />
        <input name="title" placeholder="Milestone title" required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
        <textarea name="details" placeholder="Details" required rows={2} className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
        <div className="grid gap-2 md:grid-cols-2">
          <input type="date" name="milestoneDate" className="rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
          <select name="category" defaultValue="event" className="rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm">
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base">
          Add Milestone
        </button>
      </form>

      <div className="mt-3 space-y-3">
        {milestones.map((milestone) => (
          <form key={milestone.id} action={updateKeyMilestoneAction} className="grid gap-2 rounded border border-parchment-border bg-parchment-base/70 p-4">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="milestoneId" value={milestone.id} />
            <input name="title" required defaultValue={milestone.title} className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
            <textarea name="details" required rows={2} defaultValue={milestone.details} className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
            <div className="grid gap-2 md:grid-cols-2">
              <input type="date" name="milestoneDate" defaultValue={milestone.milestoneDate ?? ""} className="rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
              <select name="category" defaultValue={milestone.category} className="rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base">
                Save
              </button>
              <button formAction={deleteKeyMilestoneAction} type="submit" className="rounded border border-red-700 bg-red-700 px-3 py-1.5 text-xs font-semibold text-white">
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
