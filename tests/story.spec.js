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
  await page.route("**/images/1.jpg", (route) => route.abort());
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

test.describe("hero cake animation regression", () => {
  test.use({ reducedMotion: "no-preference" });
  test("cake stays visible after scrolling back, resizing, and reloading", async ({
    page,
  }) => {
    await page.goto(process.env.STORY_TEST_URL || "/");
    const cake = page.locator(".hero-art .cake");
    const assertVisibleCake = async () => {
      await expect(cake).toBeVisible();
      await expect
        .poll(() =>
          cake.evaluate((el) => {
            let opacity = 1;
            for (let node = el; node; node = node.parentElement) {
              opacity *= Number(getComputedStyle(node).opacity);
            }
            return opacity;
          }),
        )
        .toBeGreaterThan(0.95);
    };
    await assertVisibleCake();
    await page.addStyleTag({
      content:
        "html { scroll-snap-type: none !important; scroll-behavior: auto !important; }",
    });
    await page.evaluate(() => window.scrollTo(0, innerHeight));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
    // Allow the scrubbed timeline to finish before returning to its initial state.
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await assertVisibleCake();
    const viewport = page.viewportSize();
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height - 80,
    });
    await assertVisibleCake();
    await page.reload();
    await assertVisibleCake();
  });
});

test("calendar decorations never overlap the year or date grid", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#birthday").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const bounds = await page.locator(".calendar-paper").evaluate((el) => {
    const rect = (selector) => {
      const r = el.querySelector(selector).getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    };
    return {
      year: rect(".calendar-heading span:last-child"),
      grid: rect(".calendar-grid"),
      stamp: rect(".special-stamp"),
      note: rect(".calendar-doodle"),
    };
  });
  const overlaps = (a, b) =>
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top;
  expect(overlaps(bounds.stamp, bounds.year)).toBe(false);
  expect(overlaps(bounds.stamp, bounds.grid)).toBe(false);
  expect(overlaps(bounds.note, bounds.grid)).toBe(false);
  expect(overlaps(bounds.note, bounds.stamp)).toBe(false);
});

test.describe("typing love letter", () => {
  test.use({ reducedMotion: "no-preference" });
  test("types progressively, can skip, restarts, and finishes naturally", async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto("/");
    await page.getByRole("button", { name: "Buka Suratnya" }).click();
    await page.clock.runFor(1000);
    const body = page.locator(".typed-letter-body");
    await expect(body).toBeVisible();
    const length = () =>
      page
        .locator(".typed-visible")
        .evaluateAll((nodes) =>
          nodes.reduce((n, el) => n + el.textContent.length, 0),
        );
    await page.clock.runFor(600);
    const first = await length();
    expect(first).toBeGreaterThan(0);
    await page.clock.runFor(400);
    expect(await length()).toBeGreaterThan(first);
    await expect(body).toHaveAttribute("data-complete", "false");
    await page.getByRole("button", { name: "Tampilkan semua" }).click();
    await expect(body).toHaveAttribute("data-complete", "true");
    await expect(page.locator(".readable-letter .signature")).toBeVisible();
    await page.getByRole("button", { name: "Tutup", exact: true }).click();
    await page.getByRole("button", { name: "Buka Suratnya" }).click();
    await page.clock.runFor(1000);
    await expect(body).toHaveAttribute("data-complete", "false");
    await page.clock.fastForward(60000);
    await expect(body).toHaveAttribute("data-complete", "true");
    await expect(page.locator(".typing-caret")).toHaveCount(0);
    await page.getByRole("button", { name: "Tutup", exact: true }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(
      page.getByRole("button", { name: "Tutup", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test("reduced motion shows the complete letter immediately", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Buka Suratnya" }).click();
  await expect(page.locator(".typed-letter-body")).toHaveAttribute(
    "data-complete",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Tampilkan semua" }),
  ).toHaveCount(0);
  await expect(page.locator(".readable-letter .signature")).toBeVisible();
});
