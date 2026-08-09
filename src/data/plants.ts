/**
 * Campus species catalogue.
 *
 * Built from the 2026 floristic survey (`src/data/generated/species.json`,
 * produced by `scripts/import_flora_data.py`) with hand-written profiles from
 * `src/data/curated.ts` layered on top where we have them.
 */

import generatedSpecies from "@/data/generated/species.json";
import importReport from "@/data/generated/import-report.json";
import { CURATED_PROFILES, FAMILY_ORDERS } from "@/data/curated";
import { hasPlantImage, PHOTOGRAPHED_SPECIES } from "@/lib/images";

export type PlantType =
  | "Tree"
  | "Palm"
  | "Shrub"
  | "Subshrub"
  | "Climber"
  | "Succulent"
  | "Herb"
  | "Grass"
  | "Sedge";

export type GrowthStatus = "Cultivated" | "Wild";
export type LifeForm = "Annual" | "Perennial";
export type MapLayer = "trees" | "shrubs" | "herbs";

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
  /** Individuals recorded during the GPS survey. */
  occurrences: number;
  zones: string[];
  badgeColor: string;
  hasImage: boolean;
  /** True when a written profile exists beyond the survey fields. */
  hasProfile: boolean;

  // Curated detail — absent for species not yet written up.
  nativeStatus?: "Native" | "Exotic";
  medicinal?: boolean;
  height?: string;
  habitat?: string;
  conservationStatus?: string;
  description: string[];
  diagnosticCharacters: { label: string; value: string }[];
  phenology?: {
    flowering: number[];
    fruiting: number[];
    floweringLabel: string;
    fruitingLabel: string;
  };
  ethnobotany: { title: string; text: string }[];
  references: string[];
  voucher?: { number: string; collector: string; date: string; barcode: string };
};

type GeneratedSpecies = (typeof generatedSpecies)[number];

function buildPlant(record: GeneratedSpecies): Plant {
  const curated = CURATED_PROFILES[record.slug];

  return {
    slug: record.slug,
    scientificName: record.scientificName,
    author: record.author || undefined,
    commonName: curated?.commonName ?? record.commonName,
    localNames: record.localNames,
    family: record.family,
    genus: record.genus,
    order: curated?.order ?? FAMILY_ORDERS[record.family],
    type: record.type as PlantType,
    habit: record.habit,
    lifeForm: record.lifeForm as LifeForm,
    growthStatus: record.growthStatus as GrowthStatus,
    layer: record.layer as MapLayer,
    occurrences: record.occurrences,
    zones: record.zones,
    badgeColor: record.badgeColor,
    hasImage: hasPlantImage(record.slug),
    hasProfile: Boolean(curated?.description?.length),

    nativeStatus: curated?.nativeStatus,
    medicinal: curated?.medicinal,
    height: curated?.height,
    habitat: curated?.habitat,
    conservationStatus: curated?.conservationStatus,
    description: curated?.description ?? [],
    diagnosticCharacters: curated?.diagnosticCharacters ?? [],
    phenology: curated?.phenology,
    ethnobotany: curated?.ethnobotany ?? [],
    references: curated?.references ?? [],
    voucher: curated?.voucher,
  };
}

export const PLANTS: Plant[] = (generatedSpecies as GeneratedSpecies[])
  .map(buildPlant)
  .sort((a, b) => a.scientificName.localeCompare(b.scientificName));

const BY_SLUG = new Map(PLANTS.map((p) => [p.slug, p]));

export function getPlantBySlug(slug: string): Plant | undefined {
  return BY_SLUG.get(slug);
}

export const PLANT_TYPES: PlantType[] = [
  "Tree",
  "Palm",
  "Shrub",
  "Subshrub",
  "Climber",
  "Succulent",
  "Herb",
  "Grass",
  "Sedge",
];

export function countByType(type: PlantType): number {
  return PLANTS.filter((p) => p.type === type).length;
}

/** Species with the most individuals recorded in the survey. */
export const MOST_ABUNDANT: Plant[] = [...PLANTS]
  .filter((p) => p.occurrences > 0)
  .sort((a, b) => b.occurrences - a.occurrences)
  .slice(0, 12);

/** Feature the written-up species first, then fall back to abundant ones. */
export const RECENT_PLANTS: Plant[] = [
  ...PLANTS.filter((p) => p.hasImage),
  ...MOST_ABUNDANT.filter((p) => !p.hasImage),
].slice(0, 5);

export const STATS = {
  species: PLANTS.length,
  families: new Set(PLANTS.map((p) => p.family)).size,
  genera: new Set(PLANTS.map((p) => p.genus)).size,
  /** Individual plants pinned by GPS during the survey. */
  locations: PLANTS.reduce((sum, p) => sum + p.occurrences, 0),
  photographed: PHOTOGRAPHED_SPECIES,
  profiled: PLANTS.filter((p) => p.hasProfile).length,
  cultivated: PLANTS.filter((p) => p.growthStatus === "Cultivated").length,
  wild: PLANTS.filter((p) => p.growthStatus === "Wild").length,
  surveyedAt: importReport.generatedAt,
};
