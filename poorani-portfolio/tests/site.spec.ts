import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  { path: "/", h1: /Poorani/i },
  { path: "/about", h1: /Poorani/i },
  { path: "/skills", h1: /Full/i },
  { path: "/projects", h1: /Campaigns/i },
  { path: "/experience", h1: /Media/i },
  { path: "/contact", h1: /Let's/i },
];

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(page.url() || "http://x").origin) errors.push(`${r.status()} ${r.url()}`); });
  return errors;
}

for (const r of ROUTES) {
  test(`${r.path} renders without errors`, async ({ page }) => {
    const errors = watchErrors(page);
    const res = await page.goto(r.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toContainText(r.h1);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, "no horizontal scroll").toBe(false);
    await page.waitForTimeout(1500);
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["referrer-policy"]).toBeTruthy();
  expect(h["x-powered-by"]).toBeUndefined();
});

test("unknown route shows the 404 page", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText(/Off/i);
});

test("robots, sitemap and icon are served", async ({ request }) => {
  for (const p of ["/robots.txt", "/sitemap.xml", "/icon.svg", "/favicon.ico"]) expect((await request.get(p)).status(), p).toBe(200);
});

test("channel dial and guide navigate between pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next channel" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("h1").first()).toContainText(/Poorani/i);
  await page.getByRole("button", { name: "Guide" }).click();
  const guide = page.getByRole("dialog", { name: "Programme guide" });
  await expect(guide).toBeVisible();
  await expect(guide.getByRole("button", { name: /Close/ })).toBeFocused();
  await guide.getByRole("link", { name: /Contact/ }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("guide closes with Escape and returns focus", async ({ page }) => {
  await page.goto("/skills");
  const btn = page.getByRole("button", { name: "Guide" });
  await btn.click();
  await expect(page.getByRole("dialog", { name: "Programme guide" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(btn).toBeFocused();
});

test("keyboard shortcut switches channel", async ({ page, isMobile }) => {
  test.skip(isMobile, "no hardware keyboard on mobile");
  await page.goto("/");
  // wait until the page is interactive (shortcuts attach after hydration)
  await expect(page.getByRole("button", { name: "Next channel" })).toBeEnabled();
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("5");
  await expect(page).toHaveURL(/\/experience$/);
});

test("project case study opens, traps focus, and closes", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: /Open case study/ }).first().click();
  const dialog = page.getByRole("dialog", { name: /case study/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Bhuvan Nritya" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: /Close/ })).toBeFocused();
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("brief builder validates and builds a brief", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Build my brief" }).click();
  await expect(page.getByText("Add your name")).toBeVisible();
  await expect(page.locator("#b-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#b-name")).toBeFocused();
  await page.fill("#b-name", "Priya S.");
  await page.fill("#b-company", "Acme");
  await page.fill("#b-msg", "We need Instagram growth for a product launch.");
  await page.getByRole("button", { name: "Build my brief" }).click();
  const pre = page.locator("pre");
  await expect(pre).toContainText("From: Priya S., Acme");
  await expect(pre).toContainText("Social media");
  await expect(pre).toContainText("Instagram growth");
});

test("brief builder escapes HTML input", async ({ page }) => {
  await page.goto("/contact");
  await page.fill("#b-name", '<img src=x onerror="window.__xss=1">');
  await page.fill("#b-msg", "<script>window.__xss=1</script> hello there");
  await page.getByRole("button", { name: "Build my brief" }).click();
  await expect(page.locator("pre")).toContainText("<script>");
  expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
});

test("WhatsApp and Gmail links are pre-filled", async ({ page }) => {
  await page.goto("/contact");
  const wa = page.getByRole("link", { name: "Enquire on WhatsApp" });
  await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/916380852606\?text=Hi%20Poorani/);
  await expect(wa).toHaveAttribute("target", "_blank");
  const mail = page.getByRole("link", { name: "poorani1718@gmail.com" }).first();
  await expect(mail).toHaveAttribute("href", /^https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=poorani1718%40gmail\.com&su=Digital%20marketing%20enquiry&body=Hi%20Poorani/);
  await page.fill("#b-name", "Priya S.");
  await page.fill("#b-msg", "We need Instagram growth for a product launch.");
  await page.getByRole("button", { name: "Build my brief" }).click();
  await expect(page.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute("href", /text=Campaign%20brief.*Instagram%20growth/);
  await expect(page.getByRole("link", { name: "Send in Gmail" })).toHaveAttribute("href", /su=Campaign%20brief%20from%20Priya%20S\.&body=Campaign%20brief/);
});

test("skills receipts expand", async ({ page }) => {
  await page.goto("/skills");
  const row = page.getByRole("button", { name: /Paid Ads/ });
  await row.click();
  await expect(page.getByText("Performance campaigns for Design Phoenix")).toBeVisible();
});

test("skip link moves focus to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard only");
  await page.goto("/about");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("Lab page has been removed", async ({ page }) => {
  const res = await page.goto("/lab");
  expect(res?.status()).toBe(404);
  await page.goto("/");
  await page.getByRole("button", { name: "Guide" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Lab/ })).toHaveCount(0);
});
