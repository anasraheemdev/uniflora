/**
 * Data access layer — Supabase-backed (Phase 2).
 *
 * Every shape here (`Plant`, `Family`, `CampusZone`, `PlantMarker`,
 * `Specimen`) is byte-identical to the Phase 1 static types that used to
 * live in `src/data/*.ts`, so components that already rendered these fields
 * don't need to change — only *how* the data arrives (an `await` instead of
 * a module-scope constant) does.
 *
 * Uses the cookie-free public client (`@/lib/supabase/public`) — every table
 * read here is public (RLS grants SELECT to everyone), and this needs to be
 * callable from `generateStaticParams` at build time, where there is no
 * request to read a session cookie from in the first place. Still
 * server-only in practice (bundling it into a Client Component pulls in
 * `@supabase/supabase-js` for nothing) — Client Components should import
 * types/constants/pure helpers from `@/lib/data-types` directly instead.
 */
import { createClient } from "@/lib/supabase/public";
import { withCache } from "@/lib/redis";
import type { Database } from "@/types/supabase";
import type { CampusSettings, CampusZone, Family, MapLayer, Plant, PlantMarker, PlantType, Specimen, Stats } from "@/lib/data-types";

// Re-exported so server code can import types/constants/pure helpers from
// this one module too, alongside the async DB functions below.
export * from "@/lib/data-types";

type SpeciesRow = Database["public"]["Tables"]["species"]["Row"] & {
  families: Pick<Database["public"]["Tables"]["families"]["Row"], "name" | "order_name"> | null;
  species_profiles: Database["public"]["Tables"]["species_profiles"]["Row"] | null;
};

const SPECIES_SELECT = "*, families(name, order_name), species_profiles(*)";

function toPlant(row: SpeciesRow, zones: string[] = []): Plant {
  const profile = row.species_profiles;
  return {
    slug: row.slug,
    scientificName: row.scientific_name,
    author: row.author ?? undefined,
    commonName: row.common_name,
    localNames: row.local_names,
    family: row.families?.name ?? "",
    genus: row.genus,
    order: row.families?.order_name ?? undefined,
    type: row.type,
    habit: row.habit,
    lifeForm: row.life_form,
    growthStatus: row.growth_status,
    layer: row.layer,
    occurrences: row.occurrences,
    zones,
    badgeColor: row.badge_color,
    hasImage: row.has_image,
    hasProfile: Boolean(profile?.description?.length),
    nativeStatus: profile?.native_status ?? undefined,
    medicinal: profile?.medicinal ?? undefined,
    height: profile?.height ?? undefined,
    habitat: profile?.habitat ?? undefined,
    conservationStatus: profile?.conservation_status ?? undefined,
    synonyms: profile?.synonyms ?? [],
    nativeRange: profile?.native_range ?? undefined,
    introducedRange: profile?.introduced_range ?? undefined,
    regionalDistribution: profile?.regional_distribution ?? undefined,
    taxonomicNotes: profile?.taxonomic_notes ?? undefined,
    description: profile?.description ?? [],
    diagnosticCharacters: (profile?.diagnostic_characters as Plant["diagnosticCharacters"]) ?? [],
    phenology: (profile?.phenology as Plant["phenology"]) ?? undefined,
    ethnobotany: (profile?.ethnobotany as Plant["ethnobotany"]) ?? [],
    references: profile?.references ?? [],
    voucher: (profile?.voucher as Plant["voucher"]) ?? undefined,
  };
}

function toFamily(row: Database["public"]["Tables"]["families"]["Row"]): Family {
  return {
    slug: row.slug,
    name: row.name,
    letter: row.letter,
    order: row.order_name ?? undefined,
    commonName: row.common_name ?? undefined,
    genera: row.genera,
    generaCount: row.genera.length,
    speciesCount: row.species_count,
    occurrences: row.occurrences,
    habits: row.habits,
    cultivated: row.cultivated,
    wild: row.wild,
    description: row.description ?? undefined,
    characteristics: row.characteristics,
    distribution: row.distribution ?? undefined,
    economicUses: row.economic_uses,
    hasProfile: Boolean(row.description),
  };
}

// ── Species ────────────────────────────────────────────────────────────────

export async function getAllPlants(): Promise<Plant[]> {
  return withCache("uf:species:all", 300, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("species")
      .select(SPECIES_SELECT)
      .order("scientific_name")
      .returns<SpeciesRow[]>();
    if (error) throw error;
    return data.map((row) => toPlant(row));
  });
}

export async function getPlantBySlug(slug: string): Promise<Plant | undefined> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("species")
    .select(SPECIES_SELECT)
    .eq("slug", slug)
    .maybeSingle()
    .returns<SpeciesRow>();
  if (error) throw error;
  if (!row) return undefined;

  const { data: markers } = await supabase.from("plant_markers").select("zone_id").eq("species_id", row.id);
  const zones = [...new Set((markers ?? []).map((m) => m.zone_id))];
  return toPlant(row, zones);
}

export async function countByType(type: PlantType): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase.from("species").select("*", { count: "exact", head: true }).eq("type", type);
  if (error) throw error;
  return count ?? 0;
}

export async function getStats(): Promise<Stats> {
  const plants = await getAllPlants();
  return {
    species: plants.length,
    families: new Set(plants.map((p) => p.family)).size,
    genera: new Set(plants.map((p) => p.genus)).size,
    locations: plants.reduce((sum, p) => sum + p.occurrences, 0),
    photographed: plants.filter((p) => p.hasImage).length,
    profiled: plants.filter((p) => p.hasProfile).length,
    cultivated: plants.filter((p) => p.growthStatus === "Cultivated").length,
    wild: plants.filter((p) => p.growthStatus === "Wild").length,
  };
}

export async function getMostAbundant(limit = 12): Promise<Plant[]> {
  const plants = await getAllPlants();
  return [...plants].filter((p) => p.occurrences > 0).sort((a, b) => b.occurrences - a.occurrences).slice(0, limit);
}

export async function getRecentPlants(limit = 5): Promise<Plant[]> {
  const plants = await getAllPlants();
  const photographed = plants.filter((p) => p.hasImage);
  const abundantUnphotographed = [...plants]
    .filter((p) => p.occurrences > 0 && !p.hasImage)
    .sort((a, b) => b.occurrences - a.occurrences);
  return [...photographed, ...abundantUnphotographed].slice(0, limit);
}

// ── Families ───────────────────────────────────────────────────────────────

export async function getAllFamilies(): Promise<Family[]> {
  return withCache("uf:families:all", 300, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("families").select("*").order("name");
    if (error) throw error;
    return data.map(toFamily);
  });
}

export async function getFamilyLetters(): Promise<string[]> {
  const families = await getAllFamilies();
  return [...new Set(families.map((f) => f.letter))].sort();
}

export async function getFamilyBySlug(slug: string): Promise<Family | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("families").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toFamily(data) : undefined;
}

export async function getFamilyByName(name: string): Promise<Family | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("families").select("*").ilike("name", name).maybeSingle();
  if (error) throw error;
  return data ? toFamily(data) : undefined;
}

export async function getPlantsByFamily(name: string): Promise<Plant[]> {
  const plants = await getAllPlants();
  return plants.filter((p) => p.family === name);
}

export async function getRelatedFamilies(family: Family, limit = 4): Promise<Family[]> {
  const families = await getAllFamilies();
  if (family.order) {
    const sameOrder = families.filter((f) => f.slug !== family.slug && f.order === family.order);
    if (sameOrder.length) return sameOrder.slice(0, limit);
  }
  return families
    .filter((f) => f.slug !== family.slug)
    .sort((a, b) => Math.abs(a.speciesCount - family.speciesCount) - Math.abs(b.speciesCount - family.speciesCount))
    .slice(0, limit);
}

export async function getFeaturedFamilies(limit = 3): Promise<Family[]> {
  const families = await getAllFamilies();
  return [...families].sort((a, b) => b.occurrences - a.occurrences || b.speciesCount - a.speciesCount).slice(0, limit);
}

// ── Campus map ─────────────────────────────────────────────────────────────

export async function getCampusSettings(): Promise<CampusSettings> {
  return withCache("uf:campus:settings", 3600, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("campus_settings").select("*").single();
    if (error) throw error;
    return {
      center: [data.center_lat, data.center_lng] as [number, number],
      bounds: data.bounds as [[number, number], [number, number]],
      zoom: data.zoom,
    };
  });
}

export async function getCampusZones(): Promise<CampusZone[]> {
  return withCache("uf:campus:zones", 300, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("campus_zones").select("*").order("id");
    if (error) throw error;
    return data.map((z) => ({
      id: z.id,
      name: z.name,
      shortName: z.short_name,
      color: z.color,
      center: [z.center_lat, z.center_lng] as [number, number],
      polygon: z.polygon as [number, number][],
      plantCount: z.plant_count,
    }));
  });
}

/** All 2,998 GPS-pinned individuals — this is "the map data." */
export async function getPlantMarkers(): Promise<PlantMarker[]> {
  return withCache("uf:campus:markers", 300, async () => {
    const supabase = await createClient();
    type Row = { id: string; lat: number; lng: number; zone_id: string; layer: MapLayer; species: { slug: string } | null };

    // PostgREST caps a single request at 1,000 rows by default — this table
    // has ~3,000, so page through it in batches rather than silently
    // truncating the map to the first 1,000 markers.
    const pageSize = 1000;
    const rows: Row[] = [];
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("plant_markers")
        .select("id, lat, lng, zone_id, layer, species:species_id(slug)")
        .range(from, from + pageSize - 1)
        .returns<Row[]>();
      if (error) throw error;
      rows.push(...data);
      if (data.length < pageSize) break;
    }

    return rows.filter((m) => m.species).map((m) => ({
      id: m.id,
      slug: m.species!.slug,
      lat: m.lat,
      lng: m.lng,
      zoneId: m.zone_id,
      layer: m.layer,
    }));
  });
}

/** Targeted query for a single species' page — avoids pulling all 2,998 rows. */
export async function getMarkersBySpeciesSlug(slug: string): Promise<PlantMarker[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plant_markers")
    .select("id, lat, lng, zone_id, layer, species:species_id!inner(slug)")
    .eq("species.slug", slug)
    .returns<{ id: string; lat: number; lng: number; zone_id: string; layer: MapLayer; species: { slug: string } }[]>();
  if (error) throw error;
  return data.map((m) => ({ id: m.id, slug, lat: m.lat, lng: m.lng, zoneId: m.zone_id, layer: m.layer }));
}

// ── Specimens ──────────────────────────────────────────────────────────────

export async function getSpecimens(): Promise<Specimen[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("specimens")
    .select("voucher_number, collector, collected_year, species:species_id(slug, scientific_name, type, families(name))")
    .returns<
      {
        voucher_number: string;
        collector: string;
        collected_year: string | null;
        species: { slug: string; scientific_name: string; type: PlantType; families: { name: string } | null } | null;
      }[]
    >();
  if (error) throw error;
  return data
    .filter((s) => s.species)
    .map((s) => ({
      slug: s.species!.slug,
      scientificName: s.species!.scientific_name,
      family: s.species!.families?.name ?? "",
      type: s.species!.type,
      voucher: s.voucher_number,
      collector: s.collector,
      year: s.collected_year ?? "",
    }));
}

export async function getSpecimenStats(): Promise<{ vouchers: number; collectors: number }> {
  const specimens = await getSpecimens();
  return { vouchers: specimens.length, collectors: new Set(specimens.map((s) => s.collector)).size };
}
