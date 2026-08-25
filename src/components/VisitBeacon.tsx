"use client";

import { useEffect } from "react";

/**
 * Fire-and-forget visit counter for the Admin Analytics "Monthly visitors"
 * stat (src/lib/redis.ts). Runs once per browser session, not once per page
 * navigation — a full site session counts as one visit, matching what
 * "Monthly Visitors" meant in the original mock stat.
 */
export function VisitBeacon() {
  useEffect(() => {
    const key = "uf-visit-recorded";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/track-visit", { method: "POST", keepalive: true }).catch(() => {
      // Non-critical — a missed count isn't worth surfacing.
    });
  }, []);

  return null;
}
