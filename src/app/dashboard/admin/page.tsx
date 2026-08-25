import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction, StatCard, StatusBadge } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getActivityLog, getPendingApprovals, getAdminStats, displayId } from "@/lib/dashboard-data";
import { getCampusZones } from "@/lib/data";
import { requireRole } from "@/lib/require-role";

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");
  const [stats, pending, activity, zones] = await Promise.all([
    getAdminStats(),
    getPendingApprovals(4),
    getActivityLog(4),
    getCampusZones(),
  ]);
  const totalMapped = zones.reduce((sum, z) => sum + z.plantCount, 0) || 1;

  return (
    <DashboardShell
      user={user}
      title="Admin Dashboard"
      subtitle="Manage species, users, approvals, and platform analytics."
      activePath="/dashboard/admin"
    >
      <div className="uf-grid-4 uf-grid-tiles" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="uf-split-dash" style={{ marginBottom: 28 }}>
        <Panel
          title="Pending Approvals"
          action={
            <Link href="/dashboard/admin/approvals" style={{ display: "inline-flex", alignItems: "center", minHeight: 40, color: color.forest600, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              View all →
            </Link>
          }
        >
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ textAlign: "left", padding: "10px 22px", fontWeight: 700 }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Species</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Submitter</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "20px 22px", color: color.faint }}>Nothing pending review.</td></tr>
              )}
              {pending.map((row) => (
                <tr key={row.id} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600, color: color.forest600 }}>{displayId(row.id)}</td>
                  <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: font.display }}>{row.species}</td>
                  <td style={{ padding: "14px 12px", color: color.inkSoft }}>{row.submitter}</td>
                  <td style={{ padding: "14px 12px" }}><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Panel title="Quick Actions">
            <div style={{ padding: "12px 16px", display: "grid", gap: 10 }}>
              <QuickAction label="Add New Species" desc="Create a species record with taxonomy" />
              <QuickAction label="Manage Users" desc="Roles, permissions, and access" />
              <QuickAction label="Generate QR Labels" desc="Printable campus plant labels" />
              <QuickAction label="Export Data" desc="CSV, PDF, and GIS datasets" />
            </div>
          </Panel>

          <Panel title="Mapped Plants by Zone">
            <div style={{ padding: "16px 22px 22px" }}>
              {zones.map((z) => {
                const pct = Math.round((z.plantCount / totalMapped) * 100);
                return (
                  <div key={z.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span>{z.shortName}</span>
                      <span style={{ fontWeight: 700, color: color.forest600 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 8, background: color.statusDraftBg, borderRadius: 999 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: color.forest600, borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Recent Activity">
        <div style={{ padding: "4px 0" }}>
          {activity.length === 0 && <div style={{ padding: "20px 22px", color: color.faint }}>No activity logged yet.</div>}
          {activity.map((a, i) => (
            <div key={i} className="uf-dashrow" style={{ display: "flex", gap: 16, padding: "14px 22px", borderTop: i > 0 ? `1px solid ${color.borderStrong}` : "none", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color.forest600, flex: "0 0 auto" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.action}</div>
                <div style={{ fontSize: 13, color: color.muted, marginTop: 2 }}>{a.detail}</div>
              </div>
              <div style={{ fontSize: 13, color: color.faint, textAlign: "right" }}>
                <div>{a.user}</div>
                <div>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}
