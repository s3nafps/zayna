export type RateLimitDecision = { allowed: boolean; retryAfterMs: number };

// Fixed-window limiter, kept in process memory. Good for one app instance.
// Phase 6 moves it to Redis when the app runs on several instances.
export function createRateLimiter({ maxAttempts, windowMs }: { maxAttempts: number; windowMs: number }) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  function prune(now: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }

  return {
    check(key: string, now: number): RateLimitDecision {
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        return { allowed: true, retryAfterMs: 0 };
      }
      return {
        allowed: bucket.count < maxAttempts,
        retryAfterMs: Math.max(0, bucket.resetAt - now),
      };
    },
    recordFailure(key: string, now: number): void {
      if (buckets.size > 10_000) {
        prune(now);
      }
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
      } else {
        bucket.count += 1;
      }
    },
    reset(key: string): void {
      buckets.delete(key);
    },
  };
}

// Brief §9: rate limiting. Five failed logins per email and IP, per 15 minutes.
export const loginLimiter = createRateLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });
