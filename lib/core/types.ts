export type CoreHorizon = "now" | "next" | "later";

export type CoreProject = {
  id: string;
  name: string;
  codename: string;
  description: string;
};

export type CoreRoadmapItem = {
  id: string;
  projectId: string;
  projectName: string;
  projectCodename: string;
  teamId: string | null;
  teamName: string;
  horizon: CoreHorizon;
  title: string;
  body: string;
  ownerName: string | null;
};

export type CoreData = {
  projects: CoreProject[];
  roadmap: CoreRoadmapItem[];
};
