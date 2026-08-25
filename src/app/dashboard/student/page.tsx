import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, ProgressBar, QuickAction, StatCard, StatusBadge } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getLearningProgress, getStudentStats, getStudentSubmissions, displayId } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { getSessionUserId } from "@/lib/auth";
import { getStats } from "@/lib/data";

export default async function StudentDashboardPage() {
  const user = await requireRole("student");
  const userId = (await getSessionUserId())!;
  const [stats, submissions, learning, catalogueStats] = await Promise.all([
    getStudentStats(userId),
    getStudentSubmissions(userId, 4),
    getLearningProgress(userId),
    getStats(),
  ]);

  return (
    <DashboardShell
      user={user}
      title="Student Dashboard"
      subtitle="Submit observations, track your contributions, and learn campus flora."
      activePath="/dashboard/student"
    >
      <div className="uf-grid-4 uf-grid-tiles" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="uf-split-dash" style={{ marginBottom: 28 }}>
        <Panel
          title="My Submissions"
          action={
            <Link href="/dashboard/student/submissions" style={{ display: "inline-flex", alignItems: "center", minHeight: 40, color: color.forest600, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              View all →
            </Link>
          }
        >
          <div className="uf-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <th style={{ textAlign: "left", padding: "10px 22px", fontWeight: 700 }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Species</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Type</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "20px 22px", color: color.faint }}>No submissions yet — <Link href="/dashboard/student/submit" style={{ color: color.forest600 }}>submit your first observation</Link>.</td></tr>
              )}
              {submissions.map((row) => (
                <tr key={row.id} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                  <td style={{ padding: "14px 22px", fontWeight: 600, color: color.forest600 }}>{displayId(row.id)}</td>
                  <td style={{ padding: "14px 12px", fontStyle: "italic", fontFamily: font.display }}>{row.species}</td>
                  <td style={{ padding: "14px 12px" }}>{row.type}</td>
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
                <QuickAction label="Browse Campus Flora" desc={`${catalogueStats.species} documented species`} />
              </Link>
              <Link href="/learn" style={{ textDecoration: "none", color: "inherit" }}>
                <QuickAction label="Take a Quiz" desc="Test your plant knowledge" />
              </Link>
            </div>
          </Panel>

          <Panel title="Learning Progress">
            <div style={{ padding: "18px 22px 8px" }}>
              {learning.map((item) => (
                <ProgressBar key={item.title} value={item.progress} label={`${item.title} — ${item.label}`} />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ background: color.parchmentDeep, border: `1px solid ${color.borderStrong}`, borderRadius: 18, padding: "26px 30px" }}>
        <h3 style={{ fontFamily: font.display, fontWeight: 600, fontSize: 20, margin: "0 0 10px" }}>How contributions work</h3>
        <p style={{ fontSize: 15, color: color.inkSoft, lineHeight: 1.6, margin: 0 }}>
          Upload plant observations with photos and optional GPS coordinates. A contributor or taxonomist will review your submission. Once approved, your sighting appears on the campus map and species pages.
        </p>
      </div>
    </DashboardShell>
  );
}
