import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  FlattenedProjectPersonModel,
  ProjectDetailModel,
  ProjectImageModel,
  ProjectKeyMilestone,
  ProjectLinkModel,
  ProjectRoadmapCard,
  ProjectTeamDirectoryModel,
  TeamRole
} from "@/lib/projects/types";

type ProjectRow = {
  id: string;
  name: string;
  codename: string;
  description: string;
  is_core: boolean;
};

type ProjectTeamRow = {
  team_id: string;
};

type TeamRow = {
  id: string;
  name: string;
};

type TeamMembershipRow = {
  team_id: string;
  person_id: string;
  role: TeamRole;
  allocation_pct: number | null;
};

type PersonRow = {
  id: string;
  display_name: string;
  title: string;
};

type RoadmapItemRow = {
  id: string;
  team_id: string | null;
  horizon: "now" | "next" | "later";
  title: string;
  body: string;
  owner_person_id: string | null;
};

type ProjectLinkRow = {
  id: string;
  label: string;
  url: string;
};

type ProjectImageRow = {
  id: string;
  storage_path: string;
  caption: string;
};

type KeyMilestoneRow = {
  id: string;
  title: string;
  details: string;
  milestone_date: string | null;
  category: "event" | "release" | "exercise" | "other";
};

const UNASSIGNED_TEAM_ID = "unassigned-team";
const UNASSIGNED_TEAM_NAME = "Unassigned";

function sortStrings(values: Iterable<string>) {
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export async function getProjectDetail(projectId: string): Promise<ProjectDetailModel | null> {
  const supabase = await createSupabaseServerClient();

  const [
    projectResult,
    projectTeamsResult,
    roadmapResult,
    linksResult,
    imagesResult,
    milestonesResult
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, codename, description, is_core")
      .eq("id", projectId)
      .maybeSingle<ProjectRow>(),
    supabase
      .from("project_teams")
      .select("team_id")
      .eq("project_id", projectId)
      .returns<ProjectTeamRow[]>(),
    supabase
      .from("roadmap_items")
      .select("id, team_id, horizon, title, body, owner_person_id")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .returns<RoadmapItemRow[]>(),
    supabase
      .from("project_links")
      .select("id, label, url")
      .eq("project_id", projectId)
      .order("label", { ascending: true })
      .returns<ProjectLinkRow[]>(),
    supabase
      .from("project_images")
      .select("id, storage_path, caption")
      .eq("project_id", projectId)
      .order("id", { ascending: true })
      .returns<ProjectImageRow[]>(),
    supabase
      .from("key_milestones")
      .select("id, title, details, milestone_date, category")
      .eq("project_id", projectId)
      .order("milestone_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true })
      .returns<KeyMilestoneRow[]>()
  ]);

  if (projectResult.error) {
    throw new Error(`Failed to load project: ${projectResult.error.message}`);
  }
  if (!projectResult.data) {
    return null;
  }
  if (projectTeamsResult.error) {
    throw new Error(`Failed to load project teams: ${projectTeamsResult.error.message}`);
  }
  if (roadmapResult.error) {
    throw new Error(`Failed to load roadmap items: ${roadmapResult.error.message}`);
  }
  if (linksResult.error) {
    throw new Error(`Failed to load project links: ${linksResult.error.message}`);
  }
  if (imagesResult.error) {
    throw new Error(`Failed to load project images: ${imagesResult.error.message}`);
  }
  if (milestonesResult.error) {
    throw new Error(`Failed to load key milestones: ${milestonesResult.error.message}`);
  }

  const teamIds = new Set((projectTeamsResult.data ?? []).map((row) => row.team_id));
  (roadmapResult.data ?? []).forEach((item) => {
    if (item.team_id) {
      teamIds.add(item.team_id);
    }
  });

  const teamIdList = Array.from(teamIds);

  const [teamsResult, teamMembershipsResult] = await Promise.all([
    teamIdList.length > 0
      ? supabase
          .from("teams")
          .select("id, name")
          .in("id", teamIdList)
          .returns<TeamRow[]>()
      : Promise.resolve({ data: [], error: null }),
    teamIdList.length > 0
      ? supabase
          .from("team_memberships")
          .select("team_id, person_id, role, allocation_pct")
          .in("team_id", teamIdList)
          .returns<TeamMembershipRow[]>()
      : Promise.resolve({ data: [], error: null })
  ]);

  if (teamsResult.error) {
    throw new Error(`Failed to load teams: ${teamsResult.error.message}`);
  }
  if (teamMembershipsResult.error) {
    throw new Error(`Failed to load team memberships: ${teamMembershipsResult.error.message}`);
  }

  const peopleIds = new Set<string>();
  (teamMembershipsResult.data ?? []).forEach((membership) => {
    peopleIds.add(membership.person_id);
  });
  (roadmapResult.data ?? []).forEach((item) => {
    if (item.owner_person_id) {
      peopleIds.add(item.owner_person_id);
    }
  });

  const peopleIdList = Array.from(peopleIds);
  const peopleResult =
    peopleIdList.length > 0
      ? await supabase.from("people").select("id, display_name, title").in("id", peopleIdList).returns<PersonRow[]>()
      : { data: [], error: null };

  if (peopleResult.error) {
    throw new Error(`Failed to load people: ${peopleResult.error.message}`);
  }

  const teams = teamsResult.data ?? [];
  const memberships = teamMembershipsResult.data ?? [];
  const people = peopleResult.data ?? [];

  const teamNameById = new Map(teams.map((team) => [team.id, team.name]));
  const personById = new Map(people.map((person) => [person.id, person]));

  const roadmap: ProjectRoadmapCard[] = (roadmapResult.data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    horizon: item.horizon,
    ownerName: item.owner_person_id ? personById.get(item.owner_person_id)?.display_name ?? null : null,
    ownerPersonId: item.owner_person_id,
    teamId: item.team_id,
    teamName: item.team_id ? teamNameById.get(item.team_id) ?? UNASSIGNED_TEAM_NAME : UNASSIGNED_TEAM_NAME
  }));

  const teamDirectoryById = new Map<string, ProjectTeamDirectoryModel>();

  teams.forEach((team) => {
    teamDirectoryById.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      members: []
    });
  });

  memberships.forEach((membership) => {
    const person = personById.get(membership.person_id);
    if (!person) {
      return;
    }

    const existingTeam = teamDirectoryById.get(membership.team_id);
    if (!existingTeam) {
      return;
    }

    existingTeam.members.push({
      personId: person.id,
      displayName: person.display_name,
      title: person.title,
      role: membership.role,
      allocationPct: membership.allocation_pct
    });
  });

  const teamDirectory = Array.from(teamDirectoryById.values())
    .map((team) => ({
      ...team,
      members: team.members.sort((a, b) => a.displayName.localeCompare(b.displayName))
    }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));

  const flattenedPeopleMap = new Map<string, FlattenedProjectPersonModel>();

  memberships.forEach((membership) => {
    const person = personById.get(membership.person_id);
    const teamName = teamNameById.get(membership.team_id);

    if (!person || !teamName) {
      return;
    }

    const existing = flattenedPeopleMap.get(person.id);
    if (existing) {
      existing.teamNames = sortStrings(new Set([...existing.teamNames, teamName]));
      existing.roles = Array.from(new Set([...existing.roles, membership.role])).sort((a, b) => a.localeCompare(b));
      return;
    }

    flattenedPeopleMap.set(person.id, {
      personId: person.id,
      displayName: person.display_name,
      title: person.title,
      teamNames: [teamName],
      roles: [membership.role]
    });
  });

  const roadmapOwnerIdsWithoutMembership = (roadmapResult.data ?? [])
    .map((item) => item.owner_person_id)
    .filter((value): value is string => Boolean(value))
    .filter((personId) => !flattenedPeopleMap.has(personId));

  roadmapOwnerIdsWithoutMembership.forEach((personId) => {
    const person = personById.get(personId);
    if (!person) {
      return;
    }

    flattenedPeopleMap.set(personId, {
      personId: person.id,
      displayName: person.display_name,
      title: person.title,
      teamNames: [UNASSIGNED_TEAM_NAME],
      roles: []
    });
  });

  const flattenedPeople = Array.from(flattenedPeopleMap.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));

  const links: ProjectLinkModel[] = (linksResult.data ?? []).map((link) => ({
    id: link.id,
    label: link.label,
    url: link.url
  }));

  const milestones: ProjectKeyMilestone[] = (milestonesResult.data ?? []).map((milestone) => ({
    id: milestone.id,
    title: milestone.title,
    details: milestone.details,
    milestoneDate: milestone.milestone_date,
    category: milestone.category
  }));

  const imagesBucket = process.env.SUPABASE_PROJECT_IMAGES_BUCKET ?? "project-images";
  const images: ProjectImageModel[] = await Promise.all(
    (imagesResult.data ?? []).map(async (image) => {
      if (image.storage_path.startsWith("http://") || image.storage_path.startsWith("https://")) {
        return {
          id: image.id,
          caption: image.caption,
          storagePath: image.storage_path,
          imageUrl: image.storage_path
        };
      }

      const signed = await supabase.storage.from(imagesBucket).createSignedUrl(image.storage_path, 60 * 60);
      const fallbackPublicUrl = supabase.storage.from(imagesBucket).getPublicUrl(image.storage_path).data.publicUrl;

      return {
        id: image.id,
        caption: image.caption,
        storagePath: image.storage_path,
        imageUrl: signed.data?.signedUrl ?? fallbackPublicUrl
      };
    })
  );

  const hasUnassignedRoadmap = roadmap.some((item) => item.teamId === null);
  if (hasUnassignedRoadmap) {
    teamDirectory.unshift({
      teamId: UNASSIGNED_TEAM_ID,
      teamName: UNASSIGNED_TEAM_NAME,
      members: []
    });
  }

  return {
    project: {
      id: projectResult.data.id,
      name: projectResult.data.name,
      codename: projectResult.data.codename,
      description: projectResult.data.description,
      isCore: projectResult.data.is_core
    },
    roadmap,
    images,
    links,
    milestones,
    teamDirectory,
    people: flattenedPeople,
    teamOptions: teams
      .map((team) => ({
        id: team.id,
        name: team.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    personOptions: people
      .map((person) => ({
        id: person.id,
        name: person.display_name
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  };
}
