'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Bookmark, Clock, TrendingUp, X, Star } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'keyword' | 'author' | 'category' | 'recent';
  count?: number;
}

interface SavedSearch {
  id: string;
  query: string;
  filters: any;
  name: string;
  created: string;
}

interface SmartSearchProps {
  onSearch: (query: string, filters: any) => void;
  onAdvancedSearch: (params: any) => void;
  placeholder?: string;
  showSavedSearches?: boolean;
}

export default function SmartSearch({ 
  onSearch, 
  onAdvancedSearch, 
  placeholder = "Search research articles...",
  showSavedSearches = true 
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Advanced search filters
  const [advancedFilters, setAdvancedFilters] = useState({
    authors: '',
    categories: [] as string[],
    dateRange: { start: '', end: '' },
    sources: [] as string[],
    minCitations: '',
    keywords: '',
    excludeKeywords: ''
  });

  const categories = [
    'AI in Healthcare', 'Neuroscience', 'Biotech', 'Genetics', 
    'Public Health', 'Mental Health', 'Diagnostics', 'Drug Discovery',
    'Medical Devices', 'Chronic Disease'
  ];

  const sources = [
    'Nature', 'Science', 'Cell', 'The Lancet', 'NEJM', 'PubMed',
    'Nature Neuroscience', 'Nature Medicine', 'Science Translational Medicine'
  ];

  // Load saved searches and recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('neuronova_saved_searches');
    const recent = localStorage.getItem('neuronova_recent_searches');
    
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updatedRecent);
    localStorage.setItem('neuronova_recent_searches', JSON.stringify(updatedRecent));

    // Perform search
    onSearch(searchQuery, {});
    setShowSuggestions(false);
  };

  const handleAdvancedSearch = () => {
    const params = {
      query,
      ...advancedFilters,
      categories: advancedFilters.categories.join(','),
      sources: advancedFilters.sources.join(',')
    };

    onAdvancedSearch(params);
    setShowAdvanced(false);
    setShowSuggestions(false);
  };

  const saveCurrentSearch = () => {
    const searchName = prompt('Name this search:');
    if (!searchName) return;

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      query,
      filters: advancedFilters,
      name: searchName,
      created: new Date().toISOString()
    };

    const updated = [...savedSearches, newSavedSearch];
    setSavedSearches(updated);
    localStorage.setItem('neuronova_saved_searches', JSON.stringify(updated));
  };

  const loadSavedSearch = (saved: SavedSearch) => {
    setQuery(saved.query);
    setAdvancedFilters(saved.filters);
    onAdvancedSearch({
      query: saved.query,
      ...saved.filters,
      categories: saved.filters.categories.join(','),
      sources: saved.filters.sources.join(',')
    });
    setShowSuggestions(false);
  };

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('neuronova_saved_searches', JSON.stringify(updated));
  };

  const handleCategoryToggle = (category: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSourceToggle = (source: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Advanced Search"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleSearch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (query.length > 0 || recentSearches.length > 0 || savedSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Current Query Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-b border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Suggestions</h4>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => {
                      setQuery(suggestion.text);
                      handleSearch(suggestion.text);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      {suggestion.type === 'keyword' && <Search className="h-4 w-4 text-blue-400" />}
                      {suggestion.type === 'author' && <Star className="h-4 w-4 text-yellow-400" />}
                      {suggestion.type === 'category' && <Filter className="h-4 w-4 text-green-400" />}
                      <span className="text-slate-200">{suggestion.text}</span>
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-slate-400">{suggestion.count} results</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-3 border-b border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Recent Searches
                </h4>
                {recentSearches.slice(0, 5).map((recent, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(recent);
                      handleSearch(recent);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
                  >
                    {recent}
                  </button>
                ))}
              </div>
            )}

            {/* Saved Searches */}
            {showSavedSearches && savedSearches.length > 0 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Saved Searches
                </h4>
                {savedSearches.slice(0, 3).map((saved) => (
                  <div key={saved.id} className="flex items-center justify-between px-3 py-2 hover:bg-slate-700 rounded-lg">
                    <button
                      onClick={() => loadSavedSearch(saved)}
                      className="flex-1 text-left text-slate-300"
                    >
                      {saved.name}
                    </button>
                    <button
                      onClick={() => deleteSavedSearch(saved.id)}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Search Panel */}
      {showAdvanced && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Advanced Search</h3>
            <button
              onClick={() => setShowAdvanced(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Authors</label>
              <input
                type="text"
                value={advancedFilters.authors}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, authors: e.target.value }))}
                placeholder="e.g., Smith, Johnson"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Keywords</label>
              <input
                type="text"
                value={advancedFilters.keywords}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="e.g., machine learning, neural networks"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Categories</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={advancedFilters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700"
                    />
                    <span className="ml-2 text-sm text-slate-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sources</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {sources.map((source) => (
                  <label key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={advancedFilters.sources.includes(source)}
                      onChange={() => handleSourceToggle(source)}
                      className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-700"
                    />
                    <span className="ml-2 text-sm text-slate-300">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={advancedFilters.dateRange.start}
                  onChange={(e) => setAdvancedFilters(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={advancedFilters.dateRange.end}
                  onChange={(e) => setAdvancedFilters(prev => ({ 
                    ...prev, 
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Min Citations */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Citations</label>
              <input
                type="number"
                value={advancedFilters.minCitations}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, minCitations: e.target.value }))}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={saveCurrentSearch}
              className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              <span>Save Search</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setAdvancedFilters({
                    authors: '',
                    categories: [],
                    dateRange: { start: '', end: '' },
                    sources: [],
                    minCitations: '',
                    keywords: '',
                    excludeKeywords: ''
                  });
                }}
                className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleAdvancedSearch}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 