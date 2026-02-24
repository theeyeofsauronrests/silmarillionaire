import { RoadmapColumn } from "@/components/project/roadmap-column";
import { groupRoadmapByTeamAndHorizon } from "@/lib/roadmap/grouping";
import type { ProjectRoadmapCard } from "@/lib/projects/types";

type RoadmapBoardProps = {
  roadmap: ProjectRoadmapCard[];
};

const HORIZON_ORDER: Array<"now" | "next" | "later"> = ["now", "next", "later"];

export function RoadmapBoard({ roadmap }: RoadmapBoardProps) {
  if (roadmap.length === 0) {
    return (
      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Roadmap Board</h2>
        <p className="mt-3 text-sm text-parchment-ink/80">No roadmap items have been added yet.</p>
      </section>
    );
  }

  const grouped = groupRoadmapByTeamAndHorizon(roadmap);

  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Roadmap Board</h2>
      <p className="mt-1 text-sm text-parchment-ink/80">Swimlanes by team, organized into now/next/later horizons.</p>

      <div className="mt-4 space-y-4">
        {grouped.teamNames.map((teamName) => {
          const byTeam = grouped.byTeamAndHorizon.get(teamName);
          if (!byTeam) {
            return null;
          }

          return (
            <section key={teamName} className="rounded border border-parchment-border/70 bg-parchment-base/70 p-4">
              <h3 className="mb-3 text-xl font-semibold text-parchment-green">{teamName}</h3>
              <div className="grid gap-3 lg:grid-cols-3">
                {HORIZON_ORDER.map((horizon) => (
                  <RoadmapColumn
                    key={`${teamName}-${horizon}`}
                    horizon={horizon}
                    items={byTeam.get(horizon) ?? []}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
