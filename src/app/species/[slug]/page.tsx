import Link from "next/link";
import { notFound } from "next/navigation";
import { PlantAssistant } from "@/components/assistant/PlantAssistant";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlantImage } from "@/components/ui/PlantImage";
import { PLANTS, getPlantBySlug } from "@/data/plants";
import { getFamilyByName, familySlugFromName } from "@/data/families";
import { getMarkersBySlug, getZoneById } from "@/data/campus-map";

export function generateStaticParams() {
  return PLANTS.map((plant) => ({ slug: plant.slug }));
}

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-playfair), 'Playfair Display', serif",
        fontWeight: 600,
        fontSize: 24,
        margin: "0 0 16px",
      }}
    >
      {children}
    </h2>
  );
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = getPlantBySlug(slug);
  if (!plant) notFound();

  const family = getFamilyByName(plant.family);
  const markers = getMarkersBySlug(plant.slug);
  const zones = plant.zones.map((id) => getZoneById(id)).filter(Boolean);

  const quickFacts: { label: string; value: string; href?: string; italic?: boolean; green?: boolean }[] = [
    { label: "Family", value: plant.family, href: `/families/${familySlugFromName(plant.family)}` },
    { label: "Genus", value: plant.genus, italic: true },
    ...(plant.order ? [{ label: "Order", value: plant.order }] : []),
    { label: "Habit", value: plant.habit },
    { label: "Life form", value: plant.lifeForm },
    { label: "Occurrence", value: plant.growthStatus, green: true },
    ...(plant.height ? [{ label: "Height", value: plant.height }] : []),
    ...(plant.habitat ? [{ label: "Habitat", value: plant.habitat }] : []),
    ...(plant.nativeStatus ? [{ label: "Origin", value: plant.nativeStatus }] : []),
    ...(plant.conservationStatus ? [{ label: "Conservation", value: plant.conservationStatus }] : []),
    { label: "Mapped individuals", value: String(plant.occurrences), green: true },
  ];

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="explore" />

      <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 22, paddingBottom: 0 }}>
        <div className="uf-breadcrumb" style={{ fontSize: 13.5, color: "#6b7360", fontWeight: 500 }}>
          <Link href="/" style={{ color: "#6b7360", textDecoration: "none" }}>Home</Link>
          {" "}&nbsp;/&nbsp;{" "}
          <Link href="/explore" style={{ color: "#6b7360", textDecoration: "none" }}>Explore Plants</Link>
          {" "}&nbsp;/&nbsp;{" "}
          <Link href={`/families/${familySlugFromName(plant.family)}`} style={{ color: "#6b7360", textDecoration: "none" }}>{plant.family}</Link>
          {" "}&nbsp;/&nbsp;{" "}
          <span style={{ color: "#2e6b3a", fontWeight: 600, fontStyle: "italic" }}>{plant.scientificName}</span>
        </div>
      </div>

      <div className="uf-page-pad uf-split-species" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 22, paddingBottom: 60 }}>
        <div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ background: "#e2ecda", color: "#2e6b3a", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.type}</span>
              <span style={{ background: "#dce9d4", color: "#3f6b2e", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.growthStatus}</span>
              <span style={{ background: "#eef0e2", color: "#6b7360", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.lifeForm}</span>
              {plant.medicinal && (
                <span style={{ background: "#f2e6d0", color: "#96702b", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>Medicinal</span>
              )}
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(28px, 6vw, 44px)", margin: 0, letterSpacing: -0.5 }}>
              {plant.scientificName}{" "}
              {plant.author && (
                <span style={{ fontStyle: "normal", fontSize: 20, color: "#8a9682", fontFamily: "var(--font-source-sans), 'Source Sans 3', sans-serif", fontWeight: 500 }}>{plant.author}</span>
              )}
            </h1>
            {plant.localNames.length > 0 && (
              <div style={{ fontSize: 18, color: "#3f4a3a", marginTop: 8 }}>{plant.localNames.join(" · ")}</div>
            )}
          </div>

          <PlantImage
            slug={plant.slug}
            type={plant.type}
            alt={plant.commonName}
            rounded
            radius={16}
            style={{ display: "block", width: "100%", height: "clamp(220px, 50vw, 420px)", borderRadius: 16, overflow: "hidden" }}
            priority
          />
          {!plant.hasImage && (
            <p style={{ fontSize: 13, color: "#8a9682", margin: "10px 2px 0" }}>
              No photograph on file for this species yet. Contributors can{" "}
              <Link href="/dashboard/student/submit" style={{ color: "#2e6b3a", fontWeight: 600 }}>submit one</Link>.
            </p>
          )}

          {plant.description.length > 0 ? (
            <div style={{ marginTop: 34 }}>
              <SectionHeading>Description</SectionHeading>
              {plant.description.map((para, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: "#33402f", margin: i === plant.description.length - 1 ? 0 : "0 0 14px" }}>{para}</p>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 34, background: "#fbf9f1", border: "1px dashed #d8d2bb", borderRadius: 14, padding: 22 }}>
              <SectionHeading>Description</SectionHeading>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "#5a6553", margin: 0 }}>
                A written profile for <i>{plant.scientificName}</i> has not been added yet. What we do know from the
                campus survey: it is {plant.lifeForm.toLowerCase()} {plant.habit.toLowerCase()} in the family{" "}
                <b>{plant.family}</b>, recorded as <b>{plant.growthStatus.toLowerCase()}</b> on campus
                {plant.occurrences > 0
                  ? ` with ${plant.occurrences} individual${plant.occurrences === 1 ? "" : "s"} mapped by GPS.`
                  : ", though no GPS records were logged for it during the mapping survey."}
              </p>
            </div>
          )}

          {plant.diagnosticCharacters.length > 0 && (
            <div style={{ marginTop: 30, background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 14, padding: 24 }}>
              <SectionHeading>Diagnostic Characters</SectionHeading>
              <div className="uf-grid-2" style={{ gap: "16px 28px" }}>
                {plant.diagnosticCharacters.map((dc) => (
                  <div key={dc.label}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#8a9682" }}>{dc.label}</div>
                    <div style={{ fontSize: 15, color: "#33402f", marginTop: 4 }}>{dc.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {plant.phenology && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>Phenology</SectionHeading>
              <div style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 14, padding: 22 }}>
                <div className="uf-phenology-scroll">
                  <div style={{ display: "grid", gridTemplateColumns: "90px repeat(12,1fr)", gap: 5, alignItems: "center", minWidth: 480 }}>
                    <div />
                    {MONTHS.map((m, i) => (
                      <div key={`${m}-${i}`} style={{ textAlign: "center", fontSize: 11, color: "#8a9682", fontWeight: 600 }}>{m}</div>
                    ))}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#3f4a3a" }}>Flowering</div>
                    {MONTHS.map((_, i) => (
                      <div key={`f-${i}`} style={{ height: 22, borderRadius: 5, background: plant.phenology!.flowering.includes(i) ? "#d76a95" : "#eee6d4" }} />
                    ))}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#3f4a3a" }}>Fruiting</div>
                    {MONTHS.map((_, i) => (
                      <div key={`fr-${i}`} style={{ height: 22, borderRadius: 5, background: plant.phenology!.fruiting.includes(i) ? "#c99a2e" : "#eee6d4" }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 13, color: "#6b7360", flexWrap: "wrap" }}>
                  {plant.phenology.floweringLabel && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#d76a95" }} /> {plant.phenology.floweringLabel}
                    </span>
                  )}
                  {plant.phenology.fruitingLabel && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#c99a2e" }} /> {plant.phenology.fruitingLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {plant.ethnobotany.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>Ethnobotany &amp; Uses</SectionHeading>
              <div className="uf-grid-2" style={{ gap: 14 }}>
                {plant.ethnobotany.map((item) => (
                  <div key={item.title} style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 12, padding: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#2e6b3a", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: "#33402f", lineHeight: 1.55 }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <PlantAssistant
            slug={plant.slug}
            commonName={plant.commonName}
            scientificName={plant.scientificName}
            medicinal={plant.medicinal}
          />

          <div style={{ marginTop: 30 }}>
            <SectionHeading>Where it grows on campus</SectionHeading>
            {markers.length === 0 ? (
              <div style={{ background: "#fbf9f1", border: "1px dashed #d8d2bb", borderRadius: 14, padding: 22, fontSize: 15, color: "#5a6553" }}>
                This species is on the campus floristic list but was not pinned during the GPS mapping survey, so it has
                no map records yet.
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                  {zones.map((zone) => (
                    <span key={zone!.id} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 999, padding: "7px 13px", fontSize: 13.5, color: "#3f4a3a" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: zone!.color }} />
                      {zone!.shortName}
                      <b style={{ color: "#2e6b3a" }}>
                        {markers.filter((m) => m.zoneId === zone!.id).length}
                      </b>
                    </span>
                  ))}
                </div>
                <Link href={`/map?species=${plant.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "linear-gradient(135deg,#12341f,#1a4a2c)", color: "#fff", borderRadius: 14, padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{plant.occurrences}</div>
                      <div style={{ fontSize: 13.5, color: "#8fb890", marginTop: 5 }}>
                        individuals mapped across {zones.length} zone{zones.length === 1 ? "" : "s"}
                      </div>
                    </div>
                    <span style={{ background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.25)", padding: "10px 16px", borderRadius: 9, fontSize: 13.5, fontWeight: 600 }}>
                      Show on campus map ›
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>

          {plant.references.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>References</SectionHeading>
              <ol style={{ fontSize: 14, lineHeight: 1.7, color: "#5a6553", paddingLeft: 20, margin: 0 }}>
                {plant.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside className="uf-species-sidebar" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Quick Facts</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {quickFacts.map((row, i) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: i < quickFacts.length - 1 ? "1px solid #f0ecdd" : "none", fontSize: 14 }}>
                  <span style={{ color: "#8a9682", flexShrink: 0 }}>{row.label}</span>
                  {row.href ? (
                    <Link href={row.href} className="uf-tap" style={{ fontWeight: 600, color: "#2e6b3a", textDecoration: "none", textAlign: "right" }}>{row.value}</Link>
                  ) : (
                    <span style={{ fontWeight: 600, fontStyle: row.italic ? "italic" : "normal", color: row.green ? "#2e6b3a" : "inherit", textAlign: "right" }}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {family && (
            <div style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>About {family.name}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "#33402f", margin: "0 0 14px" }}>
                {family.description
                  ? family.description.slice(0, 220) + (family.description.length > 220 ? "…" : "")
                  : `${family.speciesCount} species in ${family.generaCount} genera recorded on campus.`}
              </p>
              <Link href={`/families/${family.slug}`} className="uf-tap" style={{ fontSize: 14, fontWeight: 600, color: "#2e6b3a", textDecoration: "none" }}>
                View family page →
              </Link>
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Survey record</div>
            <p style={{ fontSize: 13.5, color: "#6b7360", lineHeight: 1.55, margin: 0 }}>
              Recorded in the university floristic survey. Habit, life form and cultivation status are taken directly
              from the botanical field list; positions come from GPS readings taken on campus.
            </p>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
