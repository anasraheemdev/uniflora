"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { color, font } from "@/lib/theme";
import type { Family } from "@/lib/data-types";

type SortKey = "name" | "species" | "mapped";

type FamiliesBrowserProps = {
  families: Family[];
  letters: string[];
};

export function FamiliesBrowser({ families, letters }: FamiliesBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = families.filter((f) => {
      if (activeLetter && f.letter !== activeLetter) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        (f.commonName?.toLowerCase().includes(q) ?? false) ||
        (f.order?.toLowerCase().includes(q) ?? false) ||
        f.genera.some((g) => g.toLowerCase().includes(q))
      );
    });

    return rows.sort((a, b) => {
      if (sort === "species") return b.speciesCount - a.speciesCount || a.name.localeCompare(b.name);
      if (sort === "mapped") return b.occurrences - a.occurrences || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [families, query, activeLetter, sort]);

  const totalSpecies = families.reduce((sum, f) => sum + f.speciesCount, 0);

  return (
    <>
      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 30, paddingBottom: 6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 18 }}>
          <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${color.border}`, borderRadius: 10, padding: "10px 14px" }}>
            <SearchIcon size={17} color={color.muted} strokeWidth={1.9} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search families or genera…"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", background: "transparent", color: color.ink }}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{ border: `1px solid ${color.border}`, borderRadius: 10, padding: "11px 12px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: color.inkSoft }}
          >
            <option value="name">Sort: A–Z</option>
            <option value="species">Sort: most species</option>
            <option value="mapped">Sort: most mapped plants</option>
          </select>

          <div style={{ fontSize: 14, color: color.muted }}>
            <b style={{ color: color.ink }}>{filtered.length}</b> of {families.length} families ·{" "}
            <b style={{ color: color.forest600 }}>{totalSpecies}</b> species
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            type="button"
            className="uf-az"
            onClick={() => setActiveLetter(null)}
            style={{
              height: 34,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              borderRadius: 8,
              background: activeLetter === null ? color.forest600 : color.parchmentDeep,
              border: `1px solid ${activeLetter === null ? color.forest600 : color.border}`,
              fontSize: 13,
              fontWeight: 600,
              color: activeLetter === null ? "#fff" : color.inkSoft,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            All
          </button>
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              className="uf-az"
              onClick={() => setActiveLetter(letter === activeLetter ? null : letter)}
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: letter === activeLetter ? color.forest600 : color.parchmentDeep,
                border: `1px solid ${letter === activeLetter ? color.forest600 : color.border}`,
                fontSize: 14,
                fontWeight: 600,
                color: letter === activeLetter ? "#fff" : color.inkSoft,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 22, paddingBottom: 72 }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 14, padding: 40, textAlign: "center", color: color.muted }}>
            No families match your search. Try a different letter or keyword.
          </div>
        ) : (
          <div className="uf-grid-3">
            {filtered.map((family) => (
              <Link
                key={family.slug}
                className="uf-card"
                href={`/families/${family.slug}`}
                style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 14, padding: 22, textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", boxShadow: "0 1px 2px rgba(20,40,25,.04)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: color.sage100, display: "flex", alignItems: "center", justifyContent: "center", color: color.forest600, flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    </svg>
                  </div>
                  {family.order && (
                    <span style={{ background: color.statusDraftBg, color: color.statusDraftFg, fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6, letterSpacing: 0.3 }}>{family.order}</span>
                  )}
                </div>

                <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 21, marginTop: 15 }}>{family.name}</div>
                {family.commonName && <div style={{ fontSize: 13.5, color: color.faint, marginTop: 2 }}>{family.commonName}</div>}

                <p style={{ fontSize: 13.5, color: color.muted, lineHeight: 1.5, margin: "12px 0 0", flex: 1 }}>
                  {family.description
                    ? family.description.slice(0, 150) + (family.description.length > 150 ? "…" : "")
                    : `${family.habits.join(", ")} · ${family.cultivated} cultivated, ${family.wild} wild.`}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${color.borderStrong}`, fontSize: 13, color: color.inkSoft }}>
                  <span>
                    <b style={{ fontSize: 16 }}>{family.speciesCount}</b> species
                  </span>
                  <span>
                    <b style={{ fontSize: 16 }}>{family.generaCount}</b> genera
                  </span>
                  <span>
                    <b style={{ fontSize: 16, color: color.forest600 }}>{family.occurrences}</b> mapped
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
