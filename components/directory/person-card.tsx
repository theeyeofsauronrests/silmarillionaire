import type { PersonDirectoryItem } from "@/lib/directory/types";

type PersonCardProps = {
  person: PersonDirectoryItem;
};

function formatRoles(roles: PersonDirectoryItem["roles"]) {
  if (roles.length === 0) {
    return "Unassigned";
  }

  return roles.join(", ");
}

function renderPreview(items: string[]) {
  if (items.length === 0) {
    return "None";
  }

  const preview = items.slice(0, 3).join(", ");
  if (items.length <= 3) {
    return preview;
  }

  return `${preview}, +${items.length - 3} more`;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <article className="rounded-lg border border-parchment-border bg-parchment-base/90 p-4 shadow-parchment">
      <div className="mb-3 h-1 w-full rounded bg-parchment-border/80" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-xl font-semibold text-parchment-green">{person.displayName}</h3>
        {person.isLeadership ? (
          <span className="rounded border border-parchment-gold bg-parchment-gold/15 px-2 py-0.5 text-xs font-semibold text-parchment-gold">
            Leadership
          </span>
        ) : null}
      </div>

      <p className="text-sm text-parchment-ink/85">{person.title}</p>
      <p className="mb-3 text-xs uppercase tracking-wide text-parchment-ink/70">{person.orgUnit}</p>

      <dl className="space-y-1 text-sm">
        <div>
          <dt className="inline font-semibold text-parchment-green">Roles: </dt>
          <dd className="inline">{formatRoles(person.roles)}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-parchment-green">Teams: </dt>
          <dd className="inline">{renderPreview(person.teamNames)}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-parchment-green">Projects: </dt>
          <dd className="inline">{renderPreview(person.projectNames)}</dd>
        </div>
      </dl>
    </article>
  );
}
