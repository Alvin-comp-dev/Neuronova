'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookmarkIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  TagIcon,
  ChartBarIcon,
  DocumentTextIcon,
  StarIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface SearchResult {
  _id: string;
  title: string;
  abstract: string;
  authors: string[];
  institution?: string;
  journal?: string;
  publicationDate: string;
  categories: string[];
  tags: string[];
  doi?: string;
  externalUrl?: string;
  viewCount: number;
  citationCount: number;
  likeCount: number;
  bookmarkCount: number;
  impactScore: number;
  readabilityScore: number;
  noveltyScore: number;
  isLocal?: boolean;
  source?: { name: string; url: string; type: string; };
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Handle URL query parameters
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
      // Automatically search when coming from URL
      fetchSearchResults(queryFromUrl, selectedCategory, sortBy);
    }
  }, [searchParams]);

  const categories = [
    { key: 'all', label: 'All Categories', icon: '📚' },
    { key: 'neuroscience', label: 'Neuroscience', icon: '🧠' },
    { key: 'biotech', label: 'Biotechnology', icon: '🧬' },
    { key: 'healthcare', label: 'Healthcare', icon: '💊' },
    { key: 'pharmaceuticals', label: 'Pharmaceuticals', icon: '🔬' },
    { key: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
    { key: 'medicine', label: 'Medicine', icon: '⚕️' },
    { key: 'biology', label: 'Biology', icon: '🦠' },
    { key: 'data-science', label: 'Data Science', icon: '📊' }
  ];

  // Map category keys to API category values (matching actual database values)
  const categoryMapping: { [key: string]: string } = {
    'neuroscience': 'neuroscience',
    'biotech': 'biotech',
    'healthcare': 'healthcare', 
    'pharmaceuticals': 'pharmaceuticals',
    'ai-ml': 'ai-ml',
    'medicine': 'medicine',
    'biology': 'biology',
    'data-science': 'data-science'
  };

  const fetchSearchResults = async (query: string = '', category: string = 'all', sort: string = 'relevance') => {
    setIsLoading(true);
    try {
      // Use the search API that includes external resources
      let url = '/api/search?limit=50';
      
      // Add search query
      if (query.trim()) {
        url += `&q=${encodeURIComponent(query)}`;
      }
      
      // Add category filter
      if (category !== 'all' && categoryMapping[category]) {
        url += `&categories=${encodeURIComponent(categoryMapping[category])}`;
      }
      
      // Add search type to include external resources when local database is empty
      url += '&type=all';
      
      // Add sorting
      switch (sort) {
        case 'recent':
          url += '&sortBy=date';
          break;
        case 'citations':
          url += '&sortBy=citations';
          break;
        case 'views':
          url += '&sortBy=views';
          break;
        default:
          url += '&sortBy=relevance';
      }

      console.log('🔍 Fetching search results:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Search results received:', data);
      
      if (data.success && data.data) {
        // Deduplicate results by _id, doi, or title to prevent duplicate keys
        const uniqueResults = data.data.reduce((acc: SearchResult[], current: SearchResult) => {
          const existingIndex = acc.findIndex(result => 
            result._id === current._id || 
            (result.doi && current.doi && result.doi === current.doi) ||
            (result.title.toLowerCase().trim() === current.title.toLowerCase().trim())
          );
          
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            // If duplicate found, keep the one with more complete data
            const existing = acc[existingIndex];
            if (current.abstract?.length > existing.abstract?.length || 
                current.authors?.length > existing.authors?.length) {
              acc[existingIndex] = current;
            }
          }
          return acc;
        }, []);
        
        setSearchResults(uniqueResults);
        setTotalResults(uniqueResults.length);
      } else {
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('❌ Error fetching search results:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch results if we have a search query or selected category (not 'all')
    if (searchQuery.trim() || selectedCategory !== 'all') {
      fetchSearchResults(searchQuery, selectedCategory, sortBy);
    }
  }, [selectedCategory, sortBy]);

  // Debug: Log initial state
  useEffect(() => {
    console.log('🔍 Search page mounted with initial state:');
    console.log('  - searchQuery:', searchQuery);
    console.log('  - selectedCategory:', selectedCategory);
    console.log('  - searchResults length:', searchResults.length);
  }, []);

  const handleSearch = () => {
    fetchSearchResults(searchQuery, selectedCategory, sortBy);
  };

  const handleCategoryClick = (categoryKey: string) => {
    console.log('🔘 Category clicked:', categoryKey);
    console.log('📊 Current state before click:');
    console.log('  - searchQuery:', searchQuery);
    console.log('  - selectedCategory:', selectedCategory);
    console.log('  - searchResults length:', searchResults.length);
    
    setSelectedCategory(categoryKey);
    if (categoryKey !== 'all') {
      const categoryLabel = categories.find(cat => cat.key === categoryKey)?.label || '';
      setSearchQuery(categoryLabel);
      console.log('🔍 Will search for category:', categoryLabel);
      // Trigger immediate search for specific categories with external resources
      setTimeout(() => {
        console.log('⏰ Executing delayed search for:', categoryLabel, categoryKey);
        fetchSearchResults(categoryLabel, categoryKey, sortBy);
      }, 100);
    } else {
      // Clear search when "All Categories" is selected
      console.log('🧹 Clearing search results');
      setSearchQuery('');
      setSearchResults([]);
      setTotalResults(0);
    }
  };

  const handleBookmark = async (articleId: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      });
      
      if (response.ok) {
        setSearchResults(prev => prev.map(result => 
          result._id === articleId 
            ? { ...result, bookmarkCount: (result.bookmarkCount || 0) + 1 }
            : result
        ));
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  const handleLike = async (articleId: string) => {
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      });
      
      if (response.ok) {
        setSearchResults(prev => prev.map(result => 
          result._id === articleId 
            ? { ...result, likeCount: (result.likeCount || 0) + 1 }
            : result
        ));
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleShare = async (articleId: string) => {
    try {
      const articleUrl = `${window.location.origin}/research/${articleId}`;
      await navigator.clipboard.writeText(articleUrl);
      
      await fetch('/api/shares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId, platform: 'clipboard' }),
      });
      
      alert('Article link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ResultCard = ({ result }: { result: SearchResult }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Research Paper
            </span>
            {result.isLocal === false && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                External Source
              </span>
            )}
            {result.journal && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {result.journal}
              </span>
            )}
          </div>
          <h3 
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer mb-2"
            onClick={() => window.open(`/research/${result._id}`, '_blank')}
          >
            {result.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
            {result.abstract}
          </p>
        </div>
      </div>

      {/* Authors and Institution */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <UserIcon className="w-4 h-4" />
          <span>{result.authors.join(', ')}</span>
        </div>
        {result.institution && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BuildingOfficeIcon className="w-4 h-4" />
            <span>{result.institution}</span>
          </div>
        )}
      </div>

      {/* Categories and Tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {result.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {result.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            <span>{formatNumber(result.viewCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChartBarIcon className="w-4 h-4" />
            <span>{formatNumber(result.citationCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(result.publicationDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLike(result._id)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
          >
            <HeartIcon className="w-4 h-4" />
            <span>{formatNumber(result.likeCount || 0)}</span>
          </button>
          <button
            onClick={() => handleBookmark(result._id)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
          >
            <BookmarkIcon className="w-4 h-4" />
            <span>{formatNumber(result.bookmarkCount || 0)}</span>
          </button>
          <button
            onClick={() => handleShare(result._id)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => window.open(`/research/${encodeURIComponent(result._id)}`, '_blank')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          View Details
        </button>
        {result.externalUrl && (
          <button 
            onClick={() => window.open(result.externalUrl, '_blank')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            External Link
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Advanced Research Search
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Search across our comprehensive research database
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for papers, authors, topics, or keywords..."
              className="w-full pl-10 pr-12 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                showFilters
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option>All Time</option>
                    <option>Last Year</option>
                    <option>Last 5 Years</option>
                    <option>Last 10 Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="recent">Most Recent</option>
                    <option value="citations">Most Cited</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Search Research
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Results Header */}
        {searchResults.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {totalResults} results found
                {selectedCategory !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    {categories.find(cat => cat.key === selectedCategory)?.label}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <DocumentTextIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Results Grid/List */}
        {!isLoading && searchResults.length > 0 && (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
              : 'space-y-6'
          }`}>
            {searchResults.map((result, index) => (
              <ResultCard 
                key={`${result._id || result.doi || result.title}-${index}`} 
                result={result} 
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && (searchQuery || selectedCategory !== 'all') && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSearchResults([]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Welcome State */}
        {!isLoading && !searchQuery && selectedCategory === 'all' && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔬</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Your Research Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search across our comprehensive research database or browse by category
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {categories.filter(cat => cat.key !== 'all').map((category) => (
                <button
                  key={category.key}
                  onClick={() => {
                    console.log('🔘 Category button clicked:', category.key);
                    handleCategoryClick(category.key);
                  }}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer hover:shadow-md active:scale-95 transform"
                  style={{ userSelect: 'none' }}
                >
                  <span className="text-xl pointer-events-none">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 pointer-events-none">
                    {category.label.replace(' & ', ' & ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 