import { PageHeader } from "@/components/layout/page-header";
import { ConsolidatedRoadmap } from "@/components/projects/consolidated-roadmap";
import { requireUser } from "@/lib/auth/guards";
import { getConsolidatedRoadmap } from "@/lib/projects/get-consolidated-roadmap";

export default async function ProjectsPage() {
  await requireUser({ activeOnly: true });
  const roadmap = await getConsolidatedRoadmap();

  return (
    <section>
      <PageHeader title="Projects Roadmap" description="Consolidated roadmap across all projects and team swimlanes." />
      <ConsolidatedRoadmap data={roadmap} />
    </section>
  );
}
