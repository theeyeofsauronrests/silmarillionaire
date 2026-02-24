import type { AppRole, UserStatus } from "@/lib/auth/guards";

export type WaitlistStatus = "pending" | "approved" | "denied";

export type WaitlistRequest = {
  id: string;
  name: string;
  email: string;
  requestedAt: string;
  status: WaitlistStatus;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: AppRole;
  status: UserStatus;
  createdAt: string;
};

export type AdminProject = {
  id: string;
  name: string;
  codename: string;
  description: string;
  isCore: boolean;
};

export type AdminTeam = {
  id: string;
  name: string;
  description: string;
};

export type ProjectEditorAssignment = {
  projectId: string;
  userId: string;
};
