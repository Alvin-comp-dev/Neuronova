'use client';

import { useState, useEffect } from 'react';
import { Activity, Server, Database, Network, Clock } from 'lucide-react';

interface SystemStatus {
  system: {
    timestamp: string;
    uptime: number;
    memory: {
      heapTotal: number;
      heapUsed: number;
      rss: number;
    };
    version: string;
    platform: string;
  };
  cache: {
    hits: number;
    misses: number;
    size: number;
  };
  rateLimits: {
    total: number;
    active: number;
  };
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/system/status');
      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }
      const data = await response.json();
      setStatus(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
            <h2 className="text-xl font-semibold text-red-400 mb-2">System Status Error</h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchStatus}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              System Status
            </h1>
            <p className="text-xl text-blue-100">
              Real-time monitoring of system health and performance
            </p>
            <div className="mt-4 text-blue-200">
              Last updated: {new Date(status?.system.timestamp || '').toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* System Info */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <Server className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">System</h2>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300">
                <span className="text-slate-400">Platform:</span> {status?.system.platform}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Version:</span> {status?.system.version}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Uptime:</span> {formatUptime(status?.system.uptime || 0)}
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-900/20 rounded-lg">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Memory</h2>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300">
                <span className="text-slate-400">Total Heap:</span> {formatBytes(status?.system.memory.heapTotal || 0)}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Used Heap:</span> {formatBytes(status?.system.memory.heapUsed || 0)}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">RSS:</span> {formatBytes(status?.system.memory.rss || 0)}
              </div>
            </div>
          </div>

          {/* Cache Stats */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Cache</h2>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300">
                <span className="text-slate-400">Hit Rate:</span>{' '}
                {status?.cache ? Math.round((status.cache.hits / (status.cache.hits + status.cache.misses)) * 100) : 0}%
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Size:</span> {formatBytes(status?.cache.size || 0)}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Total Hits:</span> {status?.cache.hits || 0}
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-900/20 rounded-lg">
                <Network className="h-6 w-6 text-yellow-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Rate Limits</h2>
            </div>
            <div className="space-y-2">
              <div className="text-slate-300">
                <span className="text-slate-400">Active:</span> {status?.rateLimits.active || 0}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Total:</span> {status?.rateLimits.total || 0}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Usage:</span>{' '}
                {status?.rateLimits ? Math.round((status.rateLimits.active / status.rateLimits.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchStatus}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Clock className="h-4 w-4" />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>
    </div>
  );
} 