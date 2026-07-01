import Image from "next/image";
import type { CSSProperties } from "react";
import { getPlantImage } from "@/lib/images";

type PlantImageProps = {
  slug?: string;
  src?: string;
  alt: string;
  style?: CSSProperties;
  className?: string;
  rounded?: boolean;
  radius?: number;
  priority?: boolean;
};

export function PlantImage({
  slug,
  src,
  alt,
  style,
  className = "",
  rounded,
  radius = 12,
  priority,
}: PlantImageProps) {
  const imageSrc = src ?? (slug ? getPlantImage(slug) : getPlantImage("azadirachta-indica"));
  const borderRadius = rounded ? radius : (style?.borderRadius ?? 0);

  return (
    <div
      className={`plant-image-slot ${className}`}
      style={{ ...style, borderRadius, position: "relative" }}
    >
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
