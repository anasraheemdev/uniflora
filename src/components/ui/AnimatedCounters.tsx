"use client";

import { useEffect, useState } from "react";
import { STATS } from "@/data/plants";

type AnimatedCountersProps = {
  animate?: boolean;
};

export function AnimatedCounters({ animate = true }: AnimatedCountersProps) {
  const [values, setValues] = useState({ s: 0, f: 0, l: 0, i: 0 });

  useEffect(() => {
    const targets = {
      s: STATS.species,
      f: STATS.families,
      l: STATS.locations,
      i: STATS.images,
    };

    if (!animate) {
      setValues(targets);
      return;
    }

    const dur = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setValues({
        s: Math.round(targets.s * e),
        f: Math.round(targets.f * e),
        l: Math.round(targets.l * e),
        i: Math.round(targets.i * e),
      });
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [animate]);

  return { values };
}

export function useAnimatedStats(animate = true) {
  const [values, setValues] = useState({ s: 0, f: 0, l: 0, i: 0 });

  useEffect(() => {
    const targets = {
      s: STATS.species,
      f: STATS.families,
      l: STATS.locations,
      i: STATS.images,
    };

    if (!animate) {
      setValues(targets);
      return;
    }

    const dur = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setValues({
        s: Math.round(targets.s * e),
        f: Math.round(targets.f * e),
        l: Math.round(targets.l * e),
        i: Math.round(targets.i * e),
      });
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [animate]);

  return values;
}
