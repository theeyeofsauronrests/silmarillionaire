"use client";

import Link from "next/link";
import { useActionState } from "react";

import { initialLoginState, loginAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-parchment-green" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded border border-parchment-border bg-white/80 px-3 py-2 text-sm"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-parchment-green" htmlFor="password">
          Password
        </label>
        <input
          className="w-full rounded border border-parchment-border bg-white/80 px-3 py-2 text-sm"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? (
        <p className="rounded border border-red-400/60 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-sm text-parchment-ink/80">
        Need access?{" "}
        <Link className="text-parchment-green underline" href="/waitlist">
          Join the waitlist
        </Link>
      </p>
    </form>
  );
}
