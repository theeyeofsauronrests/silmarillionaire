import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminUsersPage() {
  await requireRole("admin");

  return (
    <section>
      <PageHeader title="Admin / Users" description="Role and status management scaffold." />
    </section>
  );
}
