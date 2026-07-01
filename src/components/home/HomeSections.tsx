"use client";

import Link from "next/link";
import { useAnimatedStats } from "@/components/ui/AnimatedCounters";
import { PlantImage } from "@/components/ui/PlantImage";
import { RECENT_PLANTS } from "@/data/plants";
import { HERO_IMAGE } from "@/lib/images";

export function HomeStats() {
  const { s, f, l, i } = useAnimatedStats(true);

  return (
    <>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{s}</div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{f}</div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{l}</div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{i.toLocaleString()}</div>
    </>
  );
}

export function HomeStatsGrid() {
  const { s, f, l, i } = useAnimatedStats(true);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 18px" }}>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{s}</div>
        <div style={{ fontSize: 13.5, color: "#6b7360", marginTop: 4 }}>Species</div>
      </div>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{f}</div>
        <div style={{ fontSize: 13.5, color: "#6b7360", marginTop: 4 }}>Families</div>
      </div>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{l}</div>
        <div style={{ fontSize: 13.5, color: "#6b7360", marginTop: 4 }}>Locations Mapped</div>
      </div>
      <div>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
          <circle cx="12" cy="13" r="3.2" />
        </svg>
        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{i.toLocaleString()}</div>
        <div style={{ fontSize: 13.5, color: "#6b7360", marginTop: 4 }}>Images</div>
      </div>
    </div>
  );
}

export function HeroBackground() {
  return (
    <PlantImage
      src={HERO_IMAGE}
      alt="Campus landscape"
      priority
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

export function RecentPlants() {
  return (
    <div className="uf-grid-5">
      {RECENT_PLANTS.map((plant) => (
        <Link
          key={plant.slug}
          href={`/species/${plant.slug}`}
          className="uf-plant"
          style={{
            background: "#ffffff",
            border: "1px solid #e6e1cf",
            borderRadius: 14,
            overflow: "hidden",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <PlantImage
            slug={plant.slug}
            alt={plant.commonName}
            style={{ display: "block", width: "100%", height: 118 }}
          />
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{plant.scientificName}</div>
            <div style={{ fontSize: 13, color: "#3f4a3a", marginTop: 6 }}>{plant.commonName}</div>
            <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 3 }}>{plant.family}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
