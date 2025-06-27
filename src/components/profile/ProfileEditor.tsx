'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  UserCircleIcon, 
  CameraIcon, 
  AcademicCapIcon,
  GlobeAltIcon,
  MapPinIcon,
  ClockIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  EyeIcon,
  BellIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { FaTwitter, FaLinkedin, FaGithub, FaOrcid, FaGoogle } from 'react-icons/fa';

interface ProfileData {
  name: string;
  bio: string;
  institution: string;
  researchInterests: string[];
  academicLevel: string;
  orcid: string;
  website: string;
  twitter: string;
  linkedin: string;
  googleScholar: string;
  location: string;
  timezone: string;
}

interface Settings {
  emailNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'researchers-only';
  newsletterSubscribed: boolean;
  researchAlerts: boolean;
  discussionNotifications: boolean;
  followNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export default function ProfileEditor() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    bio: '',
    institution: '',
    researchInterests: [],
    academicLevel: '',
    orcid: '',
    website: '',
    twitter: '',
    linkedin: '',
    googleScholar: '',
    location: '',
    timezone: '',
  });

  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    profileVisibility: 'public',
    newsletterSubscribed: true,
    researchAlerts: true,
    discussionNotifications: true,
    followNotifications: true,
    theme: 'system',
    language: 'en',
  });

  const academicLevels = [
    { value: '', label: 'Select level' },
    { value: 'undergraduate', label: 'Undergraduate Student' },
    { value: 'graduate', label: 'Graduate Student' },
    { value: 'postdoc', label: 'Postdoctoral Researcher' },
    { value: 'professor', label: 'Professor' },
    { value: 'researcher', label: 'Independent Researcher' },
    { value: 'other', label: 'Other' },
  ];

  const commonInterests = [
    'Neuroscience', 'Artificial Intelligence', 'Machine Learning', 'Brain-Computer Interface',
    'Cognitive Science', 'Neurobiology', 'Psychology', 'Computational Neuroscience',
    'Medical Research', 'Bioinformatics', 'Neuroimaging', 'Genetics', 'Pharmacology',
    'Behavioral Science', 'Neuroplasticity', 'Deep Learning', 'Neural Networks',
    'Neuropharmacology', 'Cognitive Psychology', 'Neurodegeneration', 'Synaptic Plasticity'
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Seoul', 'Asia/Mumbai', 'Asia/Singapore',
    'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
  ];

  // Load user profile data
  useEffect(() => {
    if (session?.user?.id) {
      loadUserProfile();
    }
  }, [session]);

  const loadUserProfile = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      const data = await response.json();

      if (data.success && data.user) {
        const user = data.user;
        setProfileData({
          name: user.name || '',
          bio: user.profile?.bio || '',
          institution: user.profile?.institution || '',
          researchInterests: user.profile?.researchInterests || [],
          academicLevel: user.profile?.academicLevel || '',
          orcid: user.profile?.orcid || '',
          website: user.profile?.website || '',
          twitter: user.profile?.twitter || '',
          linkedin: user.profile?.linkedin || '',
          googleScholar: user.profile?.googleScholar || '',
          location: user.profile?.location || '',
          timezone: user.profile?.timezone || '',
        });

        if (user.settings) {
          setSettings({
            emailNotifications: user.settings.emailNotifications ?? true,
            profileVisibility: user.settings.profileVisibility || 'public',
            newsletterSubscribed: user.settings.newsletterSubscribed ?? true,
            researchAlerts: user.settings.researchAlerts ?? true,
            discussionNotifications: user.settings.discussionNotifications ?? true,
            followNotifications: user.settings.followNotifications ?? true,
            theme: user.settings.theme || 'system',
            language: user.settings.language || 'en',
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleSettingsChange = (field: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const addResearchInterest = (interest: string) => {
    if (interest && !profileData.researchInterests.includes(interest)) {
      handleProfileChange('researchInterests', [...profileData.researchInterests, interest]);
      setNewInterest('');
    }
  };

  const removeResearchInterest = (interest: string) => {
    handleProfileChange('researchInterests', 
      profileData.researchInterests.filter(i => i !== interest)
    );
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          profile: {
            bio: profileData.bio,
            institution: profileData.institution,
            researchInterests: profileData.researchInterests,
            academicLevel: profileData.academicLevel,
            orcid: profileData.orcid,
            website: profileData.website,
            twitter: profileData.twitter,
            linkedin: profileData.linkedin,
            googleScholar: profileData.googleScholar,
            location: profileData.location,
            timezone: profileData.timezone,
          },
          settings: activeTab === 'settings' ? settings : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        // Update session data
        await update({
          ...session,
          user: {
            ...session.user,
            name: profileData.name,
          }
        });
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile information, privacy settings, and account security
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <UserCircleIcon className="w-4 h-4 mr-2" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BellIcon className="w-4 h-4 mr-2" />
            Notifications & Privacy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Security & Account
          </button>
        </nav>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800 dark:text-green-400">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Profile Picture
            </h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors">
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {profileData.name || 'Your Name'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profileData.institution || 'Add your institution'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={profileData.institution}
                  onChange={(e) => handleProfileChange('institution', e.target.value)}
                  placeholder="Your university or organization"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Level
                </label>
                <select
                  value={profileData.academicLevel}
                  onChange={(e) => handleProfileChange('academicLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {academicLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPinIcon className="inline w-4 h-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us about yourself and your research..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {profileData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Research Interests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Research Interests
            </h2>

            {/* Quick Add */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Popular research areas:</p>
              <div className="flex flex-wrap gap-2">
                {commonInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => addResearchInterest(interest)}
                    disabled={profileData.researchInterests.includes(interest)}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Interest Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add custom research interest"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addResearchInterest(newInterest);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addResearchInterest(newInterest)}
                disabled={!newInterest.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected Interests */}
            {profileData.researchInterests.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your research interests:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.researchInterests.map(interest => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeResearchInterest(interest)}
                        className="ml-2 text-blue-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Professional Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Professional Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaOrcid className="inline w-4 h-4 mr-2 text-green-600" />
                  ORCID ID
                </label>
                <input
                  type="text"
                  value={profileData.orcid}
                  onChange={(e) => handleProfileChange('orcid', e.target.value)}
                  placeholder="0000-0000-0000-0000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <GlobeAltIcon className="inline w-4 h-4 mr-2" />
                  Personal Website
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaTwitter className="inline w-4 h-4 mr-2 text-blue-400" />
                  Twitter
                </label>
                <input
                  type="text"
                  value={profileData.twitter}
                  onChange={(e) => handleProfileChange('twitter', e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaLinkedin className="inline w-4 h-4 mr-2 text-blue-600" />
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={profileData.linkedin}
                  onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaGoogle className="inline w-4 h-4 mr-2 text-red-500" />
                  Google Scholar
                </label>
                <input
                  type="text"
                  value={profileData.googleScholar}
                  onChange={(e) => handleProfileChange('googleScholar', e.target.value)}
                  placeholder="scholar.google.com/citations?user=..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2" />
              Privacy Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingsChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="public">🌍 Public - Anyone can view your profile</option>
                  <option value="researchers-only">🎓 Researchers Only - Verified users only</option>
                  <option value="private">🔒 Private - Only you can view your profile</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Control who can see your profile information and research interests
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BellIcon className="w-5 h-5 mr-2" />
              Notification Preferences
            </h2>

            <div className="space-y-6">
              {[
                { 
                  key: 'emailNotifications', 
                  label: 'Email Notifications', 
                  description: 'Receive email notifications for important updates and activities',
                  icon: '📧'
                },
                { 
                  key: 'newsletterSubscribed', 
                  label: 'Research Newsletter', 
                  description: 'Weekly digest of latest research in your areas of interest',
                  icon: '📰'
                },
                { 
                  key: 'researchAlerts', 
                  label: 'Research Alerts', 
                  description: 'Get notified when new research matches your interests',
                  icon: '🔔'
                },
                { 
                  key: 'discussionNotifications', 
                  label: 'Discussion Notifications', 
                  description: 'Notifications for replies, mentions, and discussion activity',
                  icon: '💬'
                },
                { 
                  key: 'followNotifications', 
                  label: 'Follow Notifications', 
                  description: 'Get notified when someone follows you or you gain new followers',
                  icon: '👥'
                },
              ].map(({ key, label, description, icon }) => (
                <div key={key} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof Settings] as boolean}
                    onChange={(e) => handleSettingsChange(key as keyof Settings, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded mt-1"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <span className="mr-2">{icon}</span>
                      {label}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <PaintBrushIcon className="w-5 h-5 mr-2" />
              Appearance & Language
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme Preference
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingsChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="system">🖥️ System Default</option>
                  <option value="light">☀️ Light Mode</option>
                  <option value="dark">🌙 Dark Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingsChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <ClockIcon className="inline w-4 h-4 mr-1" />
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => handleProfileChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select timezone</option>
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          {/* Account Security */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Account Security
            </h2>

            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Update your account password
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Login Sessions
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your active login sessions
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Verification */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Account Verification
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Verified</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">Verified</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">ORCID Verification</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Link your ORCID for researcher verification</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Verify
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Institution Verification</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Verify your academic affiliation</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-400 mb-4">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-400">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving Changes...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
} 