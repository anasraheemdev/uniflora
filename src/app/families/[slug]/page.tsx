import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlantImage } from "@/components/ui/PlantImage";
import {
  FAMILIES,
  getFamilyBySlug,
  getPlantsByFamily,
  getRelatedFamilies,
} from "@/data/families";

export function generateStaticParams() {
  return FAMILIES.map((f) => ({ slug: f.slug }));
}

export default async function FamilyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const family = getFamilyBySlug(slug);
  if (!family) notFound();

  const plants = getPlantsByFamily(family.name);
  const campusGenera = [...new Set(plants.map((p) => p.genus))];
  const related = getRelatedFamilies(family);

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="families" />

      <div style={{ background: "#12341f", color: "#fff" }}>
        <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 28, paddingBottom: 36 }}>
          <div style={{ fontSize: 13.5, color: "#8fb890", fontWeight: 600 }}>
            <Link href="/" style={{ color: "#8fb890", textDecoration: "none" }}>Home</Link>
            {" "}&nbsp;/&nbsp;{" "}
            <Link href="/families" style={{ color: "#8fb890", textDecoration: "none" }}>Families</Link>
            {" "}&nbsp;/&nbsp;{" "}
            <span style={{ color: "#fff" }}>{family.name}</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, marginBottom: 12 }}>
            <span style={{ background: "rgba(127,191,107,.25)", color: "#a7d493", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>Order: {family.order}</span>
            <span style={{ background: "rgba(255,255,255,.12)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{family.commonName}</span>
          </div>

          <h1 className="uf-page-title" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, margin: "0 0 10px", color: "#fff" }}>
            {family.name}
          </h1>
          <p style={{ color: "rgba(255,255,255,.85)", fontSize: "clamp(15px, 2.5vw, 17px)", margin: 0, maxWidth: 720, lineHeight: 1.6 }}>{family.description}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
            {[
              { label: "On campus", value: String(plants.length) },
              { label: "Campus genera", value: String(campusGenera.length) },
              { label: "Total species", value: String(family.species) },
              { label: "Total genera", value: String(family.genera) },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "#8fb890", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="uf-page-pad uf-split-species" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 32, paddingBottom: 60 }}>
        <div>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 16px" }}>Key characteristics</h2>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 16, lineHeight: 1.8, color: "#33402f" }}>
              {family.characteristics.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 12px" }}>Distribution</h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#33402f", margin: 0 }}>{family.distribution}</p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 16px" }}>Campus species ({plants.length})</h2>
            {plants.length === 0 ? (
              <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, padding: 28, color: "#6b7360", fontSize: 15 }}>
                No species from this family are in the current campus catalogue yet. Check back as the herbarium grows.
              </div>
            ) : (
              <div className="uf-grid-2" style={{ gap: 16 }}>
                {plants.map((plant) => (
                  <Link
                    key={plant.slug}
                    className="uf-card"
                    href={`/species/${plant.slug}`}
                    style={{
                      display: "flex",
                      gap: 14,
                      background: "#fff",
                      border: "1px solid #e6e1cf",
                      borderRadius: 14,
                      overflow: "hidden",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <PlantImage slug={plant.slug} alt={plant.commonName} style={{ width: 110, flex: "0 0 110px", minHeight: 110 }} />
                    <div style={{ padding: "14px 14px 14px 0", minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: 16 }}>{plant.scientificName}</div>
                      <div style={{ fontSize: 14, color: "#3f4a3a", marginTop: 4 }}>{plant.commonName}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                        <span style={{ background: plant.badgeColor, color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>{plant.type}</span>
                        <span style={{ fontSize: 12, color: "#8a9682" }}>{plant.nativeStatus}</span>
                        {plant.medicinal && (
                          <span style={{ background: "#f2e6d0", color: "#96702b", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>Medicinal</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {campusGenera.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 16px" }}>Genera on campus</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {campusGenera.map((genus) => (
                  <span key={genus} style={{ background: "#eef0e2", border: "1px solid #e0e2cf", padding: "8px 14px", borderRadius: 999, fontSize: 14, fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>
                    {genus}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="uf-species-sidebar" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Campus notes</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#33402f", margin: 0 }}>{family.campusNotes}</p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Economic &amp; cultural uses</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: "#33402f" }}>
              {family.economicUses.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </div>

          {related.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Related families ({family.order})</div>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/families/${r.slug}`}
                  style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f0ecdd", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: "#8a9682" }}>{r.commonName}</div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/explore"
            style={{
              display: "block",
              textAlign: "center",
              background: "#2e6b3a",
              color: "#fff",
              padding: 14,
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14.5,
            }}
          >
            Explore all plants →
          </Link>
          <Link
            href="/map"
            style={{
              display: "block",
              textAlign: "center",
              background: "#fff",
              color: "#2e6b3a",
              border: "1px solid #e6e1cf",
              padding: 14,
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14.5,
            }}
          >
            View on campus map →
          </Link>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
