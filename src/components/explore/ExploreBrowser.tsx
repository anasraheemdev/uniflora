"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PlantImage } from "@/components/ui/PlantImage";
import { FAMILIES } from "@/data/families";
import { PLANTS, PLANT_TYPES, type GrowthStatus, type LifeForm, type PlantType } from "@/data/plants";

type SortKey = "name" | "family" | "mapped";

const PAGE_SIZE = 24;

const TYPE_COUNTS = PLANT_TYPES.map((type) => ({
  type,
  count: PLANTS.filter((p) => p.type === type).length,
})).filter((entry) => entry.count > 0);

const labelStyle = {
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: 0.5,
  textTransform: "uppercase" as const,
  color: "#3f4a3a",
  marginBottom: 12,
};

const dividerStyle = { height: 1, background: "#e6e1cf", margin: "22px 0" };

export function ExploreBrowser() {
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<Set<PlantType>>(new Set());
  const [family, setFamily] = useState("all");
  const [status, setStatus] = useState<GrowthStatus | "all">("all");
  const [lifeForm, setLifeForm] = useState<LifeForm | "all">("all");
  const [mappedOnly, setMappedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("name");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    const rows = PLANTS.filter((plant) => {
      if (types.size > 0 && !types.has(plant.type)) return false;
      if (family !== "all" && plant.family !== family) return false;
      if (status !== "all" && plant.growthStatus !== status) return false;
      if (lifeForm !== "all" && plant.lifeForm !== lifeForm) return false;
      if (mappedOnly && plant.occurrences === 0) return false;
      if (!q) return true;
      return (
        plant.scientificName.toLowerCase().includes(q) ||
        plant.family.toLowerCase().includes(q) ||
        plant.genus.toLowerCase().includes(q) ||
        plant.localNames.some((n) => n.toLowerCase().includes(q))
      );
    });

    return rows.sort((a, b) => {
      if (sort === "mapped") return b.occurrences - a.occurrences || a.scientificName.localeCompare(b.scientificName);
      if (sort === "family") return a.family.localeCompare(b.family) || a.scientificName.localeCompare(b.scientificName);
      return a.scientificName.localeCompare(b.scientificName);
    });
  }, [search, types, family, status, lifeForm, mappedOnly, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, types, family, status, lifeForm, mappedOnly, sort]);

  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = results.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, results.length);

  const toggleType = (type: PlantType) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const resetAll = () => {
    setSearch("");
    setTypes(new Set());
    setFamily("all");
    setStatus("all");
    setLifeForm("all");
    setMappedOnly(false);
    setSort("name");
  };

  const pageNumbers = buildPageList(page, pageCount);

  /** Shown on the mobile toggle so collapsed filters are never silently active. */
  const activeFilterCount =
    types.size +
    (family !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (lifeForm !== "all" ? 1 : 0) +
    (mappedOnly ? 1 : 0);

  return (
    <div className="uf-page-pad uf-split-explore" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 32, paddingBottom: 64 }}>
      <aside className="uf-sticky-aside" style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 10, padding: "9px 12px" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Species, genus, local name…"
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "transparent", minWidth: 0 }}
          />
        </div>

        {/* On a phone the full filter stack pushes every result below the fold,
            so it collapses behind this toggle. Hidden on desktop via CSS. */}
        <button
          type="button"
          className="uf-filter-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <span>
            Filters
            {activeFilterCount > 0 && <span className="uf-filter-badge">{activeFilterCount}</span>}
          </span>
          <svg className="uf-filter-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div className={`uf-filter-body${filtersOpen ? " uf-open" : ""}`}>
        <div style={dividerStyle} />
        <div style={labelStyle}>Growth form</div>
        {TYPE_COUNTS.map(({ type, count }) => (
          <label key={type} className="uf-filter" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "5px 0", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={types.has(type)}
              onChange={() => toggleType(type)}
              style={{ accentColor: "#2e6b3a", width: 16, height: 16 }}
            />
            {type}
            <span style={{ marginLeft: "auto", color: "#8a9682", fontSize: 13 }}>{count}</span>
          </label>
        ))}

        <div style={dividerStyle} />
        <div style={labelStyle}>Family</div>
        <select
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: 10, fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#3f4a3a" }}
        >
          <option value="all">All families ({FAMILIES.length})</option>
          {FAMILIES.map((f) => (
            <option key={f.slug} value={f.name}>
              {f.name} ({f.speciesCount})
            </option>
          ))}
        </select>

        <div style={dividerStyle} />
        <div style={labelStyle}>On campus</div>
        {(["all", "Cultivated", "Wild"] as const).map((option) => (
          <label key={option} className="uf-filter" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "5px 0", cursor: "pointer" }}>
            <input
              type="radio"
              name="growth-status"
              checked={status === option}
              onChange={() => setStatus(option)}
              style={{ accentColor: "#2e6b3a", width: 16, height: 16 }}
            />
            {option === "all" ? "All" : option}
          </label>
        ))}

        <div style={dividerStyle} />
        <div style={labelStyle}>Life form</div>
        {(["all", "Annual", "Perennial"] as const).map((option) => (
          <label key={option} className="uf-filter" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "5px 0", cursor: "pointer" }}>
            <input
              type="radio"
              name="life-form"
              checked={lifeForm === option}
              onChange={() => setLifeForm(option)}
              style={{ accentColor: "#2e6b3a", width: 16, height: 16 }}
            />
            {option === "all" ? "All" : option}
          </label>
        ))}

        <div style={dividerStyle} />
        <label className="uf-filter" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={mappedOnly}
            onChange={() => setMappedOnly((v) => !v)}
            style={{ accentColor: "#2e6b3a", width: 16, height: 16 }}
          />
          Only species pinned on the map
        </label>

        <button
          type="button"
          className="uf-btn"
          onClick={resetAll}
          style={{ width: "100%", marginTop: 24, background: "#fff", color: "#2e6b3a", border: "1px solid #e6e1cf", padding: 12, borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Reset filters
        </button>
        </div>
      </aside>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 14.5, color: "#6b7360" }}>
            Showing <span style={{ fontWeight: 700, color: "#1e2b1f" }}>{from}–{to}</span> of{" "}
            <span style={{ fontWeight: 700, color: "#1e2b1f" }}>{results.length}</span> species
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: "#6b7360" }}>Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{ border: "1px solid #e6e1cf", borderRadius: 9, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#3f4a3a" }}
            >
              <option value="name">Scientific name (A–Z)</option>
              <option value="family">Family</option>
              <option value="mapped">Most mapped on campus</option>
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, padding: 48, textAlign: "center", color: "#6b7360" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#3f4a3a", marginBottom: 6 }}>No species match these filters</div>
            Try widening your search or resetting the filters.
          </div>
        ) : (
          <div className="uf-grid-4">
            {visible.map((plant) => (
              <Link
                key={plant.slug}
                className="uf-card"
                href={`/species/${plant.slug}`}
                style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, overflow: "hidden", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative" }}>
                  <PlantImage slug={plant.slug} type={plant.type} alt={plant.commonName} style={{ display: "block", width: "100%", height: 150 }} />
                  <span style={{ position: "absolute", top: 10, left: 10, background: plant.badgeColor, color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 9px", borderRadius: 6 }}>{plant.type}</span>
                  {plant.occurrences > 0 && (
                    <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(18,52,31,.82)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 9px", borderRadius: 6 }}>
                      {plant.occurrences} mapped
                    </span>
                  )}
                </div>
                <div style={{ padding: 15, flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 16, fontWeight: 600 }}>{plant.scientificName}</div>
                  {plant.localNames.length > 0 && (
                    <div style={{ fontSize: 13.5, color: "#3f4a3a", marginTop: 5 }}>{plant.localNames[0]}</div>
                  )}
                  <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 3 }}>
                    {plant.family} · {plant.growthStatus}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36, flexWrap: "wrap" }}>
            <button
              type="button"
              className="uf-tab"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={pageButtonStyle(false, page === 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
            {pageNumbers.map((entry, i) =>
              entry === "…" ? (
                <span key={`gap-${i}`} style={{ color: "#8a9682", padding: "0 4px" }}>…</span>
              ) : (
                <button key={entry} type="button" className="uf-tab" onClick={() => setPage(entry)} style={pageButtonStyle(entry === page, false)}>
                  {entry}
                </button>
              ),
            )}
            <button
              type="button"
              className="uf-tab"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              style={pageButtonStyle(false, page === pageCount)}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function pageButtonStyle(active: boolean, disabled: boolean) {
  return {
    width: 38,
    height: 38,
    borderRadius: 9,
    border: active ? "none" : "1px solid #e6e1cf",
    background: active ? "#2e6b3a" : "#fff",
    color: active ? "#fff" : disabled ? "#c3c8ba" : "#3f4a3a",
    cursor: disabled ? "default" : "pointer",
    fontWeight: active ? 700 : 500,
    fontFamily: "inherit",
    fontSize: 14,
  };
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}
