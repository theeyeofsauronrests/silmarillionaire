"use client";

import Link from "next/link";
import { useActionState } from "react";

import { waitlistAction } from "@/app/(auth)/waitlist/actions";
import { Button } from "@/components/ui/button";

const initialWaitlistState = {
  error: null,
  success: null
};

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(waitlistAction, initialWaitlistState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-parchment-green" htmlFor="name">
          Name
        </label>
        <input
          className="w-full rounded border border-parchment-border bg-white/80 px-3 py-2 text-sm"
          id="name"
          name="name"
          type="text"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-parchment-green" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded border border-parchment-border bg-white/80 px-3 py-2 text-sm"
          id="email"
          name="email"
          type="email"
          required
        />
      </div>

      {state.error ? (
        <p className="rounded border border-red-400/60 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded border border-parchment-green/50 bg-parchment-green/10 px-3 py-2 text-sm text-parchment-green">
          {state.success}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Request Access"}
      </Button>

      <p className="text-sm text-parchment-ink/80">
        Already have credentials?{" "}
        <Link className="text-parchment-green underline" href="/login">
          Return to login
        </Link>
      </p>
    </form>
  );
}
