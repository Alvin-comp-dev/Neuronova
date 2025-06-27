'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface AdminAnalytics {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
  };
  contentMetrics: {
    totalResearch: number;
    totalComments: number;
    totalLikes: number;
    contentGrowth: number;
  };
  systemMetrics: {
    pageViews: number;
    sessions: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  performanceMetrics: {
    loadTime: number;
    uptime: number;
    errorRate: number;
    apiLatency: number;
  };
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for admin analytics
  const mockAnalytics: AdminAnalytics = {
    userMetrics: {
      totalUsers: 12847,
      activeUsers: 3456,
      newUsers: 234,
      userGrowth: 12.5
    },
    contentMetrics: {
      totalResearch: 1847,
      totalComments: 5623,
      totalLikes: 18942,
      contentGrowth: 8.3
    },
    systemMetrics: {
      pageViews: 89456,
      sessions: 23847,
      avgSessionDuration: 14.7,
      bounceRate: 23.4
    },
    performanceMetrics: {
      loadTime: 1.2,
      uptime: 99.9,
      errorRate: 0.1,
      apiLatency: 85
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    suffix = '', 
    isPercentage = false 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    suffix?: string;
    isPercentage?: boolean;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isPercentage ? value.toFixed(1) : formatNumber(value)}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}% from last period
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* User Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={analytics.userMetrics.totalUsers}
            change={analytics.userMetrics.userGrowth}
            icon={UsersIcon}
          />
          <MetricCard
            title="Active Users"
            value={analytics.userMetrics.activeUsers}
            change={5.2}
            icon={EyeIcon}
          />
          <MetricCard
            title="New Users"
            value={analytics.userMetrics.newUsers}
            change={-2.1}
            icon={ArrowTrendingUpIcon}
          />
          <MetricCard
            title="User Growth"
            value={analytics.userMetrics.userGrowth}
            icon={ChartBarIcon}
            suffix="%"
            isPercentage={true}
          />
        </div>
      </div>

      {/* Content Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Content Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Research"
            value={analytics.contentMetrics.totalResearch}
            change={analytics.contentMetrics.contentGrowth}
            icon={DocumentTextIcon}
          />
          <MetricCard
            title="Comments"
            value={analytics.contentMetrics.totalComments}
            change={15.7}
            icon={ChatBubbleLeftIcon}
          />
          <MetricCard
            title="Likes"
            value={analytics.contentMetrics.totalLikes}
            change={22.3}
            icon={HeartIcon}
          />
          <MetricCard
            title="Content Growth"
            value={analytics.contentMetrics.contentGrowth}
            icon={ArrowTrendingUpIcon}
            suffix="%"
            isPercentage={true}
          />
        </div>
      </div>

      {/* System Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Page Views"
            value={analytics.systemMetrics.pageViews}
            change={18.4}
            icon={GlobeAltIcon}
          />
          <MetricCard
            title="Sessions"
            value={analytics.systemMetrics.sessions}
            change={12.1}
            icon={ClockIcon}
          />
          <MetricCard
            title="Avg Session Duration"
            value={analytics.systemMetrics.avgSessionDuration}
            change={-3.2}
            icon={ClockIcon}
            suffix="m"
            isPercentage={true}
          />
          <MetricCard
            title="Bounce Rate"
            value={analytics.systemMetrics.bounceRate}
            change={-5.8}
            icon={ArrowTrendingUpIcon}
            suffix="%"
            isPercentage={true}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Load Time"
            value={analytics.performanceMetrics.loadTime}
            change={-8.5}
            icon={ClockIcon}
            suffix="s"
            isPercentage={true}
          />
          <MetricCard
            title="Uptime"
            value={analytics.performanceMetrics.uptime}
            change={0.1}
            icon={ArrowTrendingUpIcon}
            suffix="%"
            isPercentage={true}
          />
          <MetricCard
            title="Error Rate"
            value={analytics.performanceMetrics.errorRate}
            change={-12.3}
            icon={ChartBarIcon}
            suffix="%"
            isPercentage={true}
          />
          <MetricCard
            title="API Latency"
            value={analytics.performanceMetrics.apiLatency}
            change={-15.2}
            icon={ClockIcon}
            suffix="ms"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">New user registration spike</span>
            <span className="text-sm text-green-600 dark:text-green-400">+23% increase</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Research submission peak</span>
            <span className="text-sm text-blue-600 dark:text-blue-400">45 new submissions</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Community engagement up</span>
            <span className="text-sm text-green-600 dark:text-green-400">+18% comments</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">System performance optimized</span>
            <span className="text-sm text-green-600 dark:text-green-400">-15% load time</span>
          </div>
        </div>
      </div>
    </div>
  );
}