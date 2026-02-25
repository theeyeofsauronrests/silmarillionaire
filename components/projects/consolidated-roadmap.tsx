import Link from "next/link";

import { groupRoadmapByTeamAndHorizon } from "@/lib/roadmap/grouping";
import type { ConsolidatedRoadmapData } from "@/lib/projects/get-consolidated-roadmap";

type ConsolidatedRoadmapProps = {
  data: ConsolidatedRoadmapData;
};

const HORIZONS: Array<"now" | "next" | "later"> = ["now", "next", "later"];

export function ConsolidatedRoadmap({ data }: ConsolidatedRoadmapProps) {
  if (data.items.length === 0) {
    return <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">No roadmap items found across projects.</p>;
  }

  const grouped = groupRoadmapByTeamAndHorizon(data.items);

  return (
    <section className="space-y-4">
      {grouped.teamNames.map((teamName) => {
        const byTeam = grouped.byTeamAndHorizon.get(teamName);
        if (!byTeam) return null;

        return (
          <section key={teamName} className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
            <h2 className="mb-3 text-xl font-semibold text-parchment-green">{teamName}</h2>
            <div className="grid gap-3 lg:grid-cols-3">
              {HORIZONS.map((horizon) => {
                const items = byTeam.get(horizon) ?? [];
                return (
                  <section key={`${teamName}-${horizon}`} className="rounded border border-parchment-border bg-white/35 p-3">
                    <h3 className="mb-2 text-lg font-semibold text-parchment-green">
                      {horizon === "now" ? "Now" : horizon === "next" ? "Next" : "Later"}
                    </h3>
                    <div className="space-y-2">
                      {items.length === 0 ? (
                        <p className="rounded border border-dashed border-parchment-border p-3 text-sm text-parchment-ink/70">No items</p>
                      ) : (
                        items.map((item) => (
                          <article key={item.id} className="rounded border border-parchment-border bg-parchment-base p-3">
                            <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{item.projectCodename}</p>
                            <h4 className="text-base font-semibold text-parchment-green">{item.title}</h4>
                            <p className="mt-1 text-sm text-parchment-ink/85">{item.body}</p>
                            <p className="mt-1 text-xs text-parchment-ink/70">{item.ownerName ? `Owner: ${item.ownerName}` : "Owner: Unassigned"}</p>
                            <Link href={`/projects/${item.projectId}`} className="mt-1 inline-block text-xs font-semibold text-parchment-green underline">
                              Open {item.projectCodename}
                            </Link>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
}
