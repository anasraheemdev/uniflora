import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlantAssistant } from "@/components/assistant/PlantAssistant";
import { QrCodeSvg } from "@/components/icons";
import { QR_CODE_IMAGE } from "@/lib/images";
import { PlantImage } from "@/components/ui/PlantImage";
import { PLANTS, getPlantBySlug } from "@/data/plants";
import { getFamilyBySlug, familySlugFromName } from "@/data/families";

export function generateStaticParams() {
  return PLANTS.map((plant) => ({ slug: plant.slug }));
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = getPlantBySlug(slug);
  if (!plant) notFound();

  const family = getFamilyBySlug(familySlugFromName(plant.family));

  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="explore" />

      <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 22, paddingBottom: 0 }}>
        <div style={{ fontSize: 13.5, color: "#6b7360", fontWeight: 500 }}>
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
              <span style={{ background: "#dce9d4", color: "#3f6b2e", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>{plant.nativeStatus}</span>
              {plant.medicinal && (
                <span style={{ background: "#f2e6d0", color: "#96702b", fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6 }}>Medicinal</span>
              )}
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(28px, 6vw, 44px)", margin: 0, letterSpacing: -0.5 }}>
              {plant.scientificName}{" "}
              {plant.author && (
                <span style={{ fontStyle: "normal", fontSize: 22, color: "#8a9682", fontFamily: "var(--font-source-sans), 'Source Sans 3', sans-serif", fontWeight: 500 }}>{plant.author}</span>
              )}
            </h1>
            <div style={{ fontSize: 18, color: "#3f4a3a", marginTop: 8 }}>
              {plant.commonName}
              {plant.commonNames && plant.commonNames.length > 1 && ` · ${plant.commonNames.slice(1).join(" · ")}`}
              {plant.localName && (
                <>
                  {" "}· <span style={{ fontFamily: "serif" }}>{plant.localName}</span>
                </>
              )}
            </div>
          </div>

          <PlantImage slug={plant.slug} alt={plant.commonName} rounded radius={16} style={{ display: "block", width: "100%", height: "clamp(220px, 50vw, 420px)", borderRadius: 16, overflow: "hidden" }} priority />
          <div className="uf-species-thumbs" style={{ marginTop: 10 }}>
            {["Flower", "Leaf", "Fruit", "Bark", "Seed", "Habitat"].map((part) => (
              <PlantImage key={part} slug={plant.slug} alt={`${plant.commonName} ${part}`} className="uf-thumb" rounded radius={10} style={{ display: "block", width: "100%", height: 74, borderRadius: 10, overflow: "hidden" }} />
            ))}
          </div>

          <div style={{ marginTop: 34 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 12px" }}>Description</h2>
            {plant.description.map((para, i) => (
              <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: "#33402f", margin: i === plant.description.length - 1 ? 0 : "0 0 14px" }}>{para}</p>
            ))}
          </div>

          <div style={{ marginTop: 30, background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 22, margin: "0 0 16px" }}>Diagnostic Characters</h2>
            <div className="uf-grid-2" style={{ gap: "16px 28px" }}>
              {plant.diagnosticCharacters.map((dc) => (
                <div key={dc.label}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#8a9682" }}>{dc.label}</div>
                  <div style={{ fontSize: 15, color: "#33402f", marginTop: 4 }}>{dc.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 16px" }}>Phenology</h2>
            <div style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 14, padding: 22 }}>
              <div className="uf-phenology-scroll">
              <div style={{ display: "grid", gridTemplateColumns: "90px repeat(12,1fr)", gap: 5, alignItems: "center", minWidth: 480 }}>
                <div />
                {months.map((m, i) => (
                  <div key={`${m}-${i}`} style={{ textAlign: "center", fontSize: 11, color: "#8a9682", fontWeight: 600 }}>{m}</div>
                ))}
                <div style={{ fontSize: 13, fontWeight: 600, color: "#3f4a3a" }}>Flowering</div>
                {months.map((_, i) => (
                  <div key={`f-${i}`} style={{ height: 22, borderRadius: 5, background: plant.phenology.flowering.includes(i) ? "#d76a95" : "#eee6d4" }} />
                ))}
                <div style={{ fontSize: 13, fontWeight: 600, color: "#3f4a3a" }}>Fruiting</div>
                {months.map((_, i) => (
                  <div key={`fr-${i}`} style={{ height: 22, borderRadius: 5, background: plant.phenology.fruiting.includes(i) ? "#c99a2e" : "#eee6d4" }} />
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

          <div style={{ marginTop: 30 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 16px" }}>Ethnobotany &amp; Uses</h2>
            <div className="uf-grid-2" style={{ gap: 14 }}>
              {plant.ethnobotany.map((item) => (
                <div key={item.title} style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 12, padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#2e6b3a", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: "#33402f", lineHeight: 1.55 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          <PlantAssistant
            slug={plant.slug}
            commonName={plant.commonName}
            scientificName={plant.scientificName}
            medicinal={plant.medicinal}
          />

          <div style={{ marginTop: 30 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 16px" }}>Campus Distribution</h2>
            <Link href="/map" style={{ textDecoration: "none" }}>
              <div style={{ position: "relative", height: 230, borderRadius: 14, overflow: "hidden", border: "1px solid #e6e1cf", background: "linear-gradient(135deg,#dfe8d2,#cddcc0)" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
                {[
                  { top: "38%", left: "28%" },
                  { top: "60%", left: "52%" },
                  { top: "30%", left: "68%" },
                  { top: "72%", left: "34%" },
                ].map((pos, i) => (
                  <span key={i} style={{ position: "absolute", ...pos, width: 16, height: 16, borderRadius: "50%", background: "#2e6b3a", border: "3px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,.3)" }} />
                ))}
                <span style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(14,42,23,.85)", color: "#fff", fontSize: 12.5, fontWeight: 600, padding: "6px 12px", borderRadius: 8 }}>
                  {plant.mapLocations} mapped locations · Open full map ›
                </span>
              </div>
            </Link>
          </div>

          <div style={{ marginTop: 30 }}>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, margin: "0 0 12px" }}>References</h2>
            <ol style={{ fontSize: 14, lineHeight: 1.7, color: "#5a6553", paddingLeft: 20, margin: 0 }}>
              {plant.references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="uf-species-sidebar" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Quick Facts</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Family", value: plant.family, href: `/families/${familySlugFromName(plant.family)}` },
                { label: "Genus", value: plant.genus, italic: true },
                { label: "Order", value: plant.order },
                { label: "Habit", value: plant.habit },
                ...(plant.height ? [{ label: "Height", value: plant.height }] : []),
                { label: "Habitat", value: plant.habitat },
                { label: "Status", value: `${plant.nativeStatus}${plant.conservationStatus ? ` · ${plant.conservationStatus}` : ""}`, green: true },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid #f0ecdd" : "none", fontSize: 14 }}>
                  <span style={{ color: "#8a9682", flexShrink: 0 }}>{row.label}</span>
                  {row.href ? (
                    <Link href={row.href} style={{ fontWeight: 600, color: "#2e6b3a", textDecoration: "none", textAlign: "right" }}>{row.value}</Link>
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
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "#33402f", margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{family.description}</p>
              <Link href={`/families/${family.slug}`} style={{ fontSize: 14, fontWeight: 600, color: "#2e6b3a", textDecoration: "none" }}>
                View family page →
              </Link>
            </div>
          )}

          {plant.voucher && (
            <div style={{ background: "#12341f", color: "#fff", borderRadius: 16, padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Herbarium Voucher</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 78, height: 78, borderRadius: 12, background: "#fff", padding: 8, flex: "0 0 auto" }}>
                  <QrCodeSvg size={62} />
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  <div><span style={{ color: "#8fb890" }}>Voucher:</span> {plant.voucher.number}</div>
                  <div><span style={{ color: "#8fb890" }}>Collector:</span> {plant.voucher.collector}</div>
                  <div><span style={{ color: "#8fb890" }}>Date:</span> {plant.voucher.date}</div>
                  <div><span style={{ color: "#8fb890" }}>Barcode:</span> {plant.voucher.barcode}</div>
                </div>
              </div>
              <Link href="/collections" style={{ display: "block", textAlign: "center", marginTop: 16, background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.25)", padding: 10, borderRadius: 9, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>View Specimen Sheet</Link>
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Downloads</div>
            {[
              { label: "Species PDF", href: "#" },
              { label: "Herbarium Sheet", href: "#" },
              { label: "QR Code Label", href: QR_CODE_IMAGE },
            ].map((item, i, arr) => (
              <a
                key={item.label}
                className="uf-dl"
                href={item.href}
                {...(item.label === "QR Code Label" ? { download: true, target: "_blank", rel: "noopener noreferrer" } : {})}
                style={{ display: "flex", alignItems: "center", gap: 11, padding: 12, border: "1px solid #e6e1cf", borderRadius: 10, textDecoration: "none", color: "#33402f", fontSize: 14, fontWeight: 600, marginBottom: i < arr.length - 1 ? 10 : 0 }}
              >
                {item.label === "QR Code Label" ? (
                  <QrCodeSvg size={19} />
                ) : (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></svg>
                )}
                {item.label}
              </a>
            ))}
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
