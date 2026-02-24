import { PageHeader } from "@/components/layout/page-header";
import { ProjectList } from "@/components/projects/project-list";
import { requireUser } from "@/lib/auth/guards";
import { getDirectoryData } from "@/lib/directory/get-directory-data";

export default async function ProjectsPage() {
  await requireUser();
  const directoryData = await getDirectoryData();

  return (
    <section>
      <PageHeader title="Projects" description="Browse all projects and open their detailed dossiers." />
      <ProjectList projects={directoryData.projects} />
    </section>
  );
}
