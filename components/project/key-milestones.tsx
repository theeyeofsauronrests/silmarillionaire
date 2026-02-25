import type { ProjectKeyMilestone } from "@/lib/projects/types";

type KeyMilestonesProps = {
  milestones: ProjectKeyMilestone[];
};

function labelForCategory(category: ProjectKeyMilestone["category"]) {
  if (category === "release") return "Release";
  if (category === "exercise") return "Exercise";
  if (category === "event") return "Event";
  return "Other";
}

export function KeyMilestones({ milestones }: KeyMilestonesProps) {
  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Key Milestones</h2>
      {milestones.length === 0 ? (
        <p className="mt-3 text-sm text-parchment-ink/80">No milestones recorded.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="rounded border border-parchment-border bg-white/35 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-parchment-gold bg-parchment-gold/10 px-2 py-0.5 text-xs font-semibold text-parchment-gold">
                  {labelForCategory(milestone.category)}
                </span>
                {milestone.milestoneDate ? <span className="text-xs text-parchment-ink/70">{milestone.milestoneDate}</span> : null}
              </div>
              <h3 className="mt-1 text-base font-semibold text-parchment-green">{milestone.title}</h3>
              <p className="mt-1 text-sm text-parchment-ink/85">{milestone.details}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
