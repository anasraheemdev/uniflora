import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlantImage } from "@/components/ui/PlantImage";
import { color, font } from "@/lib/theme";
import { getAllFamilies, getFamilyBySlug, getPlantsByFamily, getRelatedFamilies } from "@/lib/data";

export async function generateStaticParams() {
  const families = await getAllFamilies();
  return families.map((f) => ({ slug: f.slug }));
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: 24, margin: "0 0 16px", color: color.ink }}>
      {children}
    </h2>
  );
}

export default async function FamilyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const family = await getFamilyBySlug(slug);
  if (!family) notFound();

  const [plantsByFamily, related] = await Promise.all([getPlantsByFamily(family.name), getRelatedFamilies(family)]);
  const plants = plantsByFamily.sort(
    (a, b) => b.occurrences - a.occurrences || a.scientificName.localeCompare(b.scientificName),
  );

  const stats = [
    { label: "Species on campus", value: String(family.speciesCount) },
    { label: "Genera", value: String(family.generaCount) },
    { label: "Plants mapped", value: String(family.occurrences) },
    { label: "Cultivated / wild", value: `${family.cultivated} / ${family.wild}` },
  ];

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="families" />

      <div style={{ background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`, color: "#fff" }}>
        <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 30, paddingBottom: 40 }}>
          <div className="uf-breadcrumb" style={{ fontSize: 13.5, color: color.onDarkMuted, fontWeight: 600 }}>
            <Link href="/" style={{ color: color.onDarkMuted, textDecoration: "none" }}>Home</Link>
            {" "}&nbsp;/&nbsp;{" "}
            <Link href="/families" style={{ color: color.onDarkMuted, textDecoration: "none" }}>Families</Link>
            {" "}&nbsp;/&nbsp;{" "}
            <span style={{ color: "#fff" }}>{family.name}</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, marginBottom: 12 }}>
            {family.order && (
              <span style={{ background: "rgba(182,134,45,.22)", color: color.onDarkGold, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>Order: {family.order}</span>
            )}
            {family.commonName && (
              <span style={{ background: "rgba(255,255,255,.12)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{family.commonName}</span>
            )}
            {family.habits.slice(0, 3).map((habit) => (
              <span key={habit} style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.85)", fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: 6 }}>{habit}</span>
            ))}
          </div>

          <h1 className="uf-page-title" style={{ fontFamily: font.display, fontWeight: 600, margin: "0 0 10px", color: "#fff" }}>
            {family.name}
          </h1>
          <p style={{ color: "rgba(255,255,255,.86)", fontSize: "clamp(15px, 2.5vw, 17.5px)", margin: 0, maxWidth: 720, lineHeight: 1.6 }}>
            {family.description ??
              `Recorded in the campus floristic survey with ${family.speciesCount} species across ${family.generaCount} genera.`}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, marginTop: 30 }}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: font.display, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: color.onDarkMuted, marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="uf-page-pad uf-split-species" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 36, paddingBottom: 64 }}>
        <div>
          {family.characteristics.length > 0 && (
            <section style={{ marginBottom: 34 }}>
              <SectionHeading>Key characteristics</SectionHeading>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 16, lineHeight: 1.8, color: color.inkSoft }}>
                {family.characteristics.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          {family.distribution && (
            <section style={{ marginBottom: 34 }}>
              <SectionHeading>Distribution</SectionHeading>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: color.inkSoft, margin: 0 }}>{family.distribution}</p>
            </section>
          )}

          <section style={{ marginBottom: 34 }}>
            <SectionHeading>Species on campus ({plants.length})</SectionHeading>
            <div className="uf-grid-2" style={{ gap: 16 }}>
              {plants.map((plant) => (
                <Link
                  key={plant.slug}
                  className="uf-card"
                  href={`/species/${plant.slug}`}
                  style={{ display: "flex", gap: 14, background: "#fff", border: `1px solid ${color.border}`, borderRadius: 14, overflow: "hidden", textDecoration: "none", color: "inherit" }}
                >
                  <PlantImage slug={plant.slug} type={plant.type} alt={plant.commonName} style={{ width: 110, flex: "0 0 110px", minHeight: 110 }} />
                  <div style={{ padding: "14px 14px 14px 0", minWidth: 0 }}>
                    <div style={{ fontFamily: font.display, fontStyle: "italic", fontWeight: 600, fontSize: 16 }}>{plant.scientificName}</div>
                    {plant.localNames.length > 0 && (
                      <div style={{ fontSize: 14, color: color.inkSoft, marginTop: 4 }}>{plant.localNames.join(", ")}</div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, alignItems: "center" }}>
                      <span style={{ background: plant.badgeColor, color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>{plant.type}</span>
                      <span style={{ fontSize: 12, color: color.faint }}>{plant.growthStatus}</span>
                      {plant.occurrences > 0 && (
                        <span style={{ fontSize: 12, color: color.forest600, fontWeight: 600 }}>{plant.occurrences} mapped</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading>Genera on campus ({family.generaCount})</SectionHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {family.genera.map((genus) => (
                <span key={genus} style={{ background: color.parchmentDeep, border: `1px solid ${color.borderStrong}`, padding: "8px 14px", borderRadius: 999, fontSize: 14, fontStyle: "italic", fontFamily: font.display }}>
                  {genus}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="uf-species-sidebar" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17, marginBottom: 12 }}>On this campus</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: color.inkSoft, margin: 0 }}>
              {family.occurrences > 0 ? (
                <>
                  <b>{family.occurrences}</b> individual plant{family.occurrences === 1 ? "" : "s"} from this family were
                  pinned by GPS during the floristic survey, spread across {family.speciesCount} species.
                </>
              ) : (
                <>
                  This family is on the campus floristic list but none of its species were pinned during the GPS
                  mapping survey — most are small herbs and grasses recorded by presence rather than position.
                </>
              )}
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${color.borderStrong}`, fontSize: 13.5, color: color.inkSoft }}>
              <span><b style={{ color: color.forest600 }}>{family.cultivated}</b> cultivated</span>
              <span><b style={{ color: color.forest600 }}>{family.wild}</b> wild</span>
            </div>
          </div>

          {family.economicUses.length > 0 && (
            <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17, marginBottom: 14 }}>Economic &amp; cultural uses</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7, color: color.inkSoft }}>
                {family.economicUses.map((use) => (
                  <li key={use}>{use}</li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17, marginBottom: 14 }}>
                {family.order ? `Related families (${family.order})` : "Families of similar size"}
              </div>
              {related.map((r) => (
                <Link key={r.slug} href={`/families/${r.slug}`} style={{ display: "block", padding: "10px 0", borderBottom: `1px solid ${color.borderStrong}`, textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: color.faint }}>{r.commonName ?? `${r.speciesCount} species on campus`}</div>
                </Link>
              ))}
            </div>
          )}

          <Link href="/explore" className="uf-btn-primary" style={{ display: "block", textAlign: "center", padding: 14, borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
            Explore all plants →
          </Link>
          <Link href="/map" className="uf-btn-secondary" style={{ display: "block", textAlign: "center", padding: 14, borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
            View on campus map →
          </Link>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
