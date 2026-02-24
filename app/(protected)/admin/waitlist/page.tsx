import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminWaitlistPage() {
  await requireRole("admin");

  return (
    <section>
      <PageHeader title="Admin / Waitlist" description="Waitlist approvals scaffold." />
    </section>
  );
}
