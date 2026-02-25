"use client";

import { useState, useTransition } from "react";

import { moveRoadmapItemAction } from "@/app/(protected)/projects/[projectId]/actions";
import type { ProjectRoadmapCard } from "@/lib/projects/types";
import { groupRoadmapByTeamAndHorizon } from "@/lib/roadmap/grouping";

type DraggableRoadmapBoardProps = {
  projectId: string;
  roadmap: ProjectRoadmapCard[];
  canEdit: boolean;
  teamOptions: Array<{ id: string; name: string }>;
};

const HORIZONS: Array<"now" | "next" | "later"> = ["now", "next", "later"];
const HORIZON_LABELS: Record<(typeof HORIZONS)[number], string> = {
  now: "Now",
  next: "Next",
  later: "Later"
};

type DragPayload = {
  roadmapItemId: string;
};

export function DraggableRoadmapBoard({ projectId, roadmap, canEdit, teamOptions }: DraggableRoadmapBoardProps) {
  const grouped = groupRoadmapByTeamAndHorizon(roadmap);
  const [dragging, setDragging] = useState<DragPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onDrop = (payload: DragPayload, horizon: "now" | "next" | "later", teamName: string) => {
    const teamId =
      teamName === "Unassigned"
        ? ""
        : teamOptions.find((team) => team.name === teamName)?.id ??
          roadmap.find((item) => item.teamName === teamName && item.teamId)?.teamId ??
          "";

    startTransition(async () => {
      setError(null);
      const formData = new FormData();
      formData.set("projectId", projectId);
      formData.set("roadmapItemId", payload.roadmapItemId);
      formData.set("horizon", horizon);
      formData.set("teamId", teamId ?? "");

      try {
        await moveRoadmapItemAction(formData);
      } catch {
        setError("Unable to move roadmap item right now. Refresh and try again.");
      }
    });
  };

  if (roadmap.length === 0) {
    return (
      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Roadmap Board</h2>
        <p className="mt-3 text-sm text-parchment-ink/80">No roadmap items have been added yet.</p>
      </section>
    );
  }

  const allTeamNames = Array.from(
    new Set([...grouped.teamNames, ...teamOptions.map((team) => team.name), "Unassigned"])
  ).sort((a, b) => a.localeCompare(b));

  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Roadmap Board</h2>
      <p className="mt-1 text-sm text-parchment-ink/80">
        {canEdit ? "Drag cards between swimlane columns to update now/next/later." : "Swimlanes by team, organized into now/next/later horizons."}
      </p>
      {isPending ? <p className="mt-2 text-xs text-parchment-ink/70">Updating roadmap...</p> : null}
      {error ? <p className="mt-2 text-xs font-semibold text-red-700">{error}</p> : null}

      <div className="mt-4 space-y-4">
        {allTeamNames.map((teamName) => {
          const byTeam = grouped.byTeamAndHorizon.get(teamName);
          const lanes =
            byTeam ??
            new Map<"now" | "next" | "later", ProjectRoadmapCard[]>([
              ["now", []],
              ["next", []],
              ["later", []]
            ]);

          return (
            <section key={teamName} className="rounded border border-parchment-border/70 bg-parchment-base/70 p-4">
              <h3 className="mb-3 text-xl font-semibold text-parchment-green">{teamName}</h3>
              <div className="grid gap-3 lg:grid-cols-3">
                {HORIZONS.map((horizon) => {
                  const items = lanes.get(horizon) ?? [];
                  return (
                    <section
                      key={`${teamName}-${horizon}`}
                      className="rounded border border-parchment-border bg-white/30 p-3"
                      onDragOver={(event) => {
                        if (!canEdit) return;
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        if (!canEdit) return;
                        event.preventDefault();
                        if (!dragging) return;
                        onDrop(dragging, horizon, teamName);
                        setDragging(null);
                      }}
                    >
                      <h4 className="mb-2 text-lg font-semibold text-parchment-green">{HORIZON_LABELS[horizon]}</h4>
                      <div className="space-y-2">
                        {items.length === 0 ? (
                          <p className="rounded border border-dashed border-parchment-border p-3 text-sm text-parchment-ink/70">No items</p>
                        ) : (
                          items.map((item) => (
                            <article
                              key={item.id}
                              draggable={canEdit}
                              onDragStart={() => setDragging({ roadmapItemId: item.id })}
                              className="cursor-grab rounded border border-parchment-border bg-parchment-base p-3"
                            >
                              <h5 className="text-base font-semibold text-parchment-green">{item.title}</h5>
                              <p className="mt-1 text-sm text-parchment-ink/85">{item.body}</p>
                              {item.ownerName ? <p className="mt-2 text-xs text-parchment-ink/75">Owner: {item.ownerName}</p> : null}
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
      </div>
    </section>
  );
}
