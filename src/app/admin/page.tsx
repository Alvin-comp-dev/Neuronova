'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Database,
  Shield,
  Settings
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalResearch: number;
  pendingModeration: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  serverUptime: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalResearch: 0,
    pendingModeration: 0,
    systemHealth: 'healthy',
    serverUptime: '0h 0m'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      // Mock data for demonstration
      setStats({
        totalUsers: 1247,
        activeUsers: 89,
        totalResearch: 3456,
        pendingModeration: 12,
        systemHealth: 'healthy',
        serverUptime: '7d 14h 23m'
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Manage users, content, and system settings
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stats.systemHealth === 'healthy' 
                    ? 'bg-green-900 text-green-200' 
                    : stats.systemHealth === 'warning'
                    ? 'bg-yellow-900 text-yellow-200'
                    : 'bg-red-900 text-red-200'
                }`}>
                  <Activity className="w-3 h-3 mr-1" />
                  System {stats.systemHealth}
                </span>
                <button className="inline-flex items-center px-3 py-2 border border-slate-600 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-slate-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-white">{stats.totalUsers.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-slate-300">{stats.activeUsers} active today</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Research Papers</dt>
                    <dd className="text-lg font-medium text-white">{stats.totalResearch.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-400">+12% from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-slate-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Pending Moderation</dt>
                    <dd className="text-lg font-medium text-white">{stats.pendingModeration}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-red-400">Requires attention</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-slate-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Server Uptime</dt>
                    <dd className="text-lg font-medium text-white">{stats.serverUptime}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-700 px-5 py-3">
              <div className="text-sm">
                <span className="text-green-400">99.9% availability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-slate-800 shadow rounded-lg border border-slate-700">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: Activity },
                { id: 'users', name: 'Users', icon: Users },
                { id: 'content', name: 'Content', icon: FileText },
                { id: 'system', name: 'System', icon: Database },
                { id: 'security', name: 'Security', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                    <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'New user registration', user: 'john.doe@example.com', time: '2 minutes ago' },
                        { action: 'Research paper published', user: 'Dr. Smith', time: '15 minutes ago' },
                        { action: 'Content flagged for review', user: 'System', time: '1 hour ago' },
                        { action: 'Database backup completed', user: 'System', time: '2 hours ago' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0">
                          <div>
                            <p className="text-sm font-medium text-white">{activity.action}</p>
                            <p className="text-xs text-slate-400">{activity.user}</p>
                          </div>
                          <span className="text-xs text-slate-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                    <h3 className="text-lg font-medium text-white mb-4">System Health</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'CPU Usage', value: 45, color: 'bg-green-500' },
                        { name: 'Memory Usage', value: 72, color: 'bg-yellow-500' },
                        { name: 'Database', value: 28, color: 'bg-green-500' },
                        { name: 'Network I/O', value: 15, color: 'bg-blue-500' },
                      ].map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-slate-200">{metric.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-600 rounded-full h-2">
                              <div 
                                className={`${metric.color} h-2 rounded-full`} 
                                style={{ width: `${metric.value}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-300 w-8">{metric.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Export Users
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <Users className="w-4 h-4 mr-2" />
                      Add User
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">User Management Interface</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Advanced user management tools will be implemented here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Content Moderation</h3>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Bulk Actions
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Review Queue
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Content Moderation Tools</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Content review and moderation interface will be implemented here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Clear Cache
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <Database className="w-4 h-4 mr-2" />
                      System Logs
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Database className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">System Configuration Panel</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Advanced system settings and configuration tools will be implemented here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Security & Access Control</h3>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Access Logs
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Scan
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Shield className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Security Management Interface</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Security settings and access control management will be implemented here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 