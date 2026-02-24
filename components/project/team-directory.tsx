import type { ProjectTeamDirectoryModel, TeamMemberModel, TeamRole } from "@/lib/projects/types";

type TeamDirectoryProps = {
  teams: ProjectTeamDirectoryModel[];
};

const ROLE_ORDER: TeamRole[] = ["pm", "engineer", "designer", "other", "leadership"];
const ROLE_LABELS: Record<TeamRole, string> = {
  pm: "PM",
  engineer: "Engineers",
  designer: "Designers",
  other: "Other",
  leadership: "Leadership"
};

function formatMember(member: TeamMemberModel) {
  if (member.allocationPct === null) {
    return `${member.displayName} (${member.title})`;
  }

  return `${member.displayName} (${member.title}, ${member.allocationPct}%)`;
}

export function TeamDirectory({ teams }: TeamDirectoryProps) {
  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Team Directory</h2>

      {teams.length === 0 ? (
        <p className="mt-3 text-sm text-parchment-ink/80">No teams assigned.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {teams.map((team) => {
            const membersByRole = new Map<TeamRole, TeamMemberModel[]>(ROLE_ORDER.map((role) => [role, []]));
            team.members.forEach((member) => {
              const group = membersByRole.get(member.role) ?? [];
              group.push(member);
              membersByRole.set(member.role, group);
            });

            return (
              <section key={team.teamId} className="rounded border border-parchment-border/70 bg-parchment-base/70 p-4">
                <h3 className="text-xl font-semibold text-parchment-green">{team.teamName}</h3>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {ROLE_ORDER.map((role) => {
                    const members = membersByRole.get(role) ?? [];

                    return (
                      <article key={`${team.teamId}-${role}`} className="rounded border border-parchment-border bg-white/35 p-3">
                        <h4 className="text-sm font-semibold text-parchment-green">{ROLE_LABELS[role]}</h4>
                        {members.length === 0 ? (
                          <p className="mt-1 text-sm text-parchment-ink/70">None assigned</p>
                        ) : (
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-parchment-ink/85">
                            {members.map((member) => (
                              <li key={`${team.teamId}-${role}-${member.personId}`}>{formatMember(member)}</li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
