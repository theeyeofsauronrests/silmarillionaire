import type { AppRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProjectRow = {
  id: string;
  name: string;
  codename: string;
  description: string;
};

type ProjectEditorRow = {
  project_id: string;
};

export async function getMyProjects(userId: string, role: AppRole): Promise<ProjectRow[]> {
  const supabase = await createSupabaseServerClient();

  if (role === "admin") {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, codename, description")
      .order("name", { ascending: true })
      .returns<ProjectRow[]>();

    if (error) {
      throw new Error(`Failed to load projects: ${error.message}`);
    }

    return data ?? [];
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("project_editors")
    .select("project_id")
    .eq("user_id", userId)
    .returns<ProjectEditorRow[]>();

  if (assignmentsError) {
    throw new Error(`Failed to load project assignments: ${assignmentsError.message}`);
  }

  const projectIds = (assignments ?? []).map((assignment) => assignment.project_id);

  if (projectIds.length === 0) {
    return [];
  }

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, codename, description")
    .in("id", projectIds)
    .order("name", { ascending: true })
    .returns<ProjectRow[]>();

  if (projectsError) {
    throw new Error(`Failed to load assigned projects: ${projectsError.message}`);
  }

  return projects ?? [];
}
