import type { CSSProperties, ReactNode } from "react";

/** Consistent max-width content wrapper used on every page. */
export function Container({
  children,
  maxWidth = 1440,
  style,
  className = "",
}: {
  children: ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={`uf-page-pad ${className}`.trim()} style={{ maxWidth, margin: "0 auto", ...style }}>
      {children}
    </div>
  );
}
