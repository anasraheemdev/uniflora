import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { CONTRIBUTOR_QUEUE } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function ContributorReviewsPage() {
  const user = await requireRole("contributor");

  return (
    <DashboardShell user={user} title="Review Queue" subtitle="Verify student identifications and approve publications." activePath="/dashboard/contributor/reviews">
      <Panel title="Pending reviews">
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 22px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Species</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Student</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Submitted</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {CONTRIBUTOR_QUEUE.map((row) => (
              <tr key={row.id} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                <td style={{ padding: "14px 22px", fontWeight: 600, color: "#2e6b3a" }}>{row.id}</td>
                <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>{row.species}</td>
                <td style={{ padding: "14px 12px" }}>{row.student}</td>
                <td style={{ padding: "14px 12px", color: "#8a9682" }}>{row.submitted}</td>
                <td style={{ padding: "14px 12px" }}>
                  <button type="button" className="uf-btn" style={{ background: "#2e6b3a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 8, fontFamily: "inherit" }}>Approve</button>
                  <button type="button" style={{ background: "#fff", color: "#3f4a3a", border: "1px solid #e6e1cf", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Request changes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
    </DashboardShell>
  );
}
