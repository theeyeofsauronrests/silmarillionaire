"use server";

import { revalidatePath } from "next/cache";

import { requireProjectEditAccess } from "@/lib/auth/project-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const VALID_HORIZONS = new Set(["now", "next", "later"]);

function requireNonEmptyString(value: FormDataEntryValue | null, label: string): string {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${label}.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  return trimmed;
}

function parseOptionalUuid(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function updateProjectAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const name = requireNonEmptyString(formData.get("name"), "name");
  const codename = requireNonEmptyString(formData.get("codename"), "codename");
  const description = requireNonEmptyString(formData.get("description"), "description");

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({
      name,
      codename,
      description
    })
    .eq("id", projectId);

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createRoadmapItemAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const title = requireNonEmptyString(formData.get("title"), "title");
  const body = requireNonEmptyString(formData.get("body"), "body");
  const horizon = requireNonEmptyString(formData.get("horizon"), "horizon");

  if (!VALID_HORIZONS.has(horizon)) {
    throw new Error("Invalid horizon.");
  }

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("roadmap_items").insert({
    project_id: projectId,
    team_id: parseOptionalUuid(formData.get("teamId")),
    owner_person_id: parseOptionalUuid(formData.get("ownerPersonId")),
    title,
    body,
    horizon
  });

  if (error) {
    throw new Error(`Failed to create roadmap item: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function updateRoadmapItemAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const roadmapItemId = requireNonEmptyString(formData.get("roadmapItemId"), "roadmapItemId");
  const title = requireNonEmptyString(formData.get("title"), "title");
  const body = requireNonEmptyString(formData.get("body"), "body");
  const horizon = requireNonEmptyString(formData.get("horizon"), "horizon");

  if (!VALID_HORIZONS.has(horizon)) {
    throw new Error("Invalid horizon.");
  }

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("roadmap_items")
    .update({
      title,
      body,
      horizon,
      team_id: parseOptionalUuid(formData.get("teamId")),
      owner_person_id: parseOptionalUuid(formData.get("ownerPersonId"))
    })
    .eq("id", roadmapItemId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to update roadmap item: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteRoadmapItemAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const roadmapItemId = requireNonEmptyString(formData.get("roadmapItemId"), "roadmapItemId");

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("roadmap_items")
    .delete()
    .eq("id", roadmapItemId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to delete roadmap item: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}
