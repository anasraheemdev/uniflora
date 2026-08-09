// Sanity-check that the packed marker payload decodes back onto the campus.
import { readFileSync } from "node:fs";

const read = (name) => JSON.parse(readFileSync(new URL(`../src/data/generated/${name}`, import.meta.url), "utf8"));

const packed = read("markers.json");
const campus = read("campus.json");
const species = read("species.json");

const [originLat, originLng] = packed.origin;
const decoded = packed.markers.map(([s, dLat, dLng, z, l]) => ({
  slug: packed.slugs[s],
  lat: originLat + dLat * packed.scale,
  lng: originLng + dLng * packed.scale,
  zone: packed.zones[z],
  layer: packed.layers[l],
}));

const lats = decoded.map((m) => m.lat);
const lngs = decoded.map((m) => m.lng);
const [[swLat, swLng], [neLat, neLng]] = campus.bounds;

const outside = decoded.filter((m) => m.lat < swLat || m.lat > neLat || m.lng < swLng || m.lng > neLng);
const unknownSlugs = new Set(decoded.map((m) => m.slug));
for (const s of species) unknownSlugs.delete(s.slug);

const perZone = {};
for (const m of decoded) perZone[m.zone] = (perZone[m.zone] ?? 0) + 1;

const perLayer = {};
for (const m of decoded) perLayer[m.layer] = (perLayer[m.layer] ?? 0) + 1;

console.log("markers decoded      :", decoded.length);
console.log("lat range            :", Math.min(...lats).toFixed(6), "->", Math.max(...lats).toFixed(6));
console.log("lng range            :", Math.min(...lngs).toFixed(6), "->", Math.max(...lngs).toFixed(6));
console.log("outside campus bounds:", outside.length);
console.log("slugs not in species :", [...unknownSlugs]);
console.log("per zone             :", perZone);
console.log("per layer            :", perLayer);
console.log(
  "occurrence totals agree:",
  species.reduce((sum, s) => sum + s.occurrences, 0) === decoded.length,
);

const spanLat = (Math.max(...lats) - Math.min(...lats)) * 111320;
const spanLng = (Math.max(...lngs) - Math.min(...lngs)) * 111320 * Math.cos((32.07 * Math.PI) / 180);
console.log("campus span (m)      :", Math.round(spanLat), "x", Math.round(spanLng));
