import { expect, test } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;
const PROJECT_ID = process.env.E2E_PROJECT_ID;

test.skip(!EMAIL || !PASSWORD || !PROJECT_ID, "Set E2E_EMAIL, E2E_PASSWORD, and E2E_PROJECT_ID to run project-detail QA.");

test("project detail QA: milestones CRUD, links/images controls, drag-drop roadmap", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL!);
  await page.getByLabel("Password").fill(PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/$|\/waitlist$/);
  await expect(page).not.toHaveURL(/\/waitlist$/);

  await page.goto(`/projects/${PROJECT_ID}`);
  await expect(page.getByRole("heading", { name: /Roadmap Board/i })).toBeVisible();

  // Link CRUD
  const unique = Date.now().toString();
  const linkLabel = `QA Link ${unique}`;
  const assetsSection = page.getByRole("heading", { name: "Links and Images Editing" }).locator("..");
  await page.getByPlaceholder("Label").fill(linkLabel);
  await page.getByPlaceholder("https://...").fill("https://example.com/qa-link");
  await page.getByRole("button", { name: "Add Link" }).click();
  await expect(page.locator(`a:has-text("${linkLabel}")`).first()).toBeVisible();
  await assetsSection
    .locator("li", { has: page.locator(`a:has-text("${linkLabel}")`) })
    .getByRole("button", { name: "Remove" })
    .click();
  await expect(assetsSection.locator(`a:has-text("${linkLabel}")`)).toHaveCount(0);

  // Image CRUD (URL-backed)
  const imageCaption = `QA Image ${unique}`;
  const imageSection = assetsSection;
  await page.getByPlaceholder("Storage path or image URL").fill("https://picsum.photos/seed/silmarillion/800/400");
  await page.getByPlaceholder("Caption").fill(imageCaption);
  await page.getByRole("button", { name: "Add Image" }).click();
  await expect(imageSection.locator(`text=${imageCaption}`)).toBeVisible();
  await imageSection
    .locator("li", { has: page.locator("text=" + imageCaption) })
    .getByRole("button", { name: "Remove" })
    .click();

  // Milestone CRUD
  const milestoneTitle = `QA Milestone ${unique}`;
  const milestoneTitleUpdated = `${milestoneTitle} Updated`;
  await page.getByPlaceholder("Milestone title").fill(milestoneTitle);
  await page.getByPlaceholder("Details").first().fill("QA milestone details");
  await page.locator('input[name="milestoneDate"]').first().fill("2026-12-31");
  await page.getByRole("button", { name: "Add Milestone" }).click();

  await expect(page.getByRole("heading", { name: milestoneTitle })).toBeVisible();

  const milestoneEditForm = page.locator("form", {
    has: page.locator(`input[value="${milestoneTitle}"]`)
  }).first();
  await milestoneEditForm.locator('input[name="title"]').fill(milestoneTitleUpdated);
  await milestoneEditForm.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: milestoneTitleUpdated })).toBeVisible();

  const milestoneDeleteForm = page.locator("form", {
    has: page.locator(`input[value="${milestoneTitleUpdated}"]`)
  }).first();
  await milestoneDeleteForm.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("heading", { name: milestoneTitleUpdated })).toHaveCount(0);

  // Drag/drop roadmap if at least one draggable card is present
  const draggableCards = page.locator('article[draggable="true"]');
  const draggableCount = await draggableCards.count();
  if (draggableCount > 0) {
    const firstCard = draggableCards.first();
    const title = (await firstCard.locator("h5").first().textContent())?.trim() ?? "";
    const nextLane = page.getByRole("heading", { name: "Next" }).first().locator("..");
    await firstCard.dragTo(nextLane);
    if (title) {
      await expect(page.locator("h5", { hasText: title }).first()).toBeVisible();
    }
  }
});
