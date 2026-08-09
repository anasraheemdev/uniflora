/**
 * Data access layer.
 *
 * Backed by the generated floristic-survey JSON for now; Phase 2 swaps these
 * implementations for database/API calls (PostgreSQL + PostGIS).
 */
export { PLANTS, STATS, PLANT_TYPES, MOST_ABUNDANT, RECENT_PLANTS, getPlantBySlug, countByType } from "@/data/plants";
export type { Plant, PlantType, GrowthStatus, LifeForm } from "@/data/plants";
export {
  FAMILIES,
  FAMILY_LETTERS,
  getFamilyBySlug,
  getFamilyByName,
  getPlantsByFamily,
  getRelatedFamilies,
  getFeaturedFamilies,
  familySlugFromName,
} from "@/data/families";
export type { Family } from "@/data/families";
export { SPECIMENS } from "@/data/specimens";
export {
  PLANT_MARKERS,
  CAMPUS_ZONES,
  CAMPUS_CENTER,
  CAMPUS_BOUNDS,
  LAYER_COUNTS,
  getMarkersBySlug,
  getZoneById,
  getZoneSpecies,
} from "@/data/campus-map";
export { getPlantImage, hasPlantImage, PLANT_IMAGES, HERO_IMAGE, QR_CODE_IMAGE } from "@/lib/images";
