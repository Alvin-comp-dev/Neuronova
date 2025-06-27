import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'discussion_reply' | 'question_answered' | 'expert_followed' | 'insight_liked' | 'mention' | 'system' | 'collaboration_invite' | 'research_update' | 'achievement' | 'milestone';
  title: string;
  message: string;
  data?: {
    discussionId?: mongoose.Types.ObjectId;
    expertId?: mongoose.Types.ObjectId;
    insightId?: mongoose.Types.ObjectId;
    url?: string;
    metadata?: Record<string, any>;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  category: 'engagement' | 'system' | 'research' | 'social' | 'achievement';
  actionRequired: boolean;
  expiresAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  type: {
    type: String,
    enum: ['discussion_reply', 'question_answered', 'expert_followed', 'insight_liked', 'mention', 'system', 'collaboration_invite', 'research_update', 'achievement', 'milestone'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  data: {
    discussionId: {
      type: Schema.Types.ObjectId,
      ref: 'Discussion',
      sparse: true
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
      sparse: true
    },
    insightId: {
      type: Schema.Types.ObjectId,
      ref: 'Insight',
      sparse: true
    },
    url: {
      type: String,
      maxlength: 500
    },
    metadata: Schema.Types.Mixed
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
    index: true
  },
  category: {
    type: String,
    enum: ['engagement', 'system', 'research', 'social', 'achievement'],
    required: true,
    index: true
  },
  actionRequired: {
    type: Boolean,
    default: false,
    index: true
  },
  expiresAt: {
    type: Date,
    sparse: true
  },
  readAt: {
    type: Date,
    sparse: true
  }
}, {
  timestamps: true,
  collection: 'notifications'
});

// Compound indexes for efficient querying
NotificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, category: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, priority: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
NotificationSchema.statics.getUnreadCount = function(userId: mongoose.Types.ObjectId) {
  return this.countDocuments({ 
    recipient: userId, 
    status: 'unread',
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

NotificationSchema.statics.markAllAsRead = function(userId: mongoose.Types.ObjectId) {
  return this.updateMany(
    { recipient: userId, status: 'unread' },
    { 
      status: 'read', 
      readAt: new Date() 
    }
  );
};

NotificationSchema.statics.getNotificationsByCategory = function(
  userId: mongoose.Types.ObjectId,
  category: string,
  limit = 20,
  offset = 0
) {
  return this.find({ 
    recipient: userId, 
    category,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset);
};

NotificationSchema.statics.createNotification = async function(notificationData: Partial<INotification>) {
  // Avoid duplicate notifications for the same action within 1 hour
  if (notificationData.type && notificationData.recipient && notificationData.data) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existing = await this.findOne({
      recipient: notificationData.recipient,
      type: notificationData.type,
      'data.discussionId': notificationData.data.discussionId,
      'data.expertId': notificationData.data.expertId,
      createdAt: { $gte: oneHourAgo }
    });

    if (existing) {
      return existing;
    }
  }

  return this.create(notificationData);
};

export default mongoose.model<INotification>('Notification', NotificationSchema); 