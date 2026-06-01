import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Uses Upstash Redis for true global rate limiting when configured
// (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Falls back to a
// per-instance in-memory limiter otherwise (fine for casual abuse; not global).

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);
const redis = hasUpstash ? Redis.fromEnv() : null;
const limiters = new Map<string, Ratelimit>();

export type RateLimitResult = { ok: boolean; remaining: number; retryAfter: number };

// ---- in-memory fallback (per serverless instance) ----
type Bucket = { count: number; reset: number };
const memBuckets = new Map<string, Bucket>();

function memLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (memBuckets.size > 5000) {
    for (const [k, b] of memBuckets) if (now > b.reset) memBuckets.delete(k);
  }
  const b = memBuckets.get(key);
  if (!b || now > b.reset) {
    memBuckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

function getLimiter(name: string, limit: number, windowMs: number): Ratelimit {
  let l = limiters.get(name);
  if (!l) {
    const window = `${Math.max(1, Math.round(windowMs / 1000))} s` as Duration;
    l = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `valora:rl:${name}`,
      analytics: false,
    });
    limiters.set(name, l);
  }
  return l;
}

/**
 * Rate limit `key` under a named policy. Global (Upstash) when configured,
 * otherwise per-instance in-memory.
 */
export async function rateLimit(
  key: string,
  { limit, windowMs, name }: { limit: number; windowMs: number; name: string },
): Promise<RateLimitResult> {
  if (redis) {
    try {
      const r = await getLimiter(name, limit, windowMs).limit(key);
      return {
        ok: r.success,
        remaining: r.remaining,
        retryAfter: r.success ? 0 : Math.max(0, Math.ceil((r.reset - Date.now()) / 1000)),
      };
    } catch (err) {
      console.error("[rate-limit] Upstash error — falling back to in-memory:", err);
    }
  }
  return memLimit(`${name}:${key}`, limit, windowMs);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
