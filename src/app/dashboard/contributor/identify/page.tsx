import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { color, font } from "@/lib/theme";
import { requireRole } from "@/lib/require-role";

export default async function ContributorIdentifyPage() {
  const user = await requireRole("contributor");

  return (
    <DashboardShell user={user} title="Plant Identification" subtitle="Interactive dichotomous keys for campus flora." activePath="/dashboard/contributor/identify">
      <div className="uf-grid-2">
        {["Trees", "Shrubs", "Herbs", "Palms"].map((key) => (
          <div key={key} className="uf-card" style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 20 }}>{key} Key</div>
            <p style={{ fontSize: 14, color: color.muted, margin: "8px 0 16px" }}>Branching identification guide for campus {key.toLowerCase()}.</p>
            <Link href="/learn" className="uf-tap" style={{ color: color.forest600, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Open key →</Link>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
