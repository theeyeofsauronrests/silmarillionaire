import { WaitlistTable } from "@/components/admin/waitlist-table";
import { PageHeader } from "@/components/layout/page-header";
import { getWaitlistRequests } from "@/lib/admin/get-admin-data";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminWaitlistPage() {
  await requireRole("admin");
  const requests = await getWaitlistRequests();

  return (
    <section className="space-y-4">
      <PageHeader title="Admin / Waitlist" description="Approve or deny pending waitlist requests." />
      <WaitlistTable requests={requests} />
    </section>
  );
}
