import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, ProgressBar } from "@/components/dashboard/DashboardUI";
import { color } from "@/lib/theme";
import { getLearningProgress } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { getSessionUserId } from "@/lib/auth";

export default async function StudentLearningPage() {
  const user = await requireRole("student");
  const userId = (await getSessionUserId())!;
  const learning = await getLearningProgress(userId);

  return (
    <DashboardShell user={user} title="Learning Progress" subtitle="Track quizzes, guides, and identification modules." activePath="/dashboard/student/learning">
      <div className="uf-split-dash">
        <Panel title="Your progress">
          <div style={{ padding: "20px 22px" }}>
            {learning.map((item) => (
              <ProgressBar key={item.title} value={item.progress} label={`${item.title} — ${item.label}`} />
            ))}
          </div>
        </Panel>
        <Panel title="Continue learning">
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/learn" className="uf-tap" style={{ color: color.forest600, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Plant Identification →</Link>
            <Link href="/learn" className="uf-tap" style={{ color: color.forest600, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Botanical Glossary →</Link>
            <Link href="/learn" className="uf-tap" style={{ color: color.forest600, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Take a Quiz →</Link>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
