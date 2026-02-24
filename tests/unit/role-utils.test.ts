import { describe, expect, it } from "vitest";

import { hasMinimumRole, isActiveStatus } from "@/lib/auth/role-utils";

describe("role-utils", () => {
  it("evaluates role hierarchy correctly", () => {
    expect(hasMinimumRole("admin", "editor")).toBe(true);
    expect(hasMinimumRole("editor", "viewer")).toBe(true);
    expect(hasMinimumRole("viewer", "editor")).toBe(false);
  });

  it("evaluates active status correctly", () => {
    expect(isActiveStatus("active")).toBe(true);
    expect(isActiveStatus("pending")).toBe(false);
    expect(isActiveStatus("denied")).toBe(false);
    expect(isActiveStatus(null)).toBe(false);
    expect(isActiveStatus(undefined)).toBe(false);
  });
});
