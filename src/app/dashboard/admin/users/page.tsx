import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction } from "@/components/dashboard/DashboardUI";
import { requireRole } from "@/lib/require-role";

const USERS = [
  { name: "Dr. A. Rehman", email: "admin@uniflora.edu", role: "Administrator", status: "Active" },
  { name: "S. Iqbal", email: "curator@uniflora.edu", role: "Contributor", status: "Active" },
  { name: "M. Zahra", email: "student@uniflora.edu", role: "Student", status: "Active" },
  { name: "A. Khan", email: "akhan@uniflora.edu", role: "Student", status: "Active" },
  { name: "R. Ali", email: "rali@uniflora.edu", role: "Contributor", status: "Pending" },
];

export default async function AdminUsersPage() {
  const user = await requireRole("admin");

  return (
    <DashboardShell user={user} title="User Management" subtitle="Manage roles, permissions, and access." activePath="/dashboard/admin/users">
      <div className="uf-split-users">
        <Panel title="Registered users">
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 22px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.email} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "14px 12px", color: "#6b7360" }}>{u.email}</td>
                  <td style={{ padding: "14px 12px" }}>{u.role}</td>
                  <td style={{ padding: "14px 12px", color: u.status === "Active" ? "#2e6b3a" : "#96702b", fontWeight: 600 }}>{u.status}</td>
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
