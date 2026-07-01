"use client";

import dynamic from "next/dynamic";

const MapExplorer = dynamic(() => import("@/components/map/MapExplorer").then((m) => m.MapExplorer), {
  ssr: false,
  loading: () => (
    <div className="uf-page-pad uf-split-map">
      <aside className="uf-map-panel" style={{ background: "#fbf9f1", borderRight: "1px solid #e6e1cf", padding: 24 }}>
        <div style={{ fontWeight: 600, color: "#6b7360" }}>Loading campus map…</div>
      </aside>
      <div className="uf-map-view" style={{ background: "linear-gradient(135deg,#dfe8d2,#cbdcbe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#3f4a3a", fontWeight: 600 }}>Initializing interactive map</div>
      </div>
    </div>
  ),
});

export function MapPageClient() {
  return <MapExplorer />;
}
