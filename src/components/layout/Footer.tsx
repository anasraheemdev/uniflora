import Image from "next/image";
import Link from "next/link";
import { LOGO_IMAGE } from "@/lib/images";
import { color, font } from "@/lib/theme";

const linkStyle: React.CSSProperties = { color: color.onDarkMuted, textDecoration: "none", fontFamily: font.body };
const headingStyle: React.CSSProperties = {
  fontFamily: font.body,
  fontWeight: 700,
  color: "#fff",
  fontSize: 13,
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 16,
};

export function Footer() {
  return (
    <footer style={{ background: color.forest950, color: color.onDarkMuted }}>
      <div className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 60, paddingBottom: 34 }}>
        <div className="uf-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, position: "relative", flex: "0 0 auto" }}>
                <Image src={LOGO_IMAGE} alt="UniFlora" fill sizes="40px" style={{ objectFit: "contain" }} />
              </div>
              <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, color: "#fff" }}>UniFlora</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 300, color: color.onDarkMuted, margin: 0 }}>
              A digital platform for documenting, mapping, learning, and conserving the plant diversity of our
              university campus.
            </p>
            <div
              className="uf-kicker"
              style={{ color: color.onDarkGold, marginTop: 20, fontSize: 11.5, letterSpacing: 1.6 }}
            >
              Est. 2026 Floristic Survey
            </div>
          </div>
          <div>
            <div style={headingStyle}>Explore</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
              <Link href="/explore" style={linkStyle}>Big Trees</Link>
              <Link href="/explore" style={linkStyle}>Shrubs</Link>
              <Link href="/explore" style={linkStyle}>Medicinal Plants</Link>
              <Link href="/families" style={linkStyle}>Families</Link>
            </div>
          </div>
          <div>
            <div style={headingStyle}>Resources</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
              <Link href="/collections" style={linkStyle}>Herbarium</Link>
              <Link href="/gallery" style={linkStyle}>Gallery</Link>
              <Link href="/learn" style={linkStyle}>Learning</Link>
              <Link href="/map" style={linkStyle}>Campus Map</Link>
            </div>
          </div>
          <div>
            <div style={headingStyle}>Institute</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
              <Link href="/about" style={linkStyle}>About</Link>
              <Link href="/contact" style={linkStyle}>Contact</Link>
              <Link href="/admin" style={linkStyle}>Admin Portal</Link>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.09)" }}>
        <div
          className="uf-page-pad uf-footer-bar"
          style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 18, paddingBottom: 18, fontSize: 13, color: color.onDarkFaint, fontFamily: font.body }}
        >
          <span>© 2026 UniFlora · Campus Flora Information System</span>
          <span>Documenting our green heritage · English · اردو</span>
        </div>
      </div>
    </footer>
  );
}
