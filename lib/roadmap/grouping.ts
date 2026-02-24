import type { CoreRoadmapItem } from "@/lib/core/types";
import type { ProjectRoadmapCard } from "@/lib/projects/types";

type RoadmapLike = {
  teamName: string;
  horizon: "now" | "next" | "later";
};

export type GroupedRoadmap<T extends RoadmapLike> = {
  teamNames: string[];
  byTeamAndHorizon: Map<string, Map<"now" | "next" | "later", T[]>>;
};

function getOrCreateGroup<T extends RoadmapLike>(
  map: Map<string, Map<"now" | "next" | "later", T[]>>,
  teamName: string
): Map<"now" | "next" | "later", T[]> {
  const existing = map.get(teamName);
  if (existing) {
    return existing;
  }

  const created = new Map<"now" | "next" | "later", T[]>([
    ["now", []],
    ["next", []],
    ["later", []]
  ]);

  map.set(teamName, created);
  return created;
}

export function groupRoadmapByTeamAndHorizon<T extends RoadmapLike>(items: T[]): GroupedRoadmap<T> {
  const byTeamAndHorizon = new Map<string, Map<"now" | "next" | "later", T[]>>();

  items.forEach((item) => {
    const team = getOrCreateGroup(byTeamAndHorizon, item.teamName);
    const bucket = team.get(item.horizon);
    if (!bucket) {
      return;
    }

    bucket.push(item);
  });

  const teamNames = Array.from(byTeamAndHorizon.keys()).sort((a, b) => a.localeCompare(b));
  return { teamNames, byTeamAndHorizon };
}

export type ProjectRoadmapGrouping = GroupedRoadmap<ProjectRoadmapCard>;
export type CoreRoadmapGrouping = GroupedRoadmap<CoreRoadmapItem>;
