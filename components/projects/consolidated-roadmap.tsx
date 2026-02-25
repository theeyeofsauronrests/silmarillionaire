import Link from "next/link";

import type { ConsolidatedRoadmapData } from "@/lib/projects/get-consolidated-roadmap";

type GroupByMode = "project" | "team";

type ConsolidatedRoadmapProps = {
  data: ConsolidatedRoadmapData;
  groupBy?: GroupByMode;
};

const HORIZONS: Array<"now" | "next" | "later"> = ["now", "next", "later"];
const HORIZON_LABELS: Record<(typeof HORIZONS)[number], string> = {
  now: "Now",
  next: "Next",
  later: "Later"
};

type GroupedMap = Map<string, Map<"now" | "next" | "later", ConsolidatedRoadmapData["items"]>>;

function getGroupLabel(item: ConsolidatedRoadmapData["items"][number], groupBy: GroupByMode): string {
  return groupBy === "project" ? `${item.projectCodename} - ${item.projectName}` : item.teamName;
}

function groupItems(data: ConsolidatedRoadmapData, groupBy: GroupByMode): GroupedMap {
  const grouped = new Map<string, Map<"now" | "next" | "later", ConsolidatedRoadmapData["items"]>>();

  data.items.forEach((item) => {
    const groupLabel = getGroupLabel(item, groupBy);
    const existing = grouped.get(groupLabel);
    if (existing) {
      existing.get(item.horizon)?.push(item);
      return;
    }

    const created = new Map<"now" | "next" | "later", ConsolidatedRoadmapData["items"]>([
      ["now", item.horizon === "now" ? [item] : []],
      ["next", item.horizon === "next" ? [item] : []],
      ["later", item.horizon === "later" ? [item] : []]
    ]);
    grouped.set(groupLabel, created);
  });

  return grouped;
}

export function ConsolidatedRoadmap({ data, groupBy = "project" }: ConsolidatedRoadmapProps) {
  if (data.items.length === 0) {
    return <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">No roadmap items found across projects.</p>;
  }

  const grouped = groupItems(data, groupBy);
  const groupLabels = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

  return (
    <section className="space-y-4">
      {groupLabels.map((groupLabel) => {
        const byGroup = grouped.get(groupLabel);
        if (!byGroup) return null;

        return (
          <section key={groupLabel} className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
            <h2 className="mb-3 text-xl font-semibold text-parchment-green">{groupLabel}</h2>
            <div className="grid gap-3 lg:grid-cols-3">
              {HORIZONS.map((horizon) => {
                const items = byGroup.get(horizon) ?? [];
                return (
                  <section key={`${groupLabel}-${horizon}`} className="rounded border border-parchment-border bg-white/35 p-3">
                    <h3 className="mb-2 text-lg font-semibold text-parchment-green">{HORIZON_LABELS[horizon]}</h3>
                    <div className="space-y-2">
                      {items.length === 0 ? (
                        <p className="rounded border border-dashed border-parchment-border p-3 text-sm text-parchment-ink/70">No items</p>
                      ) : (
                        items.map((item) => (
                          <article key={item.id} className="rounded border border-parchment-border bg-parchment-base p-3">
                            {groupBy === "team" ? (
                              <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{item.projectCodename}</p>
                            ) : (
                              <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{item.teamName}</p>
                            )}
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
