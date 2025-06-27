'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  KeyIcon, 
  EyeIcon,
  UserGroupIcon,
  LockClosedIcon,
  ClockIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'permission_change' | 'data_access' | 'suspicious_activity';
  user: string;
  timestamp: string;
  ip: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface AccessControl {
  id: string;
  resource: string;
  role: string;
  permissions: string[];
  lastModified: string;
  modifiedBy: string;
}

export default function SecurityPage() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [accessControls, setAccessControls] = useState<AccessControl[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'access' | 'settings'>('events');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setSecurityEvents([
      {
        id: '1',
        type: 'failed_login',
        user: 'unknown@example.com',
        timestamp: '2024-01-15T10:30:00Z',
        ip: '192.168.1.100',
        location: 'New York, US',
        severity: 'medium',
        description: 'Multiple failed login attempts detected'
      },
      {
        id: '2',
        type: 'permission_change',
        user: 'admin@neuronova.com',
        timestamp: '2024-01-15T09:15:00Z',
        ip: '10.0.0.1',
        location: 'San Francisco, US',
        severity: 'high',
        description: 'User permissions elevated for research@neuronova.com'
      },
      {
        id: '3',
        type: 'suspicious_activity',
        user: 'researcher@example.com',
        timestamp: '2024-01-15T08:45:00Z',
        ip: '203.0.113.1',
        location: 'Unknown',
        severity: 'critical',
        description: 'Unusual data access pattern detected'
      }
    ]);

    setAccessControls([
      {
        id: '1',
        resource: 'Research Database',
        role: 'Researcher',
        permissions: ['read', 'write', 'comment'],
        lastModified: '2024-01-10T14:30:00Z',
        modifiedBy: 'admin@neuronova.com'
      },
      {
        id: '2',
        resource: 'User Management',
        role: 'Admin',
        permissions: ['read', 'write', 'delete', 'manage'],
        lastModified: '2024-01-08T11:20:00Z',
        modifiedBy: 'superadmin@neuronova.com'
      },
      {
        id: '3',
        resource: 'Analytics Dashboard',
        role: 'Analyst',
        permissions: ['read', 'export'],
        lastModified: '2024-01-05T16:45:00Z',
        modifiedBy: 'admin@neuronova.com'
      }
    ]);

    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'permission_change': return <KeyIcon className="h-5 w-5" />;
      case 'suspicious_activity': return <EyeIcon className="h-5 w-5" />;
      default: return <ShieldCheckIcon className="h-5 w-5" />;
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
            <h1 className="text-2xl font-bold text-gray-900">Security Management</h1>
            <p className="text-gray-600 mt-1">Monitor security events and manage access controls</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600">
              <ShieldCheckIcon className="h-5 w-5" />
              <span className="text-sm font-medium">System Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <LockClosedIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security Score</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'events', name: 'Security Events', icon: ExclamationTriangleIcon },
              { id: 'access', name: 'Access Control', icon: KeyIcon },
              { id: 'settings', name: 'Security Settings', icon: ShieldCheckIcon }
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
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recent Security Events</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Export Log
                </button>
              </div>
              
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Severity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {securityEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getEventIcon(event.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {event.description}
                              </div>
                              <div className="text-sm text-gray-500">
                                IP: {event.ip}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Access Control Rules</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Add Rule
                </button>
              </div>
              
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Resource
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Permissions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accessControls.map((control) => (
                      <tr key={control.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {control.resource}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {control.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {control.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            {new Date(control.lastModified).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            by {control.modifiedBy}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Authentication</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Require two-factor authentication</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Password complexity requirements</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Single sign-on (SSO)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Session Management</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700">Session timeout (minutes)</label>
                      <input type="number" className="mt-1 block w-full rounded-md border-gray-300" defaultValue={30} />
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Concurrent session limit</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Monitoring</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Log security events</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Real-time threat detection</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Email alerts for critical events</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Data Protection</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Encrypt data at rest</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Encrypt data in transit</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Data loss prevention</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 