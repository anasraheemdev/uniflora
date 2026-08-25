import type { UserRole } from "@/types/auth";
import { ROLE_LABELS } from "@/types/auth";
import { color, font } from "@/lib/theme";
import {
  IconAnalytics,
  IconHerbarium,
  IconKeys,
  IconLearning,
  IconPending,
  IconPhotos,
  IconSpecies,
  IconSubmissions,
  IconUsers,
  IconVerified,
} from "@/components/dashboard/DashboardIcons";

export { StatusBadge } from "@/components/ui/Badge";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon?: string;
};

const ICONS: Record<string, React.ReactNode> = {
  species: <IconSpecies size={26} stroke={color.forest600} strokeWidth={1.6} />,
  users: <IconUsers size={26} stroke={color.forest600} strokeWidth={1.6} />,
  pending: <IconPending size={26} strokeWidth={1.6} />,
  visitors: <IconAnalytics size={26} stroke={color.forest600} strokeWidth={1.6} />,
  verified: <IconVerified size={26} stroke={color.forest600} strokeWidth={1.6} />,
  specimen: <IconHerbarium size={26} stroke={color.forest600} strokeWidth={1.6} />,
  keys: <IconKeys size={26} stroke={color.forest600} strokeWidth={1.6} />,
  submissions: <IconSubmissions size={26} stroke={color.forest600} strokeWidth={1.6} />,
  approved: <IconVerified size={26} stroke={color.forest600} strokeWidth={1.6} />,
  photos: <IconPhotos size={26} stroke={color.forest600} strokeWidth={1.6} />,
  quiz: <IconLearning size={26} stroke={color.forest600} strokeWidth={1.6} />,
};

export function StatCard({ label, value, change, icon = "species" }: StatCardProps) {
  return (
    <div className="uf-card" style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 2px rgba(20,40,25,.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13.5, color: color.muted, fontWeight: 600 }}>{label}</div>
          <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 600, marginTop: 9, lineHeight: 1, color: color.ink }}>{value}</div>
          <div style={{ fontSize: 13, color: color.forest600, fontWeight: 600, marginTop: 9 }}>{change}</div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: color.sage100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {ICONS[icon] ?? ICONS.species}
        </div>
      </div>
    </div>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span style={{ background: "rgba(182,134,45,.2)", color: color.onDarkGold, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
      {ROLE_LABELS[role]}
    </span>
  );
}

export function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${color.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 2px rgba(20,40,25,.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${color.borderStrong}` }}>
        <h2 style={{ fontFamily: font.display, fontWeight: 600, fontSize: 18, margin: 0, color: color.ink }}>{title}</h2>
        {action}
      </div>
      <div style={{ padding: "8px 0" }}>{children}</div>
    </div>
  );
}

export function QuickAction({ label, desc }: { label: string; desc: string }) {
  return (
    <button
      type="button"
      className="uf-dl"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        padding: 16,
        border: `1px solid ${color.border}`,
        borderRadius: 12,
        background: color.parchmentDeep,
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        width: "100%",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 14.5, color: color.ink }}>{label}</span>
      <span style={{ fontSize: 13, color: color.muted }}>{desc}</span>
    </button>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
        <span style={{ fontWeight: 600, color: color.ink }}>{label}</span>
        <span style={{ color: color.forest600, fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: color.statusDraftBg, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: `linear-gradient(90deg, ${color.forest600}, ${color.forest500})`, borderRadius: 999 }} />
      </div>
    </div>
  );
}
