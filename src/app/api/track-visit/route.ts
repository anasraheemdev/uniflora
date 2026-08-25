import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/redis";

/** Fired once per page load by <VisitBeacon> (src/components/VisitBeacon.tsx). */
export async function POST() {
  await recordVisit();
  return new NextResponse(null, { status: 204 });
}
