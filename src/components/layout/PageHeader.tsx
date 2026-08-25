import { color, font } from "@/lib/theme";

type PageHeaderProps = {
  breadcrumb: string;
  title: string;
  description: React.ReactNode;
  kicker?: string;
};

export function PageHeader({ breadcrumb, title, description, kicker }: PageHeaderProps) {
  return (
    <div
      style={{
        background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(255,255,255,.06), transparent 55%), radial-gradient(circle at 8% 100%, rgba(182,134,45,.14), transparent 45%)",
        }}
      />
      <div className="uf-page-header-inner" style={{ position: "relative" }}>
        <div
          className="uf-breadcrumb"
          style={{ fontSize: 13.5, color: color.onDarkMuted, fontWeight: 600, fontFamily: font.body }}
          dangerouslySetInnerHTML={{ __html: breadcrumb }}
        />
        {kicker && (
          <div className="uf-kicker" style={{ color: color.onDarkGold, marginTop: 16 }}>
            {kicker}
          </div>
        )}
        <h1
          className="uf-page-title"
          style={{ fontFamily: font.display, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>
        <p style={{ color: "rgba(255,255,255,.86)", fontSize: "clamp(15px, 2.5vw, 17.5px)", lineHeight: 1.6, margin: 0, maxWidth: 680, fontFamily: font.body }}>
          {description}
        </p>
      </div>
    </div>
  );
}
