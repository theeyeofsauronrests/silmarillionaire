"use client";

import { useMemo, useState } from "react";

import { FilterTabs, type DirectoryFilter } from "@/components/directory/filter-tabs";
import { PersonCard } from "@/components/directory/person-card";
import { ProjectCard } from "@/components/directory/project-card";
import { SearchBar } from "@/components/directory/search-bar";
import { TeamCard } from "@/components/directory/team-card";
import type { DirectoryData } from "@/lib/directory/types";

type DirectoryExplorerProps = {
  directoryData: DirectoryData;
};

function matchesProject(project: DirectoryData["projects"][number], query: string) {
  const haystack = [
    project.name,
    project.codename,
    project.description,
    project.teamNames.join(" "),
    project.peopleNames.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function matchesTeam(team: DirectoryData["teams"][number], query: string) {
  const haystack = [team.name, team.description, team.projectNames.join(" "), team.peopleNames.join(" ")]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function matchesPerson(person: DirectoryData["people"][number], query: string) {
  const haystack = [
    person.displayName,
    person.title,
    person.orgUnit,
    person.teamNames.join(" "),
    person.projectNames.join(" "),
    person.roles.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function DirectoryExplorer({ directoryData }: DirectoryExplorerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DirectoryFilter>("projects");

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return directoryData;
    }

    return {
      projects: directoryData.projects.filter((project) => matchesProject(project, normalizedQuery)),
      teams: directoryData.teams.filter((team) => matchesTeam(team, normalizedQuery)),
      people: directoryData.people.filter((person) => matchesPerson(person, normalizedQuery))
    };
  }, [directoryData, normalizedQuery]);

  const activeCount =
    filter === "projects" ? filtered.projects.length : filter === "teams" ? filtered.teams.length : filtered.people.length;

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-parchment-border bg-parchment-base p-4 shadow-parchment">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr] md:items-end">
          <SearchBar value={query} onChange={setQuery} />
          <FilterTabs active={filter} onChange={setFilter} />
        </div>
        <p className="mt-3 text-sm text-parchment-ink/80">
          Showing {activeCount} {filter} {normalizedQuery ? `for \"${query.trim()}\"` : ""}
        </p>
      </div>

      {filter === "projects" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}

      {filter === "teams" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : null}

      {filter === "people" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : null}

      {activeCount === 0 ? (
        <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">
          No results found. Try another search term.
        </p>
      ) : null}
    </section>
  );
}
