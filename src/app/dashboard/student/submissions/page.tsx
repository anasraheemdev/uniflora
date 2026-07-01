import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, StatusBadge } from "@/components/dashboard/DashboardUI";
import { STUDENT_SUBMISSIONS } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function StudentSubmissionsPage() {
  const user = await requireRole("student");

  return (
    <DashboardShell user={user} title="My Submissions" subtitle="Track draft, pending, and approved contributions." activePath="/dashboard/student/submissions">
      <Panel title="All submissions">
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 22px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Species</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {STUDENT_SUBMISSIONS.map((row) => (
              <tr key={row.id} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                <td style={{ padding: "14px 22px", fontWeight: 600, color: "#2e6b3a" }}>{row.id}</td>
                <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>{row.species}</td>
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
