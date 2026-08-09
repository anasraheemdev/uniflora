import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MapPageClient, MapSkeleton } from "@/components/map/MapPageClient";

export default function MapPage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="map" />
      <Suspense fallback={<MapSkeleton />}>
        <MapPageClient />
      </Suspense>
    </div>
  );
}
