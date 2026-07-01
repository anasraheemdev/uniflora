import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { QrCodeSvg } from "@/components/icons";
import { PlantImage } from "@/components/ui/PlantImage";
import { SPECIMENS } from "@/data/specimens";
import { STATS } from "@/data/plants";

export default function CollectionsPage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="collections" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Collections"
        title="Herbarium & Collections"
        description={
          <>
            Digitised voucher specimens with full metadata, barcodes and QR codes.{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.vouchers.toLocaleString()}</span> herbarium sheets from{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.collectors}</span> collectors.
          </>
        }
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, borderBottom: "1px solid #e6e1cf", paddingBottom: 0 }}>
          <div style={{ display: "flex", gap: 28 }}>
            <a className="uf-tab" href="#" style={{ fontSize: 15, fontWeight: 600, color: "#2e6b3a", textDecoration: "none", paddingBottom: 14, borderBottom: "2px solid #2e6b3a" }}>Specimens</a>
            <a className="uf-tab" href="#" style={{ fontSize: 15, fontWeight: 600, color: "#8a9682", textDecoration: "none", paddingBottom: 14 }}>Collectors</a>
            <a className="uf-tab" href="#" style={{ fontSize: 15, fontWeight: 600, color: "#8a9682", textDecoration: "none", paddingBottom: 14 }}>QR Codes</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 10, padding: "8px 12px", marginBottom: 10, minWidth: 300 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input type="text" placeholder="Search voucher no., collector, species…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "transparent" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "26px 40px 64px" }}>
        <div className="uf-grid-4">
          {SPECIMENS.map((spec) => (
            <div key={spec.voucher} className="uf-card" style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: "#f0ece0", padding: 14 }}>
                <PlantImage slug={spec.slug} alt={spec.scientificName} rounded radius={6} style={{ display: "block", width: "100%", height: 230, borderRadius: 6, overflow: "hidden" }} />
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
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
