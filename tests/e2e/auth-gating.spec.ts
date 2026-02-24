import { expect, test } from "@playwright/test";

const runAuthGating = process.env.E2E_AUTH_GATING === "true";

test.skip(!runAuthGating, "Set E2E_AUTH_GATING=true with valid Supabase env to run auth gating checks.");

test("unauthenticated users are redirected to login for protected root", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});
