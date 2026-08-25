"use client";

import Image from "next/image";
import Link from "next/link";
import { useAnimatedStats, type Counts } from "@/components/ui/AnimatedCounters";
import { PlantImage } from "@/components/ui/PlantImage";
import { HERO_IMAGE } from "@/lib/images";
import type { Plant } from "@/lib/data-types";
import { color, font } from "@/lib/theme";

const STAT_ICONS: Record<string, React.ReactNode> = {
  species: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </>
  ),
  families: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  locations: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  genera: (
    <>
      <path d="M12 3v6" />
      <path d="M12 9c0 3-3 3-3 6a3 3 0 0 0 6 0c0-3-3-3-3-6Z" />
      <path d="M5 21h14" />
      <path d="M7 12H4m16 0h-3" />
    </>
  ),
};

function StatTile({ id, value, label }: { id: keyof typeof STAT_ICONS; value: string | number; label: string }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span
        style={{
          width: 44,
          height: 44,
          flex: "0 0 auto",
          borderRadius: 12,
          background: color.sage100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color.forest600} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {STAT_ICONS[id]}
        </svg>
      </span>
      <div>
        <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 600, lineHeight: 1, color: color.ink }}>{value}</div>
        <div style={{ fontSize: 13.5, color: color.muted, marginTop: 6, fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

export function HomeStatsGrid({ stats }: { stats: Counts }) {
  const { species, families, genera, locations } = useAnimatedStats(stats, true);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 20px" }}>
      <StatTile id="species" value={species} label="Species" />
      <StatTile id="families" value={families} label="Families" />
      <StatTile id="locations" value={locations.toLocaleString()} label="Plants Mapped" />
      <StatTile id="genera" value={genera} label="Genera" />
    </div>
  );
}

export function HeroBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Image
        src={HERO_IMAGE}
        alt="Campus landscape"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
        unoptimized
      />
    </div>
  );
}

export function RecentPlants({ plants }: { plants: Plant[] }) {
  return (
    <div className="uf-grid-5">
      {plants.map((plant) => (
        <Link
          key={plant.slug}
          href={`/species/${plant.slug}`}
          className="uf-plant"
          style={{
            background: color.surface,
            border: `1px solid ${color.border}`,
            borderRadius: 14,
            overflow: "hidden",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 1px 2px rgba(20,40,25,.04)",
          }}
        >
          <PlantImage
            slug={plant.slug}
            type={plant.type}
            alt={plant.commonName}
            style={{ display: "block", width: "100%", height: 122 }}
          />
          <div style={{ padding: 14 }}>
            <div style={{ fontFamily: font.display, fontStyle: "italic", fontWeight: 600, fontSize: 15.5, lineHeight: 1.25, color: color.ink }}>
              {plant.scientificName}
            </div>
            <div style={{ fontSize: 13, color: color.inkSoft, marginTop: 6, fontWeight: 500 }}>{plant.commonName}</div>
            <div style={{ fontSize: 12.5, color: color.faint, marginTop: 3 }}>{plant.family}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
