import type { CSSProperties } from "react";
import { color } from "@/lib/theme";

/**
 * Editorial eyebrow label — small caps with a gold dash — used to open a
 * section the way a magazine spread would ("FIELD NOTES", "ON CAMPUS").
 * Pass `dark` when placed on a forest-green background.
 */
export function SectionKicker({
  children,
  dark = false,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className="uf-kicker"
      style={{
        color: dark ? "#e7c983" : color.gold700,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
