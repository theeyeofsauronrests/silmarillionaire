import { notFound } from "next/navigation";

import { ImageGallery } from "@/components/project/image-gallery";
import { LinksList } from "@/components/project/links-list";
import { PersonList } from "@/components/project/person-list";
import { ProjectEditorForm } from "@/components/project/project-editor-form";
import { ProjectHeader } from "@/components/project/project-header";
import { RoadmapEditor } from "@/components/project/roadmap-editor";
import { RoadmapBoard } from "@/components/project/roadmap-board";
import { TeamDirectory } from "@/components/project/team-directory";
import { requireUser } from "@/lib/auth/guards";
import { getProjectEditAccess } from "@/lib/auth/project-access";
import { getProjectDetail } from "@/lib/projects/get-project-detail";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  await requireUser();
  const { projectId } = await params;
  const [detail, access] = await Promise.all([getProjectDetail(projectId), getProjectEditAccess(projectId)]);

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
      {access.canEdit ? (
        <RoadmapEditor
          projectId={detail.project.id}
          roadmap={detail.roadmap}
          teamOptions={detail.teamOptions}
          personOptions={detail.personOptions}
        />
      ) : null}
      <ImageGallery images={detail.images} />
      <LinksList links={detail.links} />
      <TeamDirectory teams={detail.teamDirectory} />
      <PersonList people={detail.people} />
      {access.canEdit ? <ProjectEditorForm project={detail.project} /> : null}
    </section>
  );
}
