'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Zap,
  Crown,
  Shield,
  Flame,
  CheckCircle
} from 'lucide-react';

interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: 'reading' | 'community' | 'expertise' | 'discovery' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  rarity: number;
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  currentLevelPoints: number;
  rank: number;
  totalUsers: number;
  streak: number;
  achievementsUnlocked: number;
  badgesEarned: number;
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const mockAchievements: Achievement[] = [
    {
      _id: '1',
      name: 'First Steps',
      description: 'Read your first research article',
      icon: 'BookOpen',
      category: 'reading',
      tier: 'bronze',
      points: 10,
      unlocked: true,
      unlockedDate: '2024-06-01',
      progress: 1,
      maxProgress: 1,
      rarity: 95.2
    },
    {
      _id: '2',
      name: 'Knowledge Seeker',
      description: 'Read 50 research articles',
      icon: 'Target',
      category: 'reading',
      tier: 'silver',
      points: 100,
      unlocked: true,
      unlockedDate: '2024-06-10',
      progress: 50,
      maxProgress: 50,
      rarity: 67.8
    },
    {
      _id: '3',
      name: 'Research Scholar',
      description: 'Read 200 research articles',
      icon: 'Trophy',
      category: 'reading',
      tier: 'gold',
      points: 500,
      unlocked: false,
      progress: 89,
      maxProgress: 200,
      rarity: 23.4
    },
    {
      _id: '4',
      name: 'Community Builder',
      description: 'Start 10 meaningful discussions',
      icon: 'Users',
      category: 'community',
      tier: 'silver',
      points: 150,
      unlocked: true,
      unlockedDate: '2024-06-15',
      progress: 10,
      maxProgress: 10,
      rarity: 45.6
    },
    {
      _id: '5',
      name: 'Expert Network',
      description: 'Follow 25 verified experts',
      icon: 'Star',
      category: 'social',
      tier: 'bronze',
      points: 75,
      unlocked: false,
      progress: 23,
      maxProgress: 25,
      rarity: 56.7
    },
    {
      _id: '6',
      name: 'Breakthrough Hunter',
      description: 'Be among the first 100 to read a breakthrough discovery',
      icon: 'Zap',
      category: 'discovery',
      tier: 'platinum',
      points: 1000,
      unlocked: true,
      unlockedDate: '2024-06-18',
      progress: 1,
      maxProgress: 1,
      rarity: 8.9
    },
    {
      _id: '7',
      name: 'Dedication',
      description: 'Maintain a 30-day reading streak',
      icon: 'Flame',
      category: 'reading',
      tier: 'diamond',
      points: 2000,
      unlocked: true,
      unlockedDate: '2024-06-20',
      progress: 30,
      maxProgress: 30,
      rarity: 3.4
    },
    {
      _id: '8',
      name: 'Peer Reviewer',
      description: 'Provide helpful feedback on 20 research discussions',
      icon: 'CheckCircle',
      category: 'community',
      tier: 'gold',
      points: 750,
      unlocked: false,
      progress: 12,
      maxProgress: 20,
      rarity: 18.7
    },
    {
      _id: '9',
      name: 'Citation Master',
      description: 'Bookmark 100 research articles',
      icon: 'BookOpen',
      category: 'reading',
      tier: 'silver',
      points: 200,
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      rarity: 34.5
    },
    {
      _id: '10',
      name: 'Thought Leader',
      description: 'Receive 500+ likes on your contributions',
      icon: 'Crown',
      category: 'expertise',
      tier: 'platinum',
      points: 1500,
      unlocked: false,
      progress: 234,
      maxProgress: 500,
      rarity: 5.8
    },
    {
      _id: '11',
      name: 'Early Adopter',
      description: 'Join Neuronova in its first month',
      icon: 'Shield',
      category: 'social',
      tier: 'gold',
      points: 500,
      unlocked: true,
      unlockedDate: '2024-06-01',
      progress: 1,
      maxProgress: 1,
      rarity: 12.3
    },
    {
      _id: '12',
      name: 'Knowledge Curator',
      description: 'Share 50 research articles with the community',
      icon: 'TrendingUp',
      category: 'social',
      tier: 'silver',
      points: 300,
      unlocked: false,
      progress: 28,
      maxProgress: 50,
      rarity: 28.9
    }
  ];

  const mockUserStats: UserStats = {
    totalPoints: 2340,
    level: 8,
    nextLevelPoints: 2500,
    currentLevelPoints: 2000,
    rank: 156,
    totalUsers: 12847,
    streak: 12,
    achievementsUnlocked: 4,
    badgesEarned: 3
  };

  useEffect(() => {
    setTimeout(() => {
      setAchievements(mockAchievements);
      setUserStats(mockUserStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getAchievementIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      BookOpen, Target, Trophy, Users, Star, Zap, Crown, Flame
    };
    const IconComponent = icons[iconName] || Award;
    return <IconComponent className="h-8 w-8" />;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
      case 'silver': return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/50';
      case 'gold': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'platinum': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'diamond': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/50';
    }
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
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Achievements & Rewards
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Track your progress, unlock achievements, and compete with fellow researchers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-slate-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{userStats?.level}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Level {userStats?.level}</h2>
                    <p className="text-slate-400">Research Enthusiast</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-slate-400">Total Points</p>
                  <p className="text-2xl font-bold text-white">{userStats?.totalPoints.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress to Level {(userStats?.level || 0) + 1}</span>
                  <span>{(userStats?.totalPoints || 0) - (userStats?.currentLevelPoints || 0)} / {(userStats?.nextLevelPoints || 0) - (userStats?.currentLevelPoints || 0)} XP</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((userStats?.totalPoints || 0) - (userStats?.currentLevelPoints || 0)) / ((userStats?.nextLevelPoints || 0) - (userStats?.currentLevelPoints || 0)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <Award className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats?.achievementsUnlocked}</div>
                <div className="text-slate-400">Achievements</div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats?.badgesEarned}</div>
                <div className="text-slate-400">Badges Earned</div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">#{userStats?.rank}</div>
                <div className="text-slate-400">Global Rank</div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{userStats?.streak}</div>
                <div className="text-slate-400">Day Streak</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Recent Achievements</h3>
              <div className="space-y-4">
                {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                  <div key={achievement._id} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                    <div className={`p-3 rounded-lg ${getTierColor(achievement.tier)}`}>
                      {getAchievementIcon(achievement.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{achievement.name}</h4>
                      <p className="text-slate-400 text-sm">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-400">+{achievement.points} XP</p>
                      <p className="text-slate-400 text-sm">
                        {achievement.unlockedDate && new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(achievement => (
                <div 
                  key={achievement._id} 
                  className={`bg-slate-800 rounded-lg p-6 border transition-all ${
                    achievement.unlocked 
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                      : 'border-slate-700 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getTierColor(achievement.tier)}`}>
                      {getAchievementIcon(achievement.icon)}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTierColor(achievement.tier)}`}>
                        {achievement.tier}
                      </span>
                      {achievement.unlocked && (
                        <CheckCircle className="h-6 w-6 text-green-400 mt-2" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{achievement.description}</p>
                  
                  {!achievement.unlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">+{achievement.points} XP</span>
                    <span className="text-slate-500 text-xs">{achievement.rarity}% have this</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 