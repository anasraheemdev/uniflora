import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Panel } from "@/components/dashboard/DashboardUI";
import { requireRole } from "@/lib/require-role";
import { PLANTS } from "@/data/plants";

export default async function AdminSpeciesPage() {
  const user = await requireRole("admin");

  return (
    <DashboardShell user={user} title="Species Management" subtitle="Add, edit, and publish campus flora records." activePath="/dashboard/admin/species">
      <Panel title={`All Species (${PLANTS.length} shown · 512 total)`}>
        <div className="uf-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: "#8a9682", fontSize: 12, textTransform: "uppercase" }}>
              <th style={{ textAlign: "left", padding: "12px 22px" }}>Scientific name</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Family</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Type</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {PLANTS.map((p) => (
              <tr key={p.slug} className="uf-dashrow" style={{ borderTop: "1px solid #f0ecdd" }}>
                <td style={{ padding: "14px 22px", fontStyle: "italic", fontFamily: "var(--font-playfair), serif", fontWeight: 600 }}>{p.scientificName}</td>
                <td style={{ padding: "14px 12px" }}>{p.family}</td>
                <td style={{ padding: "14px 12px" }}>{p.type}</td>
                <td style={{ padding: "14px 12px", color: "#2e6b3a", fontWeight: 600 }}>Published</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
    </DashboardShell>
  );
}
