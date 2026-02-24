import { expect, test } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Silmarillion" })).toBeVisible();
});

test("waitlist page loads", async ({ page }) => {
  await page.goto("/waitlist");
  await expect(page.getByRole("heading", { name: /Request Access|Access Pending|Access Denied|Access Active/ })).toBeVisible();
});
