import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  event: string;
  category: 'page_view' | 'user_action' | 'engagement' | 'conversion' | 'performance' | 'error';
  data: {
    page?: string;
    referrer?: string;
    userAgent?: string;
    duration?: number;
    metadata?: Record<string, any>;
  };
  properties: Record<string, any>;
  timestamp: Date;
  ip?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  device?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  event: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['page_view', 'user_action', 'engagement', 'conversion', 'performance', 'error'],
    required: true,
    index: true
  },
  data: {
    page: String,
    referrer: String,
    userAgent: String,
    duration: Number,
    metadata: Schema.Types.Mixed
  },
  properties: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ip: String,
  location: {
    country: String,
    region: String,
    city: String
  },
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet']
    },
    os: String,
    browser: String
  }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'analytics'
});

// Compound indexes for analytics queries
AnalyticsSchema.index({ category: 1, timestamp: -1 });
AnalyticsSchema.index({ event: 1, timestamp: -1 });
AnalyticsSchema.index({ userId: 1, timestamp: -1 });
AnalyticsSchema.index({ sessionId: 1, timestamp: -1 });

// TTL index to automatically delete old analytics data after 2 years
AnalyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 }); // 2 years

// Static methods for analytics queries
AnalyticsSchema.statics.getPageViews = function(startDate: Date, endDate: Date, page?: string) {
  const query: any = {
    category: 'page_view',
    timestamp: { $gte: startDate, $lte: endDate }
  };
  
  if (page) {
    query['data.page'] = page;
  }
  
  return this.aggregate([
    { $match: query },
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
};

AnalyticsSchema.statics.getUserEngagement = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        category: 'engagement',
        timestamp: { $gte: startDate, $lte: endDate },
        userId: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$userId',
        totalEvents: { $sum: 1 },
        events: { $push: '$event' },
        firstSeen: { $min: '$timestamp' },
        lastSeen: { $max: '$timestamp' }
      }
    },
    {
      $project: {
        userId: '$_id',
        totalEvents: 1,
        uniqueEvents: { $size: { $setUnion: ['$events', []] } },
        sessionDuration: {
          $divide: [
            { $subtract: ['$lastSeen', '$firstSeen'] },
            1000 * 60 // Convert to minutes
          ]
        }
      }
    }
  ]);
};

AnalyticsSchema.statics.getTopPages = function(startDate: Date, endDate: Date, limit = 10) {
  return this.aggregate([
    {
      $match: {
        category: 'page_view',
        timestamp: { $gte: startDate, $lte: endDate },
        'data.page': { $exists: true }
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
    { $limit: limit }
  ]);
};

AnalyticsSchema.statics.getConversionFunnel = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        category: 'conversion',
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$event',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        step: '$_id',
        conversions: '$count',
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { conversions: -1 } }
  ]);
};

AnalyticsSchema.statics.getDeviceStats = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        category: 'page_view',
        timestamp: { $gte: startDate, $lte: endDate },
        'device.type': { $exists: true }
      }
    },
    {
      $group: {
        _id: '$device.type',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        deviceType: '$_id',
        sessions: '$count',
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { sessions: -1 } }
  ]);
};

AnalyticsSchema.statics.getRealTimeStats = function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: fiveMinutesAgo }
      }
    },
    {
      $group: {
        _id: null,
        activeUsers: { $addToSet: '$userId' },
        pageViews: {
          $sum: {
            $cond: [{ $eq: ['$category', 'page_view'] }, 1, 0]
          }
        },
        events: { $sum: 1 }
      }
    },
    {
      $project: {
        activeUsers: { $size: '$activeUsers' },
        pageViews: 1,
        totalEvents: '$events'
      }
    }
  ]);
};

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema); 