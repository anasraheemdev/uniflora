/**
 * Pure types, constants, and helper functions shared between server and
 * client code. Deliberately has ZERO imports from `@/lib/supabase/server`
 * (or anything else that touches `next/headers`) — a Client Component can
 * safely import real *values* from this file, unlike `@/lib/data`, where
 * importing anything beyond a `type` pulls the server-only Supabase client
 * into the client bundle and breaks the build.
 *
 * `@/lib/data` re-exports everything here, so server code can keep
 * importing types/constants from one place; client components (map,
 * explore/families browsers) should import from here directly.
 */
import type { Database } from "@/types/supabase";

export type PlantType = Database["public"]["Enums"]["plant_type"];
export type GrowthStatus = Database["public"]["Enums"]["growth_status"];
export type LifeForm = Database["public"]["Enums"]["life_form"];
export type MapLayer = Database["public"]["Enums"]["map_layer"];
export type NativeStatus = Database["public"]["Enums"]["native_status"];

export const PLANT_TYPES: PlantType[] = [
  "Tree", "Palm", "Shrub", "Subshrub", "Climber", "Succulent", "Herb", "Grass", "Sedge",
];

export type Plant = {
  slug: string;
  scientificName: string;
  author?: string;
  commonName: string;
  localNames: string[];
  family: string;
  genus: string;
  order?: string;
  type: PlantType;
  habit: string;
  lifeForm: LifeForm;
  growthStatus: GrowthStatus;
  layer: MapLayer;
  occurrences: number;
  zones: string[];
  badgeColor: string;
  hasImage: boolean;
  hasProfile: boolean;
  nativeStatus?: NativeStatus;
  medicinal?: boolean;
  height?: string;
  habitat?: string;
  conservationStatus?: string;
  synonyms: string[];
  nativeRange?: string;
  introducedRange?: string;
  regionalDistribution?: string;
  taxonomicNotes?: string;
  description: string[];
  diagnosticCharacters: { label: string; value: string }[];
  phenology?: { flowering: number[]; fruiting: number[]; floweringLabel: string; fruitingLabel: string };
  ethnobotany: { title: string; text: string }[];
  references: string[];
  voucher?: { number: string; collector: string; date: string; barcode: string };
};

export type Family = {
  slug: string;
  name: string;
  letter: string;
  order?: string;
  commonName?: string;
  genera: string[];
  generaCount: number;
  speciesCount: number;
  occurrences: number;
  habits: string[];
  cultivated: number;
  wild: number;
  description?: string;
  characteristics: string[];
  distribution?: string;
  economicUses: string[];
  hasProfile: boolean;
};

export type CampusZone = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  center: [number, number];
  polygon: [number, number][];
  plantCount: number;
};

export type PlantMarker = {
  id: string;
  slug: string;
  lat: number;
  lng: number;
  zoneId: string;
  layer: MapLayer;
};

export type CampusSettings = { center: [number, number]; bounds: [[number, number], [number, number]]; zoom: number };

export type Specimen = {
  slug: string;
  scientificName: string;
  family: string;
  type: PlantType;
  voucher: string;
  collector: string;
  year: string;
};

export type Stats = {
  species: number;
  families: number;
  genera: number;
  locations: number;
  photographed: number;
  profiled: number;
  cultivated: number;
  wild: number;
};

export const LAYER_COLORS: Record<MapLayer, string> = { trees: "#2f6b3f", shrubs: "#b6862d", herbs: "#c2578e" };
export const LAYER_LABELS: Record<MapLayer, string> = { trees: "Trees & palms", shrubs: "Shrubs & climbers", herbs: "Herbs & grasses" };

export function familySlugFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getLayerCounts(markers: PlantMarker[]): Record<MapLayer, number> {
  return markers.reduce(
    (acc, m) => { acc[m.layer] += 1; return acc; },
    { trees: 0, shrubs: 0, herbs: 0 } as Record<MapLayer, number>,
  );
}

export function getZoneById(zones: CampusZone[], id: string): CampusZone | undefined {
  return zones.find((z) => z.id === id);
}

export function getMarkersBySlug(markers: PlantMarker[], slug: string): PlantMarker[] {
  return markers.filter((m) => m.slug === slug);
}
