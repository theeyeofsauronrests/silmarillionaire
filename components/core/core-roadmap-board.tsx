import Link from "next/link";

import { groupRoadmapByTeamAndHorizon } from "@/lib/roadmap/grouping";
import type { CoreData, CoreHorizon, CoreRoadmapItem } from "@/lib/core/types";

type CoreRoadmapBoardProps = {
  data: CoreData;
};

const HORIZONS: CoreHorizon[] = ["now", "next", "later"];
const HORIZON_LABELS: Record<CoreHorizon, string> = {
  now: "Now",
  next: "Next",
  later: "Later"
};

function renderCard(item: CoreRoadmapItem) {
  return (
    <article key={item.id} className="rounded border border-parchment-border bg-parchment-base p-3">
      <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{item.projectCodename}</p>
      <h4 className="text-base font-semibold text-parchment-green">{item.title}</h4>
      <p className="mt-1 text-sm text-parchment-ink/85">{item.body}</p>
      <p className="mt-2 text-xs text-parchment-ink/75">
        {item.ownerName ? `Owner: ${item.ownerName}` : "Owner: Unassigned"}
      </p>
      <Link href={`/projects/${item.projectId}`} className="mt-2 inline-block text-xs font-semibold text-parchment-green underline">
        Open {item.projectCodename}
      </Link>
    </article>
  );
}

export function CoreRoadmapBoard({ data }: CoreRoadmapBoardProps) {
  const grouped = groupRoadmapByTeamAndHorizon(data.roadmap);

  return (
    <section className="space-y-5">
      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Core Initiatives</h2>
        {data.projects.length === 0 ? (
          <p className="mt-2 text-sm text-parchment-ink/80">No projects are currently marked as core.</p>
        ) : (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-parchment-ink/90">
            {data.projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.id}`} className="font-semibold text-parchment-green underline">
                  {project.name}
                </Link>{" "}
                <span className="text-parchment-ink/70">({project.codename})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Core Roadmap</h2>
        <p className="mt-1 text-sm text-parchment-ink/80">Team-oriented swimlanes across all core projects.</p>

        {data.roadmap.length === 0 ? (
          <p className="mt-3 text-sm text-parchment-ink/80">No roadmap items found for core projects.</p>
        ) : (
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
                    {HORIZONS.map((horizon) => {
                      const items = byTeam.get(horizon) ?? [];

                      return (
                        <section key={`${teamName}-${horizon}`} className="rounded border border-parchment-border bg-white/30 p-3">
                          <h4 className="mb-2 text-lg font-semibold text-parchment-green">{HORIZON_LABELS[horizon]}</h4>
                          <div className="space-y-2">
                            {items.length === 0 ? (
                              <p className="rounded border border-dashed border-parchment-border p-3 text-sm text-parchment-ink/70">
                                No items
                              </p>
                            ) : (
                              items.map(renderCard)
                            )}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
