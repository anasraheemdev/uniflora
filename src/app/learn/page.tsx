import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlantImage } from "@/components/ui/PlantImage";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { FIELD_GUIDE_IMAGE } from "@/lib/images";
import { color, font } from "@/lib/theme";

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
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="learn" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Learn"
        kicker="Learning resources"
        title="Learning & Resources"
        description="Identification keys, botanical glossaries, field manuals, videos and quizzes to help you learn campus flora."
      />

      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", padding: "40px var(--uf-pad) 8px" }}>
        <div className="uf-grid-3">
          {RESOURCES.map((r, i) => (
            <Link
              key={r.title}
              className="uf-card"
              href={r.href ?? "#"}
              style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 16, padding: 26, textDecoration: "none", color: "inherit" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: color.sage100, display: "flex", alignItems: "center", justifyContent: "center", color: color.forest600 }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 7v14" />
                    <path d="M12 7c0-3-2.5-5-6.5-5S1 4 1 6c1.5 1 3.5 1 5.5 1h5.5" />
                    <path d="M12 7c0-3 2.5-5 6.5-5S23 4 23 6c-1.5 1-3.5 1-5.5 1H12" />
                  </svg>
                </div>
                <span style={{ fontFamily: font.display, fontWeight: 600, color: color.gold600, fontSize: 20 }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 21, marginTop: 18 }}>{r.title}</div>
              <p style={{ fontSize: 14.5, color: color.muted, lineHeight: 1.6, margin: "8px 0 0" }}>{r.desc}</p>
              <span className="uf-chip" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: color.forest600, fontWeight: 600, fontSize: 14, marginTop: 18 }}>
                {r.cta}
                <ArrowRightIcon size={15} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", padding: "36px var(--uf-pad) 72px" }}>
        <div className="uf-split-promo" style={{ background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "clamp(28px, 4vw, 48px)" }}>
            <SectionKicker dark>Featured guide</SectionKicker>
            <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(24px, 3.4vw, 34px)", color: "#fff", margin: "18px 0 14px", lineHeight: 1.22 }}>
              How to Identify a Tree in 5 Steps
            </h2>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: 16, lineHeight: 1.65, margin: "0 0 26px" }}>
              A beginner-friendly walkthrough: observe the habit, examine leaf arrangement, inspect the bark, note
              the flowers and fruit, then confirm with the campus key.
            </p>
            <a href="#" className="uf-btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Read the guide
              <ArrowRightIcon size={16} />
            </a>
          </div>
          <PlantImage src={FIELD_GUIDE_IMAGE} alt="Field guide" style={{ display: "block", width: "100%", height: "100%", minHeight: 320 }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
