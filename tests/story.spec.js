import { test, expect } from "@playwright/test";
test("complete birthday story, gallery, game, letter, gift and replay", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Happy Birthday",
  );
  await page.getByRole("button", { name: "Buka Kejutan Kecilmu" }).click();
  await page.getByRole("button", { name: "Ternyata itu kamu!" }).click();
  await expect(page.getByRole("status")).toContainText("makin gemesin");
  await page.getByRole("button", { name: "Alasan berikutnya" }).click();
  await expect(page.locator(".reason-card")).toContainText("cara kamu cerita");
  await page.getByRole("button", { name: "Balik kartu alasan 2" }).click();
  await expect(page.locator(".reason-card")).toContainText("rumah");
  await page
    .getByRole("button", { name: "Buka kenangan 1", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Foto berikutnya" }).click();
  await expect(page.locator(".viewer-nav")).toContainText("2 / 4");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Nyalakan Lilinnya" }).click();
  await expect(page.locator(".wish-cake .cake")).toHaveClass(/lit/);
  await page
    .getByRole("button", { name: "Aku Sudah Bikin Permohonan" })
    .click();
  await page.getByRole("button", { name: "Tiup Lilinnya!" }).click();
  await expect(page.locator(".wish-cake .cake")).toHaveClass(/blown/);
  await page.getByRole("button", { name: "Buka Suratnya" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".readable-letter")).toContainText("mimpi-mimpi");
  await page.getByRole("button", { name: "Tutup", exact: true }).click();
  await page.getByRole("button", { name: "Buka Hadiah Terakhirmu" }).click();
  await expect(page.locator(".final-photo")).toBeVisible();
  await page.getByRole("button", { name: "Peluk Virtual Dulu!" }).click();
  await expect(
    page.getByRole("img", { name: "Dua karakter saling berpelukan" }).last(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ulangi Cerita Kita" }).click();
  await expect(
    page.getByRole("button", { name: "Buka Hadiah Terakhirmu" }),
  ).toBeAttached();
  await expect(page.locator(".wish-cake .cake")).not.toHaveClass(/blown/);
  expect(errors).toEqual([]);
});
test("all sections fit, images load and no horizontal overflow", async ({
  page,
}) => {
  await page.goto("/");
  for (const section of await page.locator(".story-section").all()) {
    await section.scrollIntoViewIfNeeded();
    const bounds = await section.evaluate((el) => {
      const a = el.getBoundingClientRect();
      const b = (
        el.querySelector(".section-inner") || el.querySelector(".hero-content")
      ).getBoundingClientRect();
      return {
        section: a.height,
        viewport: innerHeight,
        fits: b.top >= a.top && b.bottom <= a.bottom,
        width: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
      };
    });
    expect(bounds.section).toBe(bounds.viewport);
    expect(bounds.fits).toBe(true);
    expect(bounds.width).toBe(bounds.viewportWidth);
  }
  for (const img of await page.locator("img").all()) {
    await expect(img).toHaveJSProperty("complete", true);
    expect(await img.evaluate((i) => i.naturalWidth)).toBeGreaterThan(0);
  }
});
test("missing photos fallback, music toggles and modal focus is trapped", async ({
  page,
}) => {
  await page.route("**/images/memory-1.svg", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Putar musik" }).click();
  await expect(
    page.getByRole("button", { name: "Matikan musik" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Matikan musik" }).click();
  await page
    .getByRole("button", { name: "Buka kenangan 1", exact: true })
    .click();
  await expect(page.locator(".memory-view img")).toHaveAttribute(
    "src",
    "/images/fallback.svg",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Foto berikutnya" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Tutup", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Tutup", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Buka kenangan 1", exact: true }),
  ).toBeFocused();
});
