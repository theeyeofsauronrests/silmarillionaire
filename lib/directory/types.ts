export type TeamRole = "pm" | "engineer" | "designer" | "other" | "leadership";

export type ProjectDirectoryItem = {
  id: string;
  name: string;
  codename: string;
  description: string;
  isCore: boolean;
  teamNames: string[];
  peopleNames: string[];
  peopleCount: number;
};

export type TeamDirectoryItem = {
  id: string;
  name: string;
  description: string;
  projectNames: string[];
  peopleNames: string[];
  peopleCount: number;
};

export type PersonDirectoryItem = {
  id: string;
  displayName: string;
  title: string;
  orgUnit: string;
  isLeadership: boolean;
  teamNames: string[];
  projectNames: string[];
  roles: TeamRole[];
};

export type DirectoryData = {
  projects: ProjectDirectoryItem[];
  teams: TeamDirectoryItem[];
  people: PersonDirectoryItem[];
};
