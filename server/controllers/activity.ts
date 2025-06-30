import { Request, Response } from 'express';
import { connectMongoose } from '@/lib/mongodb';
import webSocketManager from '../websocket';

// Activity types
export type ActivityType = 
  | 'discussion' 
  | 'bookmark' 
  | 'like' 
  | 'follow' 
  | 'achievement' 
  | 'publication' 
  | 'comment' 
  | 'expert_join';

interface Activity {
  _id: string;
  type: ActivityType;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
    isVerifiedExpert?: boolean;
  };
  target?: {
    _id: string;
    title: string;
    type: 'article' | 'discussion' | 'user';
  };
  metadata?: {
    achievementType?: string;
    reactionType?: string;
    commentCount?: number;
    [key: string]: any;
  };
  timestamp: Date;
  isLive?: boolean;
}

// Get recent activities
export const getActivities = async (req: Request, res: Response) => {
  try {
    const { limit = 10, includeFollowing = false } = req.query;
    const userId = req.user?._id;

    await connectMongoose();

    // Fetch activities from database
    const activities = await Activity.find({
      ...(includeFollowing === 'true' && userId ? {
        $or: [
          { 'user._id': { $in: await getFollowedUsers(userId) } },
          { isPublic: true }
        ]
      } : { isPublic: true }),
    })
    .sort({ timestamp: -1 })
    .limit(Number(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
};

// Create new activity
export const createActivity = async (activity: Omit<Activity, '_id' | 'timestamp'>) => {
  try {
    await connectMongoose();

    const newActivity = new Activity({
      ...activity,
      timestamp: new Date(),
      isLive: true
    });

    await newActivity.save();

    // Determine target users for the activity
    let targetUserIds: string[] = [];

    if (activity.type === 'follow') {
      // Send to followed user
      targetUserIds = [activity.target?._id || ''];
    } else if (activity.type === 'comment' || activity.type === 'like') {
      // Send to content owner
      const contentOwner = await getUserById(activity.target?._id || '');
      if (contentOwner) {
        targetUserIds = [contentOwner._id];
      }
    } else if (activity.type === 'expert_join') {
      // Broadcast to all users
      webSocketManager.broadcastActivity(newActivity);
      return newActivity;
    }

    // Send activity to specific users if any
    if (targetUserIds.length > 0) {
      webSocketManager.sendActivityToUsers(targetUserIds, newActivity);
    }

    return newActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

// Update existing activity
export const updateActivity = async (activityId: string, update: Partial<Activity>) => {
  try {
    await connectMongoose();

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { ...update, isLive: true },
      { new: true }
    );

    if (updatedActivity) {
      webSocketManager.updateActivity(updatedActivity);
    }

    return updatedActivity;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

// Helper function to get followed users
const getFollowedUsers = async (userId: string): Promise<string[]> => {
  try {
    const user = await User.findById(userId).select('following');
    return user?.following || [];
  } catch (error) {
    console.error('Error getting followed users:', error);
    return [];
  }
};

// Helper function to get user by ID
const getUserById = async (userId: string) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}; 