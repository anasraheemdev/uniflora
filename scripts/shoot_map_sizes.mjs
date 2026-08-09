/**
 * Screenshots the map page across breakpoints and flags horizontal overflow.
 *   node scripts/shoot_map_sizes.mjs
 */
import { chromium } from "playwright-core";

const URL = process.env.MAP_URL ?? "http://localhost:3000/map";
const SIZES = [
  [1440, 900, "desktop"],
  [1024, 768, "tablet"],
  [768, 900, "small-tablet"],
  [360, 740, "small-phone"],
];

const browser = await chromium.launch({ channel: "msedge" });
const problems = [];

for (const [width, height, name] of SIZES) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("pageerror", (err) => problems.push(`${name}: ${err.message}`));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector(".leaflet-container", { timeout: 30_000 });
  await page.waitForTimeout(2800);
  await page.screenshot({ path: `scripts/shots/${name}.png` });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const mapBox = await page.locator(".uf-map-view").boundingBox();
  console.log(`${name.padEnd(13)} overflow=${overflow}px map=${Math.round(mapBox.width)}x${Math.round(mapBox.height)}`);
  if (overflow > 1) problems.push(`${name} scrolls sideways by ${overflow}px`);
  await page.close();
}

await browser.close();

if (problems.length) {
  console.error("\nPROBLEMS:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: no horizontal overflow at any breakpoint.");
