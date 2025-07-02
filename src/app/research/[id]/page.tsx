'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShareIcon, EyeIcon, CalendarIcon, GlobeAltIcon, AcademicCapIcon, VideoCameraIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface ExternalResearchResult {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  source: string;
  url: string;
  publicationDate: string;
  type: 'research' | 'webinar' | 'workshop' | 'article' | 'conference';
  tags: string[];
  citations?: number;
  doi?: string;
}

interface ExpertContent {
  id: string;
  title: string;
  type: 'webinar' | 'workshop' | 'article' | 'conference' | 'course';
  url: string;
  description: string;
  author: string;
  date: string;
  source: string;
  relevanceScore: number;
}

interface ResearchArticle {
  _id: string;
  title: string;
  abstract: string;
  authors: any[];
  categories: string[];
  tags: string[];
  source: { name: string; url: string; type: string; };
  doi?: string;
  publicationDate: string;
  citationCount: number;
  viewCount: number;
  status: string;
  isLocal?: boolean;
  isExternal?: boolean;
  metrics?: {
    impactScore: number;
    readabilityScore: number;
    noveltyScore: number;
  };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = decodeURIComponent(params.id as string);
  
  const [article, setArticle] = useState<ResearchArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [externalPapers, setExternalPapers] = useState<ExternalResearchResult[]>([]);
  const [expertContent, setExpertContent] = useState<ExpertContent[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [keyAuthors, setKeyAuthors] = useState<string[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching article with ID:', articleId);
      console.log('🔍 Encoded URL:', `/api/research/${encodeURIComponent(articleId)}`);
      
      const response = await fetch(`/api/research/${encodeURIComponent(articleId)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setArticle(data.data);
        console.log('✅ Article loaded successfully:', data.data.title);
        
        // Fetch external research and expert content
        fetchExternalContent(data.data);
      } else {
        console.log('❌ Article not found:', data.error);
        setError(data.error || 'Article not found');
      }
    } catch (err) {
      console.error('❌ Error fetching article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const fetchExternalContent = async (article: ResearchArticle) => {
    try {
      setLoadingExternal(true);
      console.log('🌐 Fetching external content for:', article.title);
      
      const response = await fetch('/api/search/external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          keywords: [],
          categories: article.categories || [],
          tags: article.tags || []
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setExternalPapers(data.data.papers);
        setExpertContent(data.data.expertContent);
        setRelatedTopics(data.data.relatedTopics);
        setKeyAuthors(data.data.keyAuthors);
        
        console.log('✅ External content loaded via API:', data.meta.resultCounts);
      } else {
        console.error('❌ API error:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching external content:', error);
    } finally {
      setLoadingExternal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading article...</div>
          <div className="text-slate-400 text-sm mt-2">
            {articleId.includes('.') ? 'Fetching from external sources...' : 'Loading from database...'}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <button
            onClick={() => router.push('/research')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-400 hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-slate-800 rounded-xl p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-900 text-green-200">
              {article.status}
            </span>
            {article.isExternal && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-900 text-blue-200">
                External Source
              </span>
            )}
            {article.source && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-900 text-purple-200">
                {article.source.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">
            {article.title}
          </h1>

          <div className="flex items-center text-slate-300 mb-6">
            <span>Authors: </span>
            {article.authors?.map((author, index) => (
              <span key={index} className="text-blue-400 ml-2">
                {typeof author === 'string' ? author : author.name || author}
                {index < article.authors.length - 1 && ', '}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-slate-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{article.viewCount || 0}</div>
              <div className="text-slate-400 text-sm">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{article.citationCount || 0}</div>
              <div className="text-slate-400 text-sm">Citations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {new Date(article.publicationDate).toLocaleDateString()}
              </div>
              <div className="text-slate-400 text-sm">Published</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Abstract</h2>
            <div className="text-slate-300 leading-relaxed">
              {article.abstract.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Categories & Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.categories?.map((category) => (
                <span key={category} className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full">
                  {category}
                </span>
              ))}
              {article.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-600 text-slate-300 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {article.doi && (
            <div className="mb-8 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">DOI & Links</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-sm">DOI: </span>
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {article.doi}
                  </a>
                </div>
                {article.source?.url && (
                  <div>
                    <span className="text-slate-400 text-sm">Source: </span>
                    <a
                      href={article.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      View on {article.source.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {article.metrics && (
            <div className="mb-8 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Article Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{article.metrics.impactScore}</div>
                  <div className="text-slate-400 text-sm">Impact Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{article.metrics.readabilityScore}</div>
                  <div className="text-slate-400 text-sm">Readability</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{article.metrics.noveltyScore}</div>
                  <div className="text-slate-400 text-sm">Novelty</div>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* External Research & Expert Content */}
        <div className="mt-8 space-y-8">
          {/* Global Research Papers */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <GlobeAltIcon className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Related Research Worldwide</h2>
              {loadingExternal && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            
            {externalPapers.length > 0 ? (
              <div className="space-y-4">
                {externalPapers.map((paper) => (
                  <div key={paper.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors mb-2">
                          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {paper.title}
                          </a>
                        </h3>
                        <div className="text-sm text-slate-400 mb-2">
                          {paper.authors.slice(0, 3).join(', ')}
                          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                          {paper.source}
                        </span>
                        {paper.citations && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">
                            {paper.citations} citations
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        Published: {new Date(paper.publicationDate).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-1">
                        {paper.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                {loadingExternal ? 'Searching global research databases...' : 'No related papers found'}
              </div>
            )}
          </div>

          {/* Expert Content - Webinars, Workshops, Courses */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Expert Resources & Learning</h2>
            </div>
            
            {expertContent.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {expertContent.map((content) => (
                  <div key={content.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-green-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {content.type === 'webinar' && <VideoCameraIcon className="h-5 w-5 text-red-400 mr-2" />}
                        {content.type === 'workshop' && <AcademicCapIcon className="h-5 w-5 text-blue-400 mr-2" />}
                        {content.type === 'course' && <BookOpenIcon className="h-5 w-5 text-green-400 mr-2" />}
                        {content.type === 'article' && <BookOpenIcon className="h-5 w-5 text-yellow-400 mr-2" />}
                        {content.type === 'conference' && <GlobeAltIcon className="h-5 w-5 text-purple-400 mr-2" />}
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                          {content.type}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                        {content.relevanceScore}% match
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-green-400 transition-colors">
                      <a href={content.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {content.title}
                      </a>
                    </h3>
                    
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {content.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div>
                        <span className="font-medium">{content.author}</span> • {content.source}
                      </div>
                      <div>
                        {new Date(content.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                {loadingExternal ? 'Finding expert resources...' : 'No expert resources found'}
              </div>
            )}
          </div>

          {/* Related Topics & Key Authors */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Related Topics */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Related Topics</h3>
              {relatedTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {relatedTopics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full hover:bg-blue-500 transition-colors cursor-pointer">
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-sm">
                  {loadingExternal ? 'Analyzing topics...' : 'No related topics found'}
                </div>
              )}
            </div>

            {/* Key Authors */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Key Authors in Field</h3>
              {keyAuthors.length > 0 ? (
                <div className="space-y-2">
                  {keyAuthors.map((author, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700 rounded-lg p-2">
                      <span className="text-slate-300">{author}</span>
                      <span className="text-xs text-slate-400">Expert</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-sm">
                  {loadingExternal ? 'Finding key authors...' : 'No key authors found'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 