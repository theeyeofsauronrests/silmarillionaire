"use client";

import { useState } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

export function AppShell({ userEmail, children }: AppShellProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <SidebarNav
        collapsed={isNavCollapsed}
        onToggle={() => {
          setIsNavCollapsed((value) => !value);
        }}
      />
      <div className="flex min-h-screen w-full flex-col">
        <TopNav userEmail={userEmail} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
