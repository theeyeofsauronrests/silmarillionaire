import { waitlistSignOutAction } from "@/app/(auth)/waitlist/actions";
import { WaitlistForm } from "@/components/auth/waitlist-form";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

type WaitlistProfile = {
  status: "pending" | "active" | "denied";
};

export default async function WaitlistPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <h1 className="text-4xl font-semibold text-parchment-green">Request Access</h1>
        <p className="mb-6 mt-2 text-sm text-parchment-ink/80">
          Submit your details to join the Silmarillion waitlist.
        </p>
        <WaitlistForm />
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("users")
    .select("status")
    .eq("id", user.id)
    .maybeSingle<WaitlistProfile>();

  const status = profile?.status ?? "pending";

  if (status === "active") {
    return (
      <div>
        <h1 className="text-4xl font-semibold text-parchment-green">Access Active</h1>
        <p className="mb-6 mt-2 text-sm text-parchment-ink/80">Your account is active. Return to the directory.</p>
        <Link className="text-sm font-semibold text-parchment-green underline" href="/">
          Open Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold text-parchment-green">Access {status === "denied" ? "Denied" : "Pending"}</h1>
      <p className="text-sm text-parchment-ink/80">
        {status === "denied"
          ? "Your request was denied. Contact an administrator if you need this reviewed."
          : "Your access request is awaiting admin approval. You will be able to use the app once activated."}
      </p>
      <form action={waitlistSignOutAction}>
        <Button type="submit" variant="ghost">
          Sign out
        </Button>
      </form>
    </div>
  );
}
