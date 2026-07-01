import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlantImage } from "@/components/ui/PlantImage";
import { FIELD_GUIDE_IMAGE } from "@/lib/images";

const RESOURCES = [
  { title: "Plant Identification", desc: "Interactive dichotomous keys to identify trees, shrubs and herbs by leaf, flower and habit.", cta: "Start key" },
  { title: "Botanical Glossary", desc: "Over 400 illustrated botanical terms — morphology, phenology and taxonomy explained.", cta: "Browse terms" },
  { title: "Practical Manuals", desc: "Downloadable field guides for herbarium technique, specimen pressing and plant collection.", cta: "Open manuals" },
  { title: "Video Library", desc: "Short lessons on plant morphology, campus walks and identification techniques.", cta: "Watch videos" },
  { title: "Quizzes", desc: "Test your knowledge of families, genera and species with self-graded quizzes.", cta: "Take a quiz" },
  { title: "Virtual Herbarium", desc: "Explore digitised voucher specimens with zoomable high-resolution scans.", cta: "Enter herbarium", href: "/collections" },
];

export default function LearnPage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="learn" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Learn"
        title="Learning & Resources"
        description="Identification keys, botanical glossaries, field manuals, videos and quizzes to help you learn campus flora."
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px 8px" }}>
        <div className="uf-grid-3">
          {RESOURCES.map((r) => (
            <Link key={r.title} className="uf-card" href={r.href ?? "#"} style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 26, textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: "#e2ecda", display: "flex", alignItems: "center", justifyContent: "center", color: "#2e6b3a" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14" /></svg>
              </div>
              <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 22, marginTop: 16 }}>{r.title}</div>
              <p style={{ fontSize: 14.5, color: "#6b7360", lineHeight: 1.55, margin: "8px 0 0" }}>{r.desc}</p>
              <span className="uf-chip" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#2e6b3a", fontWeight: 600, fontSize: 14, marginTop: 16 }}>
                {r.cta}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px 64px" }}>
        <div className="uf-split-promo" style={{ background: "#12341f", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: 44 }}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,.14)", color: "#a7d493", fontSize: 12.5, fontWeight: 700, padding: "6px 13px", borderRadius: 999, letterSpacing: 0.5 }}>FEATURED GUIDE</span>
            <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 32, color: "#fff", margin: "18px 0 12px", lineHeight: 1.2 }}>How to Identify a Tree in 5 Steps</h2>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: 16, lineHeight: 1.6, margin: "0 0 24px" }}>A beginner-friendly walkthrough: observe the habit, examine leaf arrangement, inspect the bark, note the flowers and fruit, then confirm with the campus key.</p>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2e6b3a", color: "#fff", padding: "13px 26px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Read the guide
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
          </div>
          <PlantImage src={FIELD_GUIDE_IMAGE} alt="Field guide" style={{ display: "block", width: "100%", height: "100%", minHeight: 300 }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
