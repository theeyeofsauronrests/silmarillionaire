import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ConsolidatedRoadmapItem = {
  id: string;
  projectId: string;
  projectName: string;
  projectCodename: string;
  teamName: string;
  horizon: "now" | "next" | "later";
  title: string;
  body: string;
  ownerName: string | null;
};

export type ConsolidatedRoadmapData = {
  items: ConsolidatedRoadmapItem[];
};

type ProjectRow = { id: string; name: string; codename: string };
type RoadmapRow = {
  id: string;
  project_id: string;
  team_id: string | null;
  horizon: "now" | "next" | "later";
  title: string;
  body: string;
  owner_person_id: string | null;
};
type TeamRow = { id: string; name: string };
type PersonRow = { id: string; display_name: string };

export async function getConsolidatedRoadmap(): Promise<ConsolidatedRoadmapData> {
  const supabase = await createSupabaseServerClient();

  const [projectsResult, roadmapResult] = await Promise.all([
    supabase.from("projects").select("id, name, codename").returns<ProjectRow[]>(),
    supabase
      .from("roadmap_items")
      .select("id, project_id, team_id, horizon, title, body, owner_person_id")
      .order("created_at", { ascending: true })
      .returns<RoadmapRow[]>()
  ]);

  if (projectsResult.error) throw new Error(`Failed to load projects: ${projectsResult.error.message}`);
  if (roadmapResult.error) throw new Error(`Failed to load roadmap: ${roadmapResult.error.message}`);

  const projects = projectsResult.data ?? [];
  const roadmapRows = roadmapResult.data ?? [];

  const teamIds = Array.from(new Set(roadmapRows.map((row) => row.team_id).filter((value): value is string => Boolean(value))));
  const ownerIds = Array.from(
    new Set(roadmapRows.map((row) => row.owner_person_id).filter((value): value is string => Boolean(value)))
  );

  const [teamsResult, ownersResult] = await Promise.all([
    teamIds.length > 0
      ? supabase.from("teams").select("id, name").in("id", teamIds).returns<TeamRow[]>()
      : Promise.resolve({ data: [], error: null }),
    ownerIds.length > 0
      ? supabase.from("people").select("id, display_name").in("id", ownerIds).returns<PersonRow[]>()
      : Promise.resolve({ data: [], error: null })
  ]);

  if (teamsResult.error) throw new Error(`Failed to load teams: ${teamsResult.error.message}`);
  if (ownersResult.error) throw new Error(`Failed to load owners: ${ownersResult.error.message}`);

  const projectById = new Map(projects.map((project) => [project.id, project]));
  const teamNameById = new Map((teamsResult.data ?? []).map((team) => [team.id, team.name]));
  const ownerNameById = new Map((ownersResult.data ?? []).map((owner) => [owner.id, owner.display_name]));

  const items: ConsolidatedRoadmapItem[] = roadmapRows
    .map((row) => {
      const project = projectById.get(row.project_id);
      if (!project) return null;

      return {
        id: row.id,
        projectId: project.id,
        projectName: project.name,
        projectCodename: project.codename,
        teamName: row.team_id ? teamNameById.get(row.team_id) ?? "Unassigned" : "Unassigned",
        horizon: row.horizon,
        title: row.title,
        body: row.body,
        ownerName: row.owner_person_id ? ownerNameById.get(row.owner_person_id) ?? null : null
      };
    })
    .filter((item): item is ConsolidatedRoadmapItem => item !== null);

  return { items };
}
