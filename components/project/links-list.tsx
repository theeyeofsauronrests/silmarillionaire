import type { ProjectLinkModel } from "@/lib/projects/types";

type LinksListProps = {
  links: ProjectLinkModel[];
};

export function LinksList({ links }: LinksListProps) {
  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Important Links</h2>
      {links.length === 0 ? (
        <p className="mt-3 text-sm text-parchment-ink/80">No links available.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-parchment-green underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
