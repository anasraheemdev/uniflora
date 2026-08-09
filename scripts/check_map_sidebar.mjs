/**
 * The map page has no footer, so it should never scroll: the sidebar must
 * scroll inside its own column instead of stretching the grid row past the
 * viewport and leaving dead space beside the map.
 *   node scripts/check_map_sidebar.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge" });
const failures = [];

for (const [width, height, name] of [
  [1440, 900, "desktop"],
  [1280, 720, "small laptop"],
  [1920, 1080, "large desktop"],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("pageerror", (e) => failures.push(`${name}: ${e.message}`));
  await page.goto(BASE + "/map", { waitUntil: "networkidle" });
  await page.waitForSelector(".leaflet-container");
  await page.waitForTimeout(2200);

  const m = await page.evaluate(() => {
    const doc = document.documentElement;
    const panel = document.querySelector(".uf-map-panel");
    const inner = document.querySelector(".uf-map-panel-inner");
    const list = document.querySelector(".uf-species-scroll");
    const view = document.querySelector(".uf-map-view");
    const scrolls = (el) => el.scrollHeight > el.clientHeight + 1;
    return {
      pageScroll: doc.scrollHeight - doc.clientHeight,
      panelH: Math.round(panel.getBoundingClientRect().height),
      viewH: Math.round(view.getBoundingClientRect().height),
      listH: Math.round(list.getBoundingClientRect().height),
      listBottom: Math.round(list.getBoundingClientRect().bottom),
      panelBottom: Math.round(panel.getBoundingClientRect().bottom),
      scrollers: [
        ["panel", scrolls(panel)],
        ["panel-inner", scrolls(inner)],
        ["species list", scrolls(list)],
      ]
        .filter(([, s]) => s)
        .map(([n]) => n),
    };
  });

  console.log(
    `${name.padEnd(14)} pageScroll=${m.pageScroll}px  panel=${m.panelH}px  map=${m.viewH}px  list=${m.listH}px  scrolls: [${m.scrollers.join(", ")}]`,
  );

  if (m.pageScroll > 1) failures.push(`${name}: page scrolls by ${m.pageScroll}px; the map view should fill the window`);
  if (Math.abs(m.panelH - m.viewH) > 2) {
    failures.push(`${name}: sidebar (${m.panelH}px) and map (${m.viewH}px) are different heights — dead space`);
  }
  if (m.scrollers.length !== 1 || m.scrollers[0] !== "panel") {
    failures.push(`${name}: expected only the panel to scroll, got [${m.scrollers.join(", ")}]`);
  }

  await page.screenshot({ path: `scripts/shots/sidebar-${name.replace(/\s+/g, "-")}.png` });
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error("\nFAILED:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: map fills the window and the sidebar scrolls on its own.");
