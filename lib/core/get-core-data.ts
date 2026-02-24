import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CoreData, CoreProject, CoreRoadmapItem } from "@/lib/core/types";

type ProjectRow = {
  id: string;
  name: string;
  codename: string;
  description: string;
};

type RoadmapRow = {
  id: string;
  project_id: string;
  team_id: string | null;
  horizon: "now" | "next" | "later";
  title: string;
  body: string;
  owner_person_id: string | null;
};

type TeamRow = {
  id: string;
  name: string;
};

type PersonRow = {
  id: string;
  display_name: string;
};

type ProjectTeamRow = {
  project_id: string;
  team_id: string;
};

const UNASSIGNED_TEAM = "Unassigned";

export async function getCoreData(): Promise<CoreData> {
  const supabase = await createSupabaseServerClient();

  const { data: projectRows, error: projectError } = await supabase
    .from("projects")
    .select("id, name, codename, description")
    .eq("is_core", true)
    .order("name", { ascending: true })
    .returns<ProjectRow[]>();

  if (projectError) {
    throw new Error(`Failed to load core projects: ${projectError.message}`);
  }

  const projects: CoreProject[] = (projectRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    codename: row.codename,
    description: row.description
  }));

  if (projects.length === 0) {
    return {
      projects,
      roadmap: []
    };
  }

  const projectIds = projects.map((project) => project.id);

  const [roadmapResult, projectTeamsResult] = await Promise.all([
    supabase
      .from("roadmap_items")
      .select("id, project_id, team_id, horizon, title, body, owner_person_id")
      .in("project_id", projectIds)
      .order("created_at", { ascending: true })
      .returns<RoadmapRow[]>(),
    supabase
      .from("project_teams")
      .select("project_id, team_id")
      .in("project_id", projectIds)
      .returns<ProjectTeamRow[]>()
  ]);

  if (roadmapResult.error) {
    throw new Error(`Failed to load core roadmap: ${roadmapResult.error.message}`);
  }
  if (projectTeamsResult.error) {
    throw new Error(`Failed to load core project teams: ${projectTeamsResult.error.message}`);
  }

  const roadmapRows = roadmapResult.data ?? [];
  const projectTeamRows = projectTeamsResult.data ?? [];

  const teamIds = new Set<string>();
  roadmapRows.forEach((row) => {
    if (row.team_id) {
      teamIds.add(row.team_id);
    }
  });
  projectTeamRows.forEach((row) => {
    teamIds.add(row.team_id);
  });

  const ownerIds = new Set<string>();
  roadmapRows.forEach((row) => {
    if (row.owner_person_id) {
      ownerIds.add(row.owner_person_id);
    }
  });

  const [teamsResult, ownersResult] = await Promise.all([
    teamIds.size > 0
      ? supabase.from("teams").select("id, name").in("id", Array.from(teamIds)).returns<TeamRow[]>()
      : Promise.resolve({ data: [], error: null }),
    ownerIds.size > 0
      ? supabase
          .from("people")
          .select("id, display_name")
          .in("id", Array.from(ownerIds))
          .returns<PersonRow[]>()
      : Promise.resolve({ data: [], error: null })
  ]);

  if (teamsResult.error) {
    throw new Error(`Failed to load core teams: ${teamsResult.error.message}`);
  }
  if (ownersResult.error) {
    throw new Error(`Failed to load core roadmap owners: ${ownersResult.error.message}`);
  }

  const teamNameById = new Map((teamsResult.data ?? []).map((team) => [team.id, team.name]));
  const ownerNameById = new Map((ownersResult.data ?? []).map((person) => [person.id, person.display_name]));
  const projectById = new Map(projects.map((project) => [project.id, project]));

  const roadmap: CoreRoadmapItem[] = roadmapRows
    .map((row) => {
      const project = projectById.get(row.project_id);
      if (!project) {
        return null;
      }

      return {
        id: row.id,
        projectId: project.id,
        projectName: project.name,
        projectCodename: project.codename,
        teamId: row.team_id,
        teamName: row.team_id ? teamNameById.get(row.team_id) ?? UNASSIGNED_TEAM : UNASSIGNED_TEAM,
        horizon: row.horizon,
        title: row.title,
        body: row.body,
        ownerName: row.owner_person_id ? ownerNameById.get(row.owner_person_id) ?? null : null
      } satisfies CoreRoadmapItem;
    })
    .filter((item): item is CoreRoadmapItem => item !== null);

  return {
    projects,
    roadmap
  };
}
