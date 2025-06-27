'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { initializeAuth, getCurrentUser, logout } from '@/lib/store/slices/authSlice';
import { 
  User, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Settings,
  Eye,
  Heart,
  Bookmark,
  Download,
  Share2,
  Target,
  Brain,
  Award,
  Activity,
  BarChart3,
  Filter,
  Clock,
  Zap,
  Shield,
  Globe,
  UserCheck,
  Camera,
  Upload
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  title: string;
  affiliation: string;
  specializations: string[];
  joinDate: string;
  stats: {
    savedArticles: number;
    readingTime: number;
    articlesRead: number;
    expertFollows: number;
  };
}

interface SavedArticle {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  savedDate: string;
  readStatus: 'unread' | 'reading' | 'completed';
  personalNotes: string;
  category: string;
  tags: string[];
  readingProgress: number;
}

interface PersonalizedRecommendation {
  _id: string;
  title: string;
  reason: string;
  type: 'based-on-reading' | 'trending-in-field' | 'expert-recommended' | 'similar-interests';
  relevanceScore: number;
  category: string;
  estimatedReadTime: number;
}

interface ReadingGoal {
  type: 'articles-per-week' | 'reading-time' | 'new-categories';
  target: number;
  current: number;
  period: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saved' | 'recommendations' | 'settings'>('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [readingGoals, setReadingGoals] = useState<ReadingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, token } = useAppSelector((state) => state.auth);

  // Mock user profile data
  const mockProfile: UserProfile = {
    name: 'Dr. Alexandra Smith',
    email: 'alexandra.smith@university.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    title: 'Research Scientist',
    affiliation: 'MIT Neuroscience Department',
    specializations: ['Neuroscience', 'Brain-Computer Interfaces', 'AI in Healthcare'],
    joinDate: '2023-09-15',
    stats: {
      savedArticles: 47,
      readingTime: 142, // hours
      articlesRead: 89,
      expertFollows: 23
    }
  };

  // Mock saved articles
  const mockSavedArticles: SavedArticle[] = [
    {
      _id: '1',
      title: 'Revolutionary Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms',
      authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez'],
      journal: 'Nature Neuroscience',
      savedDate: '2024-06-15',
      readStatus: 'reading',
      personalNotes: 'Important for my BCI research project. Need to review the machine learning algorithms section.',
      category: 'Neurotech',
      tags: ['BCI', 'Neural Interface', 'Robotics'],
      readingProgress: 65
    },
    {
      _id: '2',
      title: 'CRISPR 3.0 Achieves Unprecedented Precision in Gene Editing',
      authors: ['Prof. Michael Rodriguez', 'Dr. Emily Richardson'],
      journal: 'Cell',
      savedDate: '2024-06-14',
      readStatus: 'completed',
      personalNotes: 'Excellent methodology. Could apply similar precision approaches to neural tissue editing.',
      category: 'Gene Therapy',
      tags: ['CRISPR', 'Gene Editing', 'Precision Medicine'],
      readingProgress: 100
    },
    {
      _id: '3',
      title: 'AI System Detects Alzheimer\'s 15 Years Before Symptoms',
      authors: ['Dr. Lisa Wang', 'Dr. David Kim'],
      journal: 'Science Translational Medicine',
      savedDate: '2024-06-13',
      readStatus: 'unread',
      personalNotes: '',
      category: 'AI in Healthcare',
      tags: ['AI', 'Alzheimer\'s', 'Early Detection'],
      readingProgress: 0
    }
  ];

  // Mock personalized recommendations
  const mockRecommendations: PersonalizedRecommendation[] = [
    {
      _id: '1',
      title: 'Next-Generation Neural Prosthetics: From Lab to Clinical Application',
      reason: 'Based on your BCI research interests and recent reading history',
      type: 'based-on-reading',
      relevanceScore: 0.94,
      category: 'Neurotech',
      estimatedReadTime: 12
    },
    {
      _id: '2',
      title: 'Machine Learning Approaches to Neural Signal Decoding',
      reason: 'Trending in your field: Neuroscience',
      type: 'trending-in-field',
      relevanceScore: 0.89,
      category: 'AI in Healthcare',
      estimatedReadTime: 18
    },
    {
      _id: '3',
      title: 'Ethical Frameworks for Brain-Computer Interface Development',
      reason: 'Recommended by Dr. Sarah Chen (Expert you follow)',
      type: 'expert-recommended',
      relevanceScore: 0.87,
      category: 'Neurotech Ethics',
      estimatedReadTime: 15
    }
  ];

  // Mock reading goals
  const mockReadingGoals: ReadingGoal[] = [
    {
      type: 'articles-per-week',
      target: 5,
      current: 3,
      period: 'This Week'
    },
    {
      type: 'reading-time',
      target: 10,
      current: 6.5,
      period: 'This Week (hours)'
    },
    {
      type: 'new-categories',
      target: 2,
      current: 1,
      period: 'This Month'
    }
  ];

  useEffect(() => {
    // Initialize auth if not already done
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (isInitialized && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch user data if authenticated
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, isInitialized, user, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Convert Redux user data to profile format
      if (user) {
        const userProfile: UserProfile = {
          name: user.name,
          email: user.email,
          avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          title: user.preferences?.title || 'Research Scientist',
          affiliation: user.preferences?.affiliation || 'Academic Institution',
          specializations: user.preferences?.categories || ['Neuroscience', 'AI in Healthcare'],
          joinDate: user.preferences?.joinDate || new Date().toISOString().split('T')[0],
          stats: {
            savedArticles: user.stats?.savedArticles || 0,
            readingTime: user.stats?.readingTime || 0,
            articlesRead: user.stats?.articlesRead || 0,
            expertFollows: user.stats?.expertFollows || 0
          }
        };
        setProfile(userProfile);
      }

      // For now, use mock data for articles and recommendations
      // TODO: Replace with real API calls
      setSavedArticles(mockSavedArticles);
      setRecommendations(mockRecommendations);
      setReadingGoals(mockReadingGoals);
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use mock data as fallback
      setProfile(mockProfile);
      setSavedArticles(mockSavedArticles);
      setRecommendations(mockRecommendations);
      setReadingGoals(mockReadingGoals);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update profile with new avatar URL
        if (profile) {
          setProfile({
            ...profile,
            avatar: data.avatarUrl
          });
        }

        // Refresh user data from server
        dispatch(getCurrentUser());
        
        alert('Profile picture updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const getReadingStreak = () => {
    // Mock calculation - in real app, this would come from API
    return 12; // days
  };

  const getWeeklyProgress = () => {
    const articlesGoal = readingGoals.find(g => g.type === 'articles-per-week');
    return articlesGoal ? (articlesGoal.current / articlesGoal.target) * 100 : 0;
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
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img 
                  src={profile?.avatar} 
                  alt={profile?.name}
                  className="w-24 h-24 rounded-full border-4 border-white bg-slate-600 object-cover"
                />
                <button
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full border-2 border-white transition-colors disabled:opacity-50"
                  title="Change profile picture"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{profile?.name}</h1>
                <p className="text-blue-100 text-lg">{profile?.title}</p>
                <p className="text-blue-200">{profile?.affiliation}</p>
                <div className="flex items-center mt-2 space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(profile?.joinDate || '').toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    {getReadingStreak()} day streak
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'saved', label: 'Saved Articles', icon: Bookmark },
              { id: 'recommendations', label: 'For You', icon: Brain },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Saved Articles</p>
                    <p className="text-2xl font-bold text-white">{profile?.stats.savedArticles}</p>
                  </div>
                  <Bookmark className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Articles Read</p>
                    <p className="text-2xl font-bold text-white">{profile?.stats.articlesRead}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Reading Time</p>
                    <p className="text-2xl font-bold text-white">{profile?.stats.readingTime}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Experts Following</p>
                    <p className="text-2xl font-bold text-white">{profile?.stats.expertFollows}</p>
                  </div>
                  <User className="h-8 w-8 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Reading Goals */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Reading Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {readingGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 capitalize">
                          {goal.type.replace('-', ' ')}
                        </span>
                        <span className="text-slate-400 text-sm">{goal.period}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-700 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Completed reading "CRISPR 3.0 Achieves Unprecedented Precision"</span>
                  <span className="text-slate-500 text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Saved "AI System Detects Alzheimer's 15 Years Before Symptoms"</span>
                  <span className="text-slate-500 text-sm">1 day ago</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300">Started following Dr. Sarah Chen</span>
                  <span className="text-slate-500 text-sm">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Articles Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Saved Articles</h2>
              <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100">
                <option>All Articles</option>
                <option>Unread</option>
                <option>Reading</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="space-y-4">
              {savedArticles.map(article => (
                <div key={article._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                      <p className="text-slate-400 text-sm mb-2">
                        By {article.authors.join(', ')} • {article.journal}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                        <span>Saved {new Date(article.savedDate).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          article.readStatus === 'completed' ? 'bg-green-600 text-green-100' :
                          article.readStatus === 'reading' ? 'bg-blue-600 text-blue-100' :
                          'bg-slate-600 text-slate-300'
                        }`}>
                          {article.readStatus}
                        </span>
                      </div>
                      
                      {article.readingProgress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Reading Progress</span>
                            <span>{article.readingProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${article.readingProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {article.personalNotes && (
                        <div className="bg-slate-700 rounded-lg p-3 mb-3">
                          <p className="text-slate-300 text-sm">
                            <strong>Your notes:</strong> {article.personalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-400 transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-purple-400 transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Personalized For You</h2>
                <p className="text-slate-400">AI-curated recommendations based on your interests and reading history</p>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Brain className="h-5 w-5" />
                <span className="text-sm">AI Powered</span>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.map(rec => (
                <div key={rec._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                        <div className="flex items-center px-2 py-1 bg-purple-600 text-purple-100 text-xs rounded-full">
                          <Target className="h-3 w-3 mr-1" />
                          {Math.round(rec.relevanceScore * 100)}% match
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rec.type === 'based-on-reading' ? 'bg-blue-600 text-blue-100' :
                          rec.type === 'trending-in-field' ? 'bg-green-600 text-green-100' :
                          rec.type === 'expert-recommended' ? 'bg-purple-600 text-purple-100' :
                          'bg-amber-600 text-amber-100'
                        }`}>
                          {rec.type.replace('-', ' ')}
                        </span>
                        <span>{rec.category}</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {rec.estimatedReadTime} min read
                        </span>
                      </div>

                      <p className="text-slate-300 text-sm mb-3">
                        <Zap className="h-4 w-4 inline mr-1 text-yellow-400" />
                        {rec.reason}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                        Read Now
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            
            {/* Profile Picture */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img 
                    src={profile?.avatar} 
                    alt={profile?.name}
                    className="w-20 h-20 rounded-full border-2 border-slate-600 bg-slate-600 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                       onClick={() => document.getElementById('settings-avatar-upload')?.click()}>
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 mb-2">Upload a new profile picture</p>
                  <p className="text-slate-500 text-sm mb-4">JPG, PNG, or GIF. Max size 5MB.</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => document.getElementById('settings-avatar-upload')?.click()}
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Upload New</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    id="settings-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={profile?.name}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={profile?.email}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={profile?.title}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Affiliation</label>
                  <input 
                    type="text" 
                    value={profile?.affiliation}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700" />
                  <span className="ml-2 text-slate-300">New breakthroughs in your specializations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700" />
                  <span className="ml-2 text-slate-300">Weekly research digest</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700" />
                  <span className="ml-2 text-slate-300">Community discussions you might be interested in</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700" />
                  <span className="ml-2 text-slate-300">Expert insights from people you follow</span>
                </label>
              </div>
            </div>

            {/* Reading Preferences */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Reading Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Reading Time</label>
                  <select className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Morning (6-12 PM)</option>
                    <option>Afternoon (12-6 PM)</option>
                    <option>Evening (6-12 AM)</option>
                    <option>No preference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Articles per week goal</label>
                  <input 
                    type="number" 
                    defaultValue={5}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 