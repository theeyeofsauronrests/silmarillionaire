import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { getAdminDashboardSummary } from "@/lib/admin/get-admin-data";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminPage() {
  await requireRole("admin");
  const summary = await getAdminDashboardSummary();

  return (
    <section className="space-y-4">
      <PageHeader title="Admin" description="Operational overview and entry points for approvals, users, and projects." />

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
          <h2 className="text-sm font-semibold text-parchment-green">Pending approvals</h2>
          <p className="mt-2 text-2xl font-semibold text-parchment-ink">{summary.pendingApprovals}</p>
        </article>
        <article className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
          <h2 className="text-sm font-semibold text-parchment-green">Total users</h2>
          <p className="mt-2 text-2xl font-semibold text-parchment-ink">{summary.totalUsers}</p>
        </article>
        <article className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
          <h2 className="text-sm font-semibold text-parchment-green">Total projects</h2>
          <p className="mt-2 text-2xl font-semibold text-parchment-ink">{summary.totalProjects}</p>
        </article>
      </div>

      <div className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
        <h2 className="text-lg font-semibold text-parchment-green">Admin Areas</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-parchment-ink/90">
          <li>
            <Link href="/admin/waitlist" className="text-parchment-green underline">
              Waitlist approvals
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="text-parchment-green underline">
              User role and status management
            </Link>
          </li>
          <li>
            <Link href="/admin/projects" className="text-parchment-green underline">
              Project creation and team assignment
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
