import { Request, Response, NextFunction } from 'express';
import Analytics from '../models/Analytics';
import { AuthRequest } from '../middleware/auth';

interface DeviceStats {
  type: string;
  count: number;
  percentage: number;
}

interface DailyStats {
  date: string;
  pageViews: number;
  uniqueUsers: number;
}

interface UserEngagement {
  userId: string;
  totalEvents: number;
  uniqueEvents: number;
  sessionDuration: number;
}

// Track analytics event
export const trackEvent = async (req: Request, res: Response) => {
  try {
    const {
      event,
      category,
      data = {},
      properties = {},
      sessionId,
      userId
    } = req.body;

    // Get device and location info from request
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress;

    // Parse device type from user agent (simplified)
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    const analyticsData = {
      userId: userId || null,
      sessionId: sessionId || `session_${Date.now()}_${Math.random()}`,
      event,
      category,
      data: {
        ...data,
        userAgent,
        referrer: req.get('Referer')
      },
      properties,
      ip,
      device: {
        type: deviceType,
        os: extractOS(userAgent),
        browser: extractBrowser(userAgent)
      },
      timestamp: new Date()
    };

    await Analytics.create(analyticsData);

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event'
    });
  }
};

// Get real-time analytics
export const getRealTimeStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await Analytics.getRealTimeStats();

    res.json({
      success: true,
      data: stats[0] || {
        activeUsers: 0,
        pageViews: 0,
        totalEvents: 0
      }
    });
  } catch (error) {
    console.error('Get real-time stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get real-time statistics'
    });
  }
};

// Get page view analytics
export const getPageViews = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      startDate, 
      endDate, 
      page,
      groupBy = 'day' 
    } = req.query;

    const start = new Date(startDate as string || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate as string || new Date());

    const pageViews = await Analytics.getPageViews(start, end, page as string);

    res.json({
      success: true,
      data: {
        pageViews,
        period: {
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get page views error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get page view analytics'
    });
  }
};

// Get user engagement analytics
export const getUserEngagement = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate as string || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate as string || new Date());

    const engagement = await Analytics.getUserEngagement(start, end);

    // Calculate aggregated metrics
    const totalUsers = engagement.length;
    const avgEventsPerUser = totalUsers > 0 
      ? engagement.reduce((sum, user) => sum + user.totalEvents, 0) / totalUsers 
      : 0;
    const avgSessionDuration = totalUsers > 0
      ? engagement.reduce((sum, user) => sum + (user.sessionDuration || 0), 0) / totalUsers
      : 0;

    res.json({
      success: true,
      data: {
        engagement,
        summary: {
          totalUsers,
          avgEventsPerUser: Math.round(avgEventsPerUser * 100) / 100,
          avgSessionDuration: Math.round(avgSessionDuration * 100) / 100
        },
        period: {
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get user engagement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user engagement analytics'
    });
  }
};

// Get top pages
export const getTopPages = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const start = new Date(startDate as string || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate as string || new Date());

    const topPages = await Analytics.getTopPages(start, end, Number(limit));

    res.json({
      success: true,
      data: {
        pages: topPages,
        period: {
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get top pages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get top pages analytics'
    });
  }
};

// Get device statistics
export const getDeviceStats = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate as string || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate as string || new Date());

    const deviceStats = await Analytics.getDeviceStats(start, end);

    // Calculate percentages
    const totalSessions = deviceStats.reduce((sum, device) => sum + device.sessions, 0);
    const devicesWithPercentage = deviceStats.map(device => ({
      ...device,
      percentage: totalSessions > 0 ? Math.round((device.sessions / totalSessions) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        devices: devicesWithPercentage,
        totalSessions,
        period: {
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get device stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get device statistics'
    });
  }
};

// Get conversion funnel
export const getConversionFunnel = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate as string || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const end = new Date(endDate as string || new Date());

    const funnel = await Analytics.getConversionFunnel(start, end);

    res.json({
      success: true,
      data: {
        funnel,
        period: {
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get conversion funnel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversion funnel'
    });
  }
};

// Get comprehensive dashboard data
export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const { period = '7d' } = req.query;

    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    // Parallel fetch of all dashboard data
    const [
      realTimeStats,
      pageViews,
      topPages,
      deviceStats,
      userEngagement
    ] = await Promise.all([
      Analytics.getRealTimeStats(),
      Analytics.getPageViews(startDate, endDate),
      Analytics.getTopPages(startDate, endDate, 5),
      Analytics.getDeviceStats(startDate, endDate),
      Analytics.getUserEngagement(startDate, endDate)
    ]);

    // Calculate summary metrics
    const totalPageViews = pageViews.reduce((sum, day) => sum + day.pageViews, 0);
    const totalUniqueUsers = Math.max(...pageViews.map(day => day.uniqueUsers));
    const avgEventsPerUser = userEngagement.length > 0
      ? userEngagement.reduce((sum, user) => sum + user.totalEvents, 0) / userEngagement.length
      : 0;

    res.json({
      success: true,
      data: {
        realTime: realTimeStats[0] || { activeUsers: 0, pageViews: 0, totalEvents: 0 },
        overview: {
          totalPageViews,
          totalUniqueUsers,
          avgEventsPerUser: Math.round(avgEventsPerUser * 100) / 100,
          period
        },
        pageViews,
        topPages,
        devices: deviceStats,
        engagement: {
          totalUsers: userEngagement.length,
          avgSessionDuration: userEngagement.length > 0
            ? userEngagement.reduce((sum, user) => sum + (user.sessionDuration || 0), 0) / userEngagement.length
            : 0
        },
        period: {
          startDate,
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
};

// Helper functions
function extractOS(userAgent: string): string {
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Mac OS X/.test(userAgent)) return 'macOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPhone|iPad/.test(userAgent)) return 'iOS';
  return 'Unknown';
}

function extractBrowser(userAgent: string): string {
  if (/Chrome/.test(userAgent)) return 'Chrome';
  if (/Firefox/.test(userAgent)) return 'Firefox';
  if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
  if (/Edge/.test(userAgent)) return 'Edge';
  if (/Opera/.test(userAgent)) return 'Opera';
  return 'Unknown';
}

// Mock implementations for missing Analytics methods (add these at the end of the file)
declare module '../models/Analytics' {
  interface AnalyticsModel {
    getRealTimeStats(): Promise<any>;
    getPageViews(start: Date, end: Date, page?: string): Promise<any[]>;
    getUserEngagement(start: Date, end: Date): Promise<any[]>;
    getTopPages(start: Date, end: Date, limit: number): Promise<any[]>;
    getDeviceStats(start: Date, end: Date): Promise<any[]>;
    getConversionFunnel(start: Date, end: Date): Promise<any>;
  }
}

// Temporary mock implementations
(Analytics as any).getRealTimeStats = async () => ({
  activeUsers: 150,
  pageViews: 1250,
  sessions: 320,
  bounceRate: 0.35
});

(Analytics as any).getPageViews = async (start: Date, end: Date, page?: string) => {
  return [{ date: new Date(), pageViews: 100, uniqueUsers: 50 }];
};

(Analytics as any).getUserEngagement = async (start: Date, end: Date) => {
  return [{ totalEvents: 10, sessionDuration: 300 }];
};

(Analytics as any).getTopPages = async (start: Date, end: Date, limit: number) => {
  return [{ page: '/research', views: 500 }];
};

(Analytics as any).getDeviceStats = async (start: Date, end: Date) => {
  return [{ device: 'desktop', sessions: 100 }];
};

(Analytics as any).getConversionFunnel = async (start: Date, end: Date) => {
  return { steps: [] };
};

// Get analytics dashboard data
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate as string || new Date().setDate(new Date().getDate() - 30));
    const end = new Date(endDate as string || new Date());

    // Get real-time stats
    const realTimeStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
        }
      },
      {
        $group: {
          _id: null,
          activeUsers: { $addToSet: '$userId' },
          totalEvents: { $sum: 1 }
        }
      }
    ]);

    // Get page views over time
    const pageViews = await Analytics.aggregate([
      {
        $match: {
          category: 'page_view',
          timestamp: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          pageViews: '$count',
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get top pages
    const topPages = await Analytics.aggregate([
      {
        $match: {
          category: 'page_view',
          timestamp: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$data.page',
          views: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          page: '$_id',
          views: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Get device stats
    const deviceStats = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: start, $lte: end },
          'device.type': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$device.type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDevices = deviceStats.reduce((sum: number, device: DeviceStats) => sum + device.count, 0);
    const deviceDistribution = deviceStats.map((device: DeviceStats) => ({
      type: device._id,
      count: device.count,
      percentage: (device.count / totalDevices) * 100
    }));

    // Get user engagement metrics
    const userEngagement = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: start, $lte: end },
          userId: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalEvents: { $sum: 1 },
          uniqueEvents: { $addToSet: '$event' },
          firstSeen: { $min: '$timestamp' },
          lastSeen: { $max: '$timestamp' }
        }
      },
      {
        $project: {
          userId: '$_id',
          totalEvents: 1,
          uniqueEvents: { $size: '$uniqueEvents' },
          sessionDuration: {
            $divide: [
              { $subtract: ['$lastSeen', '$firstSeen'] },
              1000 * 60 // Convert to minutes
            ]
          }
        }
      }
    ]);

    // Calculate daily active users
    const dailyActiveUsers = pageViews.reduce((sum: number, day: DailyStats) => sum + day.uniqueUsers, 0) / pageViews.length;

    // Calculate average session duration
    const avgSessionDuration = userEngagement.reduce((sum: number, user: UserEngagement) => sum + user.sessionDuration, 0) / userEngagement.length;

    res.json({
      success: true,
      data: {
        realTime: {
          activeUsers: realTimeStats[0]?.activeUsers?.length || 0,
          eventsPerMinute: realTimeStats[0]?.totalEvents || 0
        },
        overview: {
          totalPageViews: pageViews.reduce((sum: number, day: DailyStats) => sum + day.pageViews, 0),
          averageDailyUsers: Math.round(dailyActiveUsers),
          averageSessionDuration: Math.round(avgSessionDuration),
          bounceRate: 0 // TODO: Implement bounce rate calculation
        },
        trends: {
          pageViews,
          topPages,
          deviceDistribution,
          userEngagement: userEngagement.slice(0, 10) // Limit to top 10 users
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 