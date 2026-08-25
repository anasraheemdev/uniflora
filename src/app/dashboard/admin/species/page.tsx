import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { color, font } from "@/lib/theme";
import { requireRole } from "@/lib/require-role";
import { getAllPlants } from "@/lib/data";

export default async function AdminSpeciesPage() {
  const user = await requireRole("admin");
  const plants = await getAllPlants();

  return (
    <DashboardShell user={user} title="Species Management" subtitle="Add, edit, and publish campus flora records." activePath="/dashboard/admin/species">
      <Panel title={`All Species (${plants.length} total)`}>
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: color.faint, fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "12px 22px" }}>Scientific name</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Family</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Type</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((p) => (
              <tr key={p.slug} className="uf-dashrow" style={{ borderTop: `1px solid ${color.borderStrong}` }}>
                <td style={{ padding: "14px 22px", fontStyle: "italic", fontFamily: font.display, fontWeight: 600 }}>{p.scientificName}</td>
                <td style={{ padding: "14px 12px" }}>{p.family}</td>
                <td style={{ padding: "14px 12px" }}>{p.type}</td>
                <td style={{ padding: "14px 12px", color: color.forest600, fontWeight: 600 }}>Published</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
    </DashboardShell>
  );
}
