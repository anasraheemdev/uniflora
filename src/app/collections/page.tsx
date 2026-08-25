import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { QrCodeSvg } from "@/components/icons";
import { PlantImage } from "@/components/ui/PlantImage";
import { color, font } from "@/lib/theme";
import { getSpecimens, getSpecimenStats, getStats } from "@/lib/data";

export default async function CollectionsPage() {
  const [specimens, specimenStats, stats] = await Promise.all([getSpecimens(), getSpecimenStats(), getStats()]);
  const hasSpecimens = specimens.length > 0;

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="collections" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Collections"
        kicker="Voucher archive"
        title="Herbarium & Collections"
        description={
          hasSpecimens ? (
            <>
              Digitised voucher specimens with full metadata, barcodes and QR codes.{" "}
              <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{specimenStats.vouchers.toLocaleString()}</span> herbarium sheets from{" "}
              <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{specimenStats.collectors}</span> collectors.
            </>
          ) : (
            <>
              Voucher specimens for the campus flora. The{" "}
              <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{stats.species} species</span> in the floristic survey
              are catalogued, but the herbarium sheets have not been digitised yet.
            </>
          )
        }
      />

      {hasSpecimens ? (
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "30px 40px 72px" }}>
          <div className="uf-grid-4">
            {specimens.map((spec) => (
              <div key={spec.voucher} className="uf-card" style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, overflow: "hidden" }}>
                <div style={{ background: color.parchmentDeep, padding: 14 }}>
                  <PlantImage
                    slug={spec.slug}
                    type={spec.type}
                    alt={spec.scientificName}
                    rounded
                    radius={6}
                    style={{ display: "block", width: "100%", height: 230, borderRadius: 6, overflow: "hidden" }}
                  />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: font.display, fontStyle: "italic", fontSize: 16, fontWeight: 600 }}>{spec.scientificName}</div>
                  <div style={{ fontSize: 13, color: color.faint, marginTop: 2 }}>{spec.family}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
                    <div style={{ fontSize: 12.5, color: color.inkSoft, lineHeight: 1.6 }}>
                      <div><b>{spec.voucher}</b></div>
                      <div>{spec.collector} · {spec.year}</div>
                    </div>
                    <QrCodeSvg />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="uf-page-pad" style={{ maxWidth: 1000, margin: "0 auto", paddingTop: 44, paddingBottom: 76 }}>
          <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 20, padding: "44px 36px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: color.sage100, color: color.forest600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: 27, margin: "0 0 12px" }}>
              Herbarium digitisation in progress
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: color.muted, margin: "0 auto 26px", maxWidth: 620 }}>
              The floristic survey has recorded <b>{stats.species} species</b> across <b>{stats.families} families</b>,
              with <b>{stats.locations.toLocaleString()}</b> individual plants pinned by GPS. Pressed voucher sheets are
              still being catalogued, so there is nothing to browse here yet.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, textAlign: "left", marginBottom: 28 }}>
              {[
                { label: "Species catalogued", value: stats.species },
                { label: "Plants mapped", value: stats.locations.toLocaleString() },
                { label: "Species photographed", value: stats.photographed },
                { label: "Vouchers digitised", value: 0 },
              ].map((stat) => (
                <div key={stat.label} style={{ background: color.parchmentDeep, border: `1px solid ${color.borderStrong}`, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontFamily: font.display, fontSize: 25, fontWeight: 600, color: color.forest600, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12.5, color: color.muted, marginTop: 6 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/explore" className="uf-btn-primary" style={{ padding: "13px 22px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
                Browse the species catalogue →
              </Link>
              <Link href="/map" className="uf-btn-secondary" style={{ padding: "13px 22px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
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
