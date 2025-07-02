'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  description: string;
  last_updated: string;
  response_time?: number;
  uptime: string;
}

interface IncidentReport {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  created_at: string;
  updated_at: string;
  affected_services: string[];
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');

  useEffect(() => {
    fetchSystemStatus();
    // Update status every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      // In a real app, this would fetch from your monitoring API
      const mockServices: ServiceStatus[] = [
        {
          name: 'NeuroNova API',
          status: 'operational',
          description: 'Core API services running normally',
          last_updated: new Date().toISOString(),
          response_time: 45,
          uptime: '99.97%'
        },
        {
          name: 'Research Database',
          status: 'operational',
          description: 'Research data access and storage',
          last_updated: new Date().toISOString(),
          response_time: 12,
          uptime: '99.99%'
        },
        {
          name: 'Search Engine',
          status: 'operational',
          description: 'Full-text search and indexing',
          last_updated: new Date().toISOString(),
          response_time: 28,
          uptime: '99.95%'
        },
        {
          name: 'External APIs',
          status: 'operational',
          description: 'arXiv, PubMed, Semantic Scholar integration',
          last_updated: new Date().toISOString(),
          response_time: 156,
          uptime: '99.89%'
        },
        {
          name: 'Authentication',
          status: 'operational',
          description: 'User login and security services',
          last_updated: new Date().toISOString(),
          response_time: 34,
          uptime: '99.98%'
        },
        {
          name: 'File Storage',
          status: 'operational',
          description: 'Document and media storage',
          last_updated: new Date().toISOString(),
          response_time: 67,
          uptime: '99.94%'
        },
        {
          name: 'Notification System',
          status: 'operational',
          description: 'Email and push notifications',
          last_updated: new Date().toISOString(),
          response_time: 89,
          uptime: '99.92%'
        },
        {
          name: 'Analytics Platform',
          status: 'operational',
          description: 'Usage tracking and insights',
          last_updated: new Date().toISOString(),
          response_time: 23,
          uptime: '99.96%'
        }
      ];

      const mockIncidents: IncidentReport[] = [
        {
          id: '1',
          title: 'Scheduled Maintenance - Database Optimization',
          status: 'resolved',
          severity: 'minor',
          description: 'Planned maintenance to optimize database performance completed successfully.',
          created_at: '2024-01-18T02:00:00Z',
          updated_at: '2024-01-18T04:30:00Z',
          affected_services: ['Research Database']
        }
      ];

      setServices(mockServices);
      setIncidents(mockIncidents);
      
      // Determine overall status
      const hasOutage = mockServices.some(s => s.status === 'outage');
      const hasDegraded = mockServices.some(s => s.status === 'degraded');
      
      if (hasOutage) {
        setOverallStatus('outage');
      } else if (hasDegraded) {
        setOverallStatus('degraded');
      } else {
        setOverallStatus('operational');
      }
      
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'outage':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'outage':
        return 'text-red-500';
      case 'maintenance':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'operational':
        return 'All systems operational';
      case 'degraded':
        return 'Some systems experiencing issues';
      case 'outage':
        return 'Service disruption detected';
      default:
        return 'Status unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">System Status</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real-time monitoring of NeuroNova services and infrastructure
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-slate-800 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center space-x-4">
            {getStatusIcon(overallStatus)}
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${getStatusColor(overallStatus)}`}>
                {getOverallStatusMessage()}
              </h2>
              <p className="text-slate-400 mt-2">
                Last updated: {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        {/* Current Incidents */}
        {incidents.filter(i => i.status !== 'resolved').length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Current Incidents</h2>
            <div className="space-y-4">
              {incidents.filter(i => i.status !== 'resolved').map(incident => (
                <div key={incident.id} className="bg-slate-800 rounded-lg p-6 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        incident.severity === 'critical' ? 'bg-red-600 text-white' :
                        incident.severity === 'major' ? 'bg-orange-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white">
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{incident.description}</p>
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Affected: {incident.affected_services.join(', ')}</span>
                    <span>Started: {formatDate(incident.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                  </div>
                  <span className={`capitalize font-medium ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                
                <p className="text-slate-300 mb-4">{service.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white ml-2 font-medium">{service.uptime}</span>
                  </div>
                  {service.response_time && (
                    <div>
                      <span className="text-slate-400">Response:</span>
                      <span className="text-white ml-2 font-medium">{service.response_time}ms</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-slate-400">
                  Updated: {formatDate(service.last_updated)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">99.97%</div>
            <div className="text-slate-400">Overall Uptime</div>
            <div className="text-xs text-slate-500 mt-1">Last 30 days</div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">45ms</div>
            <div className="text-slate-400">Avg Response</div>
            <div className="text-xs text-slate-500 mt-1">API endpoints</div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">1.2M</div>
            <div className="text-slate-400">Requests/Day</div>
            <div className="text-xs text-slate-500 mt-1">Average volume</div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">0.02%</div>
            <div className="text-slate-400">Error Rate</div>
            <div className="text-xs text-slate-500 mt-1">Last 24 hours</div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Incident History</h2>
          <div className="bg-slate-800 rounded-lg">
            {incidents.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {incidents.map(incident => (
                  <div key={incident.id} className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{incident.title}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          incident.status === 'resolved' ? 'bg-green-600 text-white' :
                          incident.status === 'monitoring' ? 'bg-blue-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {incident.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-3">{incident.description}</p>
                    <div className="flex justify-between items-center text-sm text-slate-400">
                      <span>Affected: {incident.affected_services.join(', ')}</span>
                      <span>{formatDate(incident.created_at)} - {formatDate(incident.updated_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-slate-400">No recent incidents to report</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-slate-400 mb-6">
            Get notified about service incidents and maintenance windows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@example.com"
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 