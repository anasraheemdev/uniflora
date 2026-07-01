import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PLANTS } from "@/data/plants";
import { requireRole } from "@/lib/require-role";

export default async function StudentSubmitPage() {
  const user = await requireRole("student");

  return (
    <DashboardShell user={user} title="Submit Observation" subtitle="Upload a photo, add location, and suggest a species identification." activePath="/dashboard/student/submit">
      <div style={{ maxWidth: 640, background: "#fff", border: "1px solid #e6e1cf", borderRadius: 16, padding: 32 }}>
        <form>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Species (suggested)</label>
            <select style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", background: "#fbf9f1" }}>
              <option value="">Select a species…</option>
              {PLANTS.map((p) => (
                <option key={p.slug} value={p.slug}>{p.scientificName} — {p.commonName}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Campus zone</label>
            <select style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", background: "#fbf9f1" }}>
              <option>Zone A — Main Avenue</option>
              <option>Zone B — Science Block</option>
              <option>Zone C — Library Lawn</option>
              <option>Zone D — Hostels</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Photo</label>
            <div style={{ border: "2px dashed #cfe0c4", borderRadius: 12, padding: 32, textAlign: "center", background: "#fbf9f1", color: "#6b7360", fontSize: 14 }}>
              Drag & drop a plant photo, or click to browse
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Notes</label>
            <textarea rows={4} placeholder="Describe flowers, leaves, bark, or habitat…" style={{ width: "100%", border: "1px solid #e6e1cf", borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="uf-btn" style={{ background: "#2e6b3a", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Submit for review</button>
            <button type="button" style={{ background: "#fff", color: "#3f4a3a", border: "1px solid #e6e1cf", padding: "12px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save draft</button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
