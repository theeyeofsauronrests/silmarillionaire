import type { ProjectRoadmapCard } from "@/lib/projects/types";

type RoadmapCardProps = {
  item: ProjectRoadmapCard;
};

export function RoadmapCard({ item }: RoadmapCardProps) {
  return (
    <article className="rounded border border-parchment-border bg-parchment-base p-3">
      <h4 className="text-base font-semibold text-parchment-green">{item.title}</h4>
      <p className="mt-1 text-sm text-parchment-ink/85">{item.body}</p>
      {item.ownerName ? <p className="mt-2 text-xs text-parchment-ink/75">Owner: {item.ownerName}</p> : null}
    </article>
  );
}
