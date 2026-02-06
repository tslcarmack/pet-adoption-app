import { NextRequest } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

export function rateLimit(config: RateLimitConfig) {
  return async (req: NextRequest): Promise<{ success: boolean; remaining: number }> => {
    // Get client identifier (IP or user ID)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const key = `rate-limit:${ip}`;

    const now = Date.now();
    const record = store[key];

    if (!record || record.resetTime < now) {
      // Create new record
      store[key] = {
        count: 1,
        resetTime: now + config.interval,
      };
      return { success: true, remaining: config.maxRequests - 1 };
    }

    if (record.count >= config.maxRequests) {
      // Rate limit exceeded
      return { success: false, remaining: 0 };
    }

    // Increment count
    record.count++;
    return { success: true, remaining: config.maxRequests - record.count };
  };
}

// Preset configurations
export const rateLimiters = {
  // Auth endpoints: 5 requests per 15 minutes
  auth: rateLimit({
    interval: 15 * 60 * 1000,
    maxRequests: 5,
  }),
  
  // General API: 30 requests per minute
  api: rateLimit({
    interval: 60 * 1000,
    maxRequests: 30,
  }),
  
  // Strict endpoints: 10 requests per 5 minutes
  strict: rateLimit({
    interval: 5 * 60 * 1000,
    maxRequests: 10,
  }),
};
