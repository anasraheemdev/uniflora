import type { CSSProperties } from "react";
import { color, font, radius } from "@/lib/theme";

type Tone = "sage" | "gold" | "dark" | "outline";

const TONE_STYLE: Record<Tone, CSSProperties> = {
  sage: { background: color.sage100, color: color.forest800 },
  gold: { background: color.gold100, color: color.gold700 },
  dark: { background: "rgba(255,255,255,.14)", color: "#fff" },
  outline: { background: "transparent", color: color.ink, border: `1px solid ${color.border}` },
};

/** Small pill label — species type tags, "Featured", zone tags, filter chips. */
export function Badge({
  children,
  tone = "sage",
  style,
}: {
  children: React.ReactNode;
  tone?: Tone;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: font.body,
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: 0.2,
        padding: "5px 11px",
        borderRadius: radius.pill,
        lineHeight: 1.3,
        ...TONE_STYLE[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

const STATUS_STYLE: Record<string, CSSProperties> = {
  Pending: { background: color.statusPendingBg, color: color.statusPendingFg },
  Review: { background: color.statusReviewBg, color: color.statusReviewFg },
  Approved: { background: color.statusApprovedBg, color: color.statusApprovedFg },
  Draft: { background: color.statusDraftBg, color: color.statusDraftFg },
};

/** Workflow-status pill used across dashboard tables. */
export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.Pending;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 11px",
        borderRadius: radius.sm,
        fontFamily: font.body,
        ...style,
      }}
    >
      {status}
    </span>
  );
}
