"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Canvas, CircleMarker, LayerGroup, Map as LeafletMap } from "leaflet";
import { PlantImage } from "@/components/ui/PlantImage";
import {
  CAMPUS_BOUNDS,
  CAMPUS_CENTER,
  CAMPUS_ZONES,
  CAMPUS_ZOOM,
  LAYER_COLORS,
  LAYER_COUNTS,
  LAYER_LABELS,
  PLANT_MARKERS,
  getZoneById,
  type MapLayer,
  type PlantMarker,
} from "@/data/campus-map";
import { STATS, getPlantBySlug } from "@/data/plants";
import "leaflet/dist/leaflet.css";

type BasemapStyle = "satellite" | "street";

type MapExplorerProps = {
  initialSlug?: string;
};

const MAX_ZOOM = 20;

/** Separate panes keep the marker canvas above the zone canvas so dots stay clickable. */
const ZONE_PANE = "uf-zones";
const MARKER_PANE = "uf-markers";

/**
 * `maxNativeZoom` is the deepest zoom each provider actually has tiles for over
 * this campus — Esri imagery of Sargodha stops at 18 and serves a "Map data not
 * yet available" placeholder beyond it, and OSM returns HTTP 400 above 19.
 * Setting it lets Leaflet upscale the last real tile instead of going blank.
 */
const TILES: Record<BasemapStyle, { url: string; attribution: string; maxNativeZoom: number }> = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxNativeZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxNativeZoom: 18,
  },
};

const numberFmt = new Intl.NumberFormat("en-US");

/** Below this width the controls move into a bottom sheet over a full-bleed map. */
const MOBILE_QUERY = "(max-width: 900px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isMobile;
}

/** Small circular ‹ › control used to step between individuals of a species. */
function stepButtonStyle(disabled: boolean): CSSProperties {
  return {
    width: 26,
    height: 26,
    flexShrink: 0,
    borderRadius: "50%",
    border: "1px solid #e6e1cf",
    background: "#fff",
    color: disabled ? "#c4ccb9" : "#2e6b3a",
    fontSize: 15,
    lineHeight: 1,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit",
  };
}

export function MapExplorer({ initialSlug }: MapExplorerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const zonesLayerRef = useRef<LayerGroup | null>(null);
  const rendererRef = useRef<Canvas | null>(null);
  const zoneRendererRef = useRef<Canvas | null>(null);
  const drawnRef = useRef<{ marker: CircleMarker; item: PlantMarker }[]>([]);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);
  const [search, setSearch] = useState("");
  const [basemap, setBasemap] = useState<BasemapStyle>("satellite");
  const [layers, setLayers] = useState<Record<MapLayer, boolean>>({ trees: true, shrubs: true, herbs: true });
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [zoom, setZoom] = useState(CAMPUS_ZOOM);
  /** Which individual of the selected species the map is currently parked on. */
  const [individualIndex, setIndividualIndex] = useState(0);
  const rowRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  /**
   * On phones the card and the collapsed sheet cover the bottom of the map, so
   * anything we frame has to be pushed up into the strip that's actually visible.
   */
  const overlayInset = isMobile ? 250 : 0;
  const fitPadding = useCallback(
    () => ({
      paddingTopLeft: [24, 24] as [number, number],
      paddingBottomRight: [24, 24 + overlayInset] as [number, number],
    }),
    [overlayInset],
  );

  const filteredMarkers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PLANT_MARKERS.filter((m) => {
      if (!layers[m.layer]) return false;
      if (activeZone && m.zoneId !== activeZone) return false;
      if (!q) return true;
      const plant = getPlantBySlug(m.slug);
      if (!plant) return false;
      return (
        plant.scientificName.toLowerCase().includes(q) ||
        plant.commonName.toLowerCase().includes(q) ||
        plant.family.toLowerCase().includes(q) ||
        plant.localNames.some((n) => n.toLowerCase().includes(q)) ||
        m.id.toLowerCase().includes(q)
      );
    });
  }, [search, layers, activeZone]);

  /** Sidebar lists species, not 3,000 individual pins. */
  const speciesRows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of filteredMarkers) counts.set(m.slug, (counts.get(m.slug) ?? 0) + 1);
    return [...counts.entries()]
      .map(([slug, count]) => ({ slug, count, plant: getPlantBySlug(slug)! }))
      .filter((row) => row.plant)
      .sort((a, b) => b.count - a.count || a.plant.scientificName.localeCompare(b.plant.scientificName));
  }, [filteredMarkers]);

  /** Every individual of the selected species, in map-record order. */
  const selectedMarkers = useMemo(
    () => (selectedSlug ? PLANT_MARKERS.filter((m) => m.slug === selectedSlug) : []),
    [selectedSlug],
  );

  /** Frame all individuals of a species — used by the sidebar list. */
  const focusSpecies = useCallback(async (slug: string) => {
    setSelectedSlug(slug);
    setIndividualIndex(0);
    // On a phone the sheet covers the map, so get out of the way of the result.
    setSheetOpen(false);

    const map = mapInstance.current;
    if (!map) return;
    const points = PLANT_MARKERS.filter((m) => m.slug === slug);
    if (points.length === 0) return;

    const L = (await import("leaflet")).default;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.flyToBounds(bounds, { ...fitPadding(), maxZoom: 19, duration: 0.7 });
  }, [fitPadding]);

  /** Dismiss the plant card and drop the highlight from the map. */
  const clearSelection = useCallback(() => {
    setSelectedSlug(null);
    setIndividualIndex(0);
    mapInstance.current?.closePopup();
  }, []);

  /** Step to one specific plant and open its record. */
  const goToIndividual = useCallback(
    (index: number) => {
      const target = selectedMarkers[index];
      const map = mapInstance.current;
      if (!target || !map) return;

      setIndividualIndex(index);
      const nextZoom = Math.max(map.getZoom(), 19);
      // Nudge the centre down so the plant sits above the card, not behind it.
      const projected = map.project([target.lat, target.lng], nextZoom).add([0, overlayInset / 2]);
      map.flyTo(map.unproject(projected, nextZoom), nextZoom, { duration: 0.6 });

      // Popup rides along with the marker, so open it before the flight starts.
      drawnRef.current.find((d) => d.item.id === target.id)?.marker.openPopup();
    },
    [selectedMarkers, overlayInset],
  );

  const focusZone = useCallback(async (zoneId: string | null) => {
    setActiveZone(zoneId);
    setSheetOpen(false);
    const map = mapInstance.current;
    if (!map) return;
    const L = (await import("leaflet")).default;
    if (!zoneId) {
      map.flyToBounds(L.latLngBounds(CAMPUS_BOUNDS), { ...fitPadding(), duration: 0.6 });
      return;
    }
    const zone = getZoneById(zoneId);
    if (zone) map.flyToBounds(L.latLngBounds(zone.polygon), { ...fitPadding(), duration: 0.6 });
  }, [fitPadding]);

  // --- map init -----------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: CAMPUS_CENTER,
        zoom: CAMPUS_ZOOM,
        minZoom: 15,
        maxZoom: MAX_ZOOM,
        zoomControl: false,
        maxBounds: L.latLngBounds(CAMPUS_BOUNDS).pad(0.6),
        maxBoundsViscosity: 0.7,
        preferCanvas: true,
        // Integer-only zoom makes fitBounds undershoot by up to a full step,
        // which wastes half the screen on a phone.
        zoomSnap: 0.25,
      });

      L.tileLayer(TILES.satellite.url, {
        attribution: TILES.satellite.attribution,
        maxZoom: MAX_ZOOM,
        maxNativeZoom: TILES.satellite.maxNativeZoom,
      }).addTo(map);

      // Zones and markers each get their own pane, and therefore their own
      // canvas element. Without this they share the overlay pane, the zone
      // canvas ends up stacked on top, and it swallows every click before the
      // marker canvas underneath ever sees it — layer `interactive: false` does
      // not help, because the interception happens at the DOM element level.
      map.createPane(ZONE_PANE);
      map.createPane(MARKER_PANE);
      const zonePane = map.getPane(ZONE_PANE)!;
      const markerPane = map.getPane(MARKER_PANE)!;
      zonePane.style.zIndex = "410";
      zonePane.style.pointerEvents = "none";
      markerPane.style.zIndex = "450";

      // A few px of tolerance makes the 5px dots comfortable to hit, especially
      // where co-located plants sit close together.
      rendererRef.current = L.canvas({ tolerance: 8, pane: MARKER_PANE });
      zoneRendererRef.current = L.canvas({ pane: ZONE_PANE });

      zonesLayerRef.current = L.layerGroup().addTo(map);
      markerLayerRef.current = L.layerGroup().addTo(map);

      map.on("zoomend", () => setZoom(map.getZoom()));

      // A fixed zoom shows far too little ground on a phone-width viewport, so
      // frame the campus itself and let the zoom fall out of the container size.
      if (window.matchMedia(MOBILE_QUERY).matches) {
        map.fitBounds(L.latLngBounds(CAMPUS_BOUNDS), { paddingTopLeft: [16, 16], paddingBottomRight: [16, 80] });
        setZoom(map.getZoom());
      }

      mapInstance.current = map;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
      markerLayerRef.current = null;
      zonesLayerRef.current = null;
      drawnRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapReady && initialSlug) focusSpecies(initialSlug);
  }, [mapReady, initialSlug, focusSpecies]);

  // --- basemap ------------------------------------------------------------
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    (async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstance.current!;
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) map.removeLayer(layer);
      });
      const tile = TILES[basemap];
      L.tileLayer(tile.url, {
        attribution: tile.attribution,
        maxZoom: MAX_ZOOM,
        maxNativeZoom: tile.maxNativeZoom,
      }).addTo(map);
    })();
  }, [basemap, mapReady]);

  // --- markers (canvas circles keep 3k pins smooth) ------------------------
  useEffect(() => {
    if (!mapReady || !markerLayerRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !markerLayerRef.current) return;

      markerLayerRef.current.clearLayers();
      drawnRef.current = [];

      for (const item of filteredMarkers) {
        const plant = getPlantBySlug(item.slug);
        if (!plant) continue;

        const marker = L.circleMarker([item.lat, item.lng], {
          radius: 5,
          color: "#ffffff",
          weight: 1.2,
          opacity: 0.9,
          fillColor: LAYER_COLORS[item.layer],
          fillOpacity: 0.9,
          renderer: rendererRef.current ?? undefined,
          pane: MARKER_PANE,
          interactive: true,
          bubblingMouseEvents: false,
        });

        // Name on hover, so plants can be identified without clicking through
        // three thousand dots.
        marker.bindTooltip(
          `<i>${plant.scientificName}</i>${plant.localNames[0] ? ` · ${plant.localNames[0]}` : ""}`,
          { direction: "top", offset: [0, -6], className: "uf-map-plant-tip", opacity: 1 },
        );

        // Built on demand — eagerly stringifying 3k popups is wasted work.
        marker.bindPopup(
          () =>
            `<div class="uf-map-popup">
              <strong style="font-style:italic;font-family:Georgia,serif">${plant.scientificName}</strong>
              <div style="font-size:13px;color:#3f4a3a;margin-top:4px">${
                plant.localNames[0] ? `${plant.localNames[0]} · ` : ""
              }${plant.family}</div>
              <div style="font-size:12px;color:#8a9682;margin-top:6px">${
                getZoneById(item.zoneId)?.shortName ?? ""
              } · Record ${item.id}</div>
              <div style="font-size:12px;color:#8a9682;margin-top:2px">${plant.type} · ${plant.growthStatus}</div>
              <a href="/species/${plant.slug}" style="display:block;text-align:center;margin-top:10px;background:#2e6b3a;color:#fff;padding:8px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none">View species ›</a>
            </div>`,
          { maxWidth: 280, className: "uf-leaflet-popup" },
        );

        marker.on("click", () => {
          setSelectedSlug(item.slug);
          const position = PLANT_MARKERS.filter((m) => m.slug === item.slug).findIndex((m) => m.id === item.id);
          setIndividualIndex(position < 0 ? 0 : position);
        });

        marker.addTo(markerLayerRef.current);
        drawnRef.current.push({ marker, item });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filteredMarkers, mapReady]);

  // Rotating a phone or the URL bar collapsing resizes the map container, and
  // Leaflet only recomputes its canvas when told to.
  useEffect(() => {
    if (!mapReady) return;
    const el = mapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => mapInstance.current?.invalidateSize({ animate: false }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mapReady]);

  // Escape is the reflex for dismissing a floating panel.
  useEffect(() => {
    if (!selectedSlug && !sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (sheetOpen) setSheetOpen(false);
      else clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedSlug, sheetOpen, clearSelection]);

  // Clicking a plant on the map should reveal it in the sidebar list too.
  useEffect(() => {
    if (!selectedSlug) return;
    // Pointless (and jumpy) while the mobile sheet is collapsed out of sight.
    if (isMobile && !sheetOpen) return;
    rowRefs.current.get(selectedSlug)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedSlug, isMobile, sheetOpen]);

  // --- selection styling (restyle in place, never rebuild) -----------------
  useEffect(() => {
    for (const { marker, item } of drawnRef.current) {
      const isSelected = selectedSlug === item.slug;
      marker.setStyle({
        radius: isSelected ? 8 : 5,
        weight: isSelected ? 2.5 : 1.2,
        color: isSelected ? "#12341f" : "#ffffff",
        fillOpacity: selectedSlug && !isSelected ? 0.35 : 0.9,
      });
      if (isSelected) marker.bringToFront();
    }
  }, [selectedSlug, filteredMarkers]);

  // --- zone polygons ------------------------------------------------------
  useEffect(() => {
    if (!mapReady || !zonesLayerRef.current) return;
    zonesLayerRef.current.clearLayers();
    if (!showZones) return;

    (async () => {
      const L = (await import("leaflet")).default;
      if (!zonesLayerRef.current) return;

      for (const zone of CAMPUS_ZONES) {
        const dimmed = activeZone !== null && activeZone !== zone.id;
        L.polygon(zone.polygon, {
          color: zone.color,
          weight: dimmed ? 1 : 2,
          fillColor: zone.color,
          fillOpacity: dimmed ? 0.04 : 0.1,
          dashArray: "6 4",
          // Zones blanket every marker, so they must never absorb a click; the
          // sidebar chips select zones instead.
          interactive: false,
          renderer: zoneRendererRef.current ?? undefined,
          pane: ZONE_PANE,
        })
          // "Campus" on every label just collides with its neighbours.
          .bindTooltip(zone.shortName.replace(" Campus", ""), {
            permanent: true,
            direction: "center",
            className: "uf-map-zone-label",
          })
          .addTo(zonesLayerRef.current);
      }
    })();
  }, [showZones, mapReady, activeZone]);

  const handleZoom = (delta: number) => {
    if (delta > 0) mapInstance.current?.zoomIn();
    else mapInstance.current?.zoomOut();
  };

  const selectedPlant = selectedSlug ? getPlantBySlug(selectedSlug) : null;
  const selectedCount = selectedMarkers.length;
  const currentIndividual = selectedMarkers[individualIndex] ?? selectedMarkers[0] ?? null;

  return (
    <div className={`uf-page-pad uf-split-map${sheetOpen ? " uf-sheet-open" : ""}`}>
      {/* Tap-away target for the mobile sheet; inert on desktop. */}
      <button type="button" className="uf-sheet-scrim" aria-hidden={!sheetOpen} tabIndex={-1} onClick={() => setSheetOpen(false)} />

      {/* Scrolling is left to CSS: the panel is a bottom sheet on phones and a
          fixed-height column on desktop, and each owns a different scroll region. */}
      <aside className="uf-map-panel" style={{ background: "#fbf9f1", borderRight: "1px solid #e6e1cf" }}>
        {/* Collapsed handle doubles as the button that opens the sheet. */}
        <button
          type="button"
          className="uf-sheet-handle"
          onClick={() => setSheetOpen((v) => !v)}
          aria-expanded={sheetOpen}
          aria-label={sheetOpen ? "Hide filters and species" : "Show filters and species"}
        >
          <span className="uf-sheet-grip" />
          <span className="uf-sheet-handle-row">
            <span className="uf-sheet-handle-label">{sheetOpen ? "Hide filters" : "Filters & species"}</span>
            <span className="uf-sheet-handle-count">
              {numberFmt.format(speciesRows.length)} species · {numberFmt.format(filteredMarkers.length)} plants
            </span>
            <svg className="uf-sheet-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
            </svg>
          </span>
        </button>

        <div className="uf-map-panel-inner">
          <h1 className="uf-map-title" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 26, margin: "0 0 4px" }}>Campus Map</h1>
          <p className="uf-map-intro" style={{ fontSize: 14, color: "#6b7360", margin: "0 0 18px", lineHeight: 1.55 }}>
            <b style={{ color: "#2e6b3a" }}>{numberFmt.format(STATS.locations)}</b> individual plants pinned by GPS across{" "}
            <b style={{ color: "#2e6b3a" }}>{CAMPUS_ZONES.length}</b> campus zones. Tap a marker or pick a species below.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 10, padding: "9px 12px", marginBottom: 18 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search species, family, local name…"
              /* 16px keeps iOS Safari from zooming the viewport on focus. */
              style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "inherit", background: "transparent", minWidth: 0 }}
            />
          </div>

          <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", marginBottom: 10 }}>Basemap</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {(["satellite", "street"] as BasemapStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setBasemap(style)}
                style={{
                  flex: 1,
                  border: basemap === style ? "2px solid #2e6b3a" : "1px solid #e6e1cf",
                  background: basemap === style ? "#e2ecda" : "#fff",
                  color: "#1e2b1f",
                  padding: "11px 12px",
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

          <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", marginBottom: 10 }}>Growth form</div>
          {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => (
            <label key={layer} className="uf-layer" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={layers[layer]}
                onChange={() => setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))}
                style={{ accentColor: "#2e6b3a", width: 16, height: 16 }}
              />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: LAYER_COLORS[layer] }} /> {LAYER_LABELS[layer]}
              <span style={{ marginLeft: "auto", color: "#8a9682", fontSize: 13 }}>{numberFmt.format(LAYER_COUNTS[layer])}</span>
            </label>
          ))}

          <label className="uf-layer" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginTop: 4 }}>
            <input type="checkbox" checked={showZones} onChange={() => setShowZones((v) => !v)} style={{ accentColor: "#2e6b3a", width: 16, height: 16 }} />
            Show zone outlines
          </label>

          <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", margin: "18px 0 10px" }}>Zones</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button
              type="button"
              className="uf-zone-chip"
              onClick={() => focusZone(null)}
              style={{
                padding: "6px 11px",
                borderRadius: 999,
                border: activeZone === null ? "1px solid #2e6b3a" : "1px solid #e6e1cf",
                background: activeZone === null ? "#2e6b3a" : "#fff",
                color: activeZone === null ? "#fff" : "#3f4a3a",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              All
            </button>
            {CAMPUS_ZONES.map((zone) => {
              const active = activeZone === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  className="uf-zone-chip"
                  onClick={() => focusZone(active ? null : zone.id)}
                  title={`${zone.plantCount} plants`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 11px",
                    borderRadius: 999,
                    border: active ? "1px solid #2e6b3a" : "1px solid #e6e1cf",
                    background: active ? "#e2ecda" : "#fff",
                    color: "#3f4a3a",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: zone.color }} />
                  {zone.shortName.replace(" Campus", "")}
                </button>
              );
            })}
          </div>

          <div style={{ height: 1, background: "#e6e1cf", margin: "20px 0" }} />
          <div style={{ fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#8a9682", marginBottom: 4 }}>
            Species in view ({speciesRows.length})
          </div>
          <div style={{ fontSize: 12.5, color: "#8a9682", marginBottom: 10 }}>
            {numberFmt.format(filteredMarkers.length)} plants shown
          </div>

          <div className="uf-species-scroll" style={{ display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }}>
            {speciesRows.length === 0 && (
              <div style={{ fontSize: 14, color: "#8a9682", padding: "14px 4px" }}>No plants match these filters.</div>
            )}
            {speciesRows.map(({ slug, count, plant }) => {
              const isActive = selectedSlug === slug;
              return (
                <div key={slug} style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="uf-listitem"
                    ref={(el) => {
                      if (el) rowRefs.current.set(slug, el);
                      else rowRefs.current.delete(slug);
                    }}
                    onClick={() => focusSpecies(slug)}
                    title={`Show all ${count} on the map`}
                    style={{
                      display: "flex",
                      gap: 11,
                      padding: 9,
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
                    <PlantImage
                      slug={slug}
                      type={plant.type}
                      alt={plant.commonName}
                      rounded
                      radius={9}
                      style={{ display: "block", width: 42, height: 42, borderRadius: 9, overflow: "hidden", flex: "0 0 auto" }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {plant.scientificName}
                      </div>
                      <div style={{ fontSize: 12, color: "#8a9682", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {plant.localNames[0] ?? plant.family}
                      </div>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#2e6b3a", flexShrink: 0 }}>{count}</span>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: LAYER_COLORS[plant.layer], flexShrink: 0 }} />
                  </button>

                  {isActive && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px 10px 62px" }}>
                      <button
                        type="button"
                        onClick={() => goToIndividual((individualIndex - 1 + selectedMarkers.length) % selectedMarkers.length)}
                        disabled={selectedMarkers.length < 2}
                        aria-label="Previous individual"
                        style={stepButtonStyle(selectedMarkers.length < 2)}
                      >
                        ‹
                      </button>
                      <span style={{ fontSize: 12, color: "#5a6553", whiteSpace: "nowrap" }}>
                        Plant {Math.min(individualIndex + 1, selectedMarkers.length)} of {selectedMarkers.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => goToIndividual((individualIndex + 1) % selectedMarkers.length)}
                        disabled={selectedMarkers.length < 2}
                        aria-label="Next individual"
                        style={stepButtonStyle(selectedMarkers.length < 2)}
                      >
                        ›
                      </button>
                      <Link
                        href={`/species/${slug}`}
                        style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#2e6b3a", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        Details →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="uf-map-view" style={{ position: "relative", overflow: "hidden", background: "#dfe8d2" }}>
        <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

        <div className="uf-map-zoom" style={{ position: "absolute", top: 16, right: 16, zIndex: 500, display: "flex", flexDirection: "column", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          <button type="button" className="uf-zoom" onClick={() => handleZoom(1)} style={{ border: "none", background: "#fff", color: "#3f4a3a", width: 44, height: 44, fontSize: 22, cursor: "pointer", borderBottom: "1px solid #eee" }} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="uf-zoom" onClick={() => handleZoom(-1)} style={{ border: "none", background: "#fff", color: "#3f4a3a", width: 44, height: 44, fontSize: 22, cursor: "pointer" }} aria-label="Zoom out">
            −
          </button>
        </div>

        <div className="uf-map-legend" style={{ position: "absolute", bottom: 16, right: 16, zIndex: 500, background: "#fff", borderRadius: 12, padding: "13px 15px", boxShadow: "0 4px 14px rgba(0,0,0,.15)", fontSize: 13, maxWidth: 220 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Legend</div>
          {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => (
            <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: LAYER_COLORS[layer] }} /> {LAYER_LABELS[layer]}
            </div>
          ))}
          <div style={{ fontSize: 11.5, color: "#8a9682", lineHeight: 1.45, marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0ecdd" }}>
            Field GPS readings are recorded to the nearest arc-second, so plants sharing a reading are spread slightly to
            stay individually selectable.
          </div>
          {zoom > TILES[basemap].maxNativeZoom && (
            <div style={{ fontSize: 11.5, color: "#96702b", background: "#f7efdd", borderRadius: 7, padding: "7px 9px", lineHeight: 1.45, marginTop: 8 }}>
              Past the sharpest {basemap} imagery for this area (zoom {TILES[basemap].maxNativeZoom}), so tiles are
              enlarged. Marker positions stay accurate.
            </div>
          )}
        </div>

        {selectedPlant && (
          <div className="uf-map-card" style={{ position: "absolute", bottom: 16, left: 16, zIndex: 500, width: "min(300px, calc(100% - 32px))", background: "#fff", borderRadius: 14, boxShadow: "0 18px 40px rgba(0,0,0,.25)", overflow: "hidden" }}>
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Close"
              title="Close"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1,
                width: 28,
                height: 28,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,.92)",
                color: "#3f4a3a",
                fontSize: 17,
                lineHeight: 1,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 2px 8px rgba(0,0,0,.2)",
              }}
            >
              ×
            </button>
            <div className="uf-map-card-media">
              <PlantImage
                slug={selectedPlant.slug}
                type={selectedPlant.type}
                alt={selectedPlant.commonName}
                style={{ display: "block", width: "100%", height: "100%" }}
              />
            </div>
            <div className="uf-map-card-body" style={{ padding: 14 }}>
              <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 17, fontWeight: 600 }}>{selectedPlant.scientificName}</div>
              <div style={{ fontSize: 13, color: "#3f4a3a", marginTop: 3 }}>
                {selectedPlant.localNames[0] ? `${selectedPlant.localNames[0]} · ` : ""}
                {selectedPlant.family}
              </div>
              <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 6 }}>
                {selectedCount} mapped on campus · {selectedPlant.type} · {selectedPlant.growthStatus}
              </div>

              {currentIndividual && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid #f0ecdd" }}>
                  <button
                    type="button"
                    onClick={() => goToIndividual((individualIndex - 1 + selectedCount) % selectedCount)}
                    disabled={selectedCount < 2}
                    aria-label="Previous individual"
                    style={stepButtonStyle(selectedCount < 2)}
                  >
                    ‹
                  </button>
                  <div style={{ fontSize: 12, color: "#5a6553", lineHeight: 1.35, flex: 1, textAlign: "center" }}>
                    <div style={{ fontWeight: 600 }}>Record {currentIndividual.id}</div>
                    <div style={{ color: "#8a9682" }}>{getZoneById(currentIndividual.zoneId)?.shortName}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToIndividual((individualIndex + 1) % selectedCount)}
                    disabled={selectedCount < 2}
                    aria-label="Next individual"
                    style={stepButtonStyle(selectedCount < 2)}
                  >
                    ›
                  </button>
                </div>
              )}

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
