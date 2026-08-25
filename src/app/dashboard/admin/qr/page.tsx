import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction } from "@/components/dashboard/DashboardUI";
import { QrCodeSvg } from "@/components/icons";
import { color, font } from "@/lib/theme";
import { QR_CODE_IMAGE } from "@/lib/images";
import { requireRole } from "@/lib/require-role";

export default async function AdminQrPage() {
  const user = await requireRole("admin");

  return (
    <DashboardShell user={user} title="QR Code Labels" subtitle="Generate printable QR labels for campus living collections." activePath="/dashboard/admin/qr">
      <div className="uf-grid-3">
        {["Zone A — Main Avenue", "Zone B — Science Block", "Zone C — Library Lawn"].map((zone) => (
          <div key={zone} className="uf-card" style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ background: color.parchmentDeep, border: `1px solid ${color.border}`, borderRadius: 10, padding: 10, flexShrink: 0 }}>
                <QrCodeSvg size={72} />
              </div>
              <div>
                <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{zone}</div>
                <div style={{ fontSize: 13, color: color.muted }}>14 trees · labels ready</div>
              </div>
            </div>
            <QuickAction label="Generate batch PDF" desc="Print-ready A4 sheet" />
            <a
              href={QR_CODE_IMAGE}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, marginTop: 8, fontSize: 13.5, fontWeight: 600, color: color.forest600, textDecoration: "none" }}
            >
              Download QR image
            </a>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
