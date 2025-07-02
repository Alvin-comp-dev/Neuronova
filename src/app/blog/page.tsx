'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, UserIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  published_date: string;
  category: string;
  tags: string[];
  read_time: number;
  featured_image?: string;
  featured: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI-Powered Research Discovery',
    excerpt: 'Exploring how artificial intelligence is revolutionizing the way researchers find and connect academic literature across disciplines.',
    content: 'Full article content...',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: '/avatars/sarah-chen.jpg',
      role: 'AI Research Director'
    },
    published_date: '2024-01-20',
    category: 'Artificial Intelligence',
    tags: ['AI', 'Research', 'Machine Learning', 'Discovery'],
    read_time: 8,
    featured_image: '/blog/ai-research-future.jpg',
    featured: true
  },
  {
    id: '2',
    title: 'Building Bridges: How Cross-Disciplinary Research Accelerates Innovation',
    excerpt: 'Why the most groundbreaking discoveries happen at the intersection of different fields, and how NeuroNova facilitates these connections.',
    content: 'Full article content...',
    author: {
      name: 'Prof. Michael Rodriguez',
      avatar: '/avatars/michael-rodriguez.jpg',
      role: 'Research Partnerships Lead'
    },
    published_date: '2024-01-18',
    category: 'Research Methodology',
    tags: ['Interdisciplinary', 'Innovation', 'Collaboration'],
    read_time: 6,
    featured_image: '/blog/cross-disciplinary.jpg',
    featured: false
  },
  {
    id: '3',
    title: 'Open Science and the Democratization of Knowledge',
    excerpt: 'How open access movements and platforms like NeuroNova are making research accessible to researchers worldwide, regardless of institutional affiliation.',
    content: 'Full article content...',
    author: {
      name: 'Dr. Emily Watson',
      avatar: '/avatars/emily-watson.jpg',
      role: 'Open Science Advocate'
    },
    published_date: '2024-01-15',
    category: 'Open Science',
    tags: ['Open Access', 'Democracy', 'Global Research'],
    read_time: 7,
    featured_image: '/blog/open-science.jpg',
    featured: true
  },
  {
    id: '4',
    title: 'The Evolution of Peer Review in the Digital Age',
    excerpt: 'Examining how traditional peer review processes are adapting to digital platforms and collaborative review mechanisms.',
    content: 'Full article content...',
    author: {
      name: 'Dr. James Kim',
      avatar: '/avatars/james-kim.jpg',
      role: 'Publishing Innovation Lead'
    },
    published_date: '2024-01-12',
    category: 'Academic Publishing',
    tags: ['Peer Review', 'Digital Publishing', 'Quality Control'],
    read_time: 5,
    featured: false
  },
  {
    id: '5',
    title: 'Semantic Search: Beyond Keywords to Understanding Intent',
    excerpt: 'Deep dive into how semantic search technology helps researchers find relevant papers even when they don\'t know the exact terminology.',
    content: 'Full article content...',
    author: {
      name: 'Dr. Lisa Park',
      avatar: '/avatars/lisa-park.jpg',
      role: 'Search Technology Lead'
    },
    published_date: '2024-01-10',
    category: 'Technology',
    tags: ['Semantic Search', 'NLP', 'Information Retrieval'],
    read_time: 9,
    featured: false
  },
  {
    id: '6',
    title: 'Research Ethics in the Age of Big Data',
    excerpt: 'Navigating the complex ethical landscape of modern research practices, data privacy, and responsible AI development.',
    content: 'Full article content...',
    author: {
      name: 'Prof. David Thompson',
      avatar: '/avatars/david-thompson.jpg',
      role: 'Ethics Advisor'
    },
    published_date: '2024-01-08',
    category: 'Ethics',
    tags: ['Research Ethics', 'Big Data', 'Privacy', 'Responsible AI'],
    read_time: 10,
    featured: true
  }
];

const CATEGORIES = ['All', 'Artificial Intelligence', 'Research Methodology', 'Open Science', 'Academic Publishing', 'Technology', 'Ethics'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    filterPosts();
  }, [selectedCategory, searchTerm]);

  const filterPosts = () => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">NeuroNova Blog</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Insights, discoveries, and thoughts from the forefront of research innovation. 
            Stay updated with the latest in AI, academic publishing, and research methodology.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <article className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    {post.featured_image && (
                      <div className="h-48 bg-slate-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-blue-400 text-sm font-medium">{post.category}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-sm flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {post.read_time} min read
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-300 mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-slate-300" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{post.author.name}</p>
                            <p className="text-slate-400 text-xs">{post.author.role}</p>
                          </div>
                        </div>
                        <span className="text-slate-400 text-sm">
                          {formatDate(post.published_date)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">
            Latest Articles {filteredPosts.length > 0 && `(${filteredPosts.length})`}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <article className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors cursor-pointer group">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-blue-400 text-sm font-medium">{post.category}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-sm flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {post.read_time} min
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-3 w-3 text-slate-300" />
                        </div>
                        <span className="text-slate-400 text-xs">{post.author.name}</span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {formatDate(post.published_date)}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-slate-800 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Get the latest articles, research insights, and platform updates delivered to your inbox. 
            Join our community of researchers and innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 