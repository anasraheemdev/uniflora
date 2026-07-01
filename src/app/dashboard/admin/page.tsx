import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction, StatCard, StatusBadge } from "@/components/dashboard/DashboardUI";
import { ADMIN_ACTIVITY, ADMIN_PENDING, ADMIN_STATS } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");

  return (
    <DashboardShell
      user={user}
      title="Admin Dashboard"
      subtitle="Manage species, users, approvals, and platform analytics."
      activePath="/dashboard/admin"
    >
      <div className="uf-grid-4" style={{ marginBottom: 28 }}>
        {ADMIN_STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="uf-split-dash" style={{ marginBottom: 28 }}>
        <Panel
          title="Pending Approvals"
          action={
            <Link href="/dashboard/admin/approvals" style={{ color: "#2e6b3a", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              View all →
            </Link>
          }
        >
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ textAlign: "left", padding: "10px 22px", fontWeight: 700 }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Species</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Submitter</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_PENDING.map((row) => (
                <tr key={row.id} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600, color: "#2e6b3a" }}>{row.id}</td>
                  <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>{row.species}</td>
                  <td style={{ padding: "14px 12px", color: "#3f4a3a" }}>{row.submitter}</td>
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

          <Panel title="Species Richness by Zone">
            <div style={{ padding: "16px 22px 22px" }}>
              {[
                { zone: "Zone A — Main Avenue", pct: 88 },
                { zone: "Zone B — Science Block", pct: 72 },
                { zone: "Zone C — Library Lawn", pct: 65 },
                { zone: "Zone D — Hostels", pct: 54 },
              ].map((z) => (
                <div key={z.zone} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span>{z.zone}</span>
                    <span style={{ fontWeight: 700, color: "#2e6b3a" }}>{z.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "#eef0e2", borderRadius: 999 }}>
                    <div style={{ width: `${z.pct}%`, height: "100%", background: "#2e6b3a", borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Recent Activity">
        <div style={{ padding: "4px 0" }}>
          {ADMIN_ACTIVITY.map((a, i) => (
            <div key={i} className="uf-dashrow" style={{ display: "flex", gap: 16, padding: "14px 22px", borderTop: i > 0 ? "1px solid #f0ecdd" : "none", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2e6b3a", flex: "0 0 auto" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.action}</div>
                <div style={{ fontSize: 13, color: "#6b7360", marginTop: 2 }}>{a.detail}</div>
              </div>
              <div style={{ fontSize: 13, color: "#8a9682", textAlign: "right" }}>
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
