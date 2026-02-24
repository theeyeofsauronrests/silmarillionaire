import type { AdminTeam } from "@/lib/admin/types";

type TeamAssignmentManagerProps = {
  teams: AdminTeam[];
  selectedTeamIds: Set<string>;
  fieldName?: string;
};

export function TeamAssignmentManager({
  teams,
  selectedTeamIds,
  fieldName = "teamIds"
}: TeamAssignmentManagerProps) {
  if (teams.length === 0) {
    return <p className="text-sm text-parchment-ink/80">No teams available for assignment.</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {teams.map((team) => (
        <label key={team.id} className="flex items-start gap-2 rounded border border-parchment-border bg-white/50 p-2 text-sm">
          <input
            type="checkbox"
            name={fieldName}
            value={team.id}
            defaultChecked={selectedTeamIds.has(team.id)}
            className="mt-1"
          />
          <span>
            <span className="font-semibold text-parchment-green">{team.name}</span>
            <span className="block text-parchment-ink/80">{team.description}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
