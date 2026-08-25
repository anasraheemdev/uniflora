/**
 * One-time data migration: copies the floristic survey (currently bundled as
 * `src/data/generated/*.json`) and the hand-written botanical write-ups
 * (`src/data/curated.ts`, `src/lib/images.ts`) into Supabase Postgres.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) — never run this from
 * anything that ships to a browser.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-supabase.ts
 *
 * Safe to re-run: every insert is an upsert keyed on the natural unique key
 * (slug / id), so running it again after fixing survey data just updates
 * existing rows instead of duplicating them.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import speciesJson from "../src/data/generated/species.json" with { type: "json" };
import familiesJson from "../src/data/generated/families.json" with { type: "json" };
import campusJson from "../src/data/generated/campus.json" with { type: "json" };
import markersJson from "../src/data/generated/markers.json" with { type: "json" };
import { CURATED_FAMILIES, CURATED_PROFILES, FAMILY_ORDERS } from "../src/data/curated";
import { PLANT_IMAGES } from "../src/lib/images";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

/** Supabase's PostgREST endpoint rejects very large single payloads — batch. */
async function upsertInBatches<T extends Record<string, unknown>>(
  table: string,
  rows: T[],
  onConflict: string,
  batchSize = 500,
) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    // `any` here is deliberate: this is a generic batch-upsert helper used
    // across several differently-shaped tables in a one-off migration
    // script, not app runtime code — supabase-js's precise per-table insert
    // types don't unify across a `table: string` parameter.
    const { error } = await supabase.from(table).upsert(batch as never, { onConflict });
    if (error) throw new Error(`${table} batch ${i}-${i + batch.length}: ${error.message}`);
  }
  console.log(`  ${table}: ${rows.length} rows upserted`);
}

/** Mirrors decodeMarkers() in src/data/campus-map.ts. */
function decodeMarkers() {
  const { origin, scale, slugs, zones, layers, markers } = markersJson;
  const [originLat, originLng] = origin;
  const perZone = new Map<string, number>();

  return (markers as [number, number, number, number, number][]).map(
    ([slugIndex, dLat, dLng, zoneIndex, layerIndex]) => {
      const zoneId = zones[zoneIndex];
      const next = (perZone.get(zoneId) ?? 0) + 1;
      perZone.set(zoneId, next);

      return {
        id: `${zoneId.split("-")[1].toUpperCase()}-${String(next).padStart(4, "0")}`,
        slug: slugs[slugIndex],
        lat: originLat + dLat * scale,
        lng: originLng + dLng * scale,
        zoneId,
        layer: layers[layerIndex] as "trees" | "shrubs" | "herbs",
      };
    },
  );
}

async function main() {
  console.log("1/6 families");
  await upsertInBatches(
    "families",
    familiesJson.map((f) => {
      const curated = CURATED_FAMILIES[f.name as keyof typeof CURATED_FAMILIES];
      return {
        slug: f.slug,
        name: f.name,
        letter: f.letter,
        order_name: FAMILY_ORDERS[f.name] ?? null,
        common_name: curated?.commonName ?? null,
        genera: f.genera,
        species_count: f.speciesCount,
        occurrences: f.occurrences,
        habits: f.habits,
        cultivated: f.cultivated,
        wild: f.wild,
        description: curated?.description ?? null,
        characteristics: curated?.characteristics ?? [],
        distribution: curated?.distribution ?? null,
        economic_uses: curated?.economicUses ?? [],
      };
    }),
    "slug",
  );

  const { data: familyRows, error: familyReadError } = await supabase.from("families").select("id, name");
  if (familyReadError) throw familyReadError;
  const familyIdByName = new Map(familyRows!.map((f) => [f.name, f.id]));

  console.log("2/6 species");
  await upsertInBatches(
    "species",
    speciesJson.map((p) => ({
      slug: p.slug,
      scientific_name: p.scientificName,
      author: p.author || null,
      common_name: p.commonName,
      local_names: p.localNames,
      family_id: familyIdByName.get(p.family),
      genus: p.genus,
      type: p.type,
      habit: p.habit,
      life_form: p.lifeForm,
      growth_status: p.growthStatus,
      layer: p.layer,
      badge_color: p.badgeColor,
      has_image: p.slug in PLANT_IMAGES,
      occurrences: p.occurrences,
    })),
    "slug",
  );

  const { data: speciesRows, error: speciesReadError } = await supabase.from("species").select("id, slug");
  if (speciesReadError) throw speciesReadError;
  const speciesIdBySlug = new Map(speciesRows!.map((s) => [s.slug, s.id]));

  console.log("3/6 species_profiles");
  const profileRows = Object.entries(CURATED_PROFILES)
    .filter(([slug]) => speciesIdBySlug.has(slug))
    .map(([slug, profile]) => ({
      species_id: speciesIdBySlug.get(slug),
      native_status: profile.nativeStatus ?? null,
      medicinal: profile.medicinal ?? false,
      height: profile.height ?? null,
      habitat: profile.habitat ?? null,
      conservation_status: profile.conservationStatus ?? null,
      description: profile.description ?? [],
      diagnostic_characters: profile.diagnosticCharacters ?? [],
      phenology: profile.phenology ?? null,
      ethnobotany: profile.ethnobotany ?? [],
      references: profile.references ?? [],
      voucher: profile.voucher ?? null,
    }));
  await upsertInBatches("species_profiles", profileRows, "species_id");

  console.log("4/6 campus_settings + campus_zones");
  const { error: settingsError } = await supabase.from("campus_settings").upsert(
    {
      id: true,
      center_lat: campusJson.center[0],
      center_lng: campusJson.center[1],
      bounds: campusJson.bounds,
      zoom: campusJson.zoom,
    },
    { onConflict: "id" },
  );
  if (settingsError) throw settingsError;

  await upsertInBatches(
    "campus_zones",
    campusJson.zones.map((z) => ({
      id: z.id,
      name: z.name,
      short_name: z.shortName,
      color: z.color,
      center_lat: z.center[0],
      center_lng: z.center[1],
      polygon: z.polygon,
      plant_count: z.plantCount,
    })),
    "id",
  );

  console.log("5/6 plant_markers");
  const markers = decodeMarkers();
  await upsertInBatches(
    "plant_markers",
    markers
      .filter((m) => speciesIdBySlug.has(m.slug))
      .map((m) => ({
        id: m.id,
        species_id: speciesIdBySlug.get(m.slug),
        lat: m.lat,
        lng: m.lng,
        zone_id: m.zoneId,
        layer: m.layer,
      })),
    "id",
  );

  console.log("6/6 done — verifying counts");
  const counts = await Promise.all(
    ["families", "species", "campus_zones", "plant_markers"].map(async (table) => {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      return [table, count] as const;
    }),
  );
  for (const [table, count] of counts) console.log(`  ${table}: ${count}`);
  console.log(
    "\nExpected: families 81, species 355, campus_zones 5, plant_markers 2998 (minus any markers whose species didn't resolve — check the warnings above, if any).",
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
