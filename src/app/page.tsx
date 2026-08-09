import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeroBackground, HomeStatsGrid, RecentPlants } from "@/components/home/HomeSections";

const EXPLORE_TYPES = [
  {
    title: "Big Trees",
    desc: "Large, high canopy trees",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7Z" />
        <path d="M12 22v-3" />
      </svg>
    ),
  },
  {
    title: "Palms",
    desc: "Palm and palm-like plants",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
        <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
        <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
        <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
      </svg>
    ),
  },
  {
    title: "Shrubs",
    desc: "Woody plants with multiple stems",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-7l-2-2" />
        <path d="M17 8v.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0Z" />
        <path d="m14 14-2 2" />
      </svg>
    ),
  },
  {
    title: "Small Trees",
    desc: "Small-sized trees with lower canopy",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.05a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z" />
        <path d="M12 19v3" />
      </svg>
    ),
  },
  {
    title: "Herbs & Climbers",
    desc: "Herbaceous plants and climbers",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
  },
  {
    title: "Medicinal Plants",
    desc: "Plants with medicinal value",
    icon: (
      <span style={{ width: 38, height: 38, borderRadius: "50%", background: "#2e6b3a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v12" />
          <path d="M6 12h12" />
        </svg>
      </span>
    ),
  },
];

const QUICK_LINKS = [
  { title: "Explore", desc: "Browse plants by name, family, habit and more.", href: "/explore", icon: "leaf" },
  { title: "Map", desc: "View plant locations across campus.", href: "/map", icon: "map" },
  { title: "Collections", desc: "Access herbarium and photo collections.", href: "/collections", icon: "camera" },
  { title: "Learn", desc: "Identification keys, guides and resources.", href: "/learn", icon: "book" },
];

const MISSION = [
  { title: "Contribute", desc: "Help us grow the data. Upload photos and plant information.", icon: "users" },
  { title: "Identify", desc: "Use identification tools and keys to identify plants.", icon: "identify" },
  { title: "Share", desc: "Share knowledge and data with the community.", icon: "share" },
  { title: "Conserve", desc: "Promote awareness and conserve plant diversity.", icon: "conserve" },
];

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif", background: "#f5f1e6", color: "#1e2b1f", minHeight: "100%", overflowX: "hidden" }}>
      <Header active="home" sticky={false} logoLink={false} />

      <section style={{ position: "relative", minHeight: "clamp(420px, 70vh, 560px)", overflow: "hidden", background: "#0c1e12" }}>
        <HeroBackground />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(9,26,15,.94) 0%, rgba(9,26,15,.7) 40%, rgba(9,26,15,.3) 70%, rgba(9,26,15,.55) 100%)" }} />

        <div className="uf-hero-inner">
          <div style={{ maxWidth: 660, flex: 1, minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,.13)", border: "1px solid rgba(255,255,255,.22)", color: "#d7e8cf", padding: "8px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, backdropFilter: "blur(4px)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#a7d493" stroke="none"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /></svg>
              Documenting Our Green Heritage
            </div>

            <h1 className="uf-hero-title" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, color: "#ffffff", margin: "22px 0 0", letterSpacing: -0.5 }}>
              Discover, Learn &amp;<br />Conserve <span style={{ fontStyle: "italic", color: "#7dbf6b" }}>Campus Flora</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,.9)", fontSize: 19, margin: "20px 0 6px", maxWidth: 560 }}>An open digital platform to explore the plant diversity of our campus.</p>
            <p style={{ color: "#a7d493", fontSize: 16, fontWeight: 600, letterSpacing: 0.6, margin: "0 0 26px" }}>Identify &nbsp;·&nbsp; Document &nbsp;·&nbsp; Share &nbsp;·&nbsp; Conserve</p>

            <div className="uf-hero-search" style={{ background: "#ffffff", borderRadius: 14, padding: "8px 8px 8px 18px", maxWidth: 560, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7360" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input type="text" placeholder="Search plants by name, family, habitat…" style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "inherit", color: "#1e2b1f", background: "transparent", padding: "8px 4px" }} />
              <button type="button" className="uf-searchbtn" style={{ background: "#2e6b3a", color: "#fff", border: "none", padding: "12px 26px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 20, color: "rgba(255,255,255,.85)", fontSize: 14.5 }}>
              <span style={{ fontWeight: 700, color: "#fff" }}>Popular Searches:</span>
              {["Neem", "Bougainvillea", "Ficus", "Acacia", "Pongamia"].map((term, i, arr) => (
                <span key={term} style={{ display: "contents" }}>
                  <Link className="uf-chip" href="/explore" style={{ color: "#cfe0c4", textDecoration: "none", fontWeight: 600 }}>{term}</Link>
                  {i < arr.length - 1 && <span style={{ color: "#6f8a68" }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="uf-hero-quicklinks" style={{ background: "rgba(240,238,224,.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.5)", borderRadius: 18, padding: 12, boxShadow: "0 20px 45px rgba(0,0,0,.28)" }}>
            {QUICK_LINKS.map((ql) => (
              <Link key={ql.title} className="uf-ql" href={ql.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, textDecoration: "none", color: "inherit" }}>
                <span style={{ width: 44, height: 44, borderRadius: 11, background: "#e2ecda", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", color: "#2e6b3a" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /></svg>
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 16, color: "#1e2b1f" }}>{ql.title}</span>
                  <span style={{ display: "block", fontSize: 13, color: "#5f6b58", marginTop: 2 }}>{ql.desc}</span>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a9682" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 34, paddingBottom: 8 }}>
        <div className="uf-grid-6 uf-grid-tiles">
          {EXPLORE_TYPES.map((card) => (
            <div key={card.title} className="uf-card" style={{ background: "#fbf9f1", border: "1px solid #e6e1cf", borderRadius: 14, padding: 22 }}>
              {card.icon}
              <div style={{ fontWeight: 700, fontSize: 17, marginTop: 14 }}>{card.title}</div>
              <div style={{ fontSize: 13.5, color: "#6b7360", marginTop: 5, lineHeight: 1.4 }}>{card.desc}</div>
              <Link className="uf-chip" href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#2e6b3a", fontWeight: 600, fontSize: 14, textDecoration: "none", marginTop: 16 }}>
                Explore <ArrowIcon />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 24, paddingBottom: 24 }}>
        <div className="uf-split-stats">
          <div style={{ background: "#eef0e2", border: "1px solid #e0e2cf", borderRadius: 16, padding: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 22 }}>Campus Flora in Numbers</div>
            <HomeStatsGrid />
            <button type="button" className="uf-btn" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#0e2a17", color: "#fff", border: "none", padding: "12px 22px", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer", marginTop: 26, fontFamily: "inherit" }}>
              View All Statistics
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="5" /><rect x="12" y="8" width="3" height="9" /><rect x="17" y="5" width="3" height="12" /></svg>
            </button>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>Recently Added Plants</div>
              <Link className="uf-chip" href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#2e6b3a", fontWeight: 600, fontSize: 14.5, textDecoration: "none" }}>
                View All <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
            <RecentPlants />
          </div>
        </div>
      </section>

      <section className="uf-page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 8, paddingBottom: 56 }}>
        <div style={{ background: "#eef0e2", border: "1px solid #e0e2cf", borderRadius: 16, padding: "clamp(20px, 4vw, 30px) clamp(18px, 4vw, 34px)" }}>
          <div className="uf-mission-grid">
          {MISSION.map((m) => (
            <div key={m.title} style={{ display: "flex", gap: 14 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e6b3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16.5 }}>{m.title}</div>
                <div style={{ fontSize: 13.5, color: "#6b7360", marginTop: 5, lineHeight: 1.45 }}>{m.desc}</div>
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
