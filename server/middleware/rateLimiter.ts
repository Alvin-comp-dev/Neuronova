import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  handler: (req: Request, res: Response): void => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth specific rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  },
  handler: (req: Request, res: Response): void => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.'
    });
  },
  skipSuccessfulRequests: true,
});

// Admin specific rate limiter
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // higher limit for admin operations
  message: {
    success: false,
    error: 'Too many admin requests, please try again later.'
  },
  handler: (req: Request, res: Response): void => {
    res.status(429).json({
      success: false,
      error: 'Too many admin requests, please try again later.'
    });
  },
});

// Custom rate limiter for specific endpoints
export const createCustomLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    handler: (req: Request, res: Response): void => {
      res.status(429).json({
        success: false,
        error: message
      });
    },
  });
}; 