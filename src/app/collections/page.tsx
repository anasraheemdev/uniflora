import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { QrCodeSvg } from "@/components/icons";
import { PlantImage } from "@/components/ui/PlantImage";
import { SPECIMENS, SPECIMEN_STATS } from "@/data/specimens";
import { STATS, getPlantBySlug } from "@/data/plants";

export default function CollectionsPage() {
  const hasSpecimens = SPECIMENS.length > 0;

  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="collections" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Collections"
        title="Herbarium & Collections"
        description={
          hasSpecimens ? (
            <>
              Digitised voucher specimens with full metadata, barcodes and QR codes.{" "}
              <span style={{ color: "#a7d493", fontWeight: 600 }}>{SPECIMEN_STATS.vouchers.toLocaleString()}</span> herbarium sheets from{" "}
              <span style={{ color: "#a7d493", fontWeight: 600 }}>{SPECIMEN_STATS.collectors}</span> collectors.
            </>
          ) : (
            <>
              Voucher specimens for the campus flora. The{" "}
              <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.species} species</span> in the floristic survey
              are catalogued, but the herbarium sheets have not been digitised yet.
            </>
          )
        }
      />

      {hasSpecimens ? (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "26px 40px 64px" }}>
          <div className="uf-grid-4">
            {SPECIMENS.map((spec) => {
              const plant = getPlantBySlug(spec.slug);
              return (
                <div key={spec.voucher} className="uf-card" style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ background: "#f0ece0", padding: 14 }}>
                    <PlantImage
                      slug={spec.slug}
                      type={plant?.type}
                      alt={spec.scientificName}
                      rounded
                      radius={6}
                      style={{ display: "block", width: "100%", height: 230, borderRadius: 6, overflow: "hidden" }}
                    />
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontStyle: "italic", fontSize: 16, fontWeight: 600 }}>{spec.scientificName}</div>
                    <div style={{ fontSize: 13, color: "#8a9682", marginTop: 2 }}>{spec.family}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
                      <div style={{ fontSize: 12.5, color: "#5a6553", lineHeight: 1.6 }}>
                        <div><b>{spec.voucher}</b></div>
                        <div>{spec.collector} · {spec.year}</div>
                      </div>
                      <QrCodeSvg />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="uf-page-pad" style={{ maxWidth: 1000, margin: "0 auto", paddingTop: 40, paddingBottom: 70 }}>
          <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 18, padding: "40px 36px", textAlign: "center" }}>
            <div style={{ width: 62, height: 62, borderRadius: 16, background: "#e2ecda", color: "#2e6b3a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 26, margin: "0 0 12px" }}>
              Herbarium digitisation in progress
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "#5a6553", margin: "0 auto 24px", maxWidth: 620 }}>
              The floristic survey has recorded <b>{STATS.species} species</b> across <b>{STATS.families} families</b>,
              with <b>{STATS.locations.toLocaleString()}</b> individual plants pinned by GPS. Pressed voucher sheets are
              still being catalogued, so there is nothing to browse here yet.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, textAlign: "left", marginBottom: 26 }}>
              {[
                { label: "Species catalogued", value: STATS.species },
                { label: "Plants mapped", value: STATS.locations.toLocaleString() },
                { label: "Species photographed", value: STATS.photographed },
                { label: "Vouchers digitised", value: 0 },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#2e6b3a", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7360", marginTop: 5 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/explore" style={{ background: "#2e6b3a", color: "#fff", padding: "12px 22px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
                Browse the species catalogue →
              </Link>
              <Link href="/map" style={{ background: "#fff", color: "#2e6b3a", border: "1px solid #e6e1cf", padding: "12px 22px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
                Open the campus map →
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
