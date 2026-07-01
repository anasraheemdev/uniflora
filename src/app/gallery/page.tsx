import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlantImage } from "@/components/ui/PlantImage";
import { PLANTS } from "@/data/plants";

const GALLERY_ITEMS = [
  { slug: "azadirachta-indica", height: 260, caption: "Flowers · Spring · A. Rehman" },
  { slug: "bougainvillea-glabra", height: 340, caption: "Flowers · S. Iqbal" },
  { slug: "ficus-religiosa", height: 220, caption: "Leaf · M. Zahra" },
  { slug: "cassia-fistula", height: 300, caption: "Flowers · Monsoon" },
  { slug: "delonix-regia", height: 320, caption: "Flowers · Summer" },
  { slug: "calliandra-haematocephala", height: 240, caption: "Flowers · A. Rehman" },
  { slug: "terminalia-arjuna", height: 280, caption: "Bark · S. Iqbal" },
  { slug: "ocimum-tenuiflorum", height: 210, caption: "Habit · M. Zahra" },
  { slug: "nerium-oleander", height: 300, caption: "Flowers · Spring" },
  { slug: "jasminum-sambac", height: 230, caption: "Flowers · A. Rehman" },
  { slug: "pongamia-pinnata", height: 270, caption: "Fruit · Monsoon" },
  { slug: "acacia-nilotica", height: 250, caption: "Habitat · S. Iqbal" },
];

const FILTERS = ["All", "Flowers", "Leaves", "Fruits", "Bark", "Habitat", "Spring", "Monsoon"];

export default function GalleryPage() {
  const plantMap = Object.fromEntries(PLANTS.map((p) => [p.slug, p]));

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active={null} />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Gallery"
        title="Photo Gallery"
        description="A curated visual archive of campus flora — organised by species, habitat, flower colour, season and photographer."
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 40px 8px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {FILTERS.map((filter, i) => (
            <span
              key={filter}
              className="uf-fchip"
              style={{
                background: i === 0 ? "#2e6b3a" : "#fff",
                color: i === 0 ? "#fff" : "#3f4a3a",
                border: `1px solid ${i === 0 ? "#2e6b3a" : "#e6e1cf"}`,
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 40px 64px" }}>
        <div className="uf-gallery-masonry">
          {GALLERY_ITEMS.map((item) => {
            const plant = plantMap[item.slug];
            return (
              <figure key={item.slug + item.caption} className="uf-g" style={{ margin: "0 0 16px" }}>
                <PlantImage slug={item.slug} alt={plant?.commonName ?? item.slug} style={{ display: "block", width: "100%", height: item.height }} />
                <figcaption>
                  <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 15, fontWeight: 600 }}>{plant?.scientificName}</div>
                  <div style={{ fontSize: 12, color: "#c3d4bf" }}>{item.caption}</div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
