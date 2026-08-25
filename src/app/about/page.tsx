import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { color, font } from "@/lib/theme";
import { getStats } from "@/lib/data";

const PILLARS = [
  {
    title: "Document",
    text: "A complete, citable species catalogue — taxonomy, diagnostic characters, phenology, ethnobotany and references for every recorded plant.",
  },
  {
    title: "Map",
    text: "Every surveyed individual pinned by GPS on an interactive campus map, organised by zone and growth form.",
  },
  {
    title: "Learn",
    text: "Identification keys, a botanical glossary, field manuals and quizzes for students learning to read the campus flora.",
  },
  {
    title: "Conserve",
    text: "Native and exotic status, conservation codes and long-term records to support real biodiversity decisions on campus.",
  },
];

const REFERENCE_PLATFORMS = ["Plants of the World Online", "World Flora Online", "GBIF"];

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="about" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; About"
        kicker="Our mission"
        title="About UniFlora"
        description="An open digital platform to document, map, learn about, and conserve the plant diversity of our university campus."
      />

      <section className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 52, paddingBottom: 12 }}>
        <div className="uf-split-promo" style={{ gap: 56, alignItems: "start" }}>
          <div>
            <SectionKicker>Why UniFlora exists</SectionKicker>
            <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(24px, 3.6vw, 34px)", margin: "12px 0 20px", lineHeight: 1.25 }}>
              Scientific rigour, elegant design, and a green record built to last
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: color.inkSoft, margin: "0 0 20px" }}>
              Inspired by world-class biodiversity platforms such as{" "}
              {REFERENCE_PLATFORMS.map((p, i) => (
                <span key={p}>
                  <strong style={{ color: color.ink }}>{p}</strong>
                  {i < REFERENCE_PLATFORMS.length - 1 ? ", " : ""}
                </span>
              ))}
              , UniFlora brings the same scientific rigour and elegant design to campus flora documentation.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: color.inkSoft, margin: 0 }}>
              Our mission is to make campus plant knowledge accessible to students, researchers, conservationists,
              and the wider community — supporting education, research, and public outreach without barriers.
            </p>
          </div>

          <div style={{ background: color.parchmentDeep, border: `1px solid ${color.borderStrong}`, borderRadius: 20, padding: 30 }}>
            <SectionKicker>The survey, in numbers</SectionKicker>
            <div className="uf-grid-2" style={{ gap: 22, marginTop: 20 }}>
              {[
                { value: stats.species, label: "Species catalogued" },
                { value: stats.families, label: "Plant families" },
                { value: stats.locations.toLocaleString(), label: "Individuals GPS-mapped" },
                { value: stats.genera, label: "Genera recorded" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 32, color: color.forest600 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: color.muted, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 56, paddingBottom: 64 }}>
        <SectionKicker>What we're building</SectionKicker>
        <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", margin: "10px 0 28px" }}>
          Four pillars of the platform
        </h2>
        <div className="uf-grid-4">
          {PILLARS.map((p, i) => (
            <div key={p.title} style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 26, color: color.gold600, marginBottom: 10 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 18 }}>{p.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: color.muted, marginTop: 8 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
