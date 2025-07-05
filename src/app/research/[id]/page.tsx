'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Share2, Bookmark, BookmarkIcon, ThumbsUp, MessageSquare, Eye, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Author {
  name: string;
  affiliation: string;
  bio: string;
}

interface ResearchArticle {
  _id: string;
  title: string;
  authors: Author[];
  abstract: string;
  introduction?: string;
  methodology?: string;
  results?: string;
  discussion?: string;
  conclusion?: string;
  publicationDate: string;
  journal?: string;
  doi?: string;
  keywords?: string[];
  categories?: string[];
  tags?: string[];
  viewCount?: number;
  citationCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  impactScore?: number;
  readabilityScore?: number;
  noveltyScore?: number;
  isLocal?: boolean;
  isExternal?: boolean;
  status?: string;
  source?: { 
    name: string; 
    url: string; 
    type: string; 
  };
  externalUrl?: string;
  figures?: {
    url: string;
    caption: string;
  }[];
  references?: {
    id: number;
    text: string;
  }[];
  metrics?: {
    views: number;
    likes: number;
    shares: number;
    citations: number;
    impactScore?: number;
    readabilityScore?: number;
    noveltyScore?: number;
  };
}

export default function ResearchArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<ResearchArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for the research article
  const mockArticle: ResearchArticle = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms',
    authors: [
      {
        name: 'Prof. Elena Vasquez',
        affiliation: 'Stanford University',
        bio: 'Leading researcher in neural engineering and brain-computer interfaces'
      },
      {
        name: 'Dr. Marcus Johnson',
        affiliation: 'MIT',
        bio: 'Expert in robotic prosthetics and neural decoding algorithms'
      },
      {
        name: 'Dr. Priya Patel',
        affiliation: 'Johns Hopkins University',
        bio: 'Specialist in clinical applications of BCIs'
      },
      {
        name: 'Dr. Thomas Wilson',
        affiliation: 'Harvard Medical School',
        bio: 'Neurosurgeon specializing in BCI implantation'
      }
    ],
    abstract: 'Brain-computer interfaces (BCIs) hold tremendous promise for restoring motor function in paralyzed individuals. This study reports the development and clinical testing of a high-resolution BCI system that enables tetraplegic patients to control robotic arms with unprecedented precision. Through a combination of advanced neural decoding algorithms and innovative hardware design, participants achieved natural and intuitive control of robotic limbs, marking a significant advancement in assistive technology for individuals with severe motor disabilities.',
    introduction: 'Paralysis resulting from spinal cord injury, stroke, or neurodegenerative diseases affects millions worldwide, often leading to complete loss of motor function and independence. Brain-computer interfaces have emerged as a promising technology for restoring movement capabilities in these individuals. Previous BCI systems have demonstrated basic control of external devices, but achieving natural, precise movement comparable to biological limbs has remained a significant challenge. This study presents a novel BCI system that addresses these limitations through innovative neural decoding approaches and advanced robotic integration.',
    methodology: 'We recruited five tetraplegic patients (ages 45-62) with chronic spinal cord injuries at cervical levels C4-C6. Each participant underwent surgical implantation of high-density microelectrode arrays in the motor cortex. The BCI system utilized real-time neural decoding algorithms based on deep learning architectures, optimized for individual movement patterns. Participants underwent extensive training sessions over six months, progressing from basic movement tasks to complex object manipulation.',
    results: 'All participants successfully achieved control of the robotic arms, demonstrating significant improvements in movement precision and task completion rates over the study period. Mean task completion rates increased from 52% in the first month to 87% by month six. Movement trajectories showed increasing smoothness and efficiency, approaching natural arm movement patterns. Participants could reliably perform complex tasks such as picking up small objects, operating devices, and self-feeding.',
    discussion: 'The unprecedented level of control achieved in this study can be attributed to several key innovations: (1) the high-density electrode arrays providing detailed neural activity patterns, (2) adaptive deep learning algorithms that continuously optimize decoding based on individual user patterns, and (3) advanced robotic systems with enhanced tactile feedback. These results demonstrate the potential for BCIs to restore natural movement capabilities in paralyzed individuals.',
    conclusion: 'This study represents a significant advancement in BCI technology, demonstrating that high-precision control of robotic limbs is achievable for individuals with severe paralysis. The system\'s success in enabling complex task completion suggests that practical, real-world applications of BCI technology for paralyzed individuals are becoming increasingly feasible. Future work will focus on system miniaturization and wireless operation for improved practicality in daily life.',
    publicationDate: '2024-02-12T00:00:00Z',
    journal: 'Nature Medicine',
    doi: '10.1038/nm.12345',
    categories: ['neuroscience', 'medicine', 'ai-ml'],
    tags: ['brain-computer interface', 'neural prosthetics', 'paralysis', 'motor cortex', 'neural decoding', 'rehabilitation'],
    keywords: ['brain-computer interface', 'neural prosthetics', 'paralysis', 'motor cortex', 'neural decoding', 'rehabilitation'],
    viewCount: 45230,
    citationCount: 91,
    likeCount: 1250,
    bookmarkCount: 890,
    isExternal: false,
    source: {
      name: 'Nature Medicine',
      url: 'https://www.nature.com/articles/nm.12345',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38347123/',
    figures: [
      {
        url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
        caption: 'Figure 1: High-density microelectrode array placement in the motor cortex'
      },
      {
        url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop',
        caption: 'Figure 2: Neural decoding system architecture'
      },
      {
        url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
        caption: 'Figure 3: Task performance metrics over time'
      }
    ],
    references: [
      {
        id: 1,
        text: 'Smith et al. (2022). Recent advances in brain-computer interfaces. Nature Neuroscience, 25(3), 456-470.'
      },
      {
        id: 2,
        text: 'Johnson & Patel (2023). Deep learning approaches for neural decoding. Journal of Neural Engineering, 18(2), 026001.'
      },
      {
        id: 3,
        text: 'Wilson et al. (2023). Clinical applications of BCIs in spinal cord injury. Neurology, 89(5), 678-690.'
      }
    ],
    metrics: {
      views: 45230,
      likes: 1250,
      shares: 890,
      citations: 91,
      impactScore: 8.7,
      readabilityScore: 7.2,
      noveltyScore: 9.1
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/research/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Article not found');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setArticle(data.data);
        } else {
          // Fallback to mock data if API fails
          setArticle(mockArticle);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        // Use mock data as fallback
        setArticle(mockArticle);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading article...</div>
          <div className="text-slate-400 text-sm mt-2">
            {params.id.includes('.') ? 'Fetching from external sources...' : 'Loading from database...'}
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
          <Link
            href="/research"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/search"
            className="flex items-center space-x-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </Link>
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
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {(article.doi || article.source?.url || article.externalUrl) && (
            <div className="mb-8 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">DOI & Links</h3>
              <div className="space-y-3">
                {article.doi && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm min-w-[60px]">DOI:</span>
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline break-all"
                    >
                      {article.doi}
                    </a>
                  </div>
                )}
                
                {article.source?.url && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm min-w-[60px]">Source:</span>
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
                
                {article.externalUrl && article.externalUrl !== article.source?.url && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm min-w-[60px]">External:</span>
                    <a
                      href={article.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Read Full Paper
                    </a>
                  </div>
                )}
                
                {article.journal && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm min-w-[60px]">Journal:</span>
                    <span className="text-slate-300">{article.journal}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {article.metrics && (article.metrics.impactScore || article.metrics.readabilityScore || article.metrics.noveltyScore) && (
            <div className="mb-8 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Article Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                {article.metrics.impactScore && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{article.metrics.impactScore}</div>
                    <div className="text-slate-400 text-sm">Impact Score</div>
                  </div>
                )}
                {article.metrics.readabilityScore && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{article.metrics.readabilityScore}</div>
                    <div className="text-slate-400 text-sm">Readability</div>
                  </div>
                )}
                {article.metrics.noveltyScore && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{article.metrics.noveltyScore}</div>
                    <div className="text-slate-400 text-sm">Novelty</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-6 border-t border-slate-700">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Bookmark className="w-4 h-4" />
              Bookmark
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {(article.doi || article.externalUrl) && (
              <button 
                onClick={() => window.open(article.doi ? `https://doi.org/${article.doi}` : article.externalUrl, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Full Paper
              </button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
} 