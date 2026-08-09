import Image from "next/image";
import type { CSSProperties } from "react";
import { getPlantImage } from "@/lib/images";
import type { PlantType } from "@/data/plants";

type PlantImageProps = {
  slug?: string;
  src?: string;
  alt: string;
  /** Drives the placeholder silhouette when no photograph exists. */
  type?: PlantType;
  style?: CSSProperties;
  className?: string;
  rounded?: boolean;
  radius?: number;
  priority?: boolean;
};

const PLACEHOLDER_TINTS: Record<string, [string, string]> = {
  Tree: ["#dfe9d5", "#b9d0aa"],
  Palm: ["#dcebdd", "#aecfb6"],
  Shrub: ["#f0e8cf", "#dcd0a5"],
  Subshrub: ["#f0e8cf", "#dcd0a5"],
  Climber: ["#e7dff0", "#cdc0e0"],
  Succulent: ["#d9ece6", "#aed3c8"],
  Herb: ["#e6edd2", "#c8d7a6"],
  Grass: ["#eaeed3", "#d2daa6"],
  Sedge: ["#e3ead4", "#c3d0a8"],
};

function PlaceholderIcon({ type }: { type?: PlantType }) {
  const stroke = "#3f6b47";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "Palm") {
    return (
      <g {...common}>
        <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
        <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
        <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l7.07-7.08c-1.95-1.96-5.27-1.8-7.42.35" />
        <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
      </g>
    );
  }
  if (type === "Tree") {
    return (
      <g {...common}>
        <path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.05a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z" />
        <path d="M12 19v3" />
      </g>
    );
  }
  if (type === "Grass" || type === "Sedge") {
    return (
      <g {...common}>
        <path d="M12 22c0-6 1-10 4-14" />
        <path d="M12 22c0-6-1-10-4-14" />
        <path d="M12 22c0-4 .5-7 2-10" />
      </g>
    );
  }
  if (type === "Climber") {
    return (
      <g {...common}>
        <path d="M7 21c0-8 3-12 10-16" />
        <path d="M10 13c-2-1-3-3-3-5 2 0 4 1 5 3" />
        <path d="M14 9c0-2 1-4 3-5 .5 2 0 4-1.5 5.5" />
      </g>
    );
  }
  if (type === "Succulent") {
    return (
      <g {...common}>
        <path d="M12 22V9" />
        <path d="M12 13c0-3-2-5-4-5 0 3 1 5 4 5Z" />
        <path d="M12 13c0-3 2-5 4-5 0 3-1 5-4 5Z" />
        <path d="M9 22h6" />
      </g>
    );
  }
  return (
    <g {...common}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </g>
  );
}

/**
 * Shows the species photograph when one exists.
 *
 * Most surveyed species have not been photographed yet. Rather than reusing
 * another species' picture, those render a typed botanical placeholder so the
 * page never implies a photo it does not have.
 */
export function PlantImage({
  slug,
  src,
  alt,
  type,
  style,
  className = "",
  rounded,
  radius = 12,
  priority,
}: PlantImageProps) {
  const imageSrc = src ?? (slug ? getPlantImage(slug) : null);
  const borderRadius = rounded ? radius : (style?.borderRadius ?? 0);

  if (!imageSrc) {
    const [from, to] = PLACEHOLDER_TINTS[type ?? "Herb"] ?? PLACEHOLDER_TINTS.Herb;
    return (
      <div
        className={`plant-image-slot ${className}`}
        style={{
          ...style,
          borderRadius,
          position: "relative",
          background: `linear-gradient(135deg, ${from}, ${to})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="img"
        aria-label={`${alt} — no photograph on file`}
      >
        <svg width="42%" height="42%" viewBox="0 0 24 24" style={{ maxWidth: 64, maxHeight: 64, opacity: 0.55 }}>
          <PlaceholderIcon type={type} />
        </svg>
      </div>
    );
  }

  return (
    <div className={`plant-image-slot ${className}`} style={{ ...style, borderRadius, position: "relative" }}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        style={{ objectFit: "cover", borderRadius }}
        priority={priority}
        unoptimized
      />
    </div>
  );
}
