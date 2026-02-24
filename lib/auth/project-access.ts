import { redirect } from "next/navigation";

import type { AppRole } from "@/lib/auth/guards";
import { requireUser } from "@/lib/auth/guards";
import { hasMinimumRole } from "@/lib/auth/role-utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FALLBACK_ROLE: AppRole = "viewer";

function resolveRole(role: AppRole | undefined): AppRole {
  return role ?? FALLBACK_ROLE;
}

export async function getProjectEditAccess(projectId: string): Promise<{ canEdit: boolean; role: AppRole }> {
  const { authUser, profile } = await requireUser({ activeOnly: true });
  const role = resolveRole(profile?.role ?? (authUser.app_metadata.role as AppRole | undefined));

  if (hasMinimumRole(role, "admin")) {
    return { canEdit: true, role };
  }

  if (!hasMinimumRole(role, "editor")) {
    return { canEdit: false, role };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_editors")
    .select("project_id")
    .eq("project_id", projectId)
    .eq("user_id", authUser.id)
    .maybeSingle<{ project_id: string }>();

  if (error) {
    throw new Error(`Failed to resolve project edit permission: ${error.message}`);
  }

  return { canEdit: Boolean(data), role };
}

export async function requireProjectEditAccess(projectId: string): Promise<{ role: AppRole }> {
  const access = await getProjectEditAccess(projectId);

  if (!access.canEdit) {
    redirect(`/projects/${projectId}`);
  }

  return { role: access.role };
}
