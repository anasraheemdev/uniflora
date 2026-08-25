import Link from "next/link";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeroBackground, HomeStatsGrid, RecentPlants } from "@/components/home/HomeSections";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { color, font } from "@/lib/theme";
import { getRecentPlants, getStats } from "@/lib/data";

const EXPLORE_TYPES = [
  {
    title: "Big Trees",
    desc: "Large, high canopy trees",
    icon: (
      <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7ZM12 22v-3" />
    ),
  },
  {
    title: "Palms",
    desc: "Palm and palm-like plants",
    icon: (
      <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
    ),
  },
  {
    title: "Shrubs",
    desc: "Woody plants with multiple stems",
    icon: <path d="M12 22v-7l-2-2M17 8v.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0ZM14 14l-2 2" />,
  },
  {
    title: "Small Trees",
    desc: "Small-sized trees with lower canopy",
    icon: <path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.05a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19ZM12 19v3" />,
  },
  {
    title: "Herbs & Climbers",
    desc: "Herbaceous plants and climbers",
    icon: (
      <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    ),
  },
  {
    title: "Medicinal Plants",
    desc: "Plants with medicinal value",
    icon: <path d="M12 6v12M6 12h12" />,
    gold: true,
  },
];

const QUICK_LINKS = [
  { title: "Explore", desc: "Browse plants by name, family, habit and more.", href: "/explore" },
  { title: "Map", desc: "View plant locations across campus.", href: "/map" },
  { title: "Collections", desc: "Access herbarium and photo collections.", href: "/collections" },
  { title: "Learn", desc: "Identification keys, guides and resources.", href: "/learn" },
];

const MISSION = [
  { title: "Contribute", desc: "Help us grow the data. Upload photos and plant information." },
  { title: "Identify", desc: "Use identification tools and keys to identify plants." },
  { title: "Share", desc: "Share knowledge and data with the community." },
  { title: "Conserve", desc: "Promote awareness and conserve plant diversity." },
];

export default async function HomePage() {
  const [stats, recentPlants] = await Promise.all([getStats(), getRecentPlants(5)]);

  return (
    <div style={{ fontFamily: font.body, background: color.parchment, color: color.ink, minHeight: "100%", overflowX: "hidden" }}>
      <Header active="home" sticky={false} logoLink={false} />

      <section style={{ position: "relative", minHeight: "clamp(460px, 74vh, 600px)", overflow: "hidden", background: color.forest950 }}>
        <HeroBackground />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(100deg, rgba(10,20,15,.95) 0%, rgba(10,20,15,.76) 40%, rgba(10,20,15,.32) 70%, rgba(10,20,15,.58) 100%)",
          }}
        />

        <div className="uf-hero-inner">
          <div style={{ maxWidth: 680, flex: 1, minWidth: 0 }}>
            <SectionKicker dark>Documenting Our Green Heritage</SectionKicker>

            <h1
              className="uf-hero-title"
              style={{ fontFamily: font.display, fontWeight: 600, color: "#ffffff", margin: "20px 0 0", letterSpacing: "-0.01em" }}
            >
              Discover, Learn &amp;
              <br />
              Conserve <span style={{ fontStyle: "italic", color: color.onDarkGold }}>Campus Flora</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,.92)", fontSize: 19, margin: "22px 0 6px", maxWidth: 560, lineHeight: 1.5 }}>
              An open digital platform to explore the plant diversity of our campus.
            </p>
            <p style={{ color: color.onDarkGold, fontSize: 15.5, fontWeight: 600, letterSpacing: 0.6, margin: "0 0 28px" }}>
              Identify &nbsp;·&nbsp; Document &nbsp;·&nbsp; Share &nbsp;·&nbsp; Conserve
            </p>

            <div className="uf-hero-search" style={{ background: "#ffffff", borderRadius: 14, padding: "8px 8px 8px 18px", maxWidth: 560, boxShadow: "0 14px 34px rgba(0,0,0,.3)" }}>
              <SearchIcon size={20} color={color.muted} strokeWidth={1.9} />
              <input
                type="text"
                placeholder="Search plants by name, family, habitat…"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "inherit", color: color.ink, background: "transparent", padding: "8px 4px" }}
              />
              <button type="button" className="uf-searchbtn uf-btn-primary" style={{ border: "none", padding: "13px 26px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Search
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 22, color: "rgba(255,255,255,.85)", fontSize: 14.5 }}>
              <span style={{ fontWeight: 700, color: "#fff" }}>Popular Searches:</span>
              {["Neem", "Bougainvillea", "Ficus", "Acacia", "Pongamia"].map((term, i, arr) => (
                <span key={term} style={{ display: "contents" }}>
                  <Link className="uf-chip" href="/explore" style={{ color: "#d7cfa8", textDecoration: "none", fontWeight: 600 }}>
                    {term}
                  </Link>
                  {i < arr.length - 1 && <span style={{ color: "#5a6a54" }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          <div
            className="uf-hero-quicklinks"
            style={{ background: "rgba(250,246,236,.94)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.5)", borderRadius: 18, padding: 12, boxShadow: "0 24px 50px rgba(0,0,0,.32)" }}
          >
            {QUICK_LINKS.map((ql) => (
              <Link key={ql.title} className="uf-ql" href={ql.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, textDecoration: "none", color: "inherit" }}>
                <span style={{ width: 44, height: 44, borderRadius: 11, background: color.sage100, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", color: color.forest600 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  </svg>
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 16, color: color.ink }}>{ql.title}</span>
                  <span style={{ display: "block", fontSize: 13, color: color.muted, marginTop: 2 }}>{ql.desc}</span>
                </span>
                <ArrowRightIcon size={17} color={color.faint} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 56, paddingBottom: 12 }}>
        <SectionKicker>Explore by type</SectionKicker>
        <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(22px, 3vw, 30px)", margin: "10px 0 24px" }}>
          What grows on our campus
        </h2>
        <div className="uf-grid-6 uf-grid-tiles">
          {EXPLORE_TYPES.map((card) => (
            <div key={card.title} className="uf-card" style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 14, padding: 22, boxShadow: "0 1px 2px rgba(20,40,25,.04)" }}>
              <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", background: card.gold ? color.gold100 : color.sage100 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.gold ? color.gold700 : color.forest600} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {card.icon}
                </svg>
              </span>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 17.5, marginTop: 15 }}>{card.title}</div>
              <div style={{ fontSize: 13.5, color: color.muted, marginTop: 5, lineHeight: 1.45 }}>{card.desc}</div>
              <Link className="uf-chip" href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: color.forest600, fontWeight: 600, fontSize: 14, textDecoration: "none", marginTop: 16 }}>
                Explore <ArrowRightIcon size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 32, paddingBottom: 24 }}>
        <div className="uf-split-stats">
          <div style={{ background: color.parchmentDeep, border: `1px solid ${color.borderStrong}`, borderRadius: 18, padding: 30 }}>
            <SectionKicker>By the numbers</SectionKicker>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 21, margin: "10px 0 24px" }}>Campus Flora in Numbers</div>
            <HomeStatsGrid stats={stats} />
            <Link
              href="/explore"
              className="uf-btn uf-btn-outline-dark"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, background: color.forest950, color: "#fff", border: "none", padding: "13px 22px", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", marginTop: 28, textDecoration: "none" }}
            >
              View All Statistics
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <SectionKicker>Fresh from the field</SectionKicker>
                <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 21, marginTop: 8 }}>Recently Added Plants</div>
              </div>
              <Link className="uf-chip" href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: color.forest600, fontWeight: 600, fontSize: 14.5, textDecoration: "none" }}>
                View All <ArrowRightIcon size={16} />
              </Link>
            </div>
            <RecentPlants plants={recentPlants} />
          </div>
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1440, margin: "0 auto", paddingTop: 12, paddingBottom: 64 }}>
        <div style={{ background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`, borderRadius: 20, padding: "clamp(28px, 4vw, 42px) clamp(24px, 4vw, 40px)", color: "#fff" }}>
          <SectionKicker dark>How you can help</SectionKicker>
          <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: "clamp(20px, 3vw, 26px)", margin: "10px 0 26px" }}>
            Be part of the campus flora record
          </div>
          <div className="uf-mission-grid">
            {MISSION.map((m, i) => (
              <div key={m.title} style={{ display: "flex", gap: 14 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    flex: "0 0 auto",
                    borderRadius: 10,
                    background: "rgba(255,255,255,.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: font.display,
                    fontWeight: 600,
                    color: color.onDarkGold,
                    fontSize: 14,
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16.5 }}>{m.title}</div>
                  <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.72)", marginTop: 5, lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
