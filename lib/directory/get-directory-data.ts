import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DirectoryData,
  PersonDirectoryItem,
  ProjectDirectoryItem,
  TeamDirectoryItem,
  TeamRole
} from "@/lib/directory/types";

type ProjectRow = {
  id: string;
  name: string;
  codename: string;
  description: string;
  is_core: boolean;
};

type TeamRow = {
  id: string;
  name: string;
  description: string;
};

type PersonRow = {
  id: string;
  display_name: string;
  title: string;
  org_unit: string;
  is_leadership: boolean;
};

type ProjectTeamRow = {
  project_id: string;
  team_id: string;
};

type TeamMembershipRow = {
  team_id: string;
  person_id: string;
  role: TeamRole;
};

function toSortedArray(input: Set<string>): string[] {
  return Array.from(input).sort((a, b) => a.localeCompare(b));
}

export async function getDirectoryData(): Promise<DirectoryData> {
  const supabase = await createSupabaseServerClient();

  const [projectsResult, teamsResult, peopleResult, projectTeamsResult, teamMembershipsResult] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id, name, codename, description, is_core")
        .order("name", { ascending: true })
        .returns<ProjectRow[]>(),
      supabase
        .from("teams")
        .select("id, name, description")
        .order("name", { ascending: true })
        .returns<TeamRow[]>(),
      supabase
        .from("people")
        .select("id, display_name, title, org_unit, is_leadership")
        .order("display_name", { ascending: true })
        .returns<PersonRow[]>(),
      supabase
        .from("project_teams")
        .select("project_id, team_id")
        .returns<ProjectTeamRow[]>(),
      supabase
        .from("team_memberships")
        .select("team_id, person_id, role")
        .returns<TeamMembershipRow[]>()
    ]);

  if (projectsResult.error) {
    throw new Error(`Failed to load projects: ${projectsResult.error.message}`);
  }
  if (teamsResult.error) {
    throw new Error(`Failed to load teams: ${teamsResult.error.message}`);
  }
  if (peopleResult.error) {
    throw new Error(`Failed to load people: ${peopleResult.error.message}`);
  }
  if (projectTeamsResult.error) {
    throw new Error(`Failed to load project teams: ${projectTeamsResult.error.message}`);
  }
  if (teamMembershipsResult.error) {
    throw new Error(`Failed to load team memberships: ${teamMembershipsResult.error.message}`);
  }

  const projects = projectsResult.data ?? [];
  const teams = teamsResult.data ?? [];
  const people = peopleResult.data ?? [];
  const projectTeams = projectTeamsResult.data ?? [];
  const teamMemberships = teamMembershipsResult.data ?? [];

  const teamNameById = new Map(teams.map((team) => [team.id, team.name]));
  const projectNameById = new Map(projects.map((project) => [project.id, project.name]));
  const personNameById = new Map(people.map((person) => [person.id, person.display_name]));

  const projectToTeamIds = new Map<string, Set<string>>();
  const teamToProjectIds = new Map<string, Set<string>>();

  projectTeams.forEach((row) => {
    const projectTeamsSet = projectToTeamIds.get(row.project_id) ?? new Set<string>();
    projectTeamsSet.add(row.team_id);
    projectToTeamIds.set(row.project_id, projectTeamsSet);

    const teamProjectsSet = teamToProjectIds.get(row.team_id) ?? new Set<string>();
    teamProjectsSet.add(row.project_id);
    teamToProjectIds.set(row.team_id, teamProjectsSet);
  });

  const teamToPersonIds = new Map<string, Set<string>>();
  const personToTeamIds = new Map<string, Set<string>>();
  const personToRoles = new Map<string, Set<TeamRole>>();

  teamMemberships.forEach((row) => {
    const teamPeopleSet = teamToPersonIds.get(row.team_id) ?? new Set<string>();
    teamPeopleSet.add(row.person_id);
    teamToPersonIds.set(row.team_id, teamPeopleSet);

    const personTeamsSet = personToTeamIds.get(row.person_id) ?? new Set<string>();
    personTeamsSet.add(row.team_id);
    personToTeamIds.set(row.person_id, personTeamsSet);

    const personRolesSet = personToRoles.get(row.person_id) ?? new Set<TeamRole>();
    personRolesSet.add(row.role);
    personToRoles.set(row.person_id, personRolesSet);
  });

  const projectToPersonIds = new Map<string, Set<string>>();

  projectToTeamIds.forEach((teamIds, projectId) => {
    const peopleIds = new Set<string>();

    teamIds.forEach((teamId) => {
      const teamPeople = teamToPersonIds.get(teamId);
      if (!teamPeople) {
        return;
      }

      teamPeople.forEach((personId) => {
        peopleIds.add(personId);
      });
    });

    projectToPersonIds.set(projectId, peopleIds);
  });

  const personToProjectIds = new Map<string, Set<string>>();

  personToTeamIds.forEach((teamIds, personId) => {
    const projectIds = new Set<string>();

    teamIds.forEach((teamId) => {
      const linkedProjects = teamToProjectIds.get(teamId);
      if (!linkedProjects) {
        return;
      }

      linkedProjects.forEach((projectId) => {
        projectIds.add(projectId);
      });
    });

    personToProjectIds.set(personId, projectIds);
  });

  const projectItems: ProjectDirectoryItem[] = projects.map((project) => {
    const teamIds = projectToTeamIds.get(project.id) ?? new Set<string>();
    const peopleIds = projectToPersonIds.get(project.id) ?? new Set<string>();

    const teamNames = toSortedArray(
      new Set(Array.from(teamIds).map((teamId) => teamNameById.get(teamId)).filter((name): name is string => Boolean(name)))
    );

    const peopleNames = toSortedArray(
      new Set(
        Array.from(peopleIds)
          .map((personId) => personNameById.get(personId))
          .filter((name): name is string => Boolean(name))
      )
    );

    return {
      id: project.id,
      name: project.name,
      codename: project.codename,
      description: project.description,
      isCore: project.is_core,
      teamNames,
      peopleNames,
      peopleCount: peopleNames.length
    };
  });

  const teamItems: TeamDirectoryItem[] = teams.map((team) => {
    const projectIds = teamToProjectIds.get(team.id) ?? new Set<string>();
    const peopleIds = teamToPersonIds.get(team.id) ?? new Set<string>();

    const projectNames = toSortedArray(
      new Set(
        Array.from(projectIds)
          .map((projectId) => projectNameById.get(projectId))
          .filter((name): name is string => Boolean(name))
      )
    );

    const peopleNames = toSortedArray(
      new Set(
        Array.from(peopleIds)
          .map((personId) => personNameById.get(personId))
          .filter((name): name is string => Boolean(name))
      )
    );

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      projectNames,
      peopleNames,
      peopleCount: peopleNames.length
    };
  });

  const peopleItems: PersonDirectoryItem[] = people.map((person) => {
    const teamIds = personToTeamIds.get(person.id) ?? new Set<string>();
    const projectIds = personToProjectIds.get(person.id) ?? new Set<string>();

    const teamNames = toSortedArray(
      new Set(Array.from(teamIds).map((teamId) => teamNameById.get(teamId)).filter((name): name is string => Boolean(name)))
    );

    const projectNames = toSortedArray(
      new Set(
        Array.from(projectIds)
          .map((projectId) => projectNameById.get(projectId))
          .filter((name): name is string => Boolean(name))
      )
    );

    const roles = Array.from(personToRoles.get(person.id) ?? new Set<TeamRole>()).sort((a, b) =>
      a.localeCompare(b)
    );

    return {
      id: person.id,
      displayName: person.display_name,
      title: person.title,
      orgUnit: person.org_unit,
      isLeadership: person.is_leadership,
      teamNames,
      projectNames,
      roles
    };
  });

  return {
    projects: projectItems,
    teams: teamItems,
    people: peopleItems
  };
}
