'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Calendar, BookOpen, Users, Star, Bookmark, ExternalLink, Eye, SparklesIcon } from 'lucide-react';
import { ChatBubbleBottomCenterIcon, ArrowTopRightOnSquareIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
// import AdvancedSearch from '@/components/ui/AdvancedSearch';
import SmartSearch from '@/components/ui/SmartSearch';
import BookmarkButton from '@/components/ui/BookmarkButton';

import DiscussionPanel from '@/components/community/DiscussionPanel';
import SmartRecommendations from '@/components/ui/SmartRecommendations';
import AIResearchAssistant from '@/components/ai/AIResearchAssistant';

interface ResearchArticle {
  _id: string;
  title: string;
  abstract: string;
  authors: {
    name: string;
    affiliation?: string;
  }[];
  categories: string[];
  tags: string[];
  source: {
    name: string;
    url: string;
    type: 'journal' | 'preprint' | 'conference' | 'patent';
  };
  doi?: string;
  publicationDate: string;
  citationCount: number;
  viewCount: number;
  bookmarkCount: number;
  trendingScore: number;
  status: 'published' | 'preprint' | 'under-review';
  keywords: string[];
  metrics: {
    impactScore: number;
    readabilityScore: number;
    noveltyScore: number;
  };
  likeCount?: number;
  shareCount?: number;
}

export default function ResearchPage() {
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    categoriesCount: 0,
    recentArticles: 0,
  });
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [selectedDiscussionArticle, setSelectedDiscussionArticle] = useState<string | null>(null);
  const [showDiscussions, setShowDiscussions] = useState(false);
  
  // AI Assistant state - Week 6 Feature
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedAIArticle, setSelectedAIArticle] = useState<ResearchArticle | null>(null);

  // Enhanced filter options as specified in requirements
  const categories = [
    'Neurotech',
    'Biotech', 
    'AI in Healthcare',
    'Public Health',
    'Mental Health',
    'Diagnostics',
    'Chronic Disease',
    'Drug Discovery',
    'Gene Therapy',
    'Medical Devices'
  ];

  const sources = [
    'Nature',
    'PubMed',
    'The Lancet',
    'Science',
    'Cell',
    'NEJM',
    'Nature Neuroscience',
    'Science Translational Medicine',
    'Journal of Neuroscience',
    'IEEE Transactions'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'expert-picks', label: 'Expert Picks' },
    { value: 'discussed', label: 'Most Discussed' },
    { value: 'citations', label: 'Most Cited' },
    { value: 'impact', label: 'Highest Impact' }
  ];

  const years = ['2024', '2023', '2022', '2021', '2020'];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSourceChange = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleYearChange = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSources([]);
    setSelectedYears([]);
    setSearchQuery('');
  };

  useEffect(() => {
    console.log('🔄 Research page mounted, fetching data...');
    console.log('📍 Running on client side, proceeding with fetch');
    fetchStats();
    fetchArticles();
  }, []);

  useEffect(() => {
    console.log('🔄 Dependencies changed, refetching articles...');
    console.log('📍 sortBy:', sortBy, 'selectedCategories:', selectedCategories);
    fetchArticles();
  }, [sortBy, selectedCategories]);

  // Debug log whenever articles state changes
  useEffect(() => {
    console.log('📊 Articles state changed:', articles.length, articles);
    console.log('📊 Loading state:', loading);
    console.log('📊 TotalResults:', totalResults);
  }, [articles, loading, totalResults]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/research/stats');
      const data = await response.json();
      if (data.success) {
        // Map API data structure to expected format
        setStats({
          totalArticles: data.data.totalPapers || 0,
          publishedArticles: data.data.featuredPapers || 0,
          categoriesCount: Object.keys(data.data.categoryCounts || {}).length || 6,
          recentArticles: data.data.recentPapers || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values on error
    }
  };

  const fetchArticles = async () => {
    console.log('🚀 fetchArticles called - setting loading to true');
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        sortBy: sortBy === 'newest' ? 'date' : sortBy,
        limit: '12'
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories[0]); // For now, use first category
      }

      const url = `/api/research?${params}`;
      console.log('🌐 Fetching URL:', url);
      
      const response = await fetch(url);
      console.log('📡 Response status:', response.status, 'ok:', response.ok);
      
      const data = await response.json();
      console.log('📊 API Response:', data);
      console.log('📊 Data success:', data.success);
      console.log('📊 Data.data length:', data.data?.length);
      
      if (data.success && data.data) {
        console.log('✅ Setting articles to state, count:', data.data.length);
        setArticles(data.data);
        setTotalResults(data.data.length);
        console.log('✅ Articles and totalResults set');
      } else {
        console.error('❌ API error or no data:', data);
        setArticles([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      setArticles([]);
      setTotalResults(0);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchArticles(); // Actually trigger search with current query
  };

  const handleAdvancedSearch = async (searchParams: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?${new URLSearchParams(searchParams)}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data || []);
        setTotalResults(data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error with advanced search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Bookmark functionality
  const handleBookmark = async (articleId: string) => {
    try {
      const response = await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ articleId }),
      });

      if (response.ok) {
        setBookmarkedArticles(prev => {
          const newSet = new Set(prev);
          if (newSet.has(articleId)) {
            newSet.delete(articleId);
          } else {
            newSet.add(articleId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      // For now, just toggle locally
      setBookmarkedArticles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(articleId)) {
          newSet.delete(articleId);
        } else {
          newSet.add(articleId);
        }
        return newSet;
      });
    }
  };

  // Like functionality
  const handleLike = async (articleId: string) => {
    try {
      const isCurrentlyLiked = likedArticles.has(articleId);
      const action = isCurrentlyLiked ? 'remove' : 'add';

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ articleId, action }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLikedArticles(prev => {
            const newSet = new Set(prev);
            if (data.data.isLiked) {
              newSet.add(articleId);
            } else {
              newSet.delete(articleId);
            }
            return newSet;
          });
          
          // Update article like count in the articles array
          setArticles(prev => prev.map(article => 
            article._id === articleId 
              ? { ...article, likeCount: data.data.articleLikeCount }
              : article
          ));
          
          showToast(data.data.isLiked ? 'Article liked!' : 'Like removed', 'success');
        }
      } else {
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Like error:', error);
      showToast('Please log in to like articles', 'warning');
    }
  };

  // Share functionality
  const handleShare = async (articleId: string) => {
    try {
      const response = await fetch('/api/shares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        body: JSON.stringify({
          articleId,
          shareType: 'link'
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
        
        // Update article share count
        setArticles(prev => prev.map(article => 
          article._id === articleId 
            ? { ...article, shareCount: data.data.newShareCount }
            : article
        ));
      } else {
        throw new Error(data.error || 'Failed to share article');
      }
    } catch (error) {
      console.error('Share error:', error);
      showToast('Failed to share article', 'error');
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

  // AI Assistant handler - Week 6 Feature
  const handleOpenAIAssistant = (article: ResearchArticle) => {
    setSelectedAIArticle(article);
    setShowAIAssistant(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Research Feed
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover cutting-edge research in neuroscience, healthcare, and biotech. 
              Stay updated with the latest breakthroughs and scientific discoveries.
            </p>
            
            {/* Smart Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch(e);
                      }
                    }}
                    placeholder="Search research articles, authors, topics..."
                    className="w-full pl-12 pr-24 py-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <div className="absolute right-2 flex items-center space-x-2">
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {(stats.totalArticles || 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">
                Total Articles
              </div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {(stats.publishedArticles || 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">
                Published
              </div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {stats.categoriesCount || 0}
              </div>
              <div className="text-sm text-slate-400">
                Categories
              </div>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {stats.recentArticles || 0}
              </div>
              <div className="text-sm text-slate-400">
                This Month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* AI Recommendations */}
            <SmartRecommendations 
              className="mb-6"
              limit={4}
              showAlgorithmSelector={true}
              showConfidenceScores={true}
              showReasons={true}
              onArticleClick={(articleId) => {
                console.log('Recommended article clicked:', articleId);
                window.location.href = `/research/${articleId}`;
              }}
              onInteraction={(articleId, type) => {
                console.log('Recommendation interaction:', articleId, type);
                if (type === 'bookmark') {
                  handleBookmark(articleId);
                }
              }}
            />
            
            <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700" 
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <span className="ml-2 text-sm text-slate-400">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Source Type
                  </h4>
                  <div className="space-y-2">
                    {sources.map((source) => (
                      <label key={source} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700" 
                          checked={selectedSources.includes(source)}
                          onChange={() => handleSourceChange(source)}
                        />
                        <span className="ml-2 text-sm text-slate-400">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Publication Date
                  </h4>
                  <select 
                    value={selectedYears.join(',')}
                    onChange={(e) => {
                      const years = e.target.value.split(',');
                      setSelectedYears(years);
                    }}
                    className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="flex-1">
            {/* Active Filters Summary */}
            {(selectedCategories.length > 0 || selectedSources.length > 0 || selectedYears.length > 0) && (
              <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span key={category} className="inline-flex items-center px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full">
                      {category}
                      <button
                        onClick={() => handleCategoryChange(category)}
                        className="ml-2 text-blue-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedSources.map((source) => (
                    <span key={source} className="inline-flex items-center px-3 py-1 bg-emerald-600 text-emerald-100 text-sm rounded-full">
                      {source}
                      <button
                        onClick={() => handleSourceChange(source)}
                        className="ml-2 text-emerald-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedYears.map((year) => (
                    <span key={year} className="inline-flex items-center px-3 py-1 bg-purple-600 text-purple-100 text-sm rounded-full">
                      {year}
                      <button
                        onClick={() => handleYearChange(year)}
                        className="ml-2 text-purple-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Latest Research ({totalResults.toLocaleString()} articles)
              </h2>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
                    <div className="h-20 bg-slate-700 rounded mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-slate-700 rounded w-16"></div>
                      <div className="h-3 bg-slate-700 rounded w-20"></div>
                      <div className="h-3 bg-slate-700 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {articles.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {articles.map((article) => (
                      <div key={article._id} className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-slate-600 group">
                        <div className="space-y-4">
                          {/* Header with status and metrics */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                article.status === 'published' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : article.status === 'preprint'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {article.status}
                              </span>
                              <span className="text-slate-400 text-sm">
                                {article.source?.name || 'Unknown Source'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-slate-400">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">{(article.viewCount || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Bookmark className="h-4 w-4" />
                                <span className="text-sm">{article.bookmarkCount || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => window.location.href = `/research/${article._id}`}
                            className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-blue-400 cursor-pointer transition-colors group-hover:text-blue-300"
                          >
                            {article.title}
                          </h3>

                          {/* Authors */}
                          <div className="flex items-center text-slate-400 text-sm mb-3">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="truncate">
                              {article.authors?.slice(0, 3).map(author => author?.name || 'Unknown Author').join(', ') || 'No authors'}
                              {article.authors && article.authors.length > 3 && ` +${article.authors.length - 3} more`}
                            </span>
                          </div>

                          {/* Abstract */}
                          <p className="text-slate-300 text-sm mb-4 line-clamp-4 leading-relaxed">
                            {article.abstract}
                          </p>

                          {/* Categories and Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.categories?.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="px-3 py-1 bg-blue-600 text-blue-100 text-xs rounded-full font-medium"
                              >
                                {category}
                              </span>
                            )) || []}
                            {article.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            )) || []}
                          </div>

                          {/* Metrics */}
                          <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>{article.citationCount || 0} citations</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span>Impact: {article.metrics?.impactScore || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{article.publicationDate ? new Date(article.publicationDate).toLocaleDateString() : 'Unknown date'}</span>
                            </div>
                          </div>

                          {/* Action Buttons - More prominent and spaced */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                            <div className="flex items-center space-x-3">
                              {/* Like Button */}
                              <button
                                onClick={() => handleLike(article._id)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                                  likedArticles.has(article._id)
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                                }`}
                                title={likedArticles.has(article._id) ? 'Unlike' : 'Like'}
                              >
                                {likedArticles.has(article._id) ? (
                                  <HeartSolidIcon className="h-4 w-4" />
                                ) : (
                                  <HeartIcon className="h-4 w-4" />
                                )}
                                <span className="text-sm">{article.likeCount || 0}</span>
                              </button>

                              {/* Bookmark Button */}
                              <BookmarkButton
                                articleId={article._id}
                                initialBookmarked={bookmarkedArticles.has(article._id)}
                                initialCount={article.bookmarkCount || 0}
                                variant="compact"
                                onBookmarkChange={(isBookmarked, count) => {
                                  if (isBookmarked) {
                                    setBookmarkedArticles(prev => new Set(prev).add(article._id));
                                  } else {
                                    setBookmarkedArticles(prev => {
                                      const newSet = new Set(prev);
                                      newSet.delete(article._id);
                                      return newSet;
                                    });
                                  }
                                }}
                              />

                              {/* Share Button */}
                              <button
                                onClick={() => handleShare(article._id)}
                                className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                                title="Share"
                              >
                                <ShareIcon className="h-4 w-4" />
                                <span className="text-sm">{article.shareCount || 0}</span>
                              </button>

                              {/* Discuss Button */}
                              <button
                                onClick={() => {
                                  setSelectedDiscussionArticle(article._id);
                                  setShowDiscussions(true);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                              >
                                <ChatBubbleBottomCenterIcon className="h-4 w-4" />
                                <span className="text-sm font-medium">Discuss</span>
                              </button>
                            </div>
                            
                            {/* AI Assist Button - Prominent and eye-catching */}
                            <button
                              onClick={() => handleOpenAIAssistant(article)}
                              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:shadow-blue-500/25 relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                              <SparklesIcon className="h-5 w-5 relative z-10" />
                              <span className="text-sm font-semibold relative z-10">AI Assist</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-400 mb-2">No articles found</h3>
                    <p className="text-slate-500">Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discussion Panel */}
      {selectedDiscussionArticle && (
        <DiscussionPanel
          articleId={selectedDiscussionArticle}
          isOpen={showDiscussions}
          onClose={() => {
            setShowDiscussions(false);
            setSelectedDiscussionArticle(null);
          }}
        />
      )}

      {/* AI Research Assistant - Week 6 Feature */}
      {selectedAIArticle && (
        <AIResearchAssistant
          researchContent={selectedAIArticle.abstract}
          researchTitle={selectedAIArticle.title}
          isOpen={showAIAssistant}
          onClose={() => {
            setShowAIAssistant(false);
            setSelectedAIArticle(null);
          }}
        />
      )}
    </div>
  );
} 