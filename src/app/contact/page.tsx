import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { color, font } from "@/lib/theme";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${color.border}`,
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  color: color.ink,
  background: color.parchment,
};

const labelStyle: React.CSSProperties = { fontWeight: 600, fontSize: 14, color: color.inkSoft, marginBottom: 8, display: "block" };

const CHANNELS = [
  { title: "General enquiries", detail: "info@uniflora.edu", desc: "Questions about the platform, data or partnerships." },
  { title: "Report a correction", detail: "records@uniflora.edu", desc: "Spotted a wrong ID or a mapping error? Tell us." },
  { title: "Campus location", detail: "Botany Department, Main Campus", desc: "Visit the herbarium during office hours." },
];

export default function ContactPage() {
  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="contact" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Contact"
        kicker="Get in touch"
        title="Contact Us"
        description="Questions, corrections, or ideas for the campus flora record — we'd like to hear them."
      />

      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 48, paddingBottom: 64 }}>
        <div className="uf-split-promo" style={{ gap: 40 }}>
          <div>
            <SectionKicker>Reach the team</SectionKicker>
            <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", margin: "12px 0 24px" }}>
              We read every message
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {CHANNELS.map((c) => (
                <div key={c.title} style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 14, padding: 20 }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16 }}>{c.title}</div>
                  <div style={{ color: color.forest600, fontWeight: 600, fontSize: 14.5, marginTop: 6 }}>{c.detail}</div>
                  <div style={{ color: color.muted, fontSize: 13.5, marginTop: 4, lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 20, padding: "clamp(24px, 4vw, 36px)", boxShadow: "0 1px 2px rgba(20,40,25,.04), 0 10px 28px rgba(20,40,25,.06)" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="uf-split-login" style={{ gap: 16 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input type="text" placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" placeholder="you@example.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <input type="text" placeholder="What's this about?" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea rows={6} placeholder="Tell us more…" style={{ ...inputStyle, resize: "vertical" as const }} />
              </div>
              <button type="button" className="uf-btn uf-btn-primary" style={{ border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
