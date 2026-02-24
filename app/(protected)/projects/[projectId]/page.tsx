import { notFound } from "next/navigation";

import { ImageGallery } from "@/components/project/image-gallery";
import { LinksList } from "@/components/project/links-list";
import { PersonList } from "@/components/project/person-list";
import { ProjectHeader } from "@/components/project/project-header";
import { RoadmapBoard } from "@/components/project/roadmap-board";
import { TeamDirectory } from "@/components/project/team-directory";
import { requireUser } from "@/lib/auth/guards";
import { getProjectDetail } from "@/lib/projects/get-project-detail";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  await requireUser();
  const { projectId } = await params;
  const detail = await getProjectDetail(projectId);

  if (!detail) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <ProjectHeader project={detail.project} />

      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Description</h2>
        <p className="mt-3 text-sm text-parchment-ink/85">{detail.project.description}</p>
      </section>

      <RoadmapBoard roadmap={detail.roadmap} />
      <ImageGallery images={detail.images} />
      <LinksList links={detail.links} />
      <TeamDirectory teams={detail.teamDirectory} />
      <PersonList people={detail.people} />
    </section>
  );
}
