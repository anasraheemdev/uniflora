/**
 * Family index derived from the campus floristic survey.
 *
 * Counts, genera and habit mixes come straight from the survey; prose comes
 * from `src/data/curated.ts` for the families we have written up.
 */

import generatedFamilies from "@/data/generated/families.json";
import { CURATED_FAMILIES, FAMILY_ORDERS } from "@/data/curated";
import { PLANTS, type Plant } from "@/data/plants";

export type Family = {
  slug: string;
  name: string;
  letter: string;
  order?: string;
  commonName?: string;
  genera: string[];
  generaCount: number;
  speciesCount: number;
  /** Individuals of this family recorded by GPS. */
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

type GeneratedFamily = (typeof generatedFamilies)[number];

function buildFamily(record: GeneratedFamily): Family {
  const curated = CURATED_FAMILIES[record.name];

  return {
    slug: record.slug,
    name: record.name,
    letter: record.letter,
    order: FAMILY_ORDERS[record.name],
    commonName: curated?.commonName,
    genera: record.genera,
    generaCount: record.genera.length,
    speciesCount: record.speciesCount,
    occurrences: record.occurrences,
    habits: record.habits,
    cultivated: record.cultivated,
    wild: record.wild,
    description: curated?.description,
    characteristics: curated?.characteristics ?? [],
    distribution: curated?.distribution,
    economicUses: curated?.economicUses ?? [],
    hasProfile: Boolean(curated),
  };
}

export const FAMILIES: Family[] = (generatedFamilies as GeneratedFamily[])
  .map(buildFamily)
  .sort((a, b) => a.name.localeCompare(b.name));

const BY_SLUG = new Map(FAMILIES.map((f) => [f.slug, f]));
const BY_NAME = new Map(FAMILIES.map((f) => [f.name.toLowerCase(), f]));

export const FAMILY_LETTERS: string[] = [...new Set(FAMILIES.map((f) => f.letter))].sort();

export function familySlugFromName(name: string): string {
  return BY_NAME.get(name.toLowerCase())?.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getFamilyBySlug(slug: string): Family | undefined {
  return BY_SLUG.get(slug);
}

export function getFamilyByName(name: string): Family | undefined {
  return BY_NAME.get(name.toLowerCase());
}

export function getPlantsByFamily(name: string): Plant[] {
  return PLANTS.filter((p) => p.family === name);
}

/** Families sharing the same taxonomic order, else the closest by size. */
export function getRelatedFamilies(family: Family, limit = 4): Family[] {
  if (family.order) {
    const sameOrder = FAMILIES.filter((f) => f.slug !== family.slug && f.order === family.order);
    if (sameOrder.length) return sameOrder.slice(0, limit);
  }

  return FAMILIES.filter((f) => f.slug !== family.slug)
    .sort(
      (a, b) =>
        Math.abs(a.speciesCount - family.speciesCount) - Math.abs(b.speciesCount - family.speciesCount),
    )
    .slice(0, limit);
}

/** Largest families on campus, by number of mapped individuals. */
export function getFeaturedFamilies(limit = 3): Family[] {
  return [...FAMILIES]
    .sort((a, b) => b.occurrences - a.occurrences || b.speciesCount - a.speciesCount)
    .slice(0, limit);
}
