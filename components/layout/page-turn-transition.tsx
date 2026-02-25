"use client";

import { usePathname } from "next/navigation";

type PageTurnTransitionProps = {
  children: React.ReactNode;
};

export function PageTurnTransition({ children }: PageTurnTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-turn-transition">
      {children}
    </div>
  );
}
