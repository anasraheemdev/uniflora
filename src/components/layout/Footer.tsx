import Link from "next/link";
import { LeafIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer style={{ background: "#0e2a17", color: "#c3d4bf" }}>
      <div className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 52, paddingBottom: 30 }}>
        <div className="uf-footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(160deg,#4f8f43,#2e6b3a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LeafIcon size={22} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>UniFlora</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 300, color: "#a9bda4" }}>
            A digital platform for documenting, mapping, learning, and conserving the plant diversity of our university campus.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 14 }}>Explore</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
            <Link href="/explore" style={{ color: "#a9bda4", textDecoration: "none" }}>Big Trees</Link>
            <Link href="/explore" style={{ color: "#a9bda4", textDecoration: "none" }}>Shrubs</Link>
            <Link href="/explore" style={{ color: "#a9bda4", textDecoration: "none" }}>Medicinal Plants</Link>
            <Link href="/families" style={{ color: "#a9bda4", textDecoration: "none" }}>Families</Link>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 14 }}>Resources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
            <Link href="/collections" style={{ color: "#a9bda4", textDecoration: "none" }}>Herbarium</Link>
            <Link href="/gallery" style={{ color: "#a9bda4", textDecoration: "none" }}>Gallery</Link>
            <Link href="/learn" style={{ color: "#a9bda4", textDecoration: "none" }}>Learning</Link>
            <Link href="/map" style={{ color: "#a9bda4", textDecoration: "none" }}>Campus Map</Link>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 14 }}>Institute</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
            <Link href="/about" style={{ color: "#a9bda4", textDecoration: "none" }}>About</Link>
            <Link href="/contact" style={{ color: "#a9bda4", textDecoration: "none" }}>Contact</Link>
            <Link href="/admin" style={{ color: "#a9bda4", textDecoration: "none" }}>Admin Portal</Link>
          </div>
        </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
        <div className="uf-page-pad uf-footer-bar" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 18, paddingBottom: 18, fontSize: 13, color: "#7f9a7a" }}>
          <span>© 2026 UniFlora · Campus Flora Information System</span>
          <span>Documenting our green heritage · English · اردو</span>
        </div>
      </div>
    </footer>
  );
}
