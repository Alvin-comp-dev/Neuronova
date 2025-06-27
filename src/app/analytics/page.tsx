'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Eye, 
  MessageSquare, 
  Calendar,
  Award,
  Target,
  Activity,
  Globe,
  Clock,
  Zap,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  platformMetrics: {
    totalUsers: number;
    activeUsers: number;
    totalArticles: number;
    totalViews: number;
    totalDiscussions: number;
    expertCount: number;
  };
  userEngagement: {
    dailyActiveUsers: number[];
    weeklyActiveUsers: number[];
    monthlyActiveUsers: number[];
    avgSessionDuration: number;
    bounceRate: number;
    returnUserRate: number;
  };
  contentMetrics: {
    topCategories: { name: string; value: number; color: string }[];
    readingPatterns: { hour: number; reads: number }[];
    popularArticles: { title: string; views: number; category: string }[];
    expertEngagement: { name: string; followers: number; insights: number }[];
  };
  researchTrends: {
    fieldGrowth: { field: string; growth: number; papers: number }[];
    citationTrends: { month: string; citations: number; papers: number }[];
    collaborationNetwork: { source: string; target: string; strength: number }[];
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'users' | 'content' | 'research' | 'engagement'>('users');
  const [loading, setLoading] = useState(true);

  // Mock comprehensive analytics data
  const mockAnalytics: AnalyticsData = {
    platformMetrics: {
      totalUsers: 12847,
      activeUsers: 3421,
      totalArticles: 34567,
      totalViews: 1234567,
      totalDiscussions: 8934,
      expertCount: 456
    },
    userEngagement: {
      dailyActiveUsers: [1200, 1350, 1180, 1420, 1650, 1380, 1520, 1240, 1390, 1480, 1560, 1320, 1440, 1580],
      weeklyActiveUsers: [8400, 8750, 8200, 9100, 9350, 8800],
      monthlyActiveUsers: [28000, 29200, 27800, 30400, 31200, 29800],
      avgSessionDuration: 18.5, // minutes
      bounceRate: 24.3, // percentage
      returnUserRate: 67.8 // percentage
    },
    contentMetrics: {
      topCategories: [
        { name: 'Neurotech', value: 34, color: '#3b82f6' },
        { name: 'AI in Healthcare', value: 28, color: '#10b981' },
        { name: 'Gene Therapy', value: 22, color: '#8b5cf6' },
        { name: 'Regenerative Medicine', value: 18, color: '#f59e0b' },
        { name: 'Drug Discovery', value: 15, color: '#ef4444' },
        { name: 'Medical Devices', value: 12, color: '#06b6d4' }
      ],
      readingPatterns: [
        { hour: 0, reads: 45 }, { hour: 1, reads: 32 }, { hour: 2, reads: 28 }, { hour: 3, reads: 25 },
        { hour: 4, reads: 30 }, { hour: 5, reads: 42 }, { hour: 6, reads: 65 }, { hour: 7, reads: 89 },
        { hour: 8, reads: 120 }, { hour: 9, reads: 145 }, { hour: 10, reads: 167 }, { hour: 11, reads: 156 },
        { hour: 12, reads: 134 }, { hour: 13, reads: 142 }, { hour: 14, reads: 159 }, { hour: 15, reads: 148 },
        { hour: 16, reads: 132 }, { hour: 17, reads: 118 }, { hour: 18, reads: 98 }, { hour: 19, reads: 87 },
        { hour: 20, reads: 76 }, { hour: 21, reads: 68 }, { hour: 22, reads: 58 }, { hour: 23, reads: 52 }
      ],
      popularArticles: [
        { title: 'Revolutionary BCI Enables Paralyzed Patients Control', views: 45230, category: 'Neurotech' },
        { title: 'AI System Detects Alzheimer\'s 15 Years Early', views: 42100, category: 'AI Healthcare' },
        { title: 'CRISPR 3.0 Achieves 99.7% Precision', views: 38940, category: 'Gene Therapy' },
        { title: 'Bioengineered Heart Tissue Regeneration Success', views: 35670, category: 'Regenerative Medicine' },
        { title: 'Quantum-Enhanced MRI Brain Imaging', views: 28940, category: 'Medical Imaging' }
      ],
      expertEngagement: [
        { name: 'Dr. Sarah Chen', followers: 2340, insights: 8 },
        { name: 'Prof. Michael Rodriguez', followers: 1890, insights: 12 },
        { name: 'Dr. Lisa Wang', followers: 3200, insights: 15 },
        { name: 'Dr. James Wilson', followers: 1456, insights: 6 }
      ]
    },
    researchTrends: {
      fieldGrowth: [
        { field: 'Neurotech', growth: 45.2, papers: 340 },
        { field: 'AI Healthcare', growth: 38.7, papers: 280 },
        { field: 'Gene Therapy', growth: 29.3, papers: 220 },
        { field: 'Regenerative Medicine', growth: 22.1, papers: 180 },
        { field: 'Drug Discovery', growth: 18.5, papers: 150 },
        { field: 'Medical Devices', growth: 15.2, papers: 120 }
      ],
      citationTrends: [
        { month: 'Jan', citations: 2400, papers: 180 },
        { month: 'Feb', citations: 2800, papers: 210 },
        { month: 'Mar', citations: 3200, papers: 240 },
        { month: 'Apr', citations: 3600, papers: 270 },
        { month: 'May', citations: 4100, papers: 310 },
        { month: 'Jun', citations: 4500, papers: 340 }
      ],
      collaborationNetwork: [
        { source: 'Stanford', target: 'MIT', strength: 85 },
        { source: 'Harvard', target: 'Johns Hopkins', strength: 72 },
        { source: 'Oxford', target: 'Cambridge', strength: 68 },
        { source: 'Caltech', target: 'Stanford', strength: 64 }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 30) return 'text-green-400';
    if (growth > 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Platform Analytics
              </h1>
              <p className="text-xl text-violet-100 max-w-3xl">
                Comprehensive insights into platform performance, user behavior, and research trends
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.platformMetrics.totalUsers || 0)}</p>
                <p className="text-green-400 text-sm">+12.3% vs last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.platformMetrics.activeUsers || 0)}</p>
                <p className="text-green-400 text-sm">+8.7% vs last month</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Articles</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.platformMetrics.totalArticles || 0)}</p>
                <p className="text-green-400 text-sm">+15.2% vs last month</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.platformMetrics.totalViews || 0)}</p>
                <p className="text-green-400 text-sm">+22.1% vs last month</p>
              </div>
              <Eye className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Discussions</p>
                <p className="text-2xl font-bold text-white">{formatNumber(analytics?.platformMetrics.totalDiscussions || 0)}</p>
                <p className="text-green-400 text-sm">+18.9% vs last month</p>
              </div>
              <MessageSquare className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Experts</p>
                <p className="text-2xl font-bold text-white">{analytics?.platformMetrics.expertCount || 0}</p>
                <p className="text-green-400 text-sm">+5.4% vs last month</p>
              </div>
              <Award className="h-8 w-8 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'users', label: 'User Analytics', icon: Users },
              { id: 'content', label: 'Content Metrics', icon: BookOpen },
              { id: 'research', label: 'Research Trends', icon: TrendingUp },
              { id: 'engagement', label: 'Engagement', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMetric(tab.id as any)}
                className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                  selectedMetric === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Analytics */}
        {selectedMetric === 'users' && (
          <div className="space-y-8">
            {/* Daily Active Users Chart */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Daily Active Users</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.userEngagement.dailyActiveUsers.map((users, index) => ({
                  day: `Day ${index + 1}`,
                  users
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* User Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Avg Session Duration</h4>
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{analytics?.userEngagement.avgSessionDuration}m</p>
                <p className="text-green-400 text-sm">+2.3 min vs last month</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Bounce Rate</h4>
                  <Target className="h-6 w-6 text-amber-400" />
                </div>
                <p className="text-3xl font-bold text-white">{analytics?.userEngagement.bounceRate}%</p>
                <p className="text-green-400 text-sm">-1.2% vs last month</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Return User Rate</h4>
                  <RefreshCw className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{analytics?.userEngagement.returnUserRate}%</p>
                <p className="text-green-400 text-sm">+3.8% vs last month</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Metrics */}
        {selectedMetric === 'content' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Distribution */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Content by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.contentMetrics.topCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics?.contentMetrics.topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Reading Patterns */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Reading Patterns by Hour</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.contentMetrics.readingPatterns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    />
                    <Bar dataKey="reads" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Most Popular Articles</h3>
              <div className="space-y-4">
                {analytics?.contentMetrics.popularArticles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{article.title}</h4>
                      <p className="text-slate-400 text-sm">{article.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatNumber(article.views)}</p>
                      <p className="text-slate-400 text-sm">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Research Trends */}
        {selectedMetric === 'research' && (
          <div className="space-y-8">
            {/* Field Growth */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Research Field Growth</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics?.researchTrends.fieldGrowth} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="field" type="category" stroke="#9ca3af" width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="growth" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Citation Trends */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Citation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.researchTrends.citationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="citations" stroke="#f59e0b" strokeWidth={3} />
                  <Line type="monotone" dataKey="papers" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Engagement Analytics */}
        {selectedMetric === 'engagement' && (
          <div className="space-y-8">
            {/* Expert Engagement */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Top Expert Engagement</h3>
              <div className="space-y-4">
                {analytics?.contentMetrics.expertEngagement.map((expert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{expert.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{expert.name}</h4>
                        <p className="text-slate-400 text-sm">{expert.insights} insights published</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatNumber(expert.followers)}</p>
                      <p className="text-slate-400 text-sm">followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Active Users */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Weekly Active Users Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.userEngagement.weeklyActiveUsers.map((users, index) => ({
                  week: `Week ${index + 1}`,
                  users
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 