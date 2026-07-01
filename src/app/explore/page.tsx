import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlantImage } from "@/components/ui/PlantImage";
import { PLANTS, STATS } from "@/data/plants";
import { FAMILIES } from "@/data/families";

export default function ExplorePage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="explore" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Explore Plants"
        title="Explore Campus Flora"
        description={
          <>
            Browse every documented species by name, family, habit, habitat and more.{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.species} species</span> across{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.families} families</span>.
          </>
        }
      />

      <div className="uf-page-pad uf-split-explore" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 32, paddingBottom: 64 }}>
        <aside className="uf-sticky-aside" style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 10, padding: "9px 12px" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input type="text" placeholder="Search species…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "transparent" }} />
          </div>

          <div style={{ height: 1, background: "#e6e1cf", margin: "22px 0" }} />
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", color: "#3f4a3a", marginBottom: 12 }}>Plant Type</div>
          {[
            ["Big Trees", 86, true],
            ["Small Trees", 64, false],
            ["Palms", 21, false],
            ["Shrubs", 98, true],
            ["Herbs", 112, false],
            ["Climbers", 31, false],
            ["Medicinal", 74, false],
          ].map(([label, count, checked]) => (
            <label key={String(label)} className="uf-filter" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "5px 0", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={checked as boolean} style={{ accentColor: "#2e6b3a", width: 16, height: 16 }} /> {label}{" "}
              <span style={{ marginLeft: "auto", color: "#8a9682", fontSize: 13 }}>{count as number}</span>
            </label>
          ))}

          <div style={{ height: 1, background: "#e6e1cf", margin: "22px 0" }} />
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", color: "#3f4a3a", marginBottom: 12 }}>Family</div>
          <select style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: 10, fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#3f4a3a" }}>
            <option>All families</option>
            {FAMILIES.map((f) => (
              <option key={f.slug} value={f.slug}>{f.name}</option>
            ))}
          </select>

          <div style={{ height: 1, background: "#e6e1cf", margin: "22px 0" }} />
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", color: "#3f4a3a", marginBottom: 12 }}>Native / Exotic</div>
          {["All", "Native", "Exotic"].map((label, i) => (
            <label key={label} className="uf-filter" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "#3f4a3a", padding: "5px 0", cursor: "pointer" }}>
              <input type="radio" name="ne" defaultChecked={i === 0} style={{ accentColor: "#2e6b3a", width: 16, height: 16 }} /> {label}
            </label>
          ))}

          <div style={{ height: 1, background: "#e6e1cf", margin: "22px 0" }} />
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5, textTransform: "uppercase", color: "#3f4a3a", marginBottom: 12 }}>Flower Colour</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {["#fff", "#e8c141", "#d76a95", "#c0492f", "#8163a8", "#dd8a3a"].map((color) => (
              <span key={color} title={color} style={{ width: 26, height: 26, borderRadius: "50%", background: color, border: color === "#fff" ? "1px solid #d6d0bd" : "none", cursor: "pointer" }} />
            ))}
          </div>

          <button type="button" className="uf-btn" style={{ width: "100%", marginTop: 24, background: "#2e6b3a", color: "#fff", border: "none", padding: 12, borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Apply Filters</button>
        </aside>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 14.5, color: "#6b7360" }}>
              Showing <span style={{ fontWeight: 700, color: "#1e2b1f" }}>1–{PLANTS.length}</span> of <span style={{ fontWeight: 700, color: "#1e2b1f" }}>{STATS.species}</span> species
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, color: "#6b7360" }}>Sort by</span>
              <select style={{ border: "1px solid #e6e1cf", borderRadius: 9, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#3f4a3a" }}>
                <option>Scientific name (A–Z)</option>
                <option>Recently added</option>
                <option>Family</option>
                <option>Most viewed</option>
              </select>
            </div>
          </div>

          <div className="uf-grid-4">
            {PLANTS.map((plant) => (
              <Link key={plant.slug} className="uf-card" href={`/species/${plant.slug}`} style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative" }}>
                  <PlantImage slug={plant.slug} alt={plant.commonName} style={{ display: "block", width: "100%", height: 150 }} />
                  <span style={{ position: "absolute", top: 10, left: 10, background: plant.badgeColor, color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 6 }}>{plant.type}</span>
                </div>
                <div style={{ padding: 15 }}>
                  <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 16, fontWeight: 600 }}>{plant.scientificName}</div>
                  <div style={{ fontSize: 13.5, color: "#3f4a3a", marginTop: 5 }}>{plant.commonName}</div>
                  <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 3 }}>{plant.family} · {plant.nativeStatus}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36 }}>
            <button type="button" className="uf-tab" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid #e6e1cf", background: "#fff", color: "#6b7360", cursor: "pointer", fontFamily: "inherit" }}>‹</button>
            <button type="button" className="uf-tab" style={{ width: 38, height: 38, borderRadius: 9, border: "none", background: "#2e6b3a", color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>1</button>
            <button type="button" className="uf-tab" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid #e6e1cf", background: "#fff", color: "#3f4a3a", cursor: "pointer", fontFamily: "inherit" }}>2</button>
            <button type="button" className="uf-tab" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid #e6e1cf", background: "#fff", color: "#3f4a3a", cursor: "pointer", fontFamily: "inherit" }}>3</button>
            <span style={{ color: "#8a9682", padding: "0 4px" }}>…</span>
            <button type="button" className="uf-tab" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid #e6e1cf", background: "#fff", color: "#3f4a3a", cursor: "pointer", fontFamily: "inherit" }}>43</button>
            <button type="button" className="uf-tab" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid #e6e1cf", background: "#fff", color: "#6b7360", cursor: "pointer", fontFamily: "inherit" }}>›</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
