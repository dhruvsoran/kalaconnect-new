import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

const inMemoryLimiter = new Map<string, { count: number; resetAt: number }>();

function getRatelimit() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const redis = new Redis({ url, token });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '60s'),
      analytics: true,
    });
  }

  return ratelimit;
}

function checkInMemoryRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = inMemoryLimiter.get(identifier);

  if (!record || now > record.resetAt) {
    inMemoryLimiter.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxAttempts - 1, reset: now + windowMs };
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0, reset: record.resetAt };
  }

  record.count++;
  return { success: true, remaining: maxAttempts - record.count, reset: record.resetAt };
}

export async function checkRateLimit(identifier: string, maxAttempts: number = 5): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limiter = getRatelimit();

  if (!limiter) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.warn('[rate-limit] Upstash Redis not configured, using in-memory fallback');
    }
    return checkInMemoryRateLimit(identifier, maxAttempts);
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
