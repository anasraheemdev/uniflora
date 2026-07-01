"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, Marker } from "leaflet";
import { PlantImage } from "@/components/ui/PlantImage";
import {
  CAMPUS_BOUNDS,
  CAMPUS_BUILDINGS,
  CAMPUS_CENTER,
  CAMPUS_ROADS,
  CAMPUS_ZONES,
  CAMPUS_ZOOM,
  LAYER_COLORS,
  LAYER_LABELS,
  PLANT_MARKERS,
  type MapLayer,
  getZoneById,
} from "@/data/campus-map";
import { getPlantBySlug, STATS } from "@/data/plants";
import "leaflet/dist/leaflet.css";

type BasemapStyle = "street" | "satellite";

type MapExplorerProps = {
  initialSlug?: string;
};

const TILES: Record<BasemapStyle, { url: string; attribution: string; maxZoom: number }> = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
};

const LAYER_COUNTS: Record<MapLayer, number> = {
  trees: PLANT_MARKERS.filter((m) => m.layer === "trees").length,
  shrubs: PLANT_MARKERS.filter((m) => m.layer === "shrubs").length,
  herbs: PLANT_MARKERS.filter((m) => m.layer === "herbs").length,
};

export function MapExplorer({ initialSlug }: MapExplorerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const zonesLayerRef = useRef<LayerGroup | null>(null);
  const buildingsLayerRef = useRef<LayerGroup | null>(null);
  const roadsLayerRef = useRef<LayerGroup | null>(null);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);
  const [search, setSearch] = useState("");
  const [basemap, setBasemap] = useState<BasemapStyle>("street");
  const [layers, setLayers] = useState<Record<MapLayer, boolean>>({
    trees: true,
    shrubs: true,
    herbs: true,
  });
  const [showZones, setShowZones] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const filteredMarkers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PLANT_MARKERS.filter((m) => {
      if (!layers[m.layer]) return false;
      if (!q) return true;
      const plant = getPlantBySlug(m.slug);
      if (!plant) return false;
      const zone = getZoneById(m.zoneId);
      return (
        plant.scientificName.toLowerCase().includes(q) ||
        plant.commonName.toLowerCase().includes(q) ||
        plant.family.toLowerCase().includes(q) ||
        m.tag.toLowerCase().includes(q) ||
        (zone?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [search, layers]);

  const flyToMarker = useCallback((slug: string) => {
    const marker = PLANT_MARKERS.find((m) => m.slug === slug);
    if (!marker || !mapInstance.current) return;
    mapInstance.current.flyTo([marker.lat, marker.lng], 18, { duration: 0.8 });
    setSelectedSlug(slug);
  }, []);

  const toggleLayer = (layer: MapLayer) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: CAMPUS_CENTER,
        zoom: CAMPUS_ZOOM,
        minZoom: 16,
        maxZoom: 19,
        zoomControl: false,
        maxBounds: CAMPUS_BOUNDS,
        maxBoundsViscosity: 0.85,
      });

      L.tileLayer(TILES.street.url, {
        attribution: TILES.street.attribution,
        maxZoom: TILES.street.maxZoom,
      }).addTo(map);

      zonesLayerRef.current = L.layerGroup().addTo(map);
      buildingsLayerRef.current = L.layerGroup().addTo(map);
      roadsLayerRef.current = L.layerGroup().addTo(map);

      mapInstance.current = map;
      setMapReady(true);

      if (initialSlug) {
        const m = PLANT_MARKERS.find((x) => x.slug === initialSlug);
        if (m) setTimeout(() => map.flyTo([m.lat, m.lng], 18), 400);
      }
    })();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
      markersRef.current = [];
      zonesLayerRef.current = null;
      buildingsLayerRef.current = null;
      roadsLayerRef.current = null;
    };
  }, [initialSlug]);

  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    (async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstance.current!;

      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) map.removeLayer(layer);
      });

      const tile = TILES[basemap];
      L.tileLayer(tile.url, { attribution: tile.attribution, maxZoom: tile.maxZoom }).addTo(map);
    })();
  }, [basemap, mapReady]);

  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    (async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstance.current!;

      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];

      filteredMarkers.forEach((item) => {
        const plant = getPlantBySlug(item.slug);
        if (!plant) return;
        const zone = getZoneById(item.zoneId);
        const color = LAYER_COLORS[item.layer];
        const isSelected = selectedSlug === item.slug;

        const icon = L.divIcon({
          className: "uf-leaflet-marker",
          html: `<span style="
            display:block;width:${isSelected ? 26 : 20}px;height:${isSelected ? 26 : 20}px;
            border-radius:50%;background:${color};
            border:3px solid #fff;
            box-shadow:0 3px 10px rgba(0,0,0,.35);
            ${isSelected ? "transform:scale(1.1);" : ""}
          "></span>`,
          iconSize: [isSelected ? 26 : 20, isSelected ? 26 : 20],
          iconAnchor: [isSelected ? 13 : 10, isSelected ? 13 : 10],
        });

        const marker = L.marker([item.lat, item.lng], { icon })
          .bindPopup(
            `<div class="uf-map-popup">
              <strong style="font-style:italic;font-family:Georgia,serif">${plant.scientificName}</strong>
              <div style="font-size:13px;color:#3f4a3a;margin-top:4px">${plant.commonName} · ${plant.family}</div>
              <div style="font-size:12px;color:#8a9682;margin-top:6px">📍 ${zone?.name ?? ""} · ${item.tag}</div>
              <a href="/species/${plant.slug}" style="display:block;text-align:center;margin-top:10px;background:#2e6b3a;color:#fff;padding:8px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none">View species ›</a>
            </div>`,
            { maxWidth: 280, className: "uf-leaflet-popup" },
          )
          .on("click", () => setSelectedSlug(item.slug))
          .addTo(map);

        markersRef.current.push(marker);
      });
    })();
  }, [filteredMarkers, selectedSlug, mapReady]);

  useEffect(() => {
    roadsLayerRef.current?.clearLayers();
    if (!showBuildings || !mapInstance.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      CAMPUS_ROADS.forEach((road) => {
        L.polyline(road.path, {
          color: "#c8bea0",
          weight: 7,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
        })
          .bindTooltip(road.name, { permanent: false, direction: "center", className: "uf-map-tooltip" })
          .addTo(roadsLayerRef.current!);
      });
    })();
  }, [showBuildings, mapReady]);

  useEffect(() => {
    zonesLayerRef.current?.clearLayers();
    if (!showZones || !mapInstance.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      CAMPUS_ZONES.forEach((zone) => {
        const polygon = L.polygon(zone.polygon, {
          color: zone.color,
          weight: 2,
          fillColor: zone.color,
          fillOpacity: 0.12,
          dashArray: "6 4",
        }).addTo(zonesLayerRef.current!);
        polygon.bindTooltip(zone.shortName, {
          permanent: true,
          direction: "center",
          className: "uf-map-zone-label",
        });
      });
    })();
  }, [showZones, mapReady]);

  useEffect(() => {
    buildingsLayerRef.current?.clearLayers();
    if (!showBuildings || !mapInstance.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      CAMPUS_BUILDINGS.forEach((building) => {
        L.polygon(building.polygon, {
          color: "#8a9682",
          weight: 1.5,
          fillColor: "#e8e4d4",
          fillOpacity: 0.92,
        })
          .bindTooltip(building.name, {
            permanent: true,
            direction: "center",
            className: "uf-map-building-label",
          })
          .addTo(buildingsLayerRef.current!);
      });
    })();
  }, [showBuildings, mapReady]);

  const handleZoom = (delta: number) => {
    if (!mapInstance.current) return;
    if (delta > 0) mapInstance.current.zoomIn();
    else mapInstance.current.zoomOut();
  };

  const selectedPlant = selectedSlug ? getPlantBySlug(selectedSlug) : null;
  const selectedMarker = selectedSlug ? PLANT_MARKERS.find((m) => m.slug === selectedSlug) : null;

  return (
    <div className="uf-page-pad uf-split-map">
      <aside className="uf-map-panel" style={{ background: "#fbf9f1", borderRight: "1px solid #e6e1cf", padding: 24, overflowY: "auto" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 26, margin: "0 0 4px" }}>Campus Map</h1>
        <p style={{ fontSize: 14, color: "#6b7360", margin: "0 0 18px" }}>
          {STATS.locations} plants mapped across {CAMPUS_ZONES.length} campus zones. Pan, zoom, and tap markers to explore.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 10, padding: "9px 12px", marginBottom: 20 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plants, zones, families…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "transparent" }}
          />
        </div>

        <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", marginBottom: 10 }}>Basemap</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["street", "satellite"] as BasemapStyle[]).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setBasemap(style)}
              style={{
                flex: 1,
                border: basemap === style ? "2px solid #2e6b3a" : "1px solid #e6e1cf",
                background: basemap === style ? "#e2ecda" : "#fff",
                color: "#1e2b1f",
                padding: "9px 12px",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}
            >
              {style}
            </button>
          ))}
        </div>

        <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", marginBottom: 10 }}>Map Layers</div>
        {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => (
          <label key={layer} className="uf-layer" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={layers[layer]} onChange={() => toggleLayer(layer)} style={{ accentColor: "#2e6b3a", width: 16, height: 16 }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: LAYER_COLORS[layer] }} /> {LAYER_LABELS[layer]}
            <span style={{ marginLeft: "auto", color: "#8a9682", fontSize: 13 }}>{LAYER_COUNTS[layer]}</span>
          </label>
        ))}

        <label className="uf-layer" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginTop: 4 }}>
          <input type="checkbox" checked={showZones} onChange={() => setShowZones((v) => !v)} style={{ accentColor: "#2e6b3a", width: 16, height: 16 }} />
          Campus zones
        </label>
        <label className="uf-layer" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={showBuildings} onChange={() => setShowBuildings((v) => !v)} style={{ accentColor: "#2e6b3a", width: 16, height: 16 }} />
          Buildings &amp; roads
        </label>

        <div style={{ height: 1, background: "#e6e1cf", margin: "20px 0" }} />
        <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", marginBottom: 10 }}>
          Plants on map ({filteredMarkers.length})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 320, overflowY: "auto" }}>
          {filteredMarkers.map((item) => {
            const plant = getPlantBySlug(item.slug)!;
            const zone = getZoneById(item.zoneId);
            const isActive = selectedSlug === item.slug;
            return (
              <button
                key={item.id}
                type="button"
                className="uf-listitem"
                onClick={() => flyToMarker(item.slug)}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 10,
                  borderRadius: 10,
                  textAlign: "left",
                  border: isActive ? "2px solid #2e6b3a" : "1px solid transparent",
                  background: isActive ? "#e2ecda" : "transparent",
                  cursor: "pointer",
                  alignItems: "center",
                  fontFamily: "inherit",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <PlantImage slug={item.slug} alt={plant.commonName} rounded radius={9} style={{ display: "block", width: 46, height: 46, borderRadius: 9, overflow: "hidden", flex: "0 0 auto" }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {plant.scientificName}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#8a9682" }}>{zone?.name} · {item.tag}</div>
                </div>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: LAYER_COLORS[item.layer], flexShrink: 0, marginLeft: "auto" }} />
              </button>
            );
          })}
        </div>
      </aside>

      <div className="uf-map-view" style={{ position: "relative", overflow: "hidden", background: "#dfe8d2" }}>
        <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 500, display: "flex", flexDirection: "column", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          <button type="button" className="uf-zoom" onClick={() => handleZoom(1)} style={{ border: "none", background: "#fff", color: "#3f4a3a", width: 42, height: 42, fontSize: 22, cursor: "pointer", borderBottom: "1px solid #eee" }} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="uf-zoom" onClick={() => handleZoom(-1)} style={{ border: "none", background: "#fff", color: "#3f4a3a", width: 42, height: 42, fontSize: 22, cursor: "pointer" }} aria-label="Zoom out">
            −
          </button>
        </div>

        <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 500, background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 4px 14px rgba(0,0,0,.15)", fontSize: 13 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Legend</div>
          {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => (
            <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: LAYER_COLORS[layer] }} /> {LAYER_LABELS[layer]}
            </div>
          ))}
        </div>

        {selectedPlant && selectedMarker && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              zIndex: 500,
              width: "min(300px, calc(100% - 32px))",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 18px 40px rgba(0,0,0,.25)",
              overflow: "hidden",
            }}
          >
            <PlantImage slug={selectedPlant.slug} alt={selectedPlant.commonName} style={{ display: "block", width: "100%", height: 120 }} />
            <div style={{ padding: 14 }}>
              <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 17, fontWeight: 600 }}>{selectedPlant.scientificName}</div>
              <div style={{ fontSize: 13, color: "#3f4a3a", marginTop: 3 }}>{selectedPlant.commonName} · {selectedPlant.family}</div>
              <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 6 }}>
                📍 {getZoneById(selectedMarker.zoneId)?.name} · {selectedMarker.tag}
              </div>
              <Link href={`/species/${selectedPlant.slug}`} style={{ display: "block", textAlign: "center", marginTop: 12, background: "#2e6b3a", color: "#fff", padding: 9, borderRadius: 8, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
                View full species page ›
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
