import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, ProgressBar, QuickAction, StatCard, StatusBadge } from "@/components/dashboard/DashboardUI";
import { STUDENT_LEARNING, STUDENT_STATS, STUDENT_SUBMISSIONS } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function StudentDashboardPage() {
  const user = await requireRole("student");

  return (
    <DashboardShell
      user={user}
      title="Student Dashboard"
      subtitle="Submit observations, track your contributions, and learn campus flora."
      activePath="/dashboard/student"
    >
      <div className="uf-grid-4" style={{ marginBottom: 28 }}>
        {STUDENT_STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="uf-split-dash" style={{ marginBottom: 28 }}>
        <Panel
          title="My Submissions"
          action={
            <Link href="/dashboard/student/submissions" style={{ color: "#2e6b3a", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              View all →
            </Link>
          }
        >
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ textAlign: "left", padding: "10px 22px", fontWeight: 700 }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Species</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Type</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {STUDENT_SUBMISSIONS.map((row) => (
                <tr key={row.id} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600, color: "#2e6b3a" }}>{row.id}</td>
                  <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif" }}>{row.species}</td>
                  <td style={{ padding: "14px 12px", color: "#3f4a3a" }}>{row.type}</td>
                  <td style={{ padding: "14px 12px" }}><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Panel title="Quick Actions">
            <div style={{ padding: "12px 16px", display: "grid", gap: 10 }}>
              <Link href="/dashboard/student/submit" style={{ textDecoration: "none", color: "inherit" }}>
                <QuickAction label="Submit Observation" desc="Photo, GPS, and identification" />
              </Link>
              <Link href="/explore" style={{ textDecoration: "none", color: "inherit" }}>
                <QuickAction label="Browse Campus Flora" desc="512 documented species" />
              </Link>
              <Link href="/learn" style={{ textDecoration: "none", color: "inherit" }}>
                <QuickAction label="Take a Quiz" desc="Test your plant knowledge" />
              </Link>
            </div>
          </Panel>

          <Panel title="Learning Progress">
            <div style={{ padding: "18px 22px 8px" }}>
              {STUDENT_LEARNING.map((item) => (
                <ProgressBar key={item.title} value={item.progress} label={`${item.title} — ${item.label}`} />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ background: "#eef0e2", border: "1px solid #e0e2cf", borderRadius: 16, padding: "26px 30px" }}>
        <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 20, margin: "0 0 10px" }}>How contributions work</h3>
        <p style={{ fontSize: 15, color: "#3f4a3a", lineHeight: 1.6, margin: 0 }}>
          Upload plant observations with photos and optional GPS coordinates. A contributor or taxonomist will review your submission. Once approved, your sighting appears on the campus map and species pages.
        </p>
      </div>
    </DashboardShell>
  );
}
