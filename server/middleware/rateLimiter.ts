import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Limit each IP to 100 requests per windowMs
  
  const key = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  for (const [storeKey, value] of Object.entries(store)) {
    if (now > value.resetTime) {
      delete store[storeKey];
    }
  }
  
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else if (now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    store[key].count++;
  }
  
  // Set headers
  res.set({
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, maxRequests - store[key].count).toString(),
    'X-RateLimit-Reset': new Date(store[key].resetTime).toISOString(),
  });
  
  if (store[key].count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
    });
  }
  
  next();
}; 