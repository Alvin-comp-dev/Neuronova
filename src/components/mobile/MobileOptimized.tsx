'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  BookmarkIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface MobileArticleCard {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: string;
  readTime: number;
  viewCount: number;
  bookmarkCount: number;
  publishedDate: string;
  isBookmarked: boolean;
}

const MobileOptimized: React.FC = () => {
  const [articles, setArticles] = useState<MobileArticleCard[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI', 'Neuroscience', 'Biotech', 'Healthcare', 'Medicine'];

  // Sample mobile-optimized data
  useEffect(() => {
    setArticles([
      {
        id: '1',
        title: 'AI-Powered Drug Discovery Breakthrough',
        abstract: 'Revolutionary machine learning approach reduces drug discovery time from years to months, showing promising results in early trials.',
        authors: ['Dr. Sarah Chen', 'Dr. Mike Rodriguez'],
        category: 'AI',
        readTime: 5,
        viewCount: 1250,
        bookmarkCount: 89,
        publishedDate: '2024-12-15',
        isBookmarked: false
      },
      {
        id: '2',
        title: 'Neural Interface Technology Advances',
        abstract: 'New brain-computer interface technology enables paralyzed patients to control devices with unprecedented precision.',
        authors: ['Dr. Lisa Wang', 'Dr. James Miller'],
        category: 'Neuroscience',
        readTime: 7,
        viewCount: 890,
        bookmarkCount: 67,
        publishedDate: '2024-12-14',
        isBookmarked: true
      },
      {
        id: '3',
        title: 'Gene Therapy Breakthrough for Rare Diseases',
        abstract: 'Novel gene editing technique shows remarkable success in treating previously incurable genetic disorders.',
        authors: ['Dr. Emma Thompson'],
        category: 'Biotech',
        readTime: 6,
        viewCount: 2100,
        bookmarkCount: 156,
        publishedDate: '2024-12-13',
        isBookmarked: false
      }
    ]);
  }, []);

  const handleBookmark = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { 
            ...article, 
            isBookmarked: !article.isBookmarked,
            bookmarkCount: article.isBookmarked 
              ? article.bookmarkCount - 1 
              : article.bookmarkCount + 1
          }
        : article
    ));
  };

  const filteredArticles = articles.filter(article => 
    (selectedCategory === 'All' || article.category === selectedCategory) &&
    (searchQuery === '' || article.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-200 dark:bg-slate-800 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
            <SparklesIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mt-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="px-4 py-4 space-y-4">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Article Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                  {article.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBookmark(article.id)}
                    className={`p-2 rounded-full transition-colors ${
                      article.isBookmarked
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <BookmarkIcon className={`h-4 w-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    <ShareIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                {article.title}
              </h3>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span className="truncate">
                  {article.authors.slice(0, 2).join(', ')}
                  {article.authors.length > 2 && ` +${article.authors.length - 2}`}
                </span>
              </div>

              {/* Abstract Preview */}
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                {expandedCard === article.id 
                  ? article.abstract
                  : `${article.abstract.substring(0, 120)}...`
                }
              </p>

              <button
                onClick={() => setExpandedCard(expandedCard === article.id ? null : article.id)}
                className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium"
              >
                {expandedCard === article.id ? (
                  <>
                    <span>Show less</span>
                    <ChevronUpIcon className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Article Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    <span>{article.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <BookmarkIcon className="h-3 w-3 mr-1" />
                    <span>{article.bookmarkCount}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="text-gray-400">
                  {article.readTime} min read
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCard === article.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium">
                    <SparklesIcon className="h-5 w-5" />
                    <span>Ask AI Assistant</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                      Summarize
                    </button>
                    <button className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                      Key Insights
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Mobile Bottom Navigation (placeholder) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex justify-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Mobile-optimized research feed • Week 6 Feature
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimized; 