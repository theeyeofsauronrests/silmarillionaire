import { describe, expect, it } from "vitest";

import { groupRoadmapByTeamAndHorizon } from "@/lib/roadmap/grouping";

describe("roadmap grouping", () => {
  it("groups items by team and horizon", () => {
    const grouped = groupRoadmapByTeamAndHorizon([
      { teamName: "Bolt", horizon: "now" as const, id: "1" },
      { teamName: "Bolt", horizon: "next" as const, id: "2" },
      { teamName: "ACE", horizon: "now" as const, id: "3" }
    ]);

    expect(grouped.teamNames).toEqual(["ACE", "Bolt"]);
    expect(grouped.byTeamAndHorizon.get("Bolt")?.get("now")?.map((i) => i.id)).toEqual(["1"]);
    expect(grouped.byTeamAndHorizon.get("Bolt")?.get("next")?.map((i) => i.id)).toEqual(["2"]);
    expect(grouped.byTeamAndHorizon.get("ACE")?.get("now")?.map((i) => i.id)).toEqual(["3"]);
  });
});
