import type { TeamDirectoryItem } from "@/lib/directory/types";

type TeamCardProps = {
  team: TeamDirectoryItem;
};

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

export function TeamCard({ team }: TeamCardProps) {
  return (
    <article className="rounded-lg border border-parchment-border bg-parchment-base/90 p-4 shadow-parchment">
      <div className="mb-3 h-1 w-full rounded bg-parchment-green/70" />
      <h3 className="text-xl font-semibold text-parchment-green">{team.name}</h3>
      <p className="mb-3 mt-1 line-clamp-2 text-sm text-parchment-ink/85">{team.description}</p>

      <dl className="space-y-1 text-sm">
        <div>
          <dt className="inline font-semibold text-parchment-green">Projects: </dt>
          <dd className="inline">{renderPreview(team.projectNames)}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-parchment-green">People: </dt>
          <dd className="inline">
            {team.peopleCount} ({renderPreview(team.peopleNames)})
          </dd>
        </div>
      </dl>
    </article>
  );
}
