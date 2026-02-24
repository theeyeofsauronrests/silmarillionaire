import { DirectoryExplorer } from "@/components/directory/directory-explorer";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/guards";
import { getDirectoryData } from "@/lib/directory/get-directory-data";

export default async function HomePage() {
  await requireUser();
  const directoryData = await getDirectoryData();

  return (
    <section>
      <PageHeader
        title="Directory"
        description="Find any person, team, or project and inspect matrixed staffing relationships."
      />
      <DirectoryExplorer directoryData={directoryData} />
    </section>
  );
}
