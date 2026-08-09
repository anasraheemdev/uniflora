import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel, ProgressBar } from "@/components/dashboard/DashboardUI";
import { STUDENT_LEARNING } from "@/data/dashboard";
import { requireRole } from "@/lib/require-role";

export default async function StudentLearningPage() {
  const user = await requireRole("student");

  return (
    <DashboardShell user={user} title="Learning Progress" subtitle="Track quizzes, guides, and identification modules." activePath="/dashboard/student/learning">
      <div className="uf-split-dash">
        <Panel title="Your progress">
          <div style={{ padding: "20px 22px" }}>
            {STUDENT_LEARNING.map((item) => (
              <ProgressBar key={item.title} value={item.progress} label={`${item.title} — ${item.label}`} />
            ))}
          </div>
        </Panel>
        <Panel title="Continue learning">
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/learn" className="uf-tap" style={{ color: "#2e6b3a", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Plant Identification →</Link>
            <Link href="/learn" className="uf-tap" style={{ color: "#2e6b3a", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Botanical Glossary →</Link>
            <Link href="/learn" className="uf-tap" style={{ color: "#2e6b3a", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Take a Quiz →</Link>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
