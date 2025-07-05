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
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">System Status</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-slate-700 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">System Status</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Status</h1>
          <p className="text-slate-300">Real-time system performance and health metrics</p>
        </div>

        {status && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* System Overview */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Server className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="text-lg font-semibold">System</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Uptime:</span>
                  <span className="text-green-400">{formatUptime(status.system.uptime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Platform:</span>
                  <span>{status.system.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Version:</span>
                  <span>{status.system.version}</span>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold">Memory</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Heap Used:</span>
                  <span className="text-blue-400">{formatBytes(status.system.memory.heapUsed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Heap Total:</span>
                  <span>{formatBytes(status.system.memory.heapTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">RSS:</span>
                  <span>{formatBytes(status.system.memory.rss)}</span>
                </div>
              </div>
            </div>

            {/* Cache Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-6 w-6 text-purple-400 mr-3" />
                <h3 className="text-lg font-semibold">Cache</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Hits:</span>
                  <span className="text-green-400">{status.cache.hits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Misses:</span>
                  <span className="text-red-400">{status.cache.misses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Size:</span>
                  <span>{status.cache.size.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rate Limits */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Network className="h-6 w-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-semibold">Rate Limits</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total:</span>
                  <span>{status.rateLimits.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Active:</span>
                  <span className="text-yellow-400">{status.rateLimits.active.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 md:col-span-2">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-slate-400 mr-3" />
                <h3 className="text-lg font-semibold">Last Updated</h3>
              </div>
              <p className="text-slate-300">
                {new Date(status.system.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 