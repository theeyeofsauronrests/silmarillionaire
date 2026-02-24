import { UserRoleEditor } from "@/components/admin/user-role-editor";
import { PageHeader } from "@/components/layout/page-header";
import { getAdminUsersData } from "@/lib/admin/get-admin-data";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const data = await getAdminUsersData();

  return (
    <section className="space-y-4">
      <PageHeader
        title="Admin / Users"
        description="Manage user role, account status, and project editor assignments."
      />
      <UserRoleEditor users={data.users} projects={data.projects} assignments={data.assignments} />
    </section>
  );
}
