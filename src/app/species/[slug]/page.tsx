import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/icons";
import { PlantAssistant } from "@/components/assistant/PlantAssistant";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlantImage } from "@/components/ui/PlantImage";
import { color, font } from "@/lib/theme";
import {
  getAllPlants,
  getPlantBySlug,
  getFamilyByName,
  familySlugFromName,
  getMarkersBySpeciesSlug,
  getCampusZones,
  getZoneById,
} from "@/lib/data";

export async function generateStaticParams() {
  const plants = await getAllPlants();
  return plants.map((plant) => ({ slug: plant.slug }));
}

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const FLOWER_COLOR = "#c2578e";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: font.display,
        fontWeight: 600,
        fontSize: 24,
        margin: "0 0 16px",
        color: color.ink,
      }}
    >
      {children}
    </h2>
  );
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = await getPlantBySlug(slug);
  if (!plant) notFound();

  const [family, markers, campusZones] = await Promise.all([
    getFamilyByName(plant.family),
    getMarkersBySpeciesSlug(plant.slug),
    getCampusZones(),
  ]);
  const zones = plant.zones.map((id) => getZoneById(campusZones, id)).filter(Boolean);

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
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="explore" />

      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 22, paddingBottom: 0 }}>
        <div className="uf-breadcrumb" style={{ fontSize: 13.5, color: color.muted, fontWeight: 500 }}>
          <Link href="/" style={{ color: color.muted, textDecoration: "none" }}>Home</Link>
          {" "}&nbsp;/&nbsp;{" "}
          <Link href="/explore" style={{ color: color.muted, textDecoration: "none" }}>Explore Plants</Link>
          {" "}&nbsp;/&nbsp;{" "}
          <Link href={`/families/${familySlugFromName(plant.family)}`} style={{ color: color.muted, textDecoration: "none" }}>{plant.family}</Link>
          {" "}&nbsp;/&nbsp;{" "}
          <span style={{ color: color.forest600, fontWeight: 600, fontStyle: "italic" }}>{plant.scientificName}</span>
        </div>
      </div>

      <div className="uf-page-pad uf-split-species" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 22, paddingBottom: 64 }}>
        <div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ background: color.sage100, color: color.forest700, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.type}</span>
              <span style={{ background: color.statusApprovedBg, color: color.statusApprovedFg, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.growthStatus}</span>
              <span style={{ background: color.statusDraftBg, color: color.statusDraftFg, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.lifeForm}</span>
              {plant.medicinal && (
                <span style={{ background: color.gold100, color: color.gold700, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>Medicinal</span>
              )}
            </div>
            <h1 style={{ fontFamily: font.display, fontStyle: "italic", fontWeight: 600, fontSize: "clamp(28px, 6vw, 46px)", margin: 0, letterSpacing: "-0.01em" }}>
              {plant.scientificName}{" "}
              {plant.author && (
                <span style={{ fontStyle: "normal", fontSize: 20, color: color.faint, fontFamily: font.body, fontWeight: 500 }}>{plant.author}</span>
              )}
            </h1>
            {plant.localNames.length > 0 && (
              <div style={{ fontSize: 18, color: color.inkSoft, marginTop: 8 }}>{plant.localNames.join(" · ")}</div>
            )}
            {plant.synonyms.length > 0 && (
              <div style={{ fontSize: 13.5, color: color.faint, marginTop: 6, fontStyle: "italic" }}>
                Synonym{plant.synonyms.length > 1 ? "s" : ""}: {plant.synonyms.join("; ")}
              </div>
            )}
          </div>

          <PlantImage
            slug={plant.slug}
            type={plant.type}
            alt={plant.commonName}
            rounded
            radius={18}
            style={{ display: "block", width: "100%", height: "clamp(220px, 50vw, 420px)", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,40,25,.05), 0 16px 34px rgba(20,40,25,.1)" }}
            priority
          />
          {!plant.hasImage && (
            <p style={{ fontSize: 13, color: color.faint, margin: "10px 2px 0" }}>
              No photograph on file for this species yet. Contributors can{" "}
              <Link href="/dashboard/student/submit" style={{ color: color.forest600, fontWeight: 600 }}>submit one</Link>.
            </p>
          )}

          {plant.description.length > 0 ? (
            <div style={{ marginTop: 36 }}>
              <SectionHeading>Description</SectionHeading>
              {plant.description.map((para, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: color.inkSoft, margin: i === plant.description.length - 1 ? 0 : "0 0 14px" }}>{para}</p>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 36, background: color.parchmentDeep, border: `1px dashed ${color.borderStrong}`, borderRadius: 14, padding: 22 }}>
              <SectionHeading>Description</SectionHeading>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: color.inkSoft, margin: 0 }}>
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
            <div style={{ marginTop: 30, background: color.parchmentDeep, border: `1px solid ${color.border}`, borderRadius: 14, padding: 24 }}>
              <SectionHeading>Diagnostic Characters</SectionHeading>
              <div className="uf-grid-2" style={{ gap: "16px 28px" }}>
                {plant.diagnosticCharacters.map((dc) => (
                  <div key={dc.label}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: color.faint }}>{dc.label}</div>
                    <div style={{ fontSize: 15, color: color.inkSoft, marginTop: 4 }}>{dc.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(plant.nativeRange || plant.introducedRange || plant.regionalDistribution) && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>Distribution</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plant.nativeRange && (
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: color.inkSoft, margin: 0 }}>
                    <b style={{ color: color.forest600 }}>Native range:</b> {plant.nativeRange}
                  </p>
                )}
                {plant.introducedRange && (
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: color.inkSoft, margin: 0 }}>
                    <b style={{ color: color.forest600 }}>Introduced range:</b> {plant.introducedRange}
                  </p>
                )}
                {plant.regionalDistribution && (
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: color.inkSoft, margin: 0 }}>
                    <b style={{ color: color.forest600 }}>In Pakistan:</b> {plant.regionalDistribution}
                  </p>
                )}
              </div>
            </div>
          )}

          {plant.phenology && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>Phenology</SectionHeading>
              <div style={{ background: color.parchmentDeep, border: `1px solid ${color.border}`, borderRadius: 14, padding: 22 }}>
                <div className="uf-phenology-scroll">
                  <div style={{ display: "grid", gridTemplateColumns: "90px repeat(12,1fr)", gap: 5, alignItems: "center", minWidth: 480 }}>
                    <div />
                    {MONTHS.map((m, i) => (
                      <div key={`${m}-${i}`} style={{ textAlign: "center", fontSize: 11, color: color.faint, fontWeight: 600 }}>{m}</div>
                    ))}
                    <div style={{ fontSize: 13, fontWeight: 600, color: color.inkSoft }}>Flowering</div>
                    {MONTHS.map((_, i) => (
                      <div key={`f-${i}`} style={{ height: 22, borderRadius: 5, background: plant.phenology!.flowering.includes(i) ? FLOWER_COLOR : "#e9e2cd" }} />
                    ))}
                    <div style={{ fontSize: 13, fontWeight: 600, color: color.inkSoft }}>Fruiting</div>
                    {MONTHS.map((_, i) => (
                      <div key={`fr-${i}`} style={{ height: 22, borderRadius: 5, background: plant.phenology!.fruiting.includes(i) ? color.gold600 : "#e9e2cd" }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 13, color: color.muted, flexWrap: "wrap" }}>
                  {plant.phenology.floweringLabel && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: FLOWER_COLOR }} /> {plant.phenology.floweringLabel}
                    </span>
                  )}
                  {plant.phenology.fruitingLabel && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: color.gold600 }} /> {plant.phenology.fruitingLabel}
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
                {plant.ethnobotany.map((item, i) => (
                  <div key={`${item.title}-${i}`} style={{ background: color.parchmentDeep, border: `1px solid ${color.border}`, borderRadius: 12, padding: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: color.forest600, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: color.inkSoft, lineHeight: 1.55 }}>{item.text}</div>
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
              <div style={{ background: color.parchmentDeep, border: `1px dashed ${color.borderStrong}`, borderRadius: 14, padding: 22, fontSize: 15, color: color.inkSoft }}>
                This species is on the campus floristic list but was not pinned during the GPS mapping survey, so it has
                no map records yet.
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                  {zones.map((zone) => (
                    <span key={zone!.id} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${color.border}`, borderRadius: 999, padding: "7px 13px", fontSize: 13.5, color: color.inkSoft }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: zone!.color }} />
                      {zone!.shortName}
                      <b style={{ color: color.forest600 }}>
                        {markers.filter((m) => m.zoneId === zone!.id).length}
                      </b>
                    </span>
                  ))}
                </div>
                <Link href={`/map?species=${plant.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`, color: "#fff", borderRadius: 16, padding: "24px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 600, lineHeight: 1 }}>{plant.occurrences}</div>
                      <div style={{ fontSize: 13.5, color: color.onDarkMuted, marginTop: 6 }}>
                        individuals mapped across {zones.length} zone{zones.length === 1 ? "" : "s"}
                      </div>
                    </div>
                    <span className="uf-btn-outline-dark" style={{ padding: "11px 18px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      Show on campus map <ArrowRightIcon size={15} />
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>

          {plant.taxonomicNotes && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>Taxonomic Notes</SectionHeading>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: color.inkSoft, margin: 0 }}>{plant.taxonomicNotes}</p>
            </div>
          )}

          {plant.references.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <SectionHeading>References</SectionHeading>
              <ol style={{ fontSize: 14, lineHeight: 1.7, color: color.muted, paddingLeft: 20, margin: 0 }}>
                {plant.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside className="uf-species-sidebar" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17, marginBottom: 14 }}>Quick Facts</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {quickFacts.map((row, i) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: i < quickFacts.length - 1 ? `1px solid ${color.borderStrong}` : "none", fontSize: 14 }}>
                  <span style={{ color: color.faint, flexShrink: 0 }}>{row.label}</span>
                  {row.href ? (
                    <Link href={row.href} className="uf-tap" style={{ fontWeight: 600, color: color.forest600, textDecoration: "none", textAlign: "right" }}>{row.value}</Link>
                  ) : (
                    <span style={{ fontWeight: 600, fontStyle: row.italic ? "italic" : "normal", color: row.green ? color.forest600 : "inherit", textAlign: "right" }}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {family && (
            <div style={{ background: color.parchmentDeep, border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17, marginBottom: 8 }}>About {family.name}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: color.inkSoft, margin: "0 0 14px" }}>
                {family.description
                  ? family.description.slice(0, 220) + (family.description.length > 220 ? "…" : "")
                  : `${family.speciesCount} species in ${family.generaCount} genera recorded on campus.`}
              </p>
              <Link href={`/families/${family.slug}`} className="uf-tap" style={{ fontSize: 14, fontWeight: 600, color: color.forest600, textDecoration: "none" }}>
                View family page →
              </Link>
            </div>
          )}

          <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Survey record</div>
            <p style={{ fontSize: 13.5, color: color.muted, lineHeight: 1.55, margin: 0 }}>
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
