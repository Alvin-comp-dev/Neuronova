'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import {
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  BookmarkIcon,
  EyeIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import {
  SparklesIcon as SparklesSolid,
  BoltIcon as BoltSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';

interface RecommendedArticle {
  _id: string;
  title: string;
  abstract: string;
  authors: Array<{
    name: string;
    affiliation?: string;
  }>;
  categories: string[];
  tags: string[];
  source: {
    name: string;
    type: string;
  };
  publicationDate: string;
  citationCount: number;
  viewCount: number;
  bookmarkCount: number;
  trendingScore: number;
  keywords: string[];
  metrics: {
    impactScore: number;
    readabilityScore: number;
    noveltyScore: number;
  };
  recommendationScore: number;
  recommendationReasons: string[];
  confidence: number;
  algorithmUsed: string;
}

interface SmartRecommendationsProps {
  className?: string;
  limit?: number;
  showAlgorithmSelector?: boolean;
  showConfidenceScores?: boolean;
  showReasons?: boolean;
  onArticleClick?: (articleId: string) => void;
  onInteraction?: (articleId: string, type: 'view' | 'bookmark' | 'like' | 'share') => void;
}

const algorithmOptions = [
  {
    value: 'hybrid',
    label: 'Smart Mix',
    icon: SparklesIcon,
    description: 'Best of all algorithms combined',
    color: 'text-purple-500'
  },
  {
    value: 'content-based',
    label: 'Similar Content',
    icon: BoltIcon,
    description: 'Based on your reading history',
    color: 'text-blue-500'
  },
  {
    value: 'collaborative',
    label: 'Community Choice',
    icon: UsersIcon,
    description: 'What similar users read',
    color: 'text-green-500'
  },
  {
    value: 'trending',
    label: 'Trending Now',
    icon: ChartBarIcon,
    description: 'Popular in your fields',
    color: 'text-orange-500'
  }
];

export default function SmartRecommendations({
  className = '',
  limit = 5,
  showAlgorithmSelector = true,
  showConfidenceScores = true,
  showReasons = true,
  onArticleClick,
  onInteraction
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('hybrid');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [interactedItems, setInteractedItems] = useState<Set<string>>(new Set());

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedAlgorithm, limit]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        algorithm: selectedAlgorithm,
        userId: user?.userId || 'user1'
      });

      const headers: HeadersInit = {};
      if (isAuthenticated && user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
      }

      const response = await fetch(`/api/recommendations?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data || []);
        setLastUpdate(new Date());
      } else {
        console.error('Failed to fetch recommendations:', data.error);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleInteraction = async (articleId: string, type: 'view' | 'bookmark' | 'like' | 'share') => {
    // Optimistically update UI
    setInteractedItems(prev => new Set([...prev, `${articleId}-${type}`]));
    
    if (onInteraction) {
      onInteraction(articleId, type);
    }

    // Handle different interaction types
    try {
      if (type === 'bookmark') {
        await handleBookmark(articleId);
      } else if (type === 'like') {
        await handleLike(articleId);
      } else if (type === 'share') {
        await handleShare(articleId);
      } else if (type === 'view') {
        // Record view interaction with the recommendations API
        if (isAuthenticated && user?.token) {
          await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              interactionType: type,
              articleId,
              timestamp: new Date().toISOString()
            })
          });
        }
      }
    } catch (error) {
      console.error(`Failed to handle ${type} interaction:`, error);
      // Revert optimistic update on error
      setInteractedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${articleId}-${type}`);
        return newSet;
      });
      showToast(`Failed to ${type} article`, 'error');
    }
  };

  const handleBookmark = async (articleId: string) => {
    if (!isAuthenticated || !user?.token) {
      showToast('Please log in to bookmark articles', 'warning');
      return;
    }

    try {
      const isCurrentlyBookmarked = interactedItems.has(`${articleId}-bookmark`);
      const action = isCurrentlyBookmarked ? 'remove' : 'add';

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          articleId,
          action
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.isBookmarked) {
          showToast('Article bookmarked!', 'success');
        } else {
          showToast('Bookmark removed', 'info');
          // Remove from interacted items if unbookmarked
          setInteractedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(`${articleId}-bookmark`);
            return newSet;
          });
        }
      } else {
        throw new Error(data.error || 'Failed to update bookmark');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      throw error;
    }
  };

  const handleLike = async (articleId: string) => {
    if (!isAuthenticated || !user?.token) {
      showToast('Please log in to like articles', 'warning');
      return;
    }

    try {
      const isCurrentlyLiked = interactedItems.has(`${articleId}-like`);
      const action = isCurrentlyLiked ? 'remove' : 'add';

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          articleId,
          action
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.isLiked) {
          showToast('Article liked!', 'success');
        } else {
          showToast('Like removed', 'info');
          // Remove from interacted items if unliked
          setInteractedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(`${articleId}-like`);
            return newSet;
          });
        }
      } else {
        throw new Error(data.error || 'Failed to update like');
      }
    } catch (error) {
      console.error('Like error:', error);
      throw error;
    }
  };

  const handleShare = async (articleId: string) => {
    try {
      // Show share options modal/menu
      const shareOptions = [
        { type: 'link', label: 'Copy Link', icon: '🔗' },
        { type: 'twitter', label: 'Twitter', icon: '🐦' },
        { type: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { type: 'email', label: 'Email', icon: '📧' },
        { type: 'whatsapp', label: 'WhatsApp', icon: '💬' }
      ];

      // For now, default to copy link - in a real app you'd show a modal
      const shareType = 'link';
      
      const response = await fetch('/api/shares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && user?.token && {
            'Authorization': `Bearer ${user.token}`
          })
        },
        body: JSON.stringify({
          articleId,
          shareType
        })
      });

      const data = await response.json();

      if (data.success) {
        // Copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(data.data.url);
          showToast('Link copied to clipboard!', 'success');
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = data.data.url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showToast('Link copied to clipboard!', 'success');
        }
      } else {
        throw new Error(data.error || 'Failed to generate share link');
      }
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const toast = document.createElement('div');
    const bgColor = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
      warning: 'bg-yellow-600'
    }[type];
    
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-all duration-300 ${bgColor}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const handleArticleClick = (articleId: string) => {
    handleInteraction(articleId, 'view');
    if (onArticleClick) {
      onArticleClick(articleId);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const selectedAlgorithmInfo = algorithmOptions.find(opt => opt.value === selectedAlgorithm);

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SparklesSolid className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          </div>
          <button
            onClick={fetchRecommendations}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Refresh recommendations"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>

        {showAlgorithmSelector && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <span>Algorithm:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {algorithmOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedAlgorithm === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAlgorithmChange(option.value)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <IconComponent className={`h-4 w-4 ${isSelected ? 'text-purple-400' : option.color}`} />
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <p className="text-xs text-slate-400">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <ArrowPathIcon className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8">
            <SparklesIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">No recommendations available</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recommendations.map((article, index) => (
              <div
                key={article._id}
                className="p-4 hover:bg-slate-750 transition-colors cursor-pointer border-b border-slate-700/50 last:border-b-0"
                onClick={() => handleArticleClick(article._id)}
              >
                <div className="space-y-3">
                  {/* Header with confidence */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm leading-snug line-clamp-2 hover:text-blue-400 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {article.authors[0]?.name}
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(article.publicationDate)}
                        </span>
                      </div>
                    </div>
                    
                    {showConfidenceScores && (
                      <div className="flex-shrink-0 ml-3">
                        <div className={`text-xs font-medium ${getConfidenceColor(article.confidence)}`}>
                          {Math.round(article.confidence * 100)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {getConfidenceLabel(article.confidence)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {article.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Reasons */}
                  {showReasons && article.recommendationReasons.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">Why recommended:</div>
                      <div className="space-y-0.5">
                        {article.recommendationReasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-center space-x-1 text-xs text-slate-400">
                            <CheckCircleIcon className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-3 w-3" />
                        <span>{article.viewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookmarkIcon className="h-3 w-3" />
                        <span>{article.bookmarkCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChartBarIcon className="h-3 w-3" />
                        <span>{article.trendingScore}</span>
                      </div>
                    </div>

                    {/* Interaction buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteraction(article._id, 'bookmark');
                        }}
                        className={`p-1 rounded transition-colors ${
                          interactedItems.has(`${article._id}-bookmark`)
                            ? 'text-yellow-500'
                            : 'text-slate-400 hover:text-yellow-500'
                        }`}
                        title="Bookmark"
                      >
                        <BookmarkIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteraction(article._id, 'like');
                        }}
                        className={`p-1 rounded transition-colors ${
                          interactedItems.has(`${article._id}-like`)
                            ? 'text-red-500'
                            : 'text-slate-400 hover:text-red-500'
                        }`}
                        title="Like"
                      >
                        {interactedItems.has(`${article._id}-like`) ? (
                          <HeartSolid className="h-4 w-4" />
                        ) : (
                          <HeartIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteraction(article._id, 'share');
                        }}
                        className={`p-1 rounded transition-colors ${
                          interactedItems.has(`${article._id}-share`)
                            ? 'text-blue-500'
                            : 'text-slate-400 hover:text-blue-500'
                        }`}
                        title="Share"
                      >
                        <ShareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {recommendations.length > 0 && (
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>Updated {formatTimeAgo(lastUpdate.toISOString())}</span>
            </div>
            <div className="flex items-center space-x-1">
              {selectedAlgorithmInfo && (
                <>
                  <selectedAlgorithmInfo.icon className={`h-3 w-3 ${selectedAlgorithmInfo.color}`} />
                  <span>{selectedAlgorithmInfo.label}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 