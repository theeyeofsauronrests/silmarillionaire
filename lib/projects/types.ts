export type TeamRole = "pm" | "engineer" | "designer" | "other" | "leadership";
export type RoadmapHorizon = "now" | "next" | "later";

export type ProjectHeaderModel = {
  id: string;
  name: string;
  codename: string;
  description: string;
  isCore: boolean;
};

export type ProjectImageModel = {
  id: string;
  caption: string;
  storagePath: string;
  imageUrl: string;
};

export type ProjectLinkModel = {
  id: string;
  label: string;
  url: string;
};

export type ProjectRoadmapCard = {
  id: string;
  title: string;
  body: string;
  horizon: RoadmapHorizon;
  ownerName: string | null;
  ownerPersonId: string | null;
  teamId: string | null;
  teamName: string;
};

export type ProjectKeyMilestone = {
  id: string;
  title: string;
  details: string;
  milestoneDate: string | null;
  category: "event" | "release" | "exercise" | "other";
};

export type TeamMemberModel = {
  personId: string;
  displayName: string;
  title: string;
  role: TeamRole;
  allocationPct: number | null;
};

export type ProjectTeamDirectoryModel = {
  teamId: string;
  teamName: string;
  members: TeamMemberModel[];
};

export type FlattenedProjectPersonModel = {
  personId: string;
  displayName: string;
  title: string;
  teamNames: string[];
  roles: TeamRole[];
};

export type ProjectDetailModel = {
  project: ProjectHeaderModel;
  roadmap: ProjectRoadmapCard[];
  images: ProjectImageModel[];
  links: ProjectLinkModel[];
  milestones: ProjectKeyMilestone[];
  teamDirectory: ProjectTeamDirectoryModel[];
  people: FlattenedProjectPersonModel[];
  teamOptions: Array<{ id: string; name: string }>;
  personOptions: Array<{ id: string; name: string }>;
};
