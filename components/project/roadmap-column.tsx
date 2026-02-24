import { RoadmapCard } from "@/components/project/roadmap-card";
import type { ProjectRoadmapCard, RoadmapHorizon } from "@/lib/projects/types";

type RoadmapColumnProps = {
  horizon: RoadmapHorizon;
  items: ProjectRoadmapCard[];
};

const HORIZON_LABELS: Record<RoadmapHorizon, string> = {
  now: "Now",
  next: "Next",
  later: "Later"
};

export function RoadmapColumn({ horizon, items }: RoadmapColumnProps) {
  return (
    <section className="rounded border border-parchment-border bg-white/30 p-3">
      <h4 className="mb-3 text-lg font-semibold text-parchment-green">{HORIZON_LABELS[horizon]}</h4>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded border border-dashed border-parchment-border p-3 text-sm text-parchment-ink/70">
            No items
          </p>
        ) : (
          items.map((item) => <RoadmapCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}
