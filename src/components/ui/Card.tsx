import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { color, radius, shadow } from "@/lib/theme";

type CardProps = {
  children: ReactNode;
  href?: string;
  hover?: boolean;
  padding?: number | string;
  style?: CSSProperties;
  className?: string;
};

/** Base surface used for every card/panel across the app: white, hairline
 * border, soft resting shadow, optional lift-on-hover via the shared
 * `.uf-card` class (hover states need real CSS, not inline styles). */
export function Card({ children, href, hover = true, padding, style, className = "" }: CardProps) {
  const base: CSSProperties = {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.card,
    padding,
    textDecoration: "none",
    color: "inherit",
    display: "block",
    ...style,
  };

  const classes = `${hover ? "uf-card" : ""} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} style={base}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} style={base}>
      {children}
    </div>
  );
}
