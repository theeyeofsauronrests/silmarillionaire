import type { AppRole, UserStatus } from "@/lib/auth/guards";

const ROLE_WEIGHT: Record<AppRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2
};

export function hasMinimumRole(role: AppRole, minimum: AppRole): boolean {
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[minimum];
}

export function isActiveStatus(status: UserStatus | null | undefined): boolean {
  return status === "active";
}
