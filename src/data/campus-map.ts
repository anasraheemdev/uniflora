import type { PlantType } from "@/data/plants";

export type MapLayer = "trees" | "shrubs" | "herbs";

export type CampusZone = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  /** [lat, lng][] */
  polygon: [number, number][];
};

export type CampusBuilding = {
  id: string;
  name: string;
  polygon: [number, number][];
};

export type CampusRoad = {
  id: string;
  name: string;
  path: [number, number][];
};

export type PlantMarker = {
  id: string;
  slug: string;
  lat: number;
  lng: number;
  zoneId: string;
  layer: MapLayer;
  tag: string;
};

/** Fictional UniFlora campus — Islamabad-style coordinates for realistic OSM tiles */
export const CAMPUS_CENTER: [number, number] = [33.72115, 73.09245];
export const CAMPUS_ZOOM = 17;
export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [33.7194, 73.0898],
  [33.7228, 73.0952],
];

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: "zone-a",
    name: "Zone A — Main Avenue",
    shortName: "Main Avenue",
    color: "#2e6b3a",
    polygon: [
      [33.72235, 73.0902],
      [33.72245, 73.0918],
      [33.72155, 73.0921],
      [33.72135, 73.0905],
    ],
  },
  {
    id: "zone-b",
    name: "Zone B — Science Block",
    shortName: "Science Block",
    color: "#3a7d47",
    polygon: [
      [33.72055, 73.0900],
      [33.72125, 73.0905],
      [33.72105, 73.0920],
      [33.72035, 73.0915],
    ],
  },
  {
    id: "zone-c",
    name: "Zone C — Library Lawn",
    shortName: "Library Lawn",
    color: "#4f8f43",
    polygon: [
      [33.72135, 73.0920],
      [33.72165, 73.0935],
      [33.72075, 73.0938],
      [33.72055, 73.0922],
    ],
  },
  {
    id: "zone-d",
    name: "Zone D — Hostels",
    shortName: "Hostels",
    color: "#5a9e52",
    polygon: [
      [33.72015, 73.0925],
      [33.72055, 73.0945],
      [33.71965, 73.0948],
      [33.71945, 73.0928],
    ],
  },
  {
    id: "zone-e",
    name: "Zone E — Sports Complex",
    shortName: "Sports Complex",
    color: "#6bab5f",
    polygon: [
      [33.72185, 73.0930],
      [33.72215, 73.0948],
      [33.72115, 73.0950],
      [33.72095, 73.0932],
    ],
  },
  {
    id: "zone-f",
    name: "Zone F — Botanical Garden",
    shortName: "Botanical Garden",
    color: "#7dbf6b",
    polygon: [
      [33.72195, 73.0895],
      [33.72225, 73.0901],
      [33.72145, 73.0903],
      [33.72125, 73.0896],
    ],
  },
];

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    id: "admin",
    name: "Administration Block",
    polygon: [
      [33.72205, 73.0906],
      [33.72225, 73.0912],
      [33.72185, 73.0914],
      [33.72165, 73.0908],
    ],
  },
  {
    id: "science",
    name: "Science Block",
    polygon: [
      [33.72075, 73.0903],
      [33.72105, 73.0908],
      [33.72065, 73.0911],
      [33.72045, 73.0906],
    ],
  },
  {
    id: "library",
    name: "Central Library",
    polygon: [
      [33.72115, 73.0925],
      [33.72145, 73.0932],
      [33.72095, 73.0934],
      [33.72075, 73.0927],
    ],
  },
  {
    id: "student-center",
    name: "Student Center",
    polygon: [
      [33.72155, 73.0915],
      [33.72175, 73.0920],
      [33.72135, 73.0922],
      [33.72115, 73.0917],
    ],
  },
  {
    id: "hostel-a",
    name: "Hostel Block A",
    polygon: [
      [33.72035, 73.0930],
      [33.72055, 73.0938],
      [33.71995, 73.0940],
      [33.71975, 73.0932],
    ],
  },
  {
    id: "hostel-b",
    name: "Hostel Block B",
    polygon: [
      [33.72005, 73.0925],
      [33.72025, 73.0932],
      [33.71965, 73.0934],
      [33.71955, 73.0927],
    ],
  },
  {
    id: "auditorium",
    name: "Auditorium",
    polygon: [
      [33.72175, 73.0935],
      [33.72195, 73.0942],
      [33.72145, 73.0944],
      [33.72125, 73.0937],
    ],
  },
  {
    id: "sports",
    name: "Sports Pavilion",
    polygon: [
      [33.72195, 73.0938],
      [33.72215, 73.0945],
      [33.72155, 73.0947],
      [33.72135, 73.0940],
    ],
  },
];

export const CAMPUS_ROADS: CampusRoad[] = [
  {
    id: "main-avenue",
    name: "Main Avenue",
    path: [
      [33.7225, 73.0910],
      [33.7195, 73.0910],
      [33.7195, 73.0935],
    ],
  },
  {
    id: "ring-road",
    name: "Campus Ring Road",
    path: [
      [33.7224, 73.0900],
      [33.7224, 73.0948],
      [33.7195, 73.0948],
      [33.7195, 73.0900],
      [33.7224, 73.0900],
    ],
  },
  {
    id: "library-drive",
    name: "Library Drive",
    path: [
      [33.7216, 73.0908],
      [33.7211, 73.0936],
    ],
  },
];

export const PLANT_MARKERS: PlantMarker[] = [
  { id: "A-042", slug: "azadirachta-indica", lat: 33.72205, lng: 73.09105, zoneId: "zone-a", layer: "trees", tag: "Tree #A-042" },
  { id: "A-018", slug: "ficus-religiosa", lat: 33.72175, lng: 73.09085, zoneId: "zone-a", layer: "trees", tag: "Tree #A-018" },
  { id: "A-031", slug: "delonix-regia", lat: 33.72195, lng: 73.09145, zoneId: "zone-a", layer: "trees", tag: "Tree #A-031" },
  { id: "B-012", slug: "cassia-fistula", lat: 33.72085, lng: 73.09055, zoneId: "zone-b", layer: "trees", tag: "Tree #B-012" },
  { id: "B-027", slug: "pongamia-pinnata", lat: 33.72055, lng: 73.09095, zoneId: "zone-b", layer: "trees", tag: "Tree #B-027" },
  { id: "B-008", slug: "acacia-nilotica", lat: 33.72095, lng: 73.09025, zoneId: "zone-b", layer: "trees", tag: "Tree #B-008" },
  { id: "C-015", slug: "bougainvillea-glabra", lat: 33.72125, lng: 73.09285, zoneId: "zone-c", layer: "shrubs", tag: "Shrub #C-015" },
  { id: "C-022", slug: "calliandra-haematocephala", lat: 33.72095, lng: 73.09315, zoneId: "zone-c", layer: "shrubs", tag: "Shrub #C-022" },
  { id: "C-009", slug: "nerium-oleander", lat: 33.72145, lng: 73.09255, zoneId: "zone-c", layer: "shrubs", tag: "Shrub #C-009" },
  { id: "D-004", slug: "jasminum-sambac", lat: 33.72025, lng: 73.09355, zoneId: "zone-d", layer: "herbs", tag: "Herb #D-004" },
  { id: "F-011", slug: "ocimum-tenuiflorum", lat: 33.72155, lng: 73.08985, zoneId: "zone-f", layer: "herbs", tag: "Herb #F-011" },
  { id: "E-006", slug: "terminalia-arjuna", lat: 33.72165, lng: 73.09415, zoneId: "zone-e", layer: "trees", tag: "Tree #E-006" },
];

export const LAYER_COLORS: Record<MapLayer, string> = {
  trees: "#2e6b3a",
  shrubs: "#c99a2e",
  herbs: "#d76a95",
};

export const LAYER_LABELS: Record<MapLayer, string> = {
  trees: "Trees",
  shrubs: "Shrubs",
  herbs: "Herbs",
};

export function plantTypeToLayer(type: PlantType): MapLayer {
  if (type === "Big Tree" || type === "Small Tree" || type === "Palm") return "trees";
  if (type === "Shrub") return "shrubs";
  return "herbs";
}

export function getZoneById(id: string): CampusZone | undefined {
  return CAMPUS_ZONES.find((z) => z.id === id);
}

export function getMarkerBySlug(slug: string): PlantMarker | undefined {
  return PLANT_MARKERS.find((m) => m.slug === slug);
}
