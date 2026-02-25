"use server";

import { revalidatePath } from "next/cache";

import { requireProjectEditAccess } from "@/lib/auth/project-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const VALID_HORIZONS = new Set(["now", "next", "later"]);
const VALID_MILESTONE_CATEGORIES = new Set(["event", "release", "exercise", "other"]);

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

export async function moveRoadmapItemAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const roadmapItemId = requireNonEmptyString(formData.get("roadmapItemId"), "roadmapItemId");
  const horizon = requireNonEmptyString(formData.get("horizon"), "horizon");

  if (!VALID_HORIZONS.has(horizon)) {
    throw new Error("Invalid horizon.");
  }

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("roadmap_items")
    .update({
      horizon,
      team_id: parseOptionalUuid(formData.get("teamId"))
    })
    .eq("id", roadmapItemId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to move roadmap item: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function createProjectLinkAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const label = requireNonEmptyString(formData.get("label"), "label");
  const url = requireNonEmptyString(formData.get("url"), "url");
  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_links").insert({
    project_id: projectId,
    label,
    url
  });

  if (error) {
    throw new Error(`Failed to create project link: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteProjectLinkAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const linkId = requireNonEmptyString(formData.get("linkId"), "linkId");
  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_links").delete().eq("id", linkId).eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to delete project link: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function createProjectImageAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const storagePath = requireNonEmptyString(formData.get("storagePath"), "storagePath");
  const caption = requireNonEmptyString(formData.get("caption"), "caption");
  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_images").insert({
    project_id: projectId,
    storage_path: storagePath,
    caption
  });

  if (error) {
    throw new Error(`Failed to create project image: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteProjectImageAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const imageId = requireNonEmptyString(formData.get("imageId"), "imageId");
  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_images").delete().eq("id", imageId).eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to delete project image: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function createKeyMilestoneAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const title = requireNonEmptyString(formData.get("title"), "title");
  const details = requireNonEmptyString(formData.get("details"), "details");
  const category = requireNonEmptyString(formData.get("category"), "category");

  if (!VALID_MILESTONE_CATEGORIES.has(category)) {
    throw new Error("Invalid milestone category.");
  }

  const milestoneDateRaw = formData.get("milestoneDate");
  const milestoneDate = typeof milestoneDateRaw === "string" && milestoneDateRaw.trim().length > 0 ? milestoneDateRaw : null;

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("key_milestones").insert({
    project_id: projectId,
    title,
    details,
    category,
    milestone_date: milestoneDate
  });

  if (error) {
    throw new Error(`Failed to create key milestone: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function updateKeyMilestoneAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const milestoneId = requireNonEmptyString(formData.get("milestoneId"), "milestoneId");
  const title = requireNonEmptyString(formData.get("title"), "title");
  const details = requireNonEmptyString(formData.get("details"), "details");
  const category = requireNonEmptyString(formData.get("category"), "category");

  if (!VALID_MILESTONE_CATEGORIES.has(category)) {
    throw new Error("Invalid milestone category.");
  }

  const milestoneDateRaw = formData.get("milestoneDate");
  const milestoneDate = typeof milestoneDateRaw === "string" && milestoneDateRaw.trim().length > 0 ? milestoneDateRaw : null;

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("key_milestones")
    .update({
      title,
      details,
      category,
      milestone_date: milestoneDate
    })
    .eq("id", milestoneId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to update key milestone: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteKeyMilestoneAction(formData: FormData) {
  const projectId = requireNonEmptyString(formData.get("projectId"), "projectId");
  const milestoneId = requireNonEmptyString(formData.get("milestoneId"), "milestoneId");

  await requireProjectEditAccess(projectId);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("key_milestones")
    .delete()
    .eq("id", milestoneId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to delete key milestone: ${error.message}`);
  }

  revalidatePath(`/projects/${projectId}`);
}
