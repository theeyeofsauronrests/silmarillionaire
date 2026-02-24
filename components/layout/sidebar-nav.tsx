import Link from "next/link";

const LINKS = [
  { href: "/", label: "Directory" },
  { href: "/projects", label: "Projects" },
  { href: "/my-projects", label: "My Projects" },
  { href: "/core", label: "Core" },
  { href: "/admin", label: "Admin" }
];

export function SidebarNav() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-parchment-border/70 bg-parchment-base/70 p-4 lg:block">
      <p className="mb-6 border-b border-parchment-border/70 pb-3 text-xl font-semibold text-parchment-green">
        Silmarillion
      </p>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded px-3 py-2 text-sm text-parchment-ink hover:bg-parchment-border/20"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
