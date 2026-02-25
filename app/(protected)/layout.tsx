import { AppShell } from "@/components/layout/app-shell";
import { PageTurnTransition } from "@/components/layout/page-turn-transition";
import { requireUser } from "@/lib/auth/guards";

export default async function ProtectedLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const { authUser, profile } = await requireUser();
  const email = profile?.email ?? authUser.email ?? "Authenticated User";

  return (
    <AppShell userEmail={email}>
      <PageTurnTransition>{children}</PageTurnTransition>
    </AppShell>
  );
}
