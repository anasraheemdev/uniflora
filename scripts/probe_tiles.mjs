// Probe which zoom levels actually have imagery over the campus centre.
const LAT = 32.07442;
const LNG = 72.6834992;

const tileX = (lng, z) => Math.floor(((lng + 180) / 360) * 2 ** z);
const tileY = (lat, z) => {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z);
};

const sources = {
  esri: (z, x, y) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
  osm: (z, x, y) => `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`,
};

for (const [name, url] of Object.entries(sources)) {
  console.log(`\n=== ${name} ===`);
  for (let z = 15; z <= 21; z++) {
    const x = tileX(LNG, z);
    const y = tileY(LAT, z);
    try {
      const res = await fetch(url(z, x, y), { headers: { "User-Agent": "uniflora-tile-probe/1.0" } });
      const bytes = res.ok ? (await res.arrayBuffer()).byteLength : 0;
      console.log(`  z${String(z).padStart(2)}  ${res.status}  ${String(bytes).padStart(7)} bytes  ${url(z, x, y)}`);
    } catch (err) {
      console.log(`  z${String(z).padStart(2)}  ERROR ${err.message}`);
    }
  }
}
