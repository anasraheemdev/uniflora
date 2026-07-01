import Image from "next/image";
import { QR_CODE_IMAGE } from "@/lib/images";

export function LeafIcon({ size = 24, fill = "#eaf5e4" }: { size?: number; fill?: string }) {
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
