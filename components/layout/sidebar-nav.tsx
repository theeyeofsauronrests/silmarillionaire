import Link from "next/link";

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
  return (
    <aside
      className={`hidden shrink-0 border-r border-parchment-border/70 bg-parchment-base/70 p-4 transition-[width] duration-200 lg:block ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-parchment-border/70 pb-3">
        <p className={`text-xl font-semibold text-parchment-green ${collapsed ? "sr-only" : ""}`}>Silmarillionaire</p>
        <button
          type="button"
          onClick={onToggle}
          className="rounded border border-parchment-border px-2 py-1 text-xs font-semibold text-parchment-ink hover:bg-parchment-border/15"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded px-3 py-2 text-sm text-parchment-ink hover:bg-parchment-border/20 ${collapsed ? "text-center" : ""}`}
            title={collapsed ? link.label : undefined}
          >
            {collapsed ? link.short : link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
