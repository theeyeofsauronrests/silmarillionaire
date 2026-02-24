import { signOutAction } from "@/app/(protected)/actions";

import { Button } from "@/components/ui/button";

type TopNavProps = {
  userEmail: string;
};

export function TopNav({ userEmail }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-parchment-border/70 bg-parchment-base/90 px-4 py-3 backdrop-blur">
      <p className="text-sm text-parchment-green">{userEmail}</p>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" className="text-xs">
          Sign out
        </Button>
      </form>
    </nav>
  );
}
