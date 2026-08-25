import { ExploreBrowser } from "@/components/explore/ExploreBrowser";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { color, font } from "@/lib/theme";
import { getAllFamilies, getAllPlants, getStats } from "@/lib/data";

export default async function ExplorePage() {
  const [plants, families, stats] = await Promise.all([getAllPlants(), getAllFamilies(), getStats()]);

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="explore" />

      <PageHeader
        breadcrumb="Home &nbsp;/&nbsp; Explore Plants"
        kicker="The full catalogue"
        title="Explore Campus Flora"
        description={
          <>
            Every species recorded in the university floristic survey — searchable by name, family, growth form and
            cultivation status. <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{stats.species} species</span> across{" "}
            <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{stats.families} families</span> and{" "}
            <span style={{ color: color.onDarkGold, fontWeight: 600 }}>{stats.genera} genera</span>.
          </>
        }
      />

      <ExploreBrowser plants={plants} families={families} />

      <Footer />
    </div>
  );
}
