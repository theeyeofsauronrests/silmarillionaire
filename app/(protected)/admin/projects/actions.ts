"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireString(value: FormDataEntryValue | null, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${label}.`);
  }

  return value.trim();
}

function parseBoolean(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

function parseTeamIds(formData: FormData): string[] {
  const raw = formData.getAll("teamIds");
  const ids = raw.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return Array.from(new Set(ids));
}

export async function createProjectAction(formData: FormData) {
  await requireRole("admin");

  const name = requireString(formData.get("name"), "name");
  const codename = requireString(formData.get("codename"), "codename");
  const description = requireString(formData.get("description"), "description");
  const isCore = parseBoolean(formData.get("isCore"));
  const teamIds = parseTeamIds(formData);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      codename,
      description,
      is_core: isCore
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw new Error(`Failed to create project: ${error?.message ?? "unknown error"}`);
  }

  if (teamIds.length > 0) {
    const { error: teamError } = await supabase.from("project_teams").insert(
      teamIds.map((teamId) => ({
        project_id: data.id,
        team_id: teamId
      }))
    );

    if (teamError) {
      throw new Error(`Project created but team assignment failed: ${teamError.message}`);
    }
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProjectAdminAction(formData: FormData) {
  await requireRole("admin");

  const projectId = requireString(formData.get("projectId"), "projectId");
  const name = requireString(formData.get("name"), "name");
  const codename = requireString(formData.get("codename"), "codename");
  const description = requireString(formData.get("description"), "description");
  const isCore = parseBoolean(formData.get("isCore"));
  const teamIds = parseTeamIds(formData);

  const supabase = await createSupabaseServerClient();
  const { error: projectError } = await supabase
    .from("projects")
    .update({
      name,
      codename,
      description,
      is_core: isCore
    })
    .eq("id", projectId);

  if (projectError) {
    throw new Error(`Failed to update project: ${projectError.message}`);
  }

  const { error: deleteError } = await supabase.from("project_teams").delete().eq("project_id", projectId);
  if (deleteError) {
    throw new Error(`Failed to reset project team assignments: ${deleteError.message}`);
  }

  if (teamIds.length > 0) {
    const { error: insertError } = await supabase.from("project_teams").insert(
      teamIds.map((teamId) => ({
        project_id: projectId,
        team_id: teamId
      }))
    );

    if (insertError) {
      throw new Error(`Failed to assign project teams: ${insertError.message}`);
    }
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
}
