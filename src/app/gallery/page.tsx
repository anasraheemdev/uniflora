import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlantImage } from "@/components/ui/PlantImage";
import { PLANTS, STATS } from "@/data/plants";

/** Varied tile heights keep the masonry layout from looking like a plain grid. */
const HEIGHTS = [260, 340, 220, 300, 320, 240, 280, 300, 230, 270, 250, 310];

export default function GalleryPage() {
  const photographed = PLANTS.filter((p) => p.hasImage);
  const remaining = STATS.species - photographed.length;

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active={null} />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Gallery"
        title="Photo Gallery"
        description={
          <>
            A visual archive of the campus flora.{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{photographed.length}</span> of{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.species}</span> surveyed species have been
            photographed so far.
          </>
        }
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 40px 64px" }}>
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
                  <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 15, fontWeight: 600 }}>
                    {plant.scientificName}
                  </div>
                  <div style={{ fontSize: 12, color: "#c3d4bf" }}>
                    {plant.localNames[0] ? `${plant.localNames[0]} · ` : ""}
                    {plant.family}
                  </div>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px dashed #d8d2bb", borderRadius: 16, padding: "30px 28px", marginTop: 26, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 21, marginBottom: 8 }}>
            {remaining} species still need a photograph
          </div>
          <p style={{ fontSize: 15, color: "#5a6553", lineHeight: 1.6, margin: "0 auto 20px", maxWidth: 560 }}>
            The floristic survey recorded far more species than we have images for. Students and staff can help complete
            the archive by submitting field photographs.
          </p>
          <Link href="/dashboard/student/submit" style={{ background: "#2e6b3a", color: "#fff", padding: "12px 22px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
            Submit a photograph →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
