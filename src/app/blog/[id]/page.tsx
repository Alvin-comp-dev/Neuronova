'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
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
  external_sources?: ExternalSource[];
}

interface ExternalSource {
  name: string;
  url: string;
  available: boolean;
  description: string;
  last_checked?: string;
  error?: string;
  estimated_results?: number;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [externalSources, setExternalSources] = useState<ExternalSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'local' | 'external' | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchBlogPost(params.id as string);
    }
  }, [params.id]);

  const fetchBlogPost = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${id}`);
      const data = await response.json();

      if (data.success) {
        if (data.post) {
          setPost(data.post);
          setExternalSources(data.post.external_sources || []);
          setSourceType(data.source);
        } else {
          // Article not found locally, but external sources available
          setExternalSources(data.external_sources || []);
          setSourceType('external');
          setError(data.message || 'Article not found locally');
        }
      } else {
        setError(data.error);
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      setError('Failed to load article');
      console.error('Blog post fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMarkdownContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-white mb-6 mt-8">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-white mb-4 mt-6">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-white mb-3 mt-4">{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="text-slate-300 mb-2 ml-4">{line.substring(2)}</li>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="text-slate-300 mb-4 leading-relaxed">{line}</p>;
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {post ? (
          /* Local Article Content */
          <article>
            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{post.author.name}</p>
                    <p className="text-slate-400 text-sm">{post.author.role}</p>
                  </div>
                </div>
                
                <div className="text-slate-400 text-sm">
                  <p>{formatDate(post.published_date)}</p>
                  <p>{post.read_time} min read</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none mb-12">
              {renderMarkdownContent(post.content)}
            </div>

            {/* External Sources Section */}
            {externalSources.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                  Additional Sources & References
                </h3>
                <p className="text-slate-400 mb-6">
                  Explore these external sources for more detailed information and related research:
                </p>
                
                <div className="grid gap-4">
                  {externalSources.map((source, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${
                        source.available 
                          ? 'border-green-600 bg-green-900/20' 
                          : 'border-red-600 bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {source.available ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            ) : (
                              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                            )}
                            <h4 className="font-semibold text-white">{source.name}</h4>
                            {source.estimated_results && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                {source.estimated_results} results
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{source.description}</p>
                          {source.error && (
                            <p className="text-red-400 text-xs">Error: {source.error}</p>
                          )}
                          {source.last_checked && (
                            <p className="text-slate-500 text-xs">
                              Last checked: {new Date(source.last_checked).toLocaleString()}
                            </p>
                          )}
                        </div>
                        
                        {source.available && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            Visit Source
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ) : (
          /* Article Not Found - Show External Sources */
          <div className="text-center">
            <div className="bg-slate-800 rounded-xl p-8 mb-8">
              <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
              <p className="text-slate-400 mb-6">
                {error || 'This article is not available in our local database, but we found external sources that might have the content you\'re looking for.'}
              </p>
            </div>

            {/* External Sources */}
            {externalSources.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">External Sources Available</h2>
                <p className="text-slate-400 mb-6">
                  These external sources may contain the article or related content:
                </p>
                
                <div className="grid gap-4">
                  {externalSources.map((source, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white mb-1">{source.name}</h3>
                          <p className="text-slate-300 text-sm mb-2">{source.description}</p>
                          {source.estimated_results && (
                            <p className="text-blue-400 text-xs">
                              Estimated results: {source.estimated_results}
                            </p>
                          )}
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          Search Here
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">You Might Also Like</h2>
                <div className="grid gap-4">
                  {suggestions.map((suggestion) => (
                    <Link 
                      key={suggestion.id} 
                      href={`/blog/${suggestion.id}`}
                      className="block p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <h3 className="text-white font-medium hover:text-blue-400">
                        {suggestion.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Articles */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6">Continue Reading</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog" className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors">
              <h4 className="text-lg font-semibold text-white mb-2">Explore All Articles</h4>
              <p className="text-slate-400">Browse our complete collection of research insights and discoveries.</p>
            </Link>
            <Link href="/research" className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors">
              <h4 className="text-lg font-semibold text-white mb-2">Research Discovery</h4>
              <p className="text-slate-400">Discover the latest research papers and academic publications.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 