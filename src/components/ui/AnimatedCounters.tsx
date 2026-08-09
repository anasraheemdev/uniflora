"use client";

import { useEffect, useState } from "react";
import { STATS } from "@/data/plants";

type Counts = {
  species: number;
  families: number;
  genera: number;
  locations: number;
};

const TARGETS: Counts = {
  species: STATS.species,
  families: STATS.families,
  genera: STATS.genera,
  locations: STATS.locations,
};

/** Counts up to the real survey totals on mount. */
export function useAnimatedStats(animate = true): Counts {
  const [values, setValues] = useState<Counts>({ species: 0, families: 0, genera: 0, locations: 0 });

  useEffect(() => {
    if (!animate) {
      setValues(TARGETS);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValues({
        species: Math.round(TARGETS.species * eased),
        families: Math.round(TARGETS.families * eased),
        genera: Math.round(TARGETS.genera * eased),
        locations: Math.round(TARGETS.locations * eased),
      });
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  return values;
}
