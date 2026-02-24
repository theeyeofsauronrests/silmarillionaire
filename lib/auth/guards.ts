import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "viewer" | "editor" | "admin";
export type UserStatus = "pending" | "active" | "denied";

type UserProfile = {
  email: string;
  name: string | null;
  role: AppRole;
  status: UserStatus;
};

export type AuthContext = {
  authUser: User;
  profile: UserProfile | null;
};

type RequireUserOptions = {
  activeOnly?: boolean;
};

async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("email, name, role, status")
    .eq("id", data.user.id)
    .maybeSingle<UserProfile>();

  return {
    authUser: data.user,
    profile: profile ?? null
  } satisfies AuthContext;
}

export async function requireUser(options: RequireUserOptions = {}) {
  const { activeOnly = true } = options;
  const context = await getAuthContext();

  if (activeOnly && context.profile?.status !== "active") {
    redirect("/waitlist");
  }

  return context;
}

export async function requireRole(role: AppRole) {
  const { authUser, profile } = await requireUser({ activeOnly: true });
  const userRole = profile?.role ?? (authUser.app_metadata.role as AppRole | undefined);

  if (role === "admin" && userRole !== "admin") {
    redirect("/");
  }

  if (role === "editor" && userRole !== "editor" && userRole !== "admin") {
    redirect("/");
  }

  return { authUser, profile };
}
