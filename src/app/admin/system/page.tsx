'use client';

import React, { useState, useEffect } from 'react';
import { 
  ServerIcon, 
  CpuChipIcon, 
  CircleStackIcon, 
  CloudIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  lastRestart: string;
  port?: number;
}

export default function SystemPage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'logs' | 'maintenance'>('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setMetrics([
      { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable' },
      { name: 'Memory Usage', value: 68, unit: '%', status: 'warning', trend: 'up' },
      { name: 'Disk Usage', value: 32, unit: '%', status: 'healthy', trend: 'stable' },
      { name: 'Network I/O', value: 125, unit: 'MB/s', status: 'healthy', trend: 'down' },
      { name: 'Database Connections', value: 23, unit: 'active', status: 'healthy', trend: 'stable' },
      { name: 'Response Time', value: 245, unit: 'ms', status: 'healthy', trend: 'stable' }
    ]);

    setServices([
      { name: 'Web Server', status: 'running', uptime: '7d 14h 23m', lastRestart: '2024-01-08T10:30:00Z', port: 3000 },
      { name: 'Database', status: 'running', uptime: '15d 6h 12m', lastRestart: '2024-01-01T08:00:00Z', port: 5432 },
      { name: 'Redis Cache', status: 'running', uptime: '7d 14h 20m', lastRestart: '2024-01-08T10:33:00Z', port: 6379 },
      { name: 'Background Jobs', status: 'running', uptime: '7d 14h 23m', lastRestart: '2024-01-08T10:30:00Z' },
      { name: 'File Storage', status: 'running', uptime: '15d 6h 12m', lastRestart: '2024-01-01T08:00:00Z' },
      { name: 'Email Service', status: 'error', uptime: '0m', lastRestart: '2024-01-15T09:45:00Z', port: 587 }
    ]);

    setLoading(false);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In real app, refetch data here
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'stopped':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'critical':
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Management</h1>
            <p className="text-gray-600 mt-1">Monitor system performance and manage services</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <button 
              onClick={() => setLastUpdate(new Date())}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ServerIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-green-600">Healthy</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">15d 6h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'System Overview', icon: ChartBarIcon },
              { id: 'services', name: 'Services', icon: ServerIcon },
              { id: 'logs', name: 'System Logs', icon: CircleStackIcon },
              { id: 'maintenance', name: 'Maintenance', icon: CpuChipIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                  <div key={metric.name} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {metric.value} {metric.unit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                        {getStatusIcon(metric.status)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'healthy' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(metric.value, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Resource Usage Over Time</h4>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Performance charts would be displayed here</p>
                    <p className="text-sm">Integration with monitoring tools like Grafana</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">System Services</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Restart All
                </button>
              </div>
              
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Uptime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Port
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(service.status)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {service.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Last restart: {new Date(service.lastRestart).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                            {service.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.uptime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.port || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              Restart
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              Stop
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Logs
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
                <div className="flex space-x-2">
                  <select className="rounded-md border-gray-300 text-sm">
                    <option>All Services</option>
                    <option>Web Server</option>
                    <option>Database</option>
                    <option>Background Jobs</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                    Download Logs
                  </button>
                </div>
              </div>
              
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                <div className="space-y-1">
                  <div>[2024-01-15 10:30:15] INFO: Web server started on port 3000</div>
                  <div>[2024-01-15 10:30:16] INFO: Database connection established</div>
                  <div>[2024-01-15 10:30:17] INFO: Redis cache connected</div>
                  <div>[2024-01-15 10:30:18] INFO: Background job processor started</div>
                  <div>[2024-01-15 10:31:22] INFO: User authentication successful - user@example.com</div>
                  <div>[2024-01-15 10:32:45] WARN: High memory usage detected - 68%</div>
                  <div>[2024-01-15 10:33:12] INFO: Research data synchronized</div>
                  <div>[2024-01-15 10:34:28] ERROR: Email service connection failed</div>
                  <div>[2024-01-15 10:35:01] INFO: Automatic backup completed</div>
                  <div>[2024-01-15 10:36:15] INFO: API request processed - /api/research/stats</div>
                  <div>[2024-01-15 10:37:33] WARN: Rate limit exceeded for IP 192.168.1.100</div>
                  <div>[2024-01-15 10:38:44] INFO: Cache cleared successfully</div>
                  <div>[2024-01-15 10:39:12] INFO: Security scan completed - no threats detected</div>
                  <div>[2024-01-15 10:40:28] INFO: Database optimization completed</div>
                  <div className="text-yellow-400">[2024-01-15 10:41:05] WARN: Disk space usage at 85%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">System Maintenance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Database Maintenance</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Optimize Database
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                      Create Backup
                    </button>
                    <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700">
                      Vacuum Database
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Cache Management</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Clear All Cache
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                      Warm Cache
                    </button>
                    <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700">
                      Cache Statistics
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">System Updates</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Check for Updates
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                      Install Security Patches
                    </button>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                      Restart System
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Cleanup Tasks</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Clean Temp Files
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                      Archive Old Logs
                    </button>
                    <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700">
                      Disk Cleanup
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Scheduled Maintenance
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Next scheduled maintenance: Sunday, January 21, 2024 at 2:00 AM UTC</p>
                      <p>Estimated downtime: 30 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 