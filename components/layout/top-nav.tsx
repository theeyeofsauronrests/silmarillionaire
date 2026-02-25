import { signOutAction } from "@/app/(protected)/actions";

import { Button } from "@/components/ui/button";

type TopNavProps = {
  userEmail: string;
};

export function TopNav({ userEmail }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-parchment-gold/70 bg-[#1d2322] px-4 py-3 backdrop-blur">
      <p className="text-sm text-parchment-green">{userEmail}</p>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" className="border-parchment-gold/70 text-xs text-parchment-gold">
          Sign out
        </Button>
      </form>
    </nav>
  );
}
