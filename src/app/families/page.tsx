import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { FamiliesBrowser } from "@/components/families/FamiliesBrowser";
import { FAMILIES, FAMILY_LETTERS, getFeaturedFamilies } from "@/data/families";
import { STATS } from "@/data/plants";

export default function FamiliesPage() {
  const featured = getFeaturedFamilies(3);

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="families" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Families"
        title="Plant Families"
        description={
          <>
            Browse the campus flora by taxonomic family — from legumes and figs to mints and palms.{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{FAMILIES.length} families indexed</span> ·{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.species} species</span> documented.
          </>
        }
      />

      <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 8, paddingBottom: 8 }}>
        <div className="uf-grid-3" style={{ gap: 16 }}>
          {featured.map((f) => (
            <Link
              key={f.slug}
              href={`/families/${f.slug}`}
              style={{
                background: "linear-gradient(135deg,#12341f,#1a4a2c)",
                borderRadius: 14,
                padding: "20px 22px",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#8fb890", textTransform: "uppercase" }}>Featured family</div>
              <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 22, marginTop: 6 }}>{f.name}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.8)", marginTop: 4 }}>
                {f.speciesCount} species · {f.occurrences} plants mapped
              </div>
            </Link>
          ))}
        </div>
      </div>

      <FamiliesBrowser families={FAMILIES} letters={FAMILY_LETTERS} />

      <Footer />
    </div>
  );
}
