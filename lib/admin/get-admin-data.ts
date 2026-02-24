import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AdminProject,
  AdminTeam,
  AdminUser,
  ProjectEditorAssignment,
  WaitlistRequest
} from "@/lib/admin/types";

type WaitlistRow = {
  id: string;
  name: string;
  email: string;
  requested_at: string;
  status: "pending" | "approved" | "denied";
};

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: "viewer" | "editor" | "admin";
  status: "pending" | "active" | "denied";
  created_at: string;
};

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

type ProjectEditorRow = {
  project_id: string;
  user_id: string;
};

export async function getAdminDashboardSummary() {
  const supabase = await createSupabaseServerClient();

  const [pendingWaitlistResult, usersResult, projectsResult] = await Promise.all([
    supabase
      .from("waitlist_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true })
  ]);

  if (pendingWaitlistResult.error) {
    throw new Error(`Failed to load pending approvals count: ${pendingWaitlistResult.error.message}`);
  }
  if (usersResult.error) {
    throw new Error(`Failed to load users count: ${usersResult.error.message}`);
  }
  if (projectsResult.error) {
    throw new Error(`Failed to load projects count: ${projectsResult.error.message}`);
  }

  return {
    pendingApprovals: pendingWaitlistResult.count ?? 0,
    totalUsers: usersResult.count ?? 0,
    totalProjects: projectsResult.count ?? 0
  };
}

export async function getWaitlistRequests(): Promise<WaitlistRequest[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("waitlist_requests")
    .select("id, name, email, requested_at, status")
    .order("requested_at", { ascending: true })
    .returns<WaitlistRow[]>();

  if (error) {
    throw new Error(`Failed to load waitlist requests: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    requestedAt: row.requested_at,
    status: row.status
  }));
}

export async function getAdminUsersData(): Promise<{
  users: AdminUser[];
  projects: AdminProject[];
  assignments: ProjectEditorAssignment[];
}> {
  const supabase = await createSupabaseServerClient();

  const [usersResult, projectsResult, assignmentsResult] = await Promise.all([
    supabase
      .from("users")
      .select("id, email, name, role, status, created_at")
      .order("created_at", { ascending: true })
      .returns<UserRow[]>(),
    supabase
      .from("projects")
      .select("id, name, codename, description, is_core")
      .order("name", { ascending: true })
      .returns<ProjectRow[]>(),
    supabase.from("project_editors").select("project_id, user_id").returns<ProjectEditorRow[]>()
  ]);

  if (usersResult.error) {
    throw new Error(`Failed to load users: ${usersResult.error.message}`);
  }
  if (projectsResult.error) {
    throw new Error(`Failed to load projects: ${projectsResult.error.message}`);
  }
  if (assignmentsResult.error) {
    throw new Error(`Failed to load project editor assignments: ${assignmentsResult.error.message}`);
  }

  return {
    users: (usersResult.data ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      status: row.status,
      createdAt: row.created_at
    })),
    projects: (projectsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      codename: row.codename,
      description: row.description,
      isCore: row.is_core
    })),
    assignments: (assignmentsResult.data ?? []).map((row) => ({
      projectId: row.project_id,
      userId: row.user_id
    }))
  };
}

export async function getAdminProjectsData(): Promise<{
  projects: AdminProject[];
  teams: AdminTeam[];
  projectTeams: Array<{ projectId: string; teamId: string }>;
}> {
  const supabase = await createSupabaseServerClient();

  const [projectsResult, teamsResult, projectTeamsResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, codename, description, is_core")
      .order("name", { ascending: true })
      .returns<ProjectRow[]>(),
    supabase.from("teams").select("id, name, description").order("name", { ascending: true }).returns<TeamRow[]>(),
    supabase.from("project_teams").select("project_id, team_id").returns<Array<{ project_id: string; team_id: string }>>()
  ]);

  if (projectsResult.error) {
    throw new Error(`Failed to load projects: ${projectsResult.error.message}`);
  }
  if (teamsResult.error) {
    throw new Error(`Failed to load teams: ${teamsResult.error.message}`);
  }
  if (projectTeamsResult.error) {
    throw new Error(`Failed to load project-team assignments: ${projectTeamsResult.error.message}`);
  }

  return {
    projects: (projectsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      codename: row.codename,
      description: row.description,
      isCore: row.is_core
    })),
    teams: (teamsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description
    })),
    projectTeams: (projectTeamsResult.data ?? []).map((row) => ({
      projectId: row.project_id,
      teamId: row.team_id
    }))
  };
}
