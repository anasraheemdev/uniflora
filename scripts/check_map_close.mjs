/**
 * Selects a plant, then checks the card's × button (and Escape) dismisses it.
 * With the dev server up:
 *   npm install --no-save playwright-core
 *   node scripts/check_map_close.mjs
 */
import { chromium } from "playwright-core";

const URL = process.env.MAP_URL ?? "http://localhost:3000/map";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failures = [];
page.on("pageerror", (err) => failures.push(`page error: ${err.message}`));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector(".leaflet-container", { timeout: 30_000 });
await page.waitForTimeout(2500);

const card = page.locator("text=/mapped on campus/").first();
const closeBtn = page.getByRole("button", { name: "Close" });

async function selectAPlant() {
  await page.locator(".uf-listitem").first().click();
  await page.waitForTimeout(900);
}

// --- close via the × button ----------------------------------------------
await selectAPlant();
if (!(await card.isVisible().catch(() => false))) failures.push("card did not appear after selecting a species");
if (!(await closeBtn.isVisible().catch(() => false))) failures.push("close button is not visible on the card");

await closeBtn.click();
await page.waitForTimeout(600);
if (await card.isVisible().catch(() => false)) failures.push("card still visible after clicking ×");
else console.log("× button dismissed the card");

// --- close via Escape -----------------------------------------------------
await selectAPlant();
if (!(await card.isVisible().catch(() => false))) failures.push("card did not reappear on reselect");
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
if (await card.isVisible().catch(() => false)) failures.push("card still visible after pressing Escape");
else console.log("Escape dismissed the card");

if (failures.length) await page.screenshot({ path: "scripts/map-close-failure.png" });
await browser.close();

if (failures.length) {
  console.error("\nFAILED:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: the plant card can be dismissed.");
