"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { color } from "@/lib/theme";
import type { CampusSettings, CampusZone, Plant, PlantMarker } from "@/lib/data-types";

const MapExplorer = dynamic(() => import("@/components/map/MapExplorer").then((m) => m.MapExplorer), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="uf-page-pad uf-split-map">
      <aside className="uf-map-panel" style={{ background: color.parchmentDeep, borderRight: `1px solid ${color.border}`, padding: 24 }}>
        <div style={{ fontWeight: 600, color: color.muted }}>Loading campus map…</div>
      </aside>
      <div className="uf-map-view" style={{ background: `linear-gradient(135deg, #dfe8d2, #cbdcbe)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: color.inkSoft, fontWeight: 600 }}>Initializing interactive map</div>
      </div>
    </div>
  );
}

type MapPageClientProps = {
  campusSettings: CampusSettings;
  zones: CampusZone[];
  markers: PlantMarker[];
  plants: Plant[];
};

export function MapPageClient({ campusSettings, zones, markers, plants }: MapPageClientProps) {
  const initialSlug = useSearchParams().get("species") ?? undefined;
  return (
    <MapExplorer
      initialSlug={initialSlug}
      campusSettings={campusSettings}
      zones={zones}
      markers={markers}
      plants={plants}
    />
  );
}

export { MapSkeleton };
