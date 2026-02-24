"use server";

import { revalidatePath } from "next/cache";

import type { AppRole, UserStatus } from "@/lib/auth/guards";
import { requireRole } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = new Set<AppRole>(["viewer", "editor", "admin"]);
const ALLOWED_STATUSES = new Set<UserStatus>(["pending", "active", "denied"]);

function requireString(value: FormDataEntryValue | null, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${label}.`);
  }

  return value.trim();
}

export async function updateUserRoleAction(formData: FormData) {
  await requireRole("admin");
  const userId = requireString(formData.get("userId"), "userId");
  const role = requireString(formData.get("role"), "role") as AppRole;

  if (!ALLOWED_ROLES.has(role)) {
    throw new Error("Invalid role.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").update({ role }).eq("id", userId);
  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }

  const adminClient = createSupabaseAdminClient();
  const { data, error: fetchError } = await adminClient.auth.admin.getUserById(userId);
  if (fetchError) {
    throw new Error(`Failed to fetch auth user: ${fetchError.message}`);
  }

  const { error: metadataError } = await adminClient.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(data.user.app_metadata ?? {}),
      role
    }
  });

  if (metadataError) {
    throw new Error(`Failed to update auth metadata role: ${metadataError.message}`);
  }

  revalidatePath("/admin/users");
}

export async function updateUserStatusAction(formData: FormData) {
  await requireRole("admin");
  const userId = requireString(formData.get("userId"), "userId");
  const status = requireString(formData.get("status"), "status") as UserStatus;

  if (!ALLOWED_STATUSES.has(status)) {
    throw new Error("Invalid status.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").update({ status }).eq("id", userId);
  if (error) {
    throw new Error(`Failed to update user status: ${error.message}`);
  }

  revalidatePath("/admin/users");
}

export async function addProjectEditorAction(formData: FormData) {
  await requireRole("admin");
  const userId = requireString(formData.get("userId"), "userId");
  const projectId = requireString(formData.get("projectId"), "projectId");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_editors").upsert({
    user_id: userId,
    project_id: projectId
  });

  if (error) {
    throw new Error(`Failed to add project editor assignment: ${error.message}`);
  }

  revalidatePath("/admin/users");
}

export async function removeProjectEditorAction(formData: FormData) {
  await requireRole("admin");
  const userId = requireString(formData.get("userId"), "userId");
  const projectId = requireString(formData.get("projectId"), "projectId");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("project_editors").delete().eq("user_id", userId).eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to remove project editor assignment: ${error.message}`);
  }

  revalidatePath("/admin/users");
}
