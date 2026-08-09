"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Family } from "@/data/families";

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
      <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 26, paddingBottom: 6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 18 }}>
          <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 10, padding: "10px 14px" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search families or genera…"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", background: "transparent" }}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{ border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 12px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#3f4a3a" }}
          >
            <option value="name">Sort: A–Z</option>
            <option value="species">Sort: most species</option>
            <option value="mapped">Sort: most mapped plants</option>
          </select>

          <div style={{ fontSize: 14, color: "#6b7360" }}>
            <b style={{ color: "#1e2b1f" }}>{filtered.length}</b> of {families.length} families ·{" "}
            <b style={{ color: "#2e6b3a" }}>{totalSpecies}</b> species
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            type="button"
            onClick={() => setActiveLetter(null)}
            style={{
              height: 34,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              borderRadius: 8,
              background: activeLetter === null ? "#2e6b3a" : "#fbf9f1",
              border: `1px solid ${activeLetter === null ? "#2e6b3a" : "#e6e1cf"}`,
              fontSize: 13,
              fontWeight: 600,
              color: activeLetter === null ? "#fff" : "#3f4a3a",
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
              onClick={() => setActiveLetter(letter === activeLetter ? null : letter)}
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: letter === activeLetter ? "#2e6b3a" : "#fbf9f1",
                border: `1px solid ${letter === activeLetter ? "#2e6b3a" : "#e6e1cf"}`,
                fontSize: 14,
                fontWeight: 600,
                color: letter === activeLetter ? "#fff" : "#3f4a3a",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 20, paddingBottom: 64 }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, padding: 40, textAlign: "center", color: "#6b7360" }}>
            No families match your search. Try a different letter or keyword.
          </div>
        ) : (
          <div className="uf-grid-3">
            {filtered.map((family) => (
              <Link
                key={family.slug}
                className="uf-card"
                href={`/families/${family.slug}`}
                style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, padding: 22, textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "#e2ecda", display: "flex", alignItems: "center", justifyContent: "center", color: "#2e6b3a", flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    </svg>
                  </div>
                  {family.order && (
                    <span style={{ background: "#eef0e2", color: "#6b7360", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6, letterSpacing: 0.3 }}>{family.order}</span>
                  )}
                </div>

                <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 21, marginTop: 14 }}>{family.name}</div>
                {family.commonName && <div style={{ fontSize: 13.5, color: "#8a9682", marginTop: 2 }}>{family.commonName}</div>}

                <p style={{ fontSize: 13.5, color: "#6b7360", lineHeight: 1.5, margin: "12px 0 0", flex: 1 }}>
                  {family.description
                    ? family.description.slice(0, 150) + (family.description.length > 150 ? "…" : "")
                    : `${family.habits.join(", ")} · ${family.cultivated} cultivated, ${family.wild} wild.`}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 16, paddingTop: 14, borderTop: "1px solid #f0ecdd", fontSize: 13, color: "#3f4a3a" }}>
                  <span>
                    <b style={{ fontSize: 16 }}>{family.speciesCount}</b> species
                  </span>
                  <span>
                    <b style={{ fontSize: 16 }}>{family.generaCount}</b> genera
                  </span>
                  <span>
                    <b style={{ fontSize: 16, color: "#2e6b3a" }}>{family.occurrences}</b> mapped
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
