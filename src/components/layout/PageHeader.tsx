type PageHeaderProps = {
  breadcrumb: string;
  title: string;
  description: React.ReactNode;
};

export function PageHeader({ breadcrumb, title, description }: PageHeaderProps) {
  return (
    <div style={{ background: "#12341f", color: "#fff" }}>
      <div className="uf-page-header-inner">
        <div className="uf-breadcrumb" style={{ fontSize: 13.5, color: "#8fb890", fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: breadcrumb }} />
        <h1 className="uf-page-title" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, margin: "12px 0 8px" }}>{title}</h1>
        <p style={{ color: "rgba(255,255,255,.82)", fontSize: "clamp(15px, 2.5vw, 17px)", margin: 0, maxWidth: 660 }}>{description}</p>
      </div>
    </div>
  );
}
