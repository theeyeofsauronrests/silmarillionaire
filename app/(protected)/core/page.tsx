import { CoreRoadmapBoard } from "@/components/core/core-roadmap-board";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/guards";
import { getCoreData } from "@/lib/core/get-core-data";

export default async function CorePage() {
  await requireUser({ activeOnly: true });
  const data = await getCoreData();

  return (
    <section className="space-y-4">
      <PageHeader
        title="The Great Works of the Core"
        description="Core projects and a team-oriented Now / Next / Later roadmap across initiatives."
      />
      <CoreRoadmapBoard data={data} />
    </section>
  );
}
