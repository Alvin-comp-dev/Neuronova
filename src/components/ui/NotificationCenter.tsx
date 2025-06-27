'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  TrendingUp, 
  MessageSquare, 
  User, 
  BookOpen, 
  Star, 
  Zap,
  Calendar,
  Settings,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Notification {
  _id: string;
  type: 'breakthrough' | 'community' | 'expert' | 'recommendation' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    expertName?: string;
    articleTitle?: string;
    communityPost?: string;
    category?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'breakthrough' | 'community' | 'expert'>('all');
  const [loading, setLoading] = useState(true);

  // Mock real-time notifications
  const mockNotifications: Notification[] = [
    {
      _id: '1',
      type: 'breakthrough',
      title: 'New Breakthrough Alert',
      message: 'Revolutionary BCI technology achieves 96% accuracy in neural control',
      timestamp: '2024-06-20T10:30:00Z',
      read: false,
      priority: 'high',
      actionUrl: '/research/bci-breakthrough-2024',
      metadata: {
        category: 'Neurotech',
        articleTitle: 'Revolutionary Brain-Computer Interface Enables Paralyzed Patients'
      }
    },
    {
      _id: '2',
      type: 'expert',
      title: 'Expert Insight',
      message: 'Dr. Sarah Chen shared new insights on neural interface development',
      timestamp: '2024-06-20T09:15:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/experts/sarah-chen/insights',
      metadata: {
        expertName: 'Dr. Sarah Chen',
        category: 'Neurotech'
      }
    },
    {
      _id: '3',
      type: 'community',
      title: 'Discussion Reply',
      message: 'Someone replied to your question about CRISPR 3.0 precision',
      timestamp: '2024-06-20T08:45:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/community/discussions/crispr-precision',
      metadata: {
        communityPost: 'CRISPR 3.0 precision claims discussion'
      }
    },
    {
      _id: '4',
      type: 'recommendation',
      title: 'Personalized Recommendation',
      message: 'New AI healthcare paper matches your research interests',
      timestamp: '2024-06-20T07:20:00Z',
      read: true,
      priority: 'low',
      actionUrl: '/recommendations/ai-healthcare-diagnostic',
      metadata: {
        articleTitle: 'AI System Detects Alzheimer\'s 15 Years Before Symptoms',
        category: 'AI in Healthcare'
      }
    },
    {
      _id: '5',
      type: 'system',
      title: 'Weekly Digest Ready',
      message: 'Your personalized research digest for this week is available',
      timestamp: '2024-06-19T18:00:00Z',
      read: true,
      priority: 'low',
      actionUrl: '/profile/digest'
    },
    {
      _id: '6',
      type: 'breakthrough',
      title: 'Trending Discovery',
      message: 'Gene therapy breakthrough trending in your field',
      timestamp: '2024-06-19T16:30:00Z',
      read: true,
      priority: 'medium',
      actionUrl: '/trending/gene-therapy-breakthrough',
      metadata: {
        category: 'Gene Therapy',
        articleTitle: 'CRISPR 3.0 Achieves Unprecedented Precision'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add new notification occasionally
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          _id: Date.now().toString(),
          type: 'breakthrough',
          title: 'Live Update',
          message: 'New research paper just published in your field of interest',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          actionUrl: '/research/latest',
          metadata: {
            category: 'Live Update'
          }
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'breakthrough':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'community':
        return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case 'expert':
        return <User className="h-5 w-5 text-purple-400" />;
      case 'recommendation':
        return <Star className="h-5 w-5 text-amber-400" />;
      case 'system':
        return <Settings className="h-5 w-5 text-slate-400" />;
      default:
        return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-slate-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="breakthrough">Breakthroughs</option>
                <option value="community">Community</option>
                <option value="expert">Experts</option>
              </select>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification._id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-slate-750' : ''
                    } hover:bg-slate-750 transition-colors cursor-pointer`}
                    onClick={() => {
                      markAsRead(notification._id);
                      if (notification.actionUrl) {
                        // Navigate to URL
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-white' : 'text-slate-300'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-slate-400">
                          {notification.message}
                        </p>
                        
                        {notification.metadata && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {notification.metadata.category && (
                              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                                {notification.metadata.category}
                              </span>
                            )}
                            {notification.metadata.expertName && (
                              <span className="px-2 py-1 bg-purple-600 text-purple-100 text-xs rounded">
                                {notification.metadata.expertName}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {!notification.read && (
                          <div className="mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                              className="flex items-center text-blue-400 hover:text-blue-300 text-xs transition-colors"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark as read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Bell className="h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                </h3>
                <p className="text-slate-500">
                  {filter === 'unread' 
                    ? 'You have no unread notifications.' 
                    : 'New notifications will appear here.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm">
              Notification Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 