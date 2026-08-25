import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlantImage } from "@/components/ui/PlantImage";
import { color, font } from "@/lib/theme";
import { getAllPlants, getStats } from "@/lib/data";

/** Varied tile heights keep the masonry layout from looking like a plain grid. */
const HEIGHTS = [260, 340, 220, 300, 320, 240, 280, 300, 230, 270, 250, 310];

export default async function GalleryPage() {
  const [plants, stats] = await Promise.all([getAllPlants(), getStats()]);
  const photographed = plants.filter((p) => p.hasImage);
  const remaining = stats.species - photographed.length;

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active={null} />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Gallery"
        kicker="Visual archive"
        title="Photo Gallery"
        description={
          <>
            A visual archive of the campus flora.{" "}
            <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{photographed.length}</span> of{" "}
            <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{stats.species}</span> surveyed species have been
            photographed so far.
          </>
        }
      />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "34px 40px 72px" }}>
        <div className="uf-gallery-masonry">
          {photographed.map((plant, i) => (
            <Link key={plant.slug} href={`/species/${plant.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <figure className="uf-g" style={{ margin: "0 0 16px" }}>
                <PlantImage
                  slug={plant.slug}
                  type={plant.type}
                  alt={plant.commonName}
                  style={{ display: "block", width: "100%", height: HEIGHTS[i % HEIGHTS.length] }}
                />
                <figcaption>
                  <div style={{ fontFamily: font.display, fontStyle: "italic", fontSize: 15.5, fontWeight: 600 }}>
                    {plant.scientificName}
                  </div>
                  <div style={{ fontSize: 12, color: color.onDarkMuted }}>
                    {plant.localNames[0] ? `${plant.localNames[0]} · ` : ""}
                    {plant.family}
                  </div>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>

        <div style={{ background: "#fff", border: `1px dashed ${color.borderStrong}`, borderRadius: 18, padding: "34px 28px", marginTop: 30, textAlign: "center" }}>
          <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 22, marginBottom: 9 }}>
            {remaining} species still need a photograph
          </div>
          <p style={{ fontSize: 15, color: color.muted, lineHeight: 1.6, margin: "0 auto 22px", maxWidth: 560 }}>
            The floristic survey recorded far more species than we have images for. Students and staff can help complete
            the archive by submitting field photographs.
          </p>
          <Link href="/dashboard/student/submit" className="uf-btn-primary" style={{ padding: "13px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5, display: "inline-block" }}>
            Submit a photograph →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
