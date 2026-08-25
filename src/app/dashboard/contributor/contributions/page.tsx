import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { getContributorRecent } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { getSessionUserId } from "@/lib/auth";

export default async function ContributorContributionsPage() {
  const user = await requireRole("contributor");
  const userId = (await getSessionUserId())!;
  const recent = await getContributorRecent(userId, 50);

  return (
    <DashboardShell user={user} title="My Contributions" subtitle="Your verified edits, specimens, and identifications." activePath="/dashboard/contributor/contributions">
      <Panel title="Contribution history">
        {recent.length === 0 && <div style={{ padding: "20px 22px", color: color.faint }}>No contributions logged yet.</div>}
        {recent.map((r, i) => (
          <div key={i} className="uf-dashrow" style={{ padding: "16px 22px", borderTop: i > 0 ? `1px solid ${color.borderStrong}` : "none" }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16 }}>{r.action}</div>
            <div style={{ fontSize: 14, color: color.inkSoft, marginTop: 4 }}>{r.detail}</div>
            <div style={{ fontSize: 13, color: color.faint, marginTop: 4 }}>{r.time}</div>
          </div>
        ))}
      </Panel>
    </DashboardShell>
  );
}
