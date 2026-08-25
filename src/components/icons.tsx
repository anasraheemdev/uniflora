import Image from "next/image";
import { QR_CODE_IMAGE } from "@/lib/images";

type IconProps = { size?: number; color?: string; strokeWidth?: number };

export function LeafIcon({ size = 24, fill = "#eef7e6" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="none">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    </svg>
  );
}

/** Campus UniFlora QR code image (replaces placeholder SVG). */
export function QrCodeSvg({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={QR_CODE_IMAGE}
      alt="UniFlora QR code"
      width={size}
      height={size}
      className={className}
      style={{ display: "block", width: size, height: size, objectFit: "contain" }}
      unoptimized
    />
  );
}

/**
 * Small shared line-icon set for the glyphs repeated across many pages
 * (search bars, nav chevrons, close/menu buttons, map pins, arrows). Every
 * icon follows the same convention as the app's many one-off inline SVGs:
 * 24×24 viewBox, stroke-based, round caps/joins — so it drops in anywhere
 * without visual mismatch.
 */
function base(strokeWidth: number) {
  return {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function SearchIcon({ size = 20, color = "currentColor", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, color = "currentColor", strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, color = "currentColor", strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CloseIcon({ size = 22, color = "currentColor", strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function MenuIcon({ size = 24, color = "currentColor", strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function MapPinIcon({ size = 18, color = "currentColor", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function SparkleIcon({ size = 18, color = "currentColor", strokeWidth = 1.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(strokeWidth)} stroke={color}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}
