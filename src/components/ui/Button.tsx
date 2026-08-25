import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { font, radius } from "@/lib/theme";

type Variant = "primary" | "secondary" | "ghost" | "outline-dark" | "gold";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  style?: CSSProperties;
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "uf-btn-primary",
  secondary: "uf-btn-secondary",
  ghost: "uf-btn-ghost",
  "outline-dark": "uf-btn-outline-dark",
  gold: "uf-btn-gold",
};

const SIZE_STYLE: Record<Size, CSSProperties> = {
  sm: { padding: "9px 16px", fontSize: 13.5 },
  md: { padding: "12px 22px", fontSize: 14.5 },
  lg: { padding: "15px 28px", fontSize: 15.5 },
};

/**
 * Shared button primitive — five visual variants covering every button
 * treatment used across the app (filled CTA, light-surface secondary,
 * text-only ghost, outline-on-dark, and the gold accent for featured
 * actions). Renders a `<Link>` when `href` is given, else a `<button>`.
 */
export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  fullWidth,
  icon,
  iconPosition = "right",
  className = "",
  style,
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: font.body,
    fontWeight: 600,
    borderRadius: radius.md,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    width: fullWidth ? "100%" : undefined,
    opacity: disabled ? 0.55 : 1,
    pointerEvents: disabled ? "none" : undefined,
    ...SIZE_STYLE[size],
    ...style,
  };

  const content = (
    <>
      {icon && iconPosition === "left" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </>
  );

  const classes = `${VARIANT_CLASS[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} style={baseStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} style={baseStyle}>
      {content}
    </button>
  );
}
