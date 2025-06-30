import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import User from '../models/User';
import Organization from '../models/Organization';

// Security Event Model (for demonstration)
interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'permission_change' | 'data_access' | 'suspicious_activity' | 'password_change' | 'mfa_enabled' | 'api_access';
  user: string;
  userId?: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: any;
}

// In-memory security events store (in production, use database)
let securityEvents: SecurityEvent[] = [];

// Utility function to verify admin access
const verifyAdminAccess = (req: Request): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required');
  }
  
  const token = authHeader.substring(7);
  const user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
};

// Log security event
const logSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
  const securityEvent: SecurityEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    ...event
  };
  
  securityEvents.push(securityEvent);
  
  // Keep only last 1000 events in memory
  if (securityEvents.length > 1000) {
    securityEvents = securityEvents.slice(-1000);
  }
  
  // In production, save to database and trigger alerts for critical events
  if (event.severity === 'critical') {
    console.warn('🚨 CRITICAL SECURITY EVENT:', securityEvent);
    // Trigger alerts, notifications, etc.
  }
};

// Get security events
export const getSecurityEvents = async (req: Request, res: Response) => {
  try {
    const user = verifyAdminAccess(req);
    
    const { 
      page = 1, 
      limit = 50, 
      severity, 
      type, 
      startDate, 
      endDate 
    } = req.query;
    
    let filteredEvents = [...securityEvents];
    
    // Apply filters
    if (severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === severity);
    }
    
    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }
    
    if (startDate) {
      const start = new Date(startDate as string);
      filteredEvents = filteredEvents.filter(event => event.timestamp >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate as string);
      filteredEvents = filteredEvents.filter(event => event.timestamp <= end);
    }
    
    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
    
    // Generate security statistics
    const stats = {
      totalEvents: filteredEvents.length,
      criticalCount: filteredEvents.filter(e => e.severity === 'critical').length,
      highCount: filteredEvents.filter(e => e.severity === 'high').length,
      mediumCount: filteredEvents.filter(e => e.severity === 'medium').length,
      lowCount: filteredEvents.filter(e => e.severity === 'low').length,
      recentActivity: filteredEvents.filter(e => 
        e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
    };
    
    res.json({
      success: true,
      data: {
        events: paginatedEvents,
        stats,
        pagination: {
          current: Number(page),
          total: Math.ceil(filteredEvents.length / Number(limit)),
          count: paginatedEvents.length
        }
      }
    });

  } catch (error) {
    console.error('Get Security Events Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch security events'
    });
  }
};

// Security scan endpoint
export const performSecurityScan = async (req: Request, res: Response) => {
  try {
    const user = verifyAdminAccess(req);
    
    // Simulate security scan (in production, use actual security tools)
    const scanResults = {
      scanId: `scan_${Date.now()}`,
      timestamp: new Date(),
      status: 'completed',
      duration: Math.floor(Math.random() * 60) + 30, // 30-90 seconds
      vulnerabilities: {
        critical: Math.floor(Math.random() * 3),
        high: Math.floor(Math.random() * 5),
        medium: Math.floor(Math.random() * 10),
        low: Math.floor(Math.random() * 15),
        info: Math.floor(Math.random() * 20)
      },
      checks: [
        {
          category: 'Authentication',
          status: 'passed',
          score: 95,
          issues: ['Consider implementing password complexity requirements']
        },
        {
          category: 'Data Encryption',
          status: 'passed',
          score: 98,
          issues: []
        },
        {
          category: 'API Security',
          status: 'warning',
          score: 85,
          issues: ['Rate limiting could be more aggressive', 'Consider API versioning']
        },
        {
          category: 'Database Security',
          status: 'passed',
          score: 92,
          issues: ['Consider enabling query logging']
        },
        {
          category: 'Network Security',
          status: 'passed',
          score: 90,
          issues: ['Consider implementing WAF']
        }
      ],
      recommendations: [
        'Enable two-factor authentication for all admin accounts',
        'Implement automated security monitoring',
        'Regular security training for team members',
        'Consider implementing zero-trust architecture'
      ],
      overallScore: 92
    };
    
    // Log security scan event
    logSecurityEvent({
      type: 'data_access',
      user: user.email || user.id,
      userId: user.id,
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      location: 'Security Scan',
      severity: 'low',
      description: 'Security scan performed',
      metadata: { scanId: scanResults.scanId }
    });

    res.json({
      success: true,
      data: scanResults
    });

  } catch (error) {
    console.error('Security Scan Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to perform security scan'
    });
  }
};

// Get security configuration
export const getSecurityConfig = async (req: Request, res: Response) => {
  try {
    const user = verifyAdminAccess(req);
    
    // Mock security configuration
    const config = {
      authentication: {
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          maxAge: 90, // days
          preventReuse: 5 // last N passwords
        },
        mfa: {
          enabled: true,
          required: false,
          methods: ['totp', 'sms', 'email']
        },
        sessionManagement: {
          timeout: 30, // minutes
          maxConcurrentSessions: 3,
          requireReauth: true
        }
      },
      dataProtection: {
        encryption: {
          atRest: true,
          inTransit: true,
          algorithm: 'AES-256-GCM'
        },
        backup: {
          frequency: 'daily',
          retention: 90, // days
          encryption: true
        },
        privacy: {
          gdprCompliant: true,
          dataMinimization: true,
          rightToErasure: true
        }
      },
      networkSecurity: {
        rateLimiting: {
          enabled: true,
          requests: 100,
          window: 15, // minutes
          burst: 150
        },
        cors: {
          enabled: true,
          origins: ['http://localhost:3000', 'https://neuronova.com']
        },
        headers: {
          hsts: true,
          csp: true,
          xframe: 'DENY'
        }
      },
      monitoring: {
        logging: {
          level: 'info',
          retention: 365, // days
          encryption: true
        },
        alerting: {
          enabled: true,
          channels: ['email', 'slack'],
          thresholds: {
            failedLogins: 5,
            suspiciousActivity: 3,
            dataAccess: 100
          }
        }
      }
    };

    res.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('Get Security Config Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch security configuration'
    });
  }
};

// Update security configuration
export const updateSecurityConfig = async (req: Request, res: Response) => {
  try {
    const user = verifyAdminAccess(req);
    const { config } = req.body;
    
    // Log configuration change
    logSecurityEvent({
      type: 'permission_change',
      user: user.email || user.id,
      userId: user.id,
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      location: 'Security Configuration',
      severity: 'high',
      description: 'Security configuration updated',
      metadata: { changes: config }
    });
    
    // In production, save configuration to database
    console.log('Security configuration updated:', config);

    res.json({
      success: true,
      message: 'Security configuration updated successfully',
      data: {
        configId: `config_${Date.now()}`,
        applied: new Date(),
        appliedBy: user.id
      }
    });

  } catch (error) {
    console.error('Update Security Config Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update security configuration'
    });
  }
};

// GDPR compliance endpoints
export const gdprDataExport = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = verifyAdminAccess(req);
    const { userId } = req.params;
    
    // Get user data
    const userData = await User.findById(userId).lean();
    if (!userData) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    // Log data access
    logSecurityEvent({
      type: 'data_access',
      user: user.email || user.id,
      userId: user.id,
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      location: 'GDPR Data Export',
      severity: 'medium',
      description: `Data export requested for user ${userId}`,
      metadata: { targetUserId: userId }
    });
    
    // In production, collect all user data from various sources
    const exportData = {
      personal: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        lastLogin: (userData as any).lastLogin || null
      },
      // Add other data categories...
      metadata: {
        exportDate: new Date(),
        format: 'JSON',
        version: '1.0'
      }
    };

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('GDPR Data Export Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export user data'
    });
  }
};

// Initialize security events with some sample data
const initializeSampleSecurityEvents = () => {
  const sampleEvents = [
    {
      type: 'failed_login' as const,
      user: 'unknown@example.com',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      severity: 'medium' as const,
      description: 'Multiple failed login attempts detected'
    },
    {
      type: 'permission_change' as const,
      user: 'admin@neuronova.com',
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'San Francisco, US',
      severity: 'high' as const,
      description: 'User permissions elevated for research@neuronova.com'
    },
    {
      type: 'suspicious_activity' as const,
      user: 'researcher@example.com',
      ip: '203.0.113.1',
      userAgent: 'curl/7.68.0',
      location: 'Unknown',
      severity: 'critical' as const,
      description: 'Unusual data access pattern detected'
    }
  ];
  
  sampleEvents.forEach(event => logSecurityEvent(event));
};

// Initialize sample data
initializeSampleSecurityEvents();

// Rate limiting configurations
export const createRateLimiters = () => {
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 auth requests per windowMs
    message: {
      success: false,
      error: 'Too many authentication attempts, please try again later.'
    },
    skipSuccessfulRequests: true,
  });

  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // higher limit for admin operations
    message: {
      success: false,
      error: 'Too many admin requests, please try again later.'
    },
  });

  return { generalLimiter, authLimiter, adminLimiter };
};

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3002", "ws://localhost:3002"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

export { logSecurityEvent }; 