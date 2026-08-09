/**
 * Between 901px and 1024px the map page stacks instead of splitting, so the
 * sidebar must keep its capped, self-scrolling species list and must not clip.
 *   node scripts/check_map_tablet.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge" });
const failures = [];

for (const [width, height, name] of [
  [1000, 800, "tablet landscape"],
  [920, 700, "tablet narrow"],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE + "/map", { waitUntil: "networkidle" });
  await page.waitForSelector(".leaflet-container");
  await page.waitForTimeout(1800);

  const m = await page.evaluate(() => {
    const panel = document.querySelector(".uf-map-panel");
    const list = document.querySelector(".uf-species-scroll");
    const p = panel.getBoundingClientRect();
    return {
      stacked: getComputedStyle(panel.parentElement).gridTemplateColumns.split(" ").length === 1,
      panelH: Math.round(p.height),
      panelClipped: panel.scrollHeight > panel.clientHeight + 1,
      listScrolls: list.scrollHeight > list.clientHeight + 1,
      listH: Math.round(list.getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  console.log(
    `${name.padEnd(17)} stacked=${m.stacked}  panel=${m.panelH}px (clipped: ${m.panelClipped})  list=${m.listH}px (scrolls: ${m.listScrolls})  overflowX=${m.overflowX}px`,
  );

  if (!m.stacked) failures.push(`${name}: expected the stacked single-column layout`);
  if (m.panelClipped) failures.push(`${name}: sidebar content is clipped instead of laying out full height`);
  if (!m.listScrolls) failures.push(`${name}: species list should stay capped and scroll on its own here`);
  if (m.overflowX > 0) failures.push(`${name}: horizontal overflow of ${m.overflowX}px`);

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error("\nFAILED:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: stacked tablet layout is unchanged.");
