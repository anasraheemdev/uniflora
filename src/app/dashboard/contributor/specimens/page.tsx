import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PlantImage } from "@/components/ui/PlantImage";
import { color, font } from "@/lib/theme";
import { getSpecimens } from "@/lib/data";
import { requireRole } from "@/lib/require-role";

export default async function ContributorSpecimensPage() {
  const user = await requireRole("contributor");
  const specimens = await getSpecimens();

  return (
    <DashboardShell user={user} title="Herbarium Specimens" subtitle="Curate digitised voucher sheets and metadata." activePath="/dashboard/contributor/specimens">
      <div className="uf-grid-3">
        {specimens.slice(0, 6).map((s) => (
          <div key={s.voucher} className="uf-card" style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, overflow: "hidden" }}>
            <PlantImage slug={s.slug} alt={s.scientificName} style={{ width: "100%", height: 160 }} />
            <div style={{ padding: 16 }}>
              <div style={{ fontStyle: "italic", fontFamily: font.display, fontWeight: 600 }}>{s.scientificName}</div>
              <div style={{ fontSize: 13, color: color.faint, marginTop: 4 }}>{s.voucher} · {s.collector}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
