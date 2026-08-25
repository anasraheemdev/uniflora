import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { FamiliesBrowser } from "@/components/families/FamiliesBrowser";
import { color, font } from "@/lib/theme";
import { getAllFamilies, getFamilyLetters, getFeaturedFamilies, getStats } from "@/lib/data";

export default async function FamiliesPage() {
  const [families, letters, featured, stats] = await Promise.all([
    getAllFamilies(),
    getFamilyLetters(),
    getFeaturedFamilies(3),
    getStats(),
  ]);

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="families" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Families"
        kicker="Taxonomic index"
        title="Plant Families"
        description={
          <>
            Browse the campus flora by taxonomic family — from legumes and figs to mints and palms.{" "}
            <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{families.length} families indexed</span> ·{" "}
            <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{stats.species} species</span> documented.
          </>
        }
      />

      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 40, paddingBottom: 8 }}>
        <SectionKicker>Largest on campus</SectionKicker>
        <div className="uf-grid-3" style={{ gap: 16, marginTop: 14 }}>
          {featured.map((f) => (
            <Link
              key={f.slug}
              href={`/families/${f.slug}`}
              style={{
                background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`,
                borderRadius: 16,
                padding: "22px 24px",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: color.onDarkGold, textTransform: "uppercase" }}>Featured family</div>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 23, marginTop: 8 }}>{f.name}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.78)", marginTop: 5 }}>
                {f.speciesCount} species · {f.occurrences} plants mapped
              </div>
            </Link>
          ))}
        </div>
      </div>

      <FamiliesBrowser families={families} letters={letters} />

      <Footer />
    </div>
  );
}
