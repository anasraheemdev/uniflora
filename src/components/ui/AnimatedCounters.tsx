"use client";

import { useEffect, useState } from "react";

export type Counts = {
  species: number;
  families: number;
  genera: number;
  locations: number;
};

/** Counts up to the real survey totals (fetched server-side, passed in as `targets`) on mount. */
export function useAnimatedStats(targets: Counts, animate = true): Counts {
  const [values, setValues] = useState<Counts>({ species: 0, families: 0, genera: 0, locations: 0 });

  useEffect(() => {
    if (!animate) {
      setValues(targets);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValues({
        species: Math.round(targets.species * eased),
        families: Math.round(targets.families * eased),
        genera: Math.round(targets.genera * eased),
        locations: Math.round(targets.locations * eased),
      });
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- targets is a fresh object each render (server-fetched props); re-keying the animation on its identity would restart the count-up on every parent re-render.
  }, [animate]);

  return values;
}
