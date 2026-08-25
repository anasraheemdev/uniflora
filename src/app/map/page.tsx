import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MapPageClient, MapSkeleton } from "@/components/map/MapPageClient";
import { color, font } from "@/lib/theme";
import { getAllPlants, getCampusSettings, getCampusZones, getPlantMarkers } from "@/lib/data";

export default async function MapPage() {
  const [campusSettings, zones, markers, plants] = await Promise.all([
    getCampusSettings(),
    getCampusZones(),
    getPlantMarkers(),
    getAllPlants(),
  ]);

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="map" />
      <Suspense fallback={<MapSkeleton />}>
        <MapPageClient campusSettings={campusSettings} zones={zones} markers={markers} plants={plants} />
      </Suspense>
    </div>
  );
}
