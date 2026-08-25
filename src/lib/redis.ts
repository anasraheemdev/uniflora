/**
 * Upstash Redis — caching, rate limiting, and a visitor counter, all
 * optional. Every export here degrades gracefully to "no cache" / "no
 * limit" / "no count" when `UPSTASH_REDIS_REST_URL` /
 * `UPSTASH_REDIS_REST_TOKEN` aren't set, so the app works identically
 * without an Upstash account — Redis makes it faster and adds a couple of
 * real capabilities, it is never a hard dependency.
 */
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let client: Redis | null | undefined;

function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

/**
 * Cache-aside wrapper for the read-heavy, rarely-changing queries in
 * `src/lib/data.ts` (species/families/campus map — the exact data the map
 * and Explore pages reload on every visit). Falls straight through to `fn`
 * with no caching when Redis isn't configured.
 */
export async function withCache<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
  const redis = getRedis();
  if (!redis) return fn();

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;
  } catch {
    // A flaky cache read shouldn't take the page down — fall through to a live fetch.
  }

  const value = await fn();
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // Same here: a failed cache write just means the next request also hits Postgres.
  }
  return value;
}

/** Invalidates one or more cached keys — call after a write that changes cached data. */
export async function invalidateCache(...keys: string[]) {
  const redis = getRedis();
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // Worst case the stale entry lives out its TTL.
  }
}

let assistantLimiter: Ratelimit | null | undefined;

/** 20 requests per 10 minutes per client — the AI assistant costs real OpenAI credits per call. */
function getAssistantLimiter(): Ratelimit | null {
  if (assistantLimiter !== undefined) return assistantLimiter;
  const redis = getRedis();
  assistantLimiter = redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "10 m"), prefix: "ratelimit:assistant" })
    : null;
  return assistantLimiter;
}

/** Returns `{ ok: true }` when the request may proceed, `{ ok: false, retryAfterSeconds }` otherwise. */
export async function checkAssistantRateLimit(identifier: string): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const limiter = getAssistantLimiter();
  if (!limiter) return { ok: true };

  try {
    const result = await limiter.limit(identifier);
    if (result.success) return { ok: true };
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
  } catch {
    // Redis hiccup — fail open rather than blocking every assistant request.
    return { ok: true };
  }
}

// ── Visitor counter (feeds the Admin Analytics "Monthly visitors" stat) ────

function dayKey(date = new Date()): string {
  return `visitors:${date.toISOString().slice(0, 10)}`;
}

/** Fire-and-forget: called once per page load from a client beacon, never blocks a render. */
export async function recordVisit() {
  const redis = getRedis();
  if (!redis) return;
  try {
    const key = dayKey();
    await redis.incr(key);
    await redis.expire(key, 60 * 60 * 24 * 32);
  } catch {
    // A missed count is not worth failing a request over.
  }
}

/** Daily counts for the last N days (today first), for the analytics chart — `null` entries mean Redis isn't configured. */
export async function getDailyVisitorCounts(days = 30): Promise<(number | null)[]> {
  const redis = getRedis();
  if (!redis) return Array(days).fill(null);

  const keys = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return dayKey(d);
  });

  try {
    const values = await redis.mget<number[]>(...keys);
    return values.map((v) => v ?? 0);
  } catch {
    return Array(days).fill(null);
  }
}

export async function getMonthlyVisitorCount(): Promise<number | null> {
  const counts = await getDailyVisitorCounts(30);
  if (counts.every((c) => c === null)) return null;
  return counts.reduce((sum: number, c) => sum + (c ?? 0), 0);
}
