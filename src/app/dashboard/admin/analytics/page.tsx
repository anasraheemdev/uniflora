import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { color } from "@/lib/theme";
import { requireRole } from "@/lib/require-role";
import { getDailyVisitorCounts } from "@/lib/redis";

export default async function AdminAnalyticsPage() {
  const user = await requireRole("admin");
  const daily = await getDailyVisitorCounts(14);
  const configured = daily.some((c) => c !== null);
  const max = Math.max(1, ...daily.map((c) => c ?? 0));

  // getDailyVisitorCounts returns today-first; charts read left-to-right chronologically.
  const days = daily
    .map((count, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return { label: date.toLocaleDateString("en-GB", { weekday: "short" }), count };
    })
    .reverse();

  return (
    <DashboardShell user={user} title="Analytics" subtitle="Platform usage, mapping progress, and species trends." activePath="/dashboard/admin/analytics">
      <Panel title="Visitors — last 14 days">
        {configured ? (
          <div style={{ padding: "24px 22px 28px", display: "flex", alignItems: "flex-end", gap: 10, height: 220 }}>
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    height: `${Math.max(6, ((d.count ?? 0) / max) * 160)}px`,
                    background: `linear-gradient(180deg, ${color.forest500}, ${color.forest600})`,
                    borderRadius: "8px 8px 4px 4px",
                  }}
                />
                <div style={{ fontSize: 11.5, color: color.faint, marginTop: 10, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 11, color: color.muted, marginTop: 2 }}>{d.count ?? 0}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "40px 22px", textAlign: "center", color: color.muted, fontSize: 14.5 }}>
            Set <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> to start tracking real
            visitor counts here.
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}
