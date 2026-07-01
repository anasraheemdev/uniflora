import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, QuickAction, StatCard, StatusBadge } from "@/components/dashboard/DashboardUI";
import { CONTRIBUTOR_QUEUE, CONTRIBUTOR_RECENT, CONTRIBUTOR_STATS } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function ContributorDashboardPage() {
  const user = await requireRole("contributor");

  return (
    <DashboardShell
      user={user}
      title="Contributor Dashboard"
      subtitle="Review student submissions, curate specimens, and verify identifications."
      activePath="/dashboard/contributor"
    >
      <div className="uf-grid-4" style={{ marginBottom: 28 }}>
        {CONTRIBUTOR_STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="uf-split-dash" style={{ marginBottom: 28 }}>
        <Panel
          title="Review Queue"
          action={
            <Link href="/dashboard/contributor/reviews" style={{ color: "#2e6b3a", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Open queue →
            </Link>
          }
        >
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ textAlign: "left", padding: "10px 22px", fontWeight: 700 }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Species</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Student</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {CONTRIBUTOR_QUEUE.map((row) => (
                <tr key={row.id} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600, color: "#2e6b3a" }}>{row.id}</td>
                  <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>{row.species}</td>
                  <td style={{ padding: "14px 12px" }}>{row.student}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <StatusBadge status={row.confidence === "High" ? "Approved" : row.confidence === "Medium" ? "Review" : "Pending"} />
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
              {CONTRIBUTOR_RECENT.map((r, i) => (
                <div key={i} className="uf-dashrow" style={{ padding: "14px 22px", borderTop: i > 0 ? "1px solid #f0ecdd" : "none" }}>
                  <div style={{ fontStyle: "italic", fontFamily: "var(--font-playfair), serif", fontWeight: 600, fontSize: 15 }}>{r.species}</div>
                  <div style={{ fontSize: 13, color: "#6b7360", marginTop: 4 }}>{r.action}</div>
                  <div style={{ fontSize: 12.5, color: "#8a9682", marginTop: 4 }}>{r.date}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ background: "#12341f", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div style={{ color: "#a7d493", fontSize: 12.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Workflow reminder</div>
          <p style={{ color: "#fff", fontSize: 16, margin: "10px 0 0", maxWidth: 560, lineHeight: 1.55 }}>
            Student submissions follow: <strong>Submission → Expert review → Approval → Publication</strong>. Review pending items within 48 hours.
          </p>
        </div>
        <Link href="/dashboard/contributor/reviews" className="uf-btn" style={{ flex: "0 0 auto", background: "#2e6b3a", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 14.5 }}>
          Start reviewing
        </Link>
      </div>
    </DashboardShell>
  );
}
