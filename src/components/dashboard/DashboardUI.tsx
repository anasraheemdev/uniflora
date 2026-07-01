import type { UserRole } from "@/types/auth";
import { ROLE_LABELS } from "@/types/auth";
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

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon?: string;
};

const ICONS: Record<string, React.ReactNode> = {
  species: <IconSpecies size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  users: <IconUsers size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  pending: <IconPending size={28} strokeWidth={1.6} />,
  visitors: <IconAnalytics size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  verified: <IconVerified size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  specimen: <IconHerbarium size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  keys: <IconKeys size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  submissions: <IconSubmissions size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  approved: <IconVerified size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  photos: <IconPhotos size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
  quiz: <IconLearning size={28} stroke="#2e6b3a" strokeWidth={1.6} />,
};

export function StatCard({ label, value, change, icon = "species" }: StatCardProps) {
  return (
    <div className="uf-card" style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, padding: "22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13.5, color: "#6b7360", fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 13, color: "#2e6b3a", fontWeight: 600, marginTop: 8 }}>{change}</div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#e2ecda", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {ICONS[icon] ?? ICONS.species}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    Pending: { bg: "#f2e6d0", color: "#96702b" },
    Review: { bg: "#e8edf5", color: "#4a6080" },
    Approved: { bg: "#dce9d4", color: "#2e6b3a" },
    Draft: { bg: "#eef0e2", color: "#6b7360" },
  };
  const style = colors[status] ?? colors.Pending;

  return (
    <span style={{ background: style.bg, color: style.color, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span style={{ background: "rgba(127,191,107,.2)", color: "#a7d493", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
      {ROLE_LABELS[role]}
    </span>
  );
}

export function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e6e1cf", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #f0ecdd" }}>
        <h2 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 18, margin: 0 }}>{title}</h2>
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
        border: "1px solid #e6e1cf",
        borderRadius: 12,
        background: "#fbf9f1",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
        width: "100%",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1e2b1f" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#6b7360" }}>{desc}</span>
    </button>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ color: "#2e6b3a", fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: "#eef0e2", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: "linear-gradient(90deg,#2e6b3a,#4f8f43)", borderRadius: 999 }} />
      </div>
    </div>
  );
}
