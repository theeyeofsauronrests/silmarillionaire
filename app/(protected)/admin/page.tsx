import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminPage() {
  await requireRole("admin");

  return (
    <section>
      <PageHeader title="Admin" description="Admin dashboard scaffold with role gate." />
    </section>
  );
}
