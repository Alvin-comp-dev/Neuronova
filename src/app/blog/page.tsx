'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  BookOpen, 
  User,
  ArrowRight,
  Tag,
  Loader2
} from 'lucide-react';

interface Author {
  name: string;
  affiliation: string;
}

interface ResearchArticle {
  _id: string;
  title: string;
  abstract: string;
  authors: Author[];
  publicationDate: string;
  categories: string[];
  tags: string[];
  keywords: string[];
  source: {
    name: string;
    url: string;
    type: string;
  };
  status: string;
  citationCount: number;
  viewCount: number;
  bookmarkCount: number;
  trendingScore: number;
  metrics: {
    impactScore: number;
    readabilityScore: number;
    noveltyScore: number;
  };
}

export default function BlogPage() {
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/research?status=published&sortBy=date&limit=20');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from articles
  const categories = ['all', ...new Set(articles.flatMap(article => article.categories))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const formatReadingTime = (abstract: string) => {
    const wordsPerMinute = 200;
    const words = abstract.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getCategoryImage = (category: string): string => {
    const imageMap: { [key: string]: string } = {
      'neuroscience': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80',
      'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80',
      'healthcare': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&q=80',
      'medical-devices': 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop&q=80',
      'bioinformatics': 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c2?w=800&h=600&fit=crop&q=80',
      'brain-computer-interface': 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&h=600&fit=crop&q=80',
      'genetics': 'https://images.unsplash.com/photo-1583912268183-a34d41fe464a?w=800&h=600&fit=crop&q=80',
      'default': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop&q=80'
    };
    return imageMap[category] || imageMap.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-white text-lg">Loading articles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/50">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Articles</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchArticles}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-6">
              Neuronova Blog
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore the latest breakthroughs in neuroscience, healthcare technology, and medical research
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          <Filter className="h-5 w-5 text-slate-400" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-slate-400">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <article
                key={article._id}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-700"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="relative h-64 md:h-full bg-slate-800">
                      <div className="absolute inset-0 bg-slate-900/30" /> {/* Dark overlay */}
                      <img
                        src={getCategoryImage(article.categories[0])}
                        alt={`${article.title} - ${article.categories[0]}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getCategoryImage('default');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent pointer-events-none" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                      {article.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4">
                      {article.title}
                    </h2>

                    <p className="text-slate-300 mb-6 line-clamp-3">
                      {article.abstract}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publicationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatReadingTime(article.abstract)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{article.authors.map(a => a.name).join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{article.viewCount} views</span>
                        <span>{article.citationCount} citations</span>
                        <span>{article.bookmarkCount} bookmarks</span>
                      </div>
                      <Link
                        href={`/research/${article._id}`}
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 