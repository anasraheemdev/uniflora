/**
 * Screenshots the map page at phone size in each state, and checks the mobile
 * sheet behaves. With the dev server up:
 *   npm install --no-save playwright-core
 *   node scripts/shoot_map_mobile.mjs
 */
import { chromium, devices } from "playwright-core";

const URL = process.env.MAP_URL ?? "http://localhost:3000/map";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  ...devices["iPhone 12"],
  isMobile: false, // Edge desktop build can't emulate touch; size is what matters here.
  hasTouch: false,
});

const failures = [];
page.on("pageerror", (err) => failures.push(`page error: ${err.message}`));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector(".leaflet-container", { timeout: 30_000 });
await page.waitForTimeout(3000);

const sheet = page.locator(".uf-map-panel");
const handle = page.locator(".uf-sheet-handle");

// Map should own the viewport, with only the handle peeking.
const vp = page.viewportSize();
const mapBox = await page.locator(".uf-map-view").boundingBox();
const collapsed = await sheet.boundingBox();
console.log("viewport:", vp);
console.log("map box:", mapBox);
console.log("collapsed sheet top:", Math.round(collapsed.y), "of", vp.height);

if (mapBox.height < vp.height * 0.7) failures.push(`map only ${Math.round(mapBox.height)}px tall; should fill the screen`);
if (collapsed.y < vp.height * 0.8) failures.push("sheet is not collapsed on load");
if (!(await handle.isVisible())) failures.push("sheet handle not visible");

// Handle must be a comfortable tap target.
const handleBox = await handle.boundingBox();
if (handleBox.height < 44) failures.push(`sheet handle only ${Math.round(handleBox.height)}px tall`);

await page.screenshot({ path: "scripts/shots/mobile-1-collapsed.png" });

// Expand.
await handle.click();
await page.waitForTimeout(600);
const expanded = await sheet.boundingBox();
console.log("expanded sheet top:", Math.round(expanded.y));
if (expanded.y >= collapsed.y - 100) failures.push("sheet did not expand");
await page.screenshot({ path: "scripts/shots/mobile-2-sheet-open.png" });

// Picking a species should close the sheet and show the card.
await page.locator(".uf-listitem").first().click();
await page.waitForTimeout(1200);
const afterPick = await sheet.boundingBox();
if (afterPick.y < vp.height * 0.8) failures.push("sheet stayed open after picking a species");

const card = page.locator(".uf-map-card");
if (!(await card.isVisible().catch(() => false))) failures.push("plant card did not appear");
else {
  const cardBox = await card.boundingBox();
  console.log("card box:", cardBox);
  if (cardBox.height > vp.height * 0.32) failures.push(`card is ${Math.round(cardBox.height)}px tall; too much of the screen`);
  if (cardBox.y + cardBox.height > collapsed.y + 4) failures.push("card overlaps the collapsed sheet");
  if (cardBox.x < 4 || cardBox.x + cardBox.width > vp.width - 4) failures.push("card overflows the viewport");
}
await page.screenshot({ path: "scripts/shots/mobile-3-selected.png" });

// Nothing should scroll sideways.
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("horizontal overflow:", overflow, "px");
if (overflow > 1) failures.push(`page scrolls sideways by ${overflow}px`);

await browser.close();

if (failures.length) {
  console.error("\nFAILED:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: mobile map layout looks right.");
