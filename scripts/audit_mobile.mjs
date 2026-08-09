/**
 * Walks every route at phone width and reports concrete mobile problems:
 * sideways scrolling (with the elements causing it), tap targets that are too
 * small for a finger, and text that is too small to read.
 *
 * With the dev server up:
 *   npm install --no-save playwright-core
 *   node scripts/audit_mobile.mjs            # audit all routes
 *   node scripts/audit_mobile.mjs /explore   # audit one route
 *   SHOTS=1 node scripts/audit_mobile.mjs    # also write screenshots
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const WIDTH = Number(process.env.W ?? 390);
const HEIGHT = Number(process.env.H ?? 844);
const SHOTS = process.env.SHOTS === "1";

const ALL_ROUTES = [
  "/",
  "/explore",
  "/families",
  "/families/fabaceae",
  "/species/dalbergia-sissoo",
  "/map",
  "/collections",
  "/gallery",
  "/learn",
  "/about",
  "/contact",
  "/login",
  "/dashboard/admin",
  "/dashboard/admin/analytics",
  "/dashboard/admin/approvals",
  "/dashboard/admin/qr",
  "/dashboard/admin/species",
  "/dashboard/admin/users",
  "/dashboard/contributor",
  "/dashboard/contributor/contributions",
  "/dashboard/contributor/identify",
  "/dashboard/contributor/reviews",
  "/dashboard/contributor/specimens",
  "/dashboard/student",
  "/dashboard/student/learning",
  "/dashboard/student/submissions",
  "/dashboard/student/submit",
];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : ALL_ROUTES;

/** Runs in the page: finds what actually breaks the layout. */
function collectIssues(viewportWidth) {
  const label = (el) => {
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const id = el.id ? `#${el.id}` : "";
    return `${el.tagName.toLowerCase()}${id}${cls ? "." + cls : ""}`;
  };

  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const docOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;

  // Elements sticking out past the right edge, ignoring ones whose parent
  // already clips them (those don't cause page scroll).
  const clipped = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "hidden" || o === "auto" || o === "scroll") return true;
    }
    return false;
  };

  const wide = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > viewportWidth + 1 && !clipped(el)) {
      wide.push({ el: label(el), right: Math.round(r.right), width: Math.round(r.width) });
    }
  }
  // Keep only the outermost offenders; children just repeat the parent's sin.
  const topWide = wide.filter(
    (w, i) => !wide.some((other, j) => j !== i && other.right >= w.right && other.width > w.width),
  );

  /** Leaflet draws its own attribution and labels; not ours to restyle. */
  const thirdParty = (el) => el.closest(".leaflet-container") !== null;

  /** A link inside a sentence can't be padded without wrecking the line box. */
  const inlineInProse = (el) => {
    if (el.tagName !== "A") return false;
    const p = el.parentElement;
    if (!p || !["P", "LI", "SPAN"].includes(p.tagName)) return false;
    return p.innerText.trim().length > el.innerText.trim().length + 12;
  };

  // Finger-sized targets. 32px is lenient; Apple/Google say 44/48.
  const smallTargets = [];
  for (const el of document.querySelectorAll("a, button, input, select, textarea, [role=button]")) {
    if (!visible(el) || thirdParty(el) || inlineInProse(el)) continue;

    // A checkbox is only as tappable as the label wrapping it.
    const type = (el.getAttribute("type") || "").toLowerCase();
    const box = type === "checkbox" || type === "radio" ? el.closest("label") ?? el : el;

    const r = box.getBoundingClientRect();
    if (r.height < 32 || r.width < 24) {
      const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim();
      smallTargets.push({ el: label(el), size: `${Math.round(r.width)}x${Math.round(r.height)}`, text: text.slice(0, 28) });
    }
  }

  // Body text below 12px is uncomfortable on a phone. Uppercase kickers with
  // wide tracking ("EXPLORE · LEARN · CONSERVE") are a deliberate typographic
  // device and stay legible small, so they're exempt.
  const tinyText = [];
  for (const el of document.querySelectorAll("p, li, span, div, td, th, label, a, button")) {
    if (!visible(el) || thirdParty(el)) continue;
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 8);
    if (!direct) continue;
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    if (size >= 12) continue;
    const text = el.innerText.trim();
    const allCaps = s.textTransform === "uppercase" || (text === text.toUpperCase() && /[A-Z]/.test(text));
    const kicker = allCaps && parseFloat(s.letterSpacing) >= 1;
    if (kicker && size >= 10) continue;
    tinyText.push({ el: label(el), size: `${size}px`, text: text.slice(0, 32) });
  }

  // Inputs under 16px make iOS Safari zoom the whole page on focus.
  const zoomyInputs = [];
  for (const el of document.querySelectorAll("input, select, textarea")) {
    if (!visible(el)) continue;
    const type = (el.getAttribute("type") || "text").toLowerCase();
    if (["checkbox", "radio", "range", "color", "hidden", "submit", "button"].includes(type)) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 16) zoomyInputs.push({ el: label(el), size: `${size}px` });
  }

  const dedupe = (arr, key) => {
    const seen = new Map();
    for (const item of arr) {
      const k = item[key] + (item.size ?? "");
      if (!seen.has(k)) seen.set(k, { ...item, count: 1 });
      else seen.get(k).count++;
    }
    return [...seen.values()];
  };

  return {
    docOverflow,
    wide: topWide.slice(0, 8),
    smallTargets: dedupe(smallTargets, "el").slice(0, 8),
    tinyText: dedupe(tinyText, "el").slice(0, 6),
    zoomyInputs: dedupe(zoomyInputs, "el").slice(0, 6),
  };
}

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});

/**
 * Dashboards sit behind a role cookie, and the middleware bounces you to your
 * own role's home if the path doesn't match — so the cookie has to track the
 * route or half these pages silently redirect and never get audited.
 */
const roleFor = (route) => route.match(/^\/dashboard\/(admin|contributor|student)/)?.[1] ?? "admin";
const setRole = (role) => context.addCookies([{ name: "uf-role", value: role, url: BASE }]);
await setRole("admin");

if (SHOTS) await mkdir("scripts/shots", { recursive: true });

let problemCount = 0;
const summary = [];

for (const route of routes) {
  // /login bounces logged-in users straight to their dashboard.
  if (route === "/login") await context.clearCookies();
  else await setRole(roleFor(route));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  let issues;
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45_000 });
    await page.waitForTimeout(route === "/map" ? 2500 : 700);
    if (new URL(page.url()).pathname !== route) {
      console.log(`\n### ${route}\n  REDIRECTED to ${new URL(page.url()).pathname} — not audited`);
      await page.close();
      problemCount++;
      continue;
    }
    issues = await page.evaluate(collectIssues, WIDTH);
  } catch (err) {
    console.log(`\n### ${route}\n  LOAD FAILED: ${err.message.split("\n")[0]}`);
    await page.close();
    problemCount++;
    continue;
  }

  const lines = [];
  if (issues.docOverflow > 1) {
    lines.push(`  overflow: page scrolls sideways by ${issues.docOverflow}px`);
    for (const w of issues.wide) lines.push(`      ${w.el} — width ${w.width}, right edge ${w.right}`);
  }
  for (const t of issues.smallTargets) {
    lines.push(`  tap target ${t.size}: ${t.el}${t.text ? ` "${t.text}"` : ""}${t.count > 1 ? ` (x${t.count})` : ""}`);
  }
  for (const t of issues.tinyText) lines.push(`  text ${t.size}: ${t.el} "${t.text}"${t.count > 1 ? ` (x${t.count})` : ""}`);
  for (const i of issues.zoomyInputs) lines.push(`  input font ${i.size} (<16px triggers iOS zoom): ${i.el}`);
  for (const e of errors) lines.push(`  page error: ${e}`);

  if (lines.length) {
    problemCount += lines.length;
    console.log(`\n### ${route}`);
    console.log(lines.join("\n"));
    summary.push({ route, count: lines.length });
  }

  if (SHOTS) {
    await page.screenshot({ path: `scripts/shots/m${route.replace(/\//g, "_") || "_home"}.png`, fullPage: false });
  }
  await page.close();
}

await browser.close();

console.log("\n" + "=".repeat(56));
if (!problemCount) {
  console.log(`CLEAN: ${routes.length} routes at ${WIDTH}px, no mobile issues found.`);
} else {
  console.log(`${problemCount} issues across ${summary.length}/${routes.length} routes at ${WIDTH}px:`);
  for (const s of summary.sort((a, b) => b.count - a.count)) console.log(`  ${String(s.count).padStart(3)}  ${s.route}`);
}
