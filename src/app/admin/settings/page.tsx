'use client';

import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  BellIcon, 
  UserIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  EnvelopeIcon,
  ChartBarIcon,
  CloudIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

interface Setting {
  id: string;
  name: string;
  description: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'number' | 'select' | 'textarea';
  options?: string[];
  category: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'integrations'>('general');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setSettings([
      // General Settings
      { id: '1', name: 'Site Name', description: 'The name of your application', value: 'Neuronova', type: 'text', category: 'general' },
      { id: '2', name: 'Site Description', description: 'Brief description of your platform', value: 'Advancing Scientific Discovery', type: 'textarea', category: 'general' },
      { id: '3', name: 'Default Language', description: 'Default language for new users', value: 'English', type: 'select', options: ['English', 'Spanish', 'French', 'German'], category: 'general' },
      { id: '4', name: 'Timezone', description: 'Default timezone', value: 'UTC', type: 'select', options: ['UTC', 'EST', 'PST', 'GMT'], category: 'general' },
      { id: '5', name: 'Maintenance Mode', description: 'Enable maintenance mode', value: false, type: 'boolean', category: 'general' },
      
      // Notification Settings
      { id: '6', name: 'Email Notifications', description: 'Enable email notifications', value: true, type: 'boolean', category: 'notifications' },
      { id: '7', name: 'Push Notifications', description: 'Enable push notifications', value: true, type: 'boolean', category: 'notifications' },
      { id: '8', name: 'Admin Email', description: 'Email for admin notifications', value: 'admin@neuronova.com', type: 'text', category: 'notifications' },
      { id: '9', name: 'Notification Frequency', description: 'How often to send digest emails', value: 'Daily', type: 'select', options: ['Immediate', 'Hourly', 'Daily', 'Weekly'], category: 'notifications' },
      
      // Security Settings
      { id: '10', name: 'Session Timeout', description: 'Session timeout in minutes', value: 30, type: 'number', category: 'security' },
      { id: '11', name: 'Max Login Attempts', description: 'Maximum failed login attempts', value: 5, type: 'number', category: 'security' },
      { id: '12', name: 'Require 2FA', description: 'Require two-factor authentication', value: false, type: 'boolean', category: 'security' },
      { id: '13', name: 'Password Min Length', description: 'Minimum password length', value: 8, type: 'number', category: 'security' },
      
      // Integration Settings
      { id: '14', name: 'API Rate Limit', description: 'API requests per minute', value: 100, type: 'number', category: 'integrations' },
      { id: '15', name: 'External API Access', description: 'Allow external API access', value: true, type: 'boolean', category: 'integrations' },
      { id: '16', name: 'Webhook URL', description: 'URL for webhook notifications', value: '', type: 'text', category: 'integrations' },
      { id: '17', name: 'Analytics Tracking', description: 'Enable analytics tracking', value: true, type: 'boolean', category: 'integrations' }
    ]);

    setLoading(false);
  }, []);

  const handleSettingChange = (settingId: string, newValue: string | boolean | number) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real app, save to API
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to original values
    setHasChanges(false);
    // Refetch original settings
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={setting.value as number}
            onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );
      
      case 'boolean':
        return (
          <div className="mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={setting.value as boolean}
                onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {setting.value ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        );
      
      case 'select':
        return (
          <select
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
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
            <h1 className="text-2xl font-bold text-gray-900">Application Settings</h1>
            <p className="text-gray-600 mt-1">Configure your application preferences and system settings</p>
          </div>
          {hasChanges && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-yellow-600">You have unsaved changes</span>
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CogIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">General</p>
              <p className="text-2xl font-bold text-gray-900">{getSettingsByCategory('general').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{getSettingsByCategory('notifications').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security</p>
              <p className="text-2xl font-bold text-gray-900">{getSettingsByCategory('security').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CloudIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Integrations</p>
              <p className="text-2xl font-bold text-gray-900">{getSettingsByCategory('integrations').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'general', name: 'General', icon: CogIcon },
              { id: 'notifications', name: 'Notifications', icon: BellIcon },
              { id: 'security', name: 'Security', icon: ShieldCheckIcon },
              { id: 'integrations', name: 'Integrations', icon: CloudIcon }
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
          <div className="space-y-6">
            {getSettingsByCategory(activeTab).map((setting) => (
              <div key={setting.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      {setting.name}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      {setting.description}
                    </p>
                  </div>
                  <div>
                    {renderSettingInput(setting)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'general' && (
            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Export Configuration
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                  Import Configuration
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700">
                  Reset to Defaults
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                  Clear All Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Email Templates</h4>
              <p className="text-sm text-gray-600 mb-3">
                Customize email templates for different notification types
              </p>
              <div className="space-y-2">
                <button className="block w-full text-left bg-white p-3 rounded border hover:bg-gray-50">
                  Welcome Email Template
                </button>
                <button className="block w-full text-left bg-white p-3 rounded border hover:bg-gray-50">
                  Password Reset Template
                </button>
                <button className="block w-full text-left bg-white p-3 rounded border hover:bg-gray-50">
                  Research Update Template
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="mt-8 bg-red-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Security Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Generate API Keys
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                  Security Audit
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700">
                  Force Password Reset
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                  Revoke All Sessions
                </button>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="mt-8 bg-purple-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Available Integrations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">Email Service</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">SendGrid, Mailgun, SES</p>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Configure
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Analytics</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Google Analytics, Mixpanel</p>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Configure
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <CloudIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium">Storage</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">AWS S3, Google Cloud</p>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 