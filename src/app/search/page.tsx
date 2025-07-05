'use client';

import React, { useState, useEffect } from 'react';
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

interface Author {
  name: string;
  affiliation?: string;
}

interface SearchResult {
  _id: string;
  title: string;
  abstract: string;
  authors: Author[];
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [hasSearched, setHasSearched] = useState(false);

  const categories = [
    { key: 'all', label: 'All Categories', icon: '📚' },
    { key: 'neuroscience', label: 'Neuroscience', icon: '🧠' },
    { key: 'biotechnology', label: 'Biotechnology', icon: '🧬' },
    { key: 'healthcare', label: 'Healthcare', icon: '💊' },
    { key: 'pharmaceuticals', label: 'Pharmaceuticals', icon: '🔬' },
    { key: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
    { key: 'medicine', label: 'Medicine', icon: '⚕️' },
    { key: 'biology', label: 'Biology', icon: '🦠' },
    { key: 'data-science', label: 'Data Science', icon: '📊' },
    { key: 'medical-devices', label: 'Medical Devices', icon: '🏥' },
    { key: 'genetics', label: 'Genetics', icon: '🧬' },
    { key: 'clinical-trials', label: 'Clinical Trials', icon: '🧪' },
    { key: 'technology', label: 'Technology', icon: '💻' }
  ];

  const fetchSearchResults = async (query: string = searchQuery) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      let url = '/api/search?limit=50';
      
      if (query.trim()) {
        url += `&q=${encodeURIComponent(query)}`;
      }
      
      if (selectedCategory !== 'all') {
        url += `&categories=${encodeURIComponent(selectedCategory)}`;
      }
      
      url += '&type=all';
      
      switch (sortBy) {
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

      console.log('🔍 Fetching search results with URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSearchResults(data.data);
        setTotalResults(data.data.length);
        console.log(`📊 Found ${data.data.length} results for category: ${selectedCategory}`);
      } else {
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSearchResults();
  };

  const handleCategoryClick = (categoryKey: string) => {
    console.log('🔘 Category clicked:', categoryKey);
    setSelectedCategory(categoryKey);
    setSearchQuery('');
    
    if (categoryKey !== 'all') {
      console.log('🔍 Will search for category:', categoryKey);
    } else {
      console.log('🌍 Will show all research articles');
    }
  };

  // Only fetch results when explicitly requested (not on initial load)
  useEffect(() => {
    // Only fetch when a specific category is selected (not 'all')
    if (selectedCategory !== 'all') {
      fetchSearchResults('');
    }
  }, [selectedCategory, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Search Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Advanced Research Search
            </h1>
            <p className="text-slate-300">
              Search across our comprehensive research database
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for papers, authors, topics, or keywords..."
              className="w-full pl-10 pr-12 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                showFilters
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sort By
                  </label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Search Research
            </button>
          </div>
        </div>
      </div>

      {/* Welcome State */}
      {!isLoading && !hasSearched && !searchQuery && selectedCategory === 'all' && (
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Explore Our Research Database
            </h3>
            <p className="text-slate-300 mb-8">
              Discover cutting-edge research across multiple disciplines or browse by specific categories
            </p>
            
            {/* Browse All Button */}
            <div className="mb-8">
              <button
                onClick={() => {
                  console.log('🌍 Loading all research articles');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  fetchSearchResults('');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                🌍 Browse All Research Articles
              </button>
            </div>
            
            <div className="text-slate-400 text-sm mb-6">Or explore by category:</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {/* All Categories Button */}
              <button
                onClick={() => {
                  console.log('🌍 Loading all research articles from category grid');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  fetchSearchResults('');
                }}
                className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors border border-blue-500"
              >
                <span className="text-xl">📚</span>
                <span className="text-sm font-medium text-white">
                  All Categories
                </span>
              </button>
              
              {categories.filter(cat => cat.key !== 'all').map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  className="flex items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600"
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium text-slate-300">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {(searchResults.length > 0 || isLoading) && (
        <div className="max-w-6xl mx-auto p-6">
          {/* Results Header */}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Search Results
                </h2>
                <p className="text-slate-300 mt-1">
                  {totalResults} results found
                  {selectedCategory !== 'all' && (
                    <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
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
                      : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-300'
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Results Grid/List */}
          {!isLoading && searchResults.length > 0 && (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
                : 'space-y-6'
            }`}>
              {searchResults.map(result => (
                <div
                  key={result._id}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          Research Paper
                        </span>
                        {result.isLocal === false && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                            External Source
                          </span>
                        )}
                      </div>
                      <h3 
                        className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer mb-2"
                        onClick={() => window.open(`/research/${result._id}`, '_blank')}
                      >
                        {result.title}
                      </h3>
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                        {result.abstract}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>
                          {result.authors[0]?.name || result.authors[0]}
                          {result.authors.length > 1 ? ` +${result.authors.length - 1}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(result.publicationDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChartBarIcon className="w-4 h-4" />
                        <span>{formatNumber(result.citationCount)} citations</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="hover:text-blue-400 transition-colors">
                        <BookmarkIcon className="w-4 h-4" />
                      </button>
                      <button className="hover:text-blue-400 transition-colors">
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(`/research/${result._id}`, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </button>
                    {result.externalUrl && (
                      <button 
                        onClick={() => window.open(result.externalUrl, '_blank')}
                        className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        External Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No results found
              </h3>
              <p className="text-slate-300 mb-6">
                Try adjusting your search terms or filters
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSearchResults([]);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 