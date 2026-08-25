import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, StatusBadge } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getPendingApprovals, displayId } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";

export default async function AdminApprovalsPage() {
  const user = await requireRole("admin");
  const pending = await getPendingApprovals(50);

  return (
    <DashboardShell user={user} title="Approvals" subtitle="Review and approve student and contributor submissions." activePath="/dashboard/admin/approvals">
      <Panel title="Submission queue">
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 22px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Species</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Submitter</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "20px 22px", color: color.faint }}>Nothing pending review.</td></tr>
            )}
            {pending.map((row) => (
              <tr key={row.id} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                <td style={{ padding: "14px 22px", fontWeight: 600, color: color.forest600 }}>{displayId(row.id)}</td>
                <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: font.display }}>{row.species}</td>
                <td style={{ padding: "14px 12px" }}>{row.submitter}</td>
                <td style={{ padding: "14px 12px" }}>{row.type}</td>
                <td style={{ padding: "14px 12px", color: color.faint }}>{row.date}</td>
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
