"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Directory", short: "DIR" },
  { href: "/projects", label: "Projects", short: "PRJ" },
  { href: "/my-projects", label: "My Projects", short: "MPR" },
  { href: "/core", label: "Core", short: "COR" },
  { href: "/admin", label: "Admin", short: "ADM" }
];

type SidebarNavProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function SidebarNav({ collapsed, onToggle }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden shrink-0 border-r-2 border-parchment-gold/70 bg-[#1f2524] p-4 transition-[width] duration-200 lg:block ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-parchment-gold/30 pb-3">
        <p className={`text-xl font-semibold text-parchment-gold ${collapsed ? "sr-only" : ""}`}>Silmarillionaire</p>
        <button
          type="button"
          onClick={onToggle}
          className="rounded border border-parchment-gold/70 px-2 py-1 text-xs font-semibold text-parchment-gold hover:bg-parchment-gold/15"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>
      <nav className="space-y-1">
        {LINKS.map((link) => {
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-parchment-green/20 text-parchment-green ring-1 ring-parchment-green/60"
                  : "text-parchment-ink hover:bg-parchment-border/20"
              } ${collapsed ? "text-center" : ""}`}
              title={collapsed ? link.label : undefined}
            >
              {collapsed ? link.short : link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
