import { ExploreBrowser } from "@/components/explore/ExploreBrowser";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { STATS } from "@/data/plants";

export default function ExplorePage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="explore" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Explore Plants"
        title="Explore Campus Flora"
        description={
          <>
            Every species recorded in the university floristic survey — searchable by name, family, growth form and
            cultivation status. <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.species} species</span> across{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.families} families</span> and{" "}
            <span style={{ color: "#a7d493", fontWeight: 600 }}>{STATS.genera} genera</span>.
          </>
        }
      />

      <ExploreBrowser />

      <Footer />
    </div>
  );
}
