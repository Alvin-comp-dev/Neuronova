'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AdvancedSearchProps {
  onSearch: (query: string, filters: any) => void;
  className?: string;
}

export default function AdvancedSearch({ onSearch, className = '' }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  
  const handleSearch = () => {
    onSearch(query, {});
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search research papers, authors, keywords..."
          className="block w-full pl-10 pr-20 py-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
