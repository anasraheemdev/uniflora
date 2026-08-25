import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { color } from "@/lib/theme";
import { getAllPlants, getCampusZones } from "@/lib/data";
import { requireRole } from "@/lib/require-role";
import { submitObservationAction } from "./actions";

const inputStyle: React.CSSProperties = { width: "100%", border: `1px solid ${color.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 15, fontFamily: "inherit", background: color.parchmentDeep, boxSizing: "border-box", color: color.ink };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, fontSize: 14, marginBottom: 8, color: color.inkSoft };

export default async function StudentSubmitPage() {
  const user = await requireRole("student");
  const [plants, zones] = await Promise.all([getAllPlants(), getCampusZones()]);

  return (
    <DashboardShell user={user} title="Submit Observation" subtitle="Upload a photo, add location, and suggest a species identification." activePath="/dashboard/student/submit">
      <div style={{ maxWidth: 640, background: "#fff", border: `1px solid ${color.border}`, borderRadius: 18, padding: 32 }}>
        <form action={submitObservationAction}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Species (suggested)</label>
            <select name="species" style={inputStyle}>
              <option value="">Select a species…</option>
              {plants.map((p) => (
                <option key={p.slug} value={p.slug}>{p.scientificName} — {p.commonName}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Campus zone</label>
            <select name="zone" style={inputStyle}>
              <option value="">Select a zone…</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle} htmlFor="photo-input">Photo</label>
            <label
              htmlFor="photo-input"
              style={{ display: "block", border: `2px dashed ${color.sage200}`, borderRadius: 12, padding: 32, textAlign: "center", background: color.parchmentDeep, color: color.muted, fontSize: 14, cursor: "pointer" }}
            >
              Click to choose a plant photo (optional)
            </label>
            <input id="photo-input" type="file" name="photo" accept="image/*" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Notes</label>
            <textarea name="notes" rows={4} placeholder="Describe flowers, leaves, bark, or habitat…" style={{ ...inputStyle, background: "#fff", resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" name="intent" value="review" className="uf-btn uf-btn-primary" style={{ border: "none", padding: "13px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Submit for review
            </button>
            <button type="submit" name="intent" value="draft" className="uf-btn-secondary" style={{ padding: "13px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Save draft
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
