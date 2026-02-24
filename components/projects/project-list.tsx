"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ProjectDirectoryItem } from "@/lib/directory/types";

type ProjectListProps = {
  projects: ProjectDirectoryItem[];
};

export function ProjectList({ projects }: ProjectListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return projects;
    }

    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.codename,
        project.description,
        project.teamNames.join(" "),
        project.peopleNames.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [projects, query]);

  return (
    <section className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-parchment-green">Search Projects</span>
        <input
          className="w-full rounded border border-parchment-border bg-white/75 px-3 py-2 text-sm"
          placeholder="Search by name, codename, team, or person"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
        />
      </label>

      <div className="space-y-3">
        {filtered.map((project) => (
          <article key={project.id} className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-parchment-green">{project.name}</h3>
                <p className="text-xs uppercase tracking-wide text-parchment-ink/70">{project.codename}</p>
              </div>
              <Link
                href={`/projects/${project.id}`}
                className="shrink-0 text-sm font-semibold text-parchment-green underline"
              >
                View
              </Link>
            </div>
            <p className="mt-2 text-sm text-parchment-ink/85">{project.description}</p>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">
          No projects matched your search.
        </p>
      ) : null}
    </section>
  );
}
