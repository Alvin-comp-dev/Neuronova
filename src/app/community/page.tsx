'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Calendar, 
  ThumbsUp, 
  MessageCircle, 
  Eye, 
  Award,
  BarChart3,
  PlusCircle,
  Filter,
  Search,
  Star,
  Clock,
  CheckCircle,
  Share2,
  Bookmark,
  Heart
} from 'lucide-react';

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
    badges: string[];
  };
  category: 'Q&A' | 'Discussion' | 'Research Review' | 'News' | 'Poll';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  replies: number;
  views: number;
  likes: number;
  solved: boolean;
  featured: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface Poll {
  _id: string;
  question: string;
  options: {
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  category: string;
}

interface CommunityStats {
  totalMembers: number;
  activeToday: number;
  totalPosts: number;
  questionsAnswered: number;
}

export default function CommunityPage() {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [stats, setStats] = useState<CommunityStats>({
    totalMembers: 0,
    activeToday: 0,
    totalPosts: 0,
    questionsAnswered: 0
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  // Mock data for community posts
  const mockPosts: ForumPost[] = [
    {
      _id: '6759e1a68307c341d7b76a01',
      title: 'How does the new BCI technology compare to existing neural interfaces?',
      content: 'I\'ve been following the recent breakthrough in brain-computer interfaces and wondering how it stacks up against current solutions...',
      author: {
        name: 'Dr. Sarah Mitchell',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
        reputation: 1250,
        badges: ['Expert', 'Verified Researcher']
      },
      category: 'Q&A',
      tags: ['BCI', 'Neural Interface', 'Technology'],
      createdAt: '2024-06-15T10:30:00Z',
      updatedAt: '2024-06-15T10:30:00Z',
      replies: 23,
      views: 1420,
      likes: 45,
      solved: false,
      featured: true
    },
    {
      _id: '6759e1a68307c341d7b76a02',
      title: 'Discussion: Ethical implications of AI in medical diagnosis',
      content: 'With AI systems achieving 94% accuracy in early disease detection, what are the ethical considerations we need to address?',
      author: {
        name: 'Prof. Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        reputation: 2100,
        badges: ['Ethics Expert', 'AI Researcher']
      },
      category: 'Discussion',
      tags: ['AI', 'Ethics', 'Medical Diagnosis'],
      createdAt: '2024-06-14T15:45:00Z',
      updatedAt: '2024-06-15T09:20:00Z',
      replies: 67,
      views: 3200,
      likes: 89,
      solved: false,
      featured: true
    },
    {
      _id: '6759e1a68307c341d7b76a03',
      title: 'Research Review: CRISPR 3.0 precision claims - too good to be true?',
      content: 'The recent paper claims 99.7% accuracy. I\'ve analyzed the methodology and have some concerns about the sample size...',
      author: {
        name: 'Dr. Lisa Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
        reputation: 890,
        badges: ['Gene Therapy Specialist']
      },
      category: 'Research Review',
      tags: ['CRISPR', 'Gene Editing', 'Research Analysis'],
      createdAt: '2024-06-13T20:15:00Z',
      updatedAt: '2024-06-14T11:30:00Z',
      replies: 34,
      views: 2100,
      likes: 56,
      solved: false,
      featured: false
    },
    {
      _id: '6759e1a68307c341d7b76a04',
      title: 'Breakthrough: Quantum sensors in MRI - game changer?',
      content: 'The latest quantum-enhanced MRI technology promises unprecedented resolution. What are your thoughts on clinical applications?',
      author: {
        name: 'Dr. James Wilson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
        reputation: 1650,
        badges: ['Medical Imaging Expert', 'Quantum Tech']
      },
      category: 'News',
      tags: ['Quantum', 'MRI', 'Medical Imaging'],
      createdAt: '2024-06-12T14:20:00Z',
      updatedAt: '2024-06-13T08:45:00Z',
      replies: 19,
      views: 980,
      likes: 32,
      solved: false,
      featured: false
    },
    {
      _id: '6759e1a68307c341d7b76a05',
      title: 'Lab-grown heart tissue - regenerative medicine milestone',
      content: 'Clinical trials showing 78% success rate in heart attack recovery. This could revolutionize cardiac care...',
      author: {
        name: 'Prof. Emily Richardson',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
        reputation: 1890,
        badges: ['Regenerative Medicine', 'Clinical Researcher']
      },
      category: 'Discussion',
      tags: ['Heart', 'Regenerative Medicine', 'Clinical Trial'],
      createdAt: '2024-06-11T09:30:00Z',
      updatedAt: '2024-06-12T16:15:00Z',
      replies: 41,
      views: 1560,
      likes: 67,
      solved: false,
      featured: true
    },
    {
      _id: '6759e1a68307c341d7b76a06',
      title: 'Question: Best resources for learning about gene therapy?',
      content: 'I\'m new to the field and looking for comprehensive resources to understand current gene therapy techniques and applications.',
      author: {
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
        reputation: 245,
        badges: ['New Member']
      },
      category: 'Q&A',
      tags: ['Gene Therapy', 'Learning', 'Resources'],
      createdAt: '2024-06-10T13:45:00Z',
      updatedAt: '2024-06-11T10:20:00Z',
      replies: 15,
      views: 720,
      likes: 28,
      solved: true,
      featured: false
    }
  ];

  // Mock polls data
  const mockPolls: Poll[] = [
    {
      _id: '1',
      question: 'Which field will see the biggest breakthrough in the next 6 months?',
      options: [
        { text: 'Brain-Computer Interfaces', votes: 234 },
        { text: 'Gene Therapy', votes: 189 },
        { text: 'AI Diagnostics', votes: 156 },
        { text: 'Regenerative Medicine', votes: 123 }
      ],
      totalVotes: 702,
      createdBy: 'Neuronova Team',
      createdAt: '2024-06-10T00:00:00Z',
      expiresAt: '2024-06-24T23:59:59Z',
      category: 'Predictions'
    },
    {
      _id: '2',
      question: 'What\'s your biggest concern about AI in healthcare?',
      options: [
        { text: 'Privacy and data security', votes: 145 },
        { text: 'Accuracy and reliability', votes: 98 },
        { text: 'Job displacement', votes: 67 },
        { text: 'Ethical implications', votes: 134 }
      ],
      totalVotes: 444,
      createdBy: 'Dr. Ethics Panel',
      createdAt: '2024-06-12T00:00:00Z',
      expiresAt: '2024-06-26T23:59:59Z',
      category: 'Ethics'
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setPosts(mockPosts);
    setPolls(mockPolls);
    setStats({
      totalMembers: 12847,
      activeToday: 1203,
      totalPosts: 34567,
      questionsAnswered: 8934
    });
    setLoading(false);
  }, []);

  const categories = ['all', 'Q&A', 'Discussion', 'Research Review', 'News', 'Poll'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLike = async (postId: string) => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    try {
      const isCurrentlyLiked = likedPosts.has(postId);
      const action = isCurrentlyLiked ? 'remove' : 'add';
      
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId: postId,
          action
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (isCurrentlyLiked) {
            setLikedPosts(prev => {
              const newSet = new Set(prev);
              newSet.delete(postId);
              return newSet;
            });
          } else {
            setLikedPosts(prev => new Set(prev).add(postId));
          }
          
          // Update the post's like count
          setPosts(prev => prev.map(post => 
            post._id === postId 
              ? { ...post, likes: data.data.articleLikeCount }
              : post
          ));
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    try {
      const isCurrentlyBookmarked = bookmarkedPosts.has(postId);
      const action = isCurrentlyBookmarked ? 'remove' : 'add';
      
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId: postId,
          action
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (isCurrentlyBookmarked) {
            setBookmarkedPosts(prev => {
              const newSet = new Set(prev);
              newSet.delete(postId);
              return newSet;
            });
          } else {
            setBookmarkedPosts(prev => new Set(prev).add(postId));
          }
        }
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  const handleShare = async (postId: string, title: string) => {
    try {
      const shareUrl = `${window.location.origin}/community/${postId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: 'Check out this discussion on NeuroNova',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }

      // Record the share
      await fetch('/api/shares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          articleId: postId,
          shareType: 'link'
        })
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Community Hub
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              Connect with researchers, ask questions, share insights, and participate in 
              discussions about the latest scientific breakthroughs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalMembers.toLocaleString()}</div>
            <div className="text-slate-400">Total Members</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
            <Eye className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activeToday.toLocaleString()}</div>
            <div className="text-slate-400">Active Today</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
            <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalPosts.toLocaleString()}</div>
            <div className="text-slate-400">Total Posts</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.questionsAnswered.toLocaleString()}</div>
            <div className="text-slate-400">Questions Answered</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search and Filters */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions, questions, reviews..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  New Post
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Forum Posts */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-slate-400">Loading discussions...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No discussions found. Be the first to start a conversation!</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                <div 
                  key={post._id} 
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full bg-slate-600"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-white">{post.author.name}</h4>
                          {post.author.badges.map((badge, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-slate-400">
                          {post.author.reputation} reputation • {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {post.featured && (
                        <Star className="h-5 w-5 text-yellow-400" />
                      )}
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        post.category === 'Q&A' ? 'bg-green-600 text-green-100' :
                        post.category === 'Discussion' ? 'bg-blue-600 text-blue-100' :
                        post.category === 'Research Review' ? 'bg-purple-600 text-purple-100' :
                        'bg-gray-600 text-gray-100'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <h3 
                    className="text-lg font-semibold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors"
                    onClick={() => router.push(`/community/${post._id}`)}
                  >
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-300 mb-4 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.replies} replies
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} views
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.likes} likes
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post._id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            likedPosts.has(post._id)
                              ? 'text-red-400 bg-red-400/10'
                              : 'text-slate-400 hover:text-red-400 hover:bg-slate-700'
                          }`}
                          title={likedPosts.has(post._id) ? 'Unlike' : 'Like'}
                        >
                          <Heart className={`h-4 w-4 ${likedPosts.has(post._id) ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(post._id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarkedPosts.has(post._id)
                              ? 'text-blue-400 bg-blue-400/10'
                              : 'text-slate-400 hover:text-blue-400 hover:bg-slate-700'
                          }`}
                          title={bookmarkedPosts.has(post._id) ? 'Remove bookmark' : 'Bookmark'}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedPosts.has(post._id) ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(post._id, post.title);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-green-400 hover:bg-slate-700 transition-colors"
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Active Polls */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Active Polls</h3>
              <div className="space-y-6">
                {polls.map((poll) => (
                  <div key={poll._id} className="border-b border-slate-700 pb-6 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-white mb-4">{poll.question}</h4>
                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = (option.votes / poll.totalVotes) * 100;
                        return (
                          <div key={index} className="cursor-pointer hover:bg-slate-700 p-2 rounded transition-colors">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-300">{option.text}</span>
                              <span className="text-sm text-slate-400">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-slate-400 mt-3">
                      {poll.totalVotes} votes • Expires {new Date(poll.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Top Contributors</h3>
              <div className="space-y-4">
                {[
                  { name: 'Dr. Sarah Mitchell', reputation: 1250, posts: 89 },
                  { name: 'Prof. Michael Chen', reputation: 2100, posts: 156 },
                  { name: 'Dr. Lisa Rodriguez', reputation: 890, posts: 67 },
                  { name: 'Dr. James Wilson', reputation: 1456, posts: 112 }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{contributor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{contributor.name}</div>
                        <div className="text-xs text-slate-400">{contributor.posts} posts</div>
                      </div>
                    </div>
                    <div className="text-sm text-blue-400">{contributor.reputation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 