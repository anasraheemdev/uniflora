/**
 * Data access layer — static mock data for Phase 1.
 * Phase 2: replace implementations with database/API calls (PostgreSQL + PostGIS).
 */
export { PLANTS, STATS, getPlantBySlug, RECENT_PLANTS } from "@/data/plants";
export type { Plant, PlantType } from "@/data/plants";
export { FAMILIES, FAMILY_LETTERS, getFamilyBySlug, getPlantsByFamily, getFamiliesWithCampusCounts, familySlugFromName } from "@/data/families";
export type { Family } from "@/data/families";
export { SPECIMENS } from "@/data/specimens";
export { PLANT_MARKERS, CAMPUS_ZONES, CAMPUS_CENTER } from "@/data/campus-map";
export { getPlantImage, PLANT_IMAGES, HERO_IMAGE, QR_CODE_IMAGE } from "@/lib/images";
