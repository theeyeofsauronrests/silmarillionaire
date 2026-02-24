"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireString(value: FormDataEntryValue | null, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid ${label}.`);
  }

  return value.trim();
}

function randomPassword(length = 24) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function findAuthUserByEmail(email: string) {
  const adminClient = createSupabaseAdminClient();
  let page = 1;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 200 });

    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`);
    }

    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      return found;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureAuthUser(email: string, name: string) {
  const existing = await findAuthUserByEmail(email);
  if (existing) {
    return existing;
  }

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: randomPassword(),
    email_confirm: true,
    user_metadata: { name },
    app_metadata: { role: "viewer" }
  });

  if (error || !data.user) {
    throw new Error(`Failed to create auth user: ${error?.message ?? "unknown error"}`);
  }

  return data.user;
}

export async function approveWaitlistAction(formData: FormData) {
  await requireRole("admin");
  const requestId = requireString(formData.get("requestId"), "requestId");

  const supabase = await createSupabaseServerClient();
  const { data: request, error: requestError } = await supabase
    .from("waitlist_requests")
    .select("id, name, email, status")
    .eq("id", requestId)
    .maybeSingle<{ id: string; name: string; email: string; status: "pending" | "approved" | "denied" }>();

  if (requestError) {
    throw new Error(`Failed to load waitlist request: ${requestError.message}`);
  }
  if (!request) {
    throw new Error("Waitlist request not found.");
  }

  const authUser = await ensureAuthUser(request.email, request.name);
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(request.email);
  if (resetError) {
    throw new Error(`Failed to send password setup email: ${resetError.message}`);
  }

  const adminClient = createSupabaseAdminClient();
  const { error: metadataError } = await adminClient.auth.admin.updateUserById(authUser.id, {
    app_metadata: {
      ...(authUser.app_metadata ?? {}),
      role: "viewer"
    },
    user_metadata: {
      ...(authUser.user_metadata ?? {}),
      name: authUser.user_metadata?.name ?? request.name
    }
  });

  if (metadataError) {
    throw new Error(`Failed to set default auth metadata: ${metadataError.message}`);
  }

  const { error: userUpsertError } = await supabase.from("users").upsert(
    {
      id: authUser.id,
      email: request.email,
      name: request.name,
      role: "viewer",
      status: "active"
    },
    { onConflict: "id" }
  );

  if (userUpsertError) {
    throw new Error(`Failed to activate user profile: ${userUpsertError.message}`);
  }

  const { error: waitlistUpdateError } = await supabase
    .from("waitlist_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  if (waitlistUpdateError) {
    throw new Error(`Failed to mark waitlist request approved: ${waitlistUpdateError.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/waitlist");
  revalidatePath("/admin/users");
}

export async function denyWaitlistAction(formData: FormData) {
  await requireRole("admin");
  const requestId = requireString(formData.get("requestId"), "requestId");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("waitlist_requests")
    .update({ status: "denied" })
    .eq("id", requestId);

  if (error) {
    throw new Error(`Failed to deny waitlist request: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/waitlist");
}
