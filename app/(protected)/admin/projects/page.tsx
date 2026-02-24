import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminProjectsPage() {
  await requireRole("admin");

  return (
    <section>
      <PageHeader title="Admin / Projects" description="Project management scaffold." />
    </section>
  );
}
