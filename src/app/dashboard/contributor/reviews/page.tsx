import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getReviewQueue, displayId } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { reviewSubmissionAction } from "./actions";

export default async function ContributorReviewsPage() {
  const user = await requireRole("contributor");
  const queue = await getReviewQueue(50);

  return (
    <DashboardShell user={user} title="Review Queue" subtitle="Verify student identifications and approve publications." activePath="/dashboard/contributor/reviews">
      <Panel title="Pending reviews">
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 22px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Species</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Student</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Submitted</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "20px 22px", color: color.faint }}>Nothing pending review.</td></tr>
            )}
            {queue.map((row) => (
              <tr key={row.id} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                <td style={{ padding: "14px 22px", fontWeight: 600, color: color.forest600 }}>{displayId(row.id)}</td>
                <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: font.display }}>{row.species}</td>
                <td style={{ padding: "14px 12px" }}>{row.submitter}</td>
                <td style={{ padding: "14px 12px", color: color.faint }}>{row.date}</td>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <form action={reviewSubmissionAction}>
                      <input type="hidden" name="submissionId" value={row.id} />
                      <input type="hidden" name="decision" value="Approved" />
                      <button type="submit" className="uf-btn uf-btn-primary" style={{ border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Approve
                      </button>
                    </form>
                    <form action={reviewSubmissionAction}>
                      <input type="hidden" name="submissionId" value={row.id} />
                      <input type="hidden" name="decision" value="Rejected" />
                      <button type="submit" className="uf-btn-secondary" style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Request changes
                      </button>
                    </form>
                  </div>
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
