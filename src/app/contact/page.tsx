import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ContactPage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="contact" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Contact"
        title="Contact Us"
        description="Get in touch with the UniFlora team for contributions, corrections, partnerships, or general enquiries."
      />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 40px 64px" }}>
        <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#3f4a3a" }}>Name</label>
            <input type="text" style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "10px 14px", fontSize: 15, fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#3f4a3a" }}>Email</label>
            <input type="email" style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "10px 14px", fontSize: 15, fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#3f4a3a" }}>Message</label>
            <textarea rows={5} style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "10px 14px", fontSize: 15, fontFamily: "inherit", resize: "vertical" }} />
          </div>
          <button type="button" className="uf-btn" style={{ background: "#2e6b3a", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Send Message</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
