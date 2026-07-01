import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="about" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; About"
        title="About UniFlora"
        description="UniFlora is the Campus Flora Information System — an open digital platform to document, map, learn about, and conserve the plant diversity of our university campus."
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 40px 64px" }}>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: "#33402f", margin: "0 0 20px" }}>
          Inspired by world-class biodiversity platforms such as Plants of the World Online, World Flora Online, and GBIF, UniFlora brings scientific rigour and elegant design to campus flora documentation.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: "#33402f", margin: 0 }}>
          Our mission is to make campus plant knowledge accessible to students, researchers, conservationists, and the wider community — supporting education, research, and public outreach without barriers.
        </p>
      </div>

      <Footer />
    </div>
  );
}
