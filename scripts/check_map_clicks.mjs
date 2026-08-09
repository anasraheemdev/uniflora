/**
 * Drives the campus map with a real mouse: sweeps for a plant dot, hovers it,
 * then clicks it and asserts the popup and selection card appear.
 *
 * Guards the regression where the zone canvas stacked above the marker canvas
 * and swallowed every click. With the dev server up:
 *   npm install --no-save playwright-core
 *   node scripts/check_map_clicks.mjs
 */
import { chromium } from "playwright-core";

const URL = process.env.MAP_URL ?? "http://localhost:3000/map";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failures = [];
page.on("pageerror", (err) => failures.push(`page error: ${err.message}`));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector(".leaflet-container", { timeout: 30_000 });
await page.waitForFunction(
  () => document.querySelectorAll(".leaflet-uf-markers-pane canvas").length > 0,
  { timeout: 30_000 },
);
await page.waitForTimeout(2500);

// --- pane wiring ---------------------------------------------------------
const panes = await page.evaluate(() => {
  const read = (name) => {
    const el = document.querySelector(`.leaflet-${name}-pane`);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { zIndex: s.zIndex, pointerEvents: s.pointerEvents, canvases: el.querySelectorAll("canvas").length };
  };
  return { zones: read("uf-zones"), markers: read("uf-markers") };
});
console.log("panes:", JSON.stringify(panes));

if (!panes.markers) failures.push("marker pane missing");
if (panes.zones && panes.zones.pointerEvents !== "none") failures.push("zone pane still intercepts pointer events");
if (panes.markers && panes.zones && Number(panes.markers.zIndex) <= Number(panes.zones.zIndex)) {
  failures.push("marker pane is not above the zone pane");
}

// --- find a dot by sweeping the map, exactly like a user hunting for one ---
const box = await page.locator(".leaflet-container").boundingBox();
let hit = null;

outer: for (let y = box.y + 80; y < box.y + box.height - 80; y += 12) {
  for (let x = box.x + 80; x < box.x + box.width - 80; x += 12) {
    await page.mouse.move(x, y);
    const tip = await page.locator(".uf-map-plant-tip").first();
    if (await tip.isVisible().catch(() => false)) {
      hit = { x, y, name: (await tip.textContent())?.trim() };
      break outer;
    }
  }
}

if (!hit) {
  failures.push("swept the whole map and never hovered a plant dot");
} else {
  console.log(`hovered a dot at (${hit.x}, ${hit.y}) -> ${hit.name}`);

  // The exact failure mode was another element sitting on top of the dot.
  const topEl = await page.evaluate(
    ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return el ? `${el.tagName.toLowerCase()} .${el.className}` : "none";
    },
    hit,
  );
  console.log("topmost element at that pixel:", topEl);

  await page.mouse.click(hit.x, hit.y);
  await page.waitForTimeout(900);

  const popup = await page.locator(".uf-map-popup").first().textContent().catch(() => null);
  console.log("popup after click:", popup ? popup.replace(/\s+/g, " ").trim().slice(0, 100) : "(none)");
  if (!popup) failures.push("clicking a dot did not open a popup");

  const card = await page.locator("text=/mapped on campus/").first().textContent().catch(() => null);
  console.log("selection card:", card ? card.replace(/\s+/g, " ").trim() : "(none)");
  if (!card) failures.push("clicking a dot did not fill the selection card");
}

if (failures.length) await page.screenshot({ path: "scripts/map-click-failure.png" });
await browser.close();

if (failures.length) {
  console.error("\nFAILED:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log("\nPASS: dots are hoverable and clickable.");
