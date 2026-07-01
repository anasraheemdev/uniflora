import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { requireRole } from "@/lib/require-role";

export default async function AdminAnalyticsPage() {
  const user = await requireRole("admin");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const visitors = [3200, 3800, 4100, 4500, 4600, 4820];

  return (
    <DashboardShell user={user} title="Analytics" subtitle="Platform usage, mapping progress, and species trends." activePath="/dashboard/admin/analytics">
      <Panel title="Monthly visitors">
        <div style={{ padding: "24px 22px 28px", display: "flex", alignItems: "flex-end", gap: 16, height: 220 }}>
          {months.map((m, i) => (
            <div key={m} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: `${(visitors[i] / 5000) * 160}px`, background: "linear-gradient(180deg,#4f8f43,#2e6b3a)", borderRadius: "8px 8px 4px 4px", minHeight: 24 }} />
              <div style={{ fontSize: 12, color: "#8a9682", marginTop: 10, fontWeight: 600 }}>{m}</div>
              <div style={{ fontSize: 11, color: "#6b7360", marginTop: 2 }}>{visitors[i].toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}
