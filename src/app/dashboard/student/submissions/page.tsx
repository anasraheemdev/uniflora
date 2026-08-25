import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, StatusBadge } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getStudentSubmissions, displayId } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { getSessionUserId } from "@/lib/auth";

export default async function StudentSubmissionsPage() {
  const user = await requireRole("student");
  const userId = (await getSessionUserId())!;
  const submissions = await getStudentSubmissions(userId, 100);

  return (
    <DashboardShell user={user} title="My Submissions" subtitle="Track draft, pending, and approved contributions." activePath="/dashboard/student/submissions">
      <Panel title="All submissions">
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 22px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Species</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "20px 22px", color: color.faint }}>No submissions yet.</td></tr>
            )}
            {submissions.map((row) => (
              <tr key={row.id} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                <td style={{ padding: "14px 22px", fontWeight: 600, color: color.forest600 }}>{displayId(row.id)}</td>
                <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: font.display }}>{row.species}</td>
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
