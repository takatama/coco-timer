import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === baseURL) return route.continue();
    if (url.hostname === "daily-brew.takatama.workers.dev") {
      return route.fulfill({ json: { items: [] } });
    }
    return route.abort();
  });
  await page.addInitScript(() => {
    localStorage.setItem("coco-timer-settings", JSON.stringify({
      version: 5,
      state: {
        language: "en",
        notifyMode: "none",
        bgmEnabled: false,
        animation: true,
        debugEnabled: false,
        debugSpeed: 1,
      },
    }));
  });
  await page.clock.install({ time: new Date("2026-01-01T12:00:00Z") });
  await page.goto("/setup");
  await expect(page).toHaveURL(/\/en\/setup$/);
  await expect(page.getByRole("button", { name: "Start Timer", exact: true })).toBeVisible();
  await page.clock.pauseAt(new Date("2026-01-01T12:01:00Z"));
});

const remaining = (page: Page) => page.getByRole("timer");

test("setup carries the chosen amount into a brew that reaches completion", async ({ page }) => {
  await expect(page.getByText("300g", { exact: true })).toBeVisible();
  await expect(page.getByText("1:15", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Timeline" })).toHaveCount(0);
  const sweetBox = await page.getByRole("button", { name: "Sweet", exact: true }).boundingBox();
  const sourBox = await page.getByRole("button", { name: "Sour", exact: true }).boundingBox();
  expect(sweetBox).not.toBeNull();
  expect(sourBox).not.toBeNull();
  const flavorGroupCenter = (sweetBox!.x + sourBox!.x + sourBox!.width) / 2;
  expect(Math.abs(flavorGroupCenter - 195)).toBeLessThan(1);

  await page.getByText("View", { exact: true }).click();
  await expect(page.getByText("STEP 5", { exact: true })).toBeVisible();
  await expect(page.getByText("STEP 6", { exact: true })).toHaveCount(0);
  await expect(page.getByText("40 sec", { exact: true })).toHaveCount(2);
  await expect(page.getByText("50 sec", { exact: true })).toBeVisible();
  await expect(page.getByText("35 sec", { exact: true })).toBeVisible();
  await expect(page.getByText("45 sec", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "increase", exact: true }).click();
  await page.getByRole("button", { name: "Start Timer", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/timer$/);
  await expect(page.getByText("Beans 21g", { exact: true })).toBeVisible();
  await expect(page.getByText("Water 315g", { exact: true })).toBeVisible();
  await expect(page.getByText("Flavor Balance", { exact: true })).toBeVisible();
  await expect(page.getByText("New Hybrid Method", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();

  const mainCard = page.getByRole("region", { name: "Current Step" });
  await expect(mainCard.getByRole("img", { name: "Timeline" })).toBeVisible();
  await expect(mainCard.getByRole("status", { name: "First" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Timeline" })).toHaveCount(1);
  const heightWithPreview = (await mainCard.boundingBox())?.height;

  await page.clock.runFor(6_000);
  await expect(mainCard.getByRole("status", { name: "First" })).toHaveCount(0);
  expect((await mainCard.boundingBox())?.height).toBe(heightWithPreview);
  const timeBeforeLanguageChange = (await remaining(page).innerText()).match(/\d+:\d{2}/)?.[0];
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("radio", { name: "日本語", exact: true }).click();
  await expect(page).toHaveURL(/\/ja\/timer$/);
  expect((await remaining(page).innerText()).match(/\d+:\d{2}/)?.[0]).toBe(timeBeforeLanguageChange);
  await page.getByRole("radio", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/timer$/);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const before = await remaining(page).innerText();
  await page.clock.runFor(2_000);
  await expect(remaining(page)).not.toHaveText(before);
  await page.clock.fastForward("04:00");
  await expect(page.getByText(/Enjoy your coffee/)).toBeVisible();
  await expect(page.getByText(/^STEP /)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reset", exact: true })).toHaveCount(0);
});

test("pause holds time, resume advances it, and confirmed reset returns to idle", async ({ page }) => {
  await page.getByRole("button", { name: "Start Timer", exact: true }).click();
  await page.clock.runFor(8_000);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  const paused = await remaining(page).innerText();
  await page.clock.runFor(3_000);
  await expect(remaining(page)).toHaveText(paused);

  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(2_000);
  await expect(remaining(page)).not.toHaveText(paused);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  await expect(remaining(page)).toHaveText("0:40");
  await page.clock.runFor(6_000);
  await expect(remaining(page)).toHaveText("0:40");
});

test("canceling the startup countdown prevents a delayed start and allows retry", async ({ page }) => {
  await page.getByRole("button", { name: "Start Timer", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
  const idle = await remaining(page).innerText();
  await page.clock.runFor(8_000);
  await expect(remaining(page)).toHaveText(idle);

  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.runFor(8_000);
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await expect(remaining(page)).not.toHaveText(idle);
});
