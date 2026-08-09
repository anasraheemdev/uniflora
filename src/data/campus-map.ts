/**
 * Campus geography and GPS plant records from the 2026 survey.
 *
 * Markers arrive index-encoded (see `scripts/import_flora_data.py`) to keep the
 * payload small; they are expanded once at module load.
 */

import campus from "@/data/generated/campus.json";
import packedMarkers from "@/data/generated/markers.json";
import type { MapLayer, PlantType } from "@/data/plants";

export type { MapLayer };

export type CampusZone = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  center: [number, number];
  /** [lat, lng][] */
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

export const CAMPUS_CENTER = campus.center as [number, number];
export const CAMPUS_BOUNDS = campus.bounds as [[number, number], [number, number]];
export const CAMPUS_ZOOM = campus.zoom;

export const CAMPUS_ZONES: CampusZone[] = campus.zones.map((zone) => ({
  id: zone.id,
  name: zone.name,
  shortName: zone.shortName,
  color: zone.color,
  center: zone.center as [number, number],
  polygon: zone.polygon as [number, number][],
  plantCount: zone.plantCount,
}));

function decodeMarkers(): PlantMarker[] {
  const { origin, scale, slugs, zones, layers, markers } = packedMarkers;
  const [originLat, originLng] = origin;
  const perZone = new Map<string, number>();

  return markers.map(([slugIndex, dLat, dLng, zoneIndex, layerIndex]) => {
    const zoneId = zones[zoneIndex];
    const next = (perZone.get(zoneId) ?? 0) + 1;
    perZone.set(zoneId, next);

    return {
      id: `${zoneId.split("-")[1].toUpperCase()}-${String(next).padStart(4, "0")}`,
      slug: slugs[slugIndex],
      lat: originLat + dLat * scale,
      lng: originLng + dLng * scale,
      zoneId,
      layer: layers[layerIndex] as MapLayer,
    };
  });
}

export const PLANT_MARKERS: PlantMarker[] = decodeMarkers();

export const LAYER_COLORS: Record<MapLayer, string> = {
  trees: "#2e6b3a",
  shrubs: "#c99a2e",
  herbs: "#d76a95",
};

export const LAYER_LABELS: Record<MapLayer, string> = {
  trees: "Trees & palms",
  shrubs: "Shrubs & climbers",
  herbs: "Herbs & grasses",
};

export const LAYER_COUNTS: Record<MapLayer, number> = PLANT_MARKERS.reduce(
  (acc, marker) => {
    acc[marker.layer] += 1;
    return acc;
  },
  { trees: 0, shrubs: 0, herbs: 0 } as Record<MapLayer, number>,
);

export function plantTypeToLayer(type: PlantType): MapLayer {
  if (type === "Tree" || type === "Palm") return "trees";
  if (type === "Shrub" || type === "Subshrub" || type === "Climber") return "shrubs";
  return "herbs";
}

const ZONES_BY_ID = new Map(CAMPUS_ZONES.map((z) => [z.id, z]));

export function getZoneById(id: string): CampusZone | undefined {
  return ZONES_BY_ID.get(id);
}

const MARKERS_BY_SLUG = new Map<string, PlantMarker[]>();
for (const marker of PLANT_MARKERS) {
  const list = MARKERS_BY_SLUG.get(marker.slug);
  if (list) list.push(marker);
  else MARKERS_BY_SLUG.set(marker.slug, [marker]);
}

export function getMarkersBySlug(slug: string): PlantMarker[] {
  return MARKERS_BY_SLUG.get(slug) ?? [];
}

export function getMarkerBySlug(slug: string): PlantMarker | undefined {
  return MARKERS_BY_SLUG.get(slug)?.[0];
}

/** Species present in a zone, most abundant first. */
export function getZoneSpecies(zoneId: string): { slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const marker of PLANT_MARKERS) {
    if (marker.zoneId !== zoneId) continue;
    counts.set(marker.slug, (counts.get(marker.slug) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}
