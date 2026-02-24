import type { FlattenedProjectPersonModel } from "@/lib/projects/types";

type PersonListProps = {
  people: FlattenedProjectPersonModel[];
};

export function PersonList({ people }: PersonListProps) {
  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Flattened People List</h2>

      {people.length === 0 ? (
        <p className="mt-3 text-sm text-parchment-ink/80">No people assigned.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-parchment-border text-left text-parchment-green">
                <th className="px-2 py-2 font-semibold">Name</th>
                <th className="px-2 py-2 font-semibold">Title</th>
                <th className="px-2 py-2 font-semibold">Teams</th>
                <th className="px-2 py-2 font-semibold">Roles</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.personId} className="border-b border-parchment-border/70">
                  <td className="px-2 py-2 text-parchment-ink">{person.displayName}</td>
                  <td className="px-2 py-2 text-parchment-ink/85">{person.title}</td>
                  <td className="px-2 py-2 text-parchment-ink/85">{person.teamNames.join(", ")}</td>
                  <td className="px-2 py-2 text-parchment-ink/85">
                    {person.roles.length > 0 ? person.roles.join(", ") : "Unspecified"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
