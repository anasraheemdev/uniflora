import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction, StatCard, StatusBadge } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getContributorRecent, getContributorStats, getReviewQueue, displayId } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { getSessionUserId } from "@/lib/auth";

export default async function ContributorDashboardPage() {
  const user = await requireRole("contributor");
  const userId = (await getSessionUserId())!;
  const [stats, queue, recent] = await Promise.all([
    getContributorStats(userId),
    getReviewQueue(4),
    getContributorRecent(userId, 3),
  ]);

  return (
    <DashboardShell
      user={user}
      title="Contributor Dashboard"
      subtitle="Review student submissions, curate specimens, and verify identifications."
      activePath="/dashboard/contributor"
    >
      <div className="uf-grid-4 uf-grid-tiles" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="uf-split-dash" style={{ marginBottom: 28 }}>
        <Panel
          title="Review Queue"
          action={
            <Link href="/dashboard/contributor/reviews" className="uf-tap" style={{ color: color.forest600, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Open queue →
            </Link>
          }
        >
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ textAlign: "left", padding: "10px 22px", fontWeight: 700 }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Species</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Student</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "20px 22px", color: color.faint }}>Nothing to review.</td></tr>
              )}
              {queue.map((row) => (
                <tr key={row.id} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600, color: color.forest600 }}>{displayId(row.id)}</td>
                  <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: font.display }}>{row.species}</td>
                  <td style={{ padding: "14px 12px" }}>{row.submitter}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Panel title="Quick Actions">
            <div style={{ padding: "12px 16px", display: "grid", gap: 10 }}>
              <QuickAction label="Review Submissions" desc="Approve or request changes" />
              <QuickAction label="Upload Specimen Scan" desc="Digitise herbarium sheet" />
              <QuickAction label="Edit Species Record" desc="Update taxonomy and traits" />
              <QuickAction label="Identification Key" desc="Continue dichotomous key" />
            </div>
          </Panel>

          <Panel title="Recent Contributions">
            <div style={{ padding: "8px 0" }}>
              {recent.length === 0 && <div style={{ padding: "14px 22px", color: color.faint, fontSize: 14 }}>No contributions logged yet.</div>}
              {recent.map((r, i) => (
                <div key={i} className="uf-dashrow" style={{ padding: "14px 22px", borderTop: i > 0 ? `1px solid ${color.borderStrong}` : "none" }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15 }}>{r.action}</div>
                  <div style={{ fontSize: 13, color: color.muted, marginTop: 4 }}>{r.detail}</div>
                  <div style={{ fontSize: 12.5, color: color.faint, marginTop: 4 }}>{r.time}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ background: `linear-gradient(155deg, ${color.forest900}, ${color.forest800})`, borderRadius: 18, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: color.onDarkGold, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Workflow reminder</div>
          <p style={{ color: "#fff", fontSize: 16, margin: "10px 0 0", maxWidth: 560, lineHeight: 1.55 }}>
            Student submissions follow: <strong>Submission → Expert review → Approval → Publication</strong>. Review pending items within 48 hours.
          </p>
        </div>
        <Link href="/dashboard/contributor/reviews" className="uf-btn uf-btn-primary" style={{ flex: "0 0 auto", padding: "13px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
          Start reviewing
        </Link>
      </div>
    </DashboardShell>
  );
}
