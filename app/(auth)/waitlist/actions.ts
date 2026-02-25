"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type WaitlistState = {
  error: string | null;
  success: string | null;
};

export async function waitlistAction(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const name = formData.get("name");
  const email = formData.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    return { error: "Please provide a valid name and email.", success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("waitlist_requests").insert({
    name,
    email,
    status: "pending"
  });

  if (error) {
    return {
      error:
        "Unable to submit the request right now. Verify waitlist table migration is applied and try again.",
      success: null
    };
  }

  return {
    error: null,
    success: "Request submitted. An admin will review your access."
  };
}

export async function waitlistSignOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
