import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction } from "@/components/dashboard/DashboardUI";
import { color } from "@/lib/theme";
import { ROLE_LABELS } from "@/types/auth";
import type { UserRole } from "@/types/auth";
import { getAllUsers } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";

export default async function AdminUsersPage() {
  const user = await requireRole("admin");
  const users = await getAllUsers();

  return (
    <DashboardShell user={user} title="User Management" subtitle="Manage roles, permissions, and access." activePath="/dashboard/admin/users">
      <div className="uf-split-users">
        <Panel title="Registered users">
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 22px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "14px 12px", color: color.muted }}>{u.email}</td>
                  <td style={{ padding: "14px 12px" }}>{ROLE_LABELS[u.role as UserRole] ?? u.role}</td>
                  <td style={{ padding: "14px 12px", color: u.status === "Active" ? color.forest600 : color.gold700, fontWeight: 600 }}>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>
        <Panel title="Actions">
          <div style={{ padding: 16, display: "grid", gap: 10 }}>
            <QuickAction label="Invite user" desc="Send email invitation" />
            <QuickAction label="Export user list" desc="CSV download" />
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
