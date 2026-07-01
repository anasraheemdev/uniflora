import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { CONTRIBUTOR_RECENT } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function ContributorContributionsPage() {
  const user = await requireRole("contributor");

  return (
    <DashboardShell user={user} title="My Contributions" subtitle="Your verified edits, specimens, and identifications." activePath="/dashboard/contributor/contributions">
      <Panel title="Contribution history">
        {CONTRIBUTOR_RECENT.map((r, i) => (
          <div key={i} className="uf-dashrow" style={{ padding: "16px 22px", borderTop: i > 0 ? "1px solid #f0ecdd" : "none" }}>
            <div style={{ fontStyle: "italic", fontFamily: "var(--font-playfair), serif", fontWeight: 600, fontSize: 16 }}>{r.species}</div>
            <div style={{ fontSize: 14, color: "#3f4a3a", marginTop: 4 }}>{r.action}</div>
            <div style={{ fontSize: 13, color: "#8a9682", marginTop: 4 }}>{r.date}</div>
          </div>
        ))}
      </Panel>
    </DashboardShell>
  );
}
