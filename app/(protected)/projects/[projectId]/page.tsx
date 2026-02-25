import { notFound } from "next/navigation";

import { DraggableRoadmapBoard } from "@/components/project/draggable-roadmap-board";
import { ImageGallery } from "@/components/project/image-gallery";
import { KeyMilestonesEditor } from "@/components/project/key-milestones-editor";
import { KeyMilestones } from "@/components/project/key-milestones";
import { LinksList } from "@/components/project/links-list";
import { PersonList } from "@/components/project/person-list";
import { ProjectAssetsEditor } from "@/components/project/project-assets-editor";
import { ProjectEditorForm } from "@/components/project/project-editor-form";
import { ProjectHeader } from "@/components/project/project-header";
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
      <section className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
        <h2 className="text-lg font-semibold text-parchment-green">Edit Access</h2>
        {access.canEdit ? (
          <div className="mt-2 text-sm text-parchment-ink/85">
            <p>You can edit this project.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="#assets-editor"
                className="rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base"
              >
                Edit Links and Images
              </a>
              <a
                href="#milestones-editor"
                className="rounded border border-parchment-border px-3 py-1.5 text-xs font-semibold text-parchment-ink hover:bg-parchment-border/20"
              >
                Edit Milestones
              </a>
              <a
                href="#project-editor"
                className="rounded border border-parchment-border px-3 py-1.5 text-xs font-semibold text-parchment-ink hover:bg-parchment-border/20"
              >
                Edit Project Details
              </a>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-parchment-ink/85">
            Your role is <span className="font-semibold">{access.role}</span>. You can view but not edit this project.
            Ask an admin to assign you as a project editor in Admin → Users.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
        <h2 className="text-2xl font-semibold text-parchment-green">Description</h2>
        <p className="mt-3 text-sm text-parchment-ink/85">{detail.project.description}</p>
      </section>

      <DraggableRoadmapBoard
        projectId={detail.project.id}
        roadmap={detail.roadmap}
        canEdit={access.canEdit}
        teamOptions={detail.teamOptions}
      />
      <KeyMilestones milestones={detail.milestones} />
      {access.canEdit ? (
        <>
          <KeyMilestonesEditor projectId={detail.project.id} milestones={detail.milestones} />
          <ProjectAssetsEditor projectId={detail.project.id} links={detail.links} images={detail.images} />
        </>
      ) : null}
      <ImageGallery images={detail.images} />
      <LinksList links={detail.links} />
      <TeamDirectory teams={detail.teamDirectory} />
      <PersonList people={detail.people} />
      {access.canEdit ? <ProjectEditorForm project={detail.project} /> : null}
    </section>
  );
}
