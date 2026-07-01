import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { ADMIN_PENDING } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";
import { StatusBadge } from "@/components/dashboard/DashboardUI";

export default async function AdminApprovalsPage() {
  const user = await requireRole("admin");

  return (
    <DashboardShell user={user} title="Approvals" subtitle="Review and approve student and contributor submissions." activePath="/dashboard/admin/approvals">
      <Panel title="Submission queue">
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 22px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Species</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Submitter</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_PENDING.map((row) => (
              <tr key={row.id} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                <td style={{ padding: "14px 22px", fontWeight: 600, color: "#2e6b3a" }}>{row.id}</td>
                <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>{row.species}</td>
                <td style={{ padding: "14px 12px" }}>{row.submitter}</td>
                <td style={{ padding: "14px 12px" }}>{row.type}</td>
                <td style={{ padding: "14px 12px", color: "#8a9682" }}>{row.date}</td>
                <td style={{ padding: "14px 12px" }}><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
    </DashboardShell>
  );
}
