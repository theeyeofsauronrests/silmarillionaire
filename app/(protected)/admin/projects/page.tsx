import { ProjectEditorForm } from "@/components/admin/project-editor-form";
import { PageHeader } from "@/components/layout/page-header";
import { getAdminProjectsData } from "@/lib/admin/get-admin-data";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminProjectsPage() {
  await requireRole("admin");
  const data = await getAdminProjectsData();

  return (
    <section className="space-y-4">
      <PageHeader
        title="Admin / Projects"
        description="Create projects, maintain metadata, toggle core status, and assign teams."
      />
      <ProjectEditorForm projects={data.projects} teams={data.teams} projectTeams={data.projectTeams} />
    </section>
  );
}
