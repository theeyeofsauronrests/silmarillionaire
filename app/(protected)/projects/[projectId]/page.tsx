import { PageHeader } from "@/components/layout/page-header";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;

  return (
    <section>
      <PageHeader
        title={`Project ${projectId}`}
        description="Roadmap, staffing, links, and print mode will be built in Milestone 4."
      />
    </section>
  );
}
