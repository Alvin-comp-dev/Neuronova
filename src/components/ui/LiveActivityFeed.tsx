'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import {
  SparklesIcon,
  ChatBubbleBottomCenterIcon,
  BookmarkIcon,
  HeartIcon,
  UserPlusIcon,
  DocumentTextIcon,
  TrophyIcon,
  BellIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  SparklesIcon as SparklesSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';

interface ActivityItem {
  _id: string;
  type: 'discussion' | 'bookmark' | 'like' | 'follow' | 'achievement' | 'publication' | 'comment' | 'expert_join';
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
  timestamp: string;
  isLive?: boolean;
}

interface LiveActivityFeedProps {
  className?: string;
  limit?: number;
  autoRefresh?: boolean;
  showHeader?: boolean;
}

const activityIcons = {
  discussion: ChatBubbleBottomCenterIcon,
  bookmark: BookmarkIcon,
  like: HeartIcon,
  follow: UserPlusIcon,
  achievement: TrophyIcon,
  publication: DocumentTextIcon,
  comment: ChatBubbleBottomCenterIcon,
  expert_join: SparklesIcon
};

const activityColors = {
  discussion: 'text-blue-500',
  bookmark: 'text-yellow-500',
  like: 'text-red-500',
  follow: 'text-green-500',
  achievement: 'text-purple-500',
  publication: 'text-indigo-500',
  comment: 'text-cyan-500',
  expert_join: 'text-orange-500'
};

export default function LiveActivityFeed({ 
  className = '', 
  limit = 10, 
  autoRefresh = true, 
  showHeader = true 
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [newActivityCount, setNewActivityCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initial fetch of activities
    fetchActivities();

    // WebSocket temporarily disabled to prevent XHR poll errors
    console.log('🚫 WebSocket disabled for activity feed - preventing connection errors');
    
    // Set up polling for activity updates instead of WebSocket
    let interval: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchActivities();
      }, 30000); // Refresh every 30 seconds
    }

    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user?._id, limit, autoRefresh]);

  const fetchActivities = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        includeFollowing: isAuthenticated ? 'true' : 'false'
      });

      const response = await fetch(`/api/activity?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.data || []);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivities = (): ActivityItem[] => {
    const mockActivities: ActivityItem[] = [
      {
        _id: '1',
        type: 'expert_join',
        user: {
          _id: 'expert1',
          name: 'Dr. Sarah Chen',
          isVerifiedExpert: true
        },
        metadata: { expertise: 'Neurotechnology' },
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        isLive: true
      },
      {
        _id: '2',
        type: 'discussion',
        user: {
          _id: 'user1',
          name: 'Alex Martinez'
        },
        target: {
          _id: 'article1',
          title: 'Novel Brain-Computer Interface Breakthrough',
          type: 'article'
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      },
      {
        _id: '3',
        type: 'achievement',
        user: {
          _id: 'user2',
          name: 'Jamie Wong'
        },
        metadata: { achievementType: 'First Discussion' },
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      },
      {
        _id: '4',
        type: 'bookmark',
        user: {
          _id: 'user3',
          name: 'Dr. Michael Thompson',
          isVerifiedExpert: true
        },
        target: {
          _id: 'article2',
          title: 'CRISPR Gene Therapy for Neurodegenerative Diseases',
          type: 'article'
        },
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
      },
      {
        _id: '5',
        type: 'publication',
        user: {
          _id: 'expert2',
          name: 'Dr. Lisa Park',
          isVerifiedExpert: true
        },
        target: {
          _id: 'article3',
          title: 'Machine Learning in Drug Discovery',
          type: 'article'
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      }
    ];

    return mockActivities;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityText = (activity: ActivityItem) => {
    const userName = activity.user.name;
    const targetTitle = activity.target?.title;

    switch (activity.type) {
      case 'expert_join':
        return (
          <span>
            <strong className="text-orange-400">{userName}</strong> joined as a verified expert in{' '}
            <span className="text-slate-300">{activity.metadata?.expertise}</span>
          </span>
        );
      case 'discussion':
        return (
          <span>
            <strong className="text-blue-400">{userName}</strong> started a discussion on{' '}
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">
              "{targetTitle}"
            </span>
          </span>
        );
      case 'bookmark':
        return (
          <span>
            <strong className="text-yellow-400">{userName}</strong> bookmarked{' '}
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">
              "{targetTitle}"
            </span>
          </span>
        );
      case 'like':
        return (
          <span>
            <strong className="text-red-400">{userName}</strong> liked{' '}
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">
              "{targetTitle}"
            </span>
          </span>
        );
      case 'follow':
        return (
          <span>
            <strong className="text-green-400">{userName}</strong> started following{' '}
            <strong className="text-slate-300">{targetTitle}</strong>
          </span>
        );
      case 'achievement':
        return (
          <span>
            <strong className="text-purple-400">{userName}</strong> earned the{' '}
            <span className="text-slate-300">"{activity.metadata?.achievementType}"</span> achievement
          </span>
        );
      case 'publication':
        return (
          <span>
            <strong className="text-indigo-400">{userName}</strong> published{' '}
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">
              "{targetTitle}"
            </span>
          </span>
        );
      case 'comment':
        return (
          <span>
            <strong className="text-cyan-400">{userName}</strong> commented on{' '}
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">
              "{targetTitle}"
            </span>
          </span>
        );
      default:
        return (
          <span>
            <strong className="text-slate-400">{userName}</strong> performed an action
          </span>
        );
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.target) {
      // Navigate to the target (article, discussion, etc.)
      console.log('Navigate to:', activity.target);
    }
  };

  const refreshActivities = () => {
    fetchActivities();
    setNewActivityCount(0);
  };

  return (
    <div className={`bg-slate-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Live Activity</h2>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <span className="flex items-center text-sm text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Live
              </span>
            ) : (
              <span className="flex items-center text-sm text-red-400">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                Offline
              </span>
            )}
            <button
              onClick={refreshActivities}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors"
              title="Refresh activities"
            >
              <ArrowPathIcon className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <ArrowPathIcon className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <BellIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => {
              const IconComponent = activityIcons[activity.type];
              const iconColor = activityColors[activity.type];
              
              return (
                <div
                  key={activity._id}
                  onClick={() => handleActivityClick(activity)}
                  className={`p-3 hover:bg-slate-750 transition-colors cursor-pointer ${
                    activity.isLive ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-l-2 border-orange-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${iconColor}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-300 leading-relaxed">
                        {getActivityText(activity)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                        
                        {activity.user.isVerifiedExpert && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                            <SparklesSolid className="h-2.5 w-2.5 mr-1" />
                            Expert
                          </span>
                        )}
                        
                        {activity.isLive && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">
                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {activity.user.profileImage ? (
                        <img
                          src={activity.user.profileImage}
                          alt={activity.user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {activity.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="p-3 border-t border-slate-700 text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
} 