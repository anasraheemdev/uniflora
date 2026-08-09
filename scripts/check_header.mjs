/**
 * Checks the header renders the right nav at each width straight from the
 * server (no post-hydration swap) and that the mobile drawer opens and closes.
 *   node scripts/check_header.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge" });
const failures = [];

// --- server HTML must already contain both navs, so CSS can pick ------------
const html = await (await fetch(BASE + "/")).text();
if (!html.includes("uf-nav-desktop")) failures.push("server HTML is missing the desktop nav");
if (!html.includes("uf-menu-btn")) failures.push("server HTML is missing the mobile menu button");
if (!html.includes("uf-mobile-drawer")) failures.push("server HTML is missing the mobile drawer");

for (const [width, height, name, expectDesktopNav] of [
  [1440, 900, "desktop", true],
  [390, 844, "phone", false],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("pageerror", (e) => failures.push(`${name}: ${e.message}`));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const navVisible = await page.locator(".uf-nav-desktop").isVisible();
  const btnVisible = await page.locator(".uf-menu-btn").isVisible();
  console.log(`${name}: desktop nav ${navVisible ? "shown" : "hidden"}, menu button ${btnVisible ? "shown" : "hidden"}`);

  if (navVisible !== expectDesktopNav) failures.push(`${name}: desktop nav visibility should be ${expectDesktopNav}`);
  if (btnVisible === expectDesktopNav) failures.push(`${name}: menu button visibility should be ${!expectDesktopNav}`);

  if (!expectDesktopNav) {
    const btnBox = await page.locator(".uf-menu-btn").boundingBox();
    if (btnBox.width < 40 || btnBox.height < 40) {
      failures.push(`menu button is only ${Math.round(btnBox.width)}x${Math.round(btnBox.height)}`);
    }

    const panel = page.locator(".uf-mobile-panel");
    await page.locator(".uf-menu-btn").click();
    await page.waitForTimeout(500);
    if (!(await panel.isVisible())) failures.push("drawer did not open");
    else {
      const box = await panel.boundingBox();
      console.log(`drawer opened at x=${Math.round(box.x)} width=${Math.round(box.width)}`);
      if (box.x + box.width > width + 1) failures.push("drawer hangs off the right edge");
      if (!(await page.locator(".uf-mobile-navlink").first().isVisible())) failures.push("drawer nav links not visible");
    }

    // Backdrop tap closes it.
    await page.locator(".uf-mobile-backdrop").click({ position: { x: 20, y: 400 } });
    await page.waitForTimeout(500);
    const stillOpen = await page.locator(".uf-mobile-drawer.uf-open").count();
    if (stillOpen) failures.push("drawer stayed open after tapping the backdrop");
    else console.log("drawer closed via backdrop");
  }

  await page.screenshot({ path: `scripts/shots/header-${name}.png` });
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error("\nFAILED:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: header is correct at both widths, no hydration swap.");
