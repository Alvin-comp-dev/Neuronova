'use client';

import React, { useState, useEffect } from 'react';
import {
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  FlagIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusIcon,
  ShareIcon,
  UserGroupIcon,
  XMarkIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

interface DiscussionPanelProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  timeAgo: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  parentId?: string;
}

const DiscussionPanel: React.FC<DiscussionPanelProps> = ({ articleId, isOpen, onClose }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Mock discussions specific to the article - for demo purposes
  const getMockDiscussions = (): Discussion[] => [
    {
      id: `${articleId}-1`,
      title: 'Thoughts on methodology',
      content: 'What do you think about the experimental design used in this study? The sample size seems adequate but I\'m curious about the control group selection.',
      author: {
        name: 'Dr. Sarah Chen',
        avatar: '👩‍⚕️',
        role: 'Professor',
        verified: true
      },
      category: 'Research Questions',
      tags: ['methodology', 'experimental-design'],
      likes: 12,
      replies: 5,
      views: 89,
      timeAgo: '2 hours ago',
      isLiked: false,
      isBookmarked: false
    },
    {
      id: `${articleId}-2`,
      title: 'Potential applications',
      content: 'This research has interesting implications for clinical practice. Has anyone seen similar approaches being tested in real-world settings?',
      author: {
        name: 'Dr. Michael Rodriguez',
        avatar: '👨‍🔬',
        role: 'Clinician',
        verified: true
      },
      category: 'Clinical Applications',
      tags: ['clinical', 'applications'],
      likes: 8,
      replies: 3,
      views: 56,
      timeAgo: '4 hours ago',
      isLiked: false,
      isBookmarked: true
    },
    {
      id: `${articleId}-3`,
      title: 'Follow-up questions',
      content: 'Great paper! I\'d love to see how this methodology could be extended to pediatric populations. Any thoughts on the ethical considerations?',
      author: {
        name: 'Dr. Emily Watson',
        avatar: '🧬',
        role: 'PostDoc',
        verified: false
      },
      category: 'Future Research',
      tags: ['pediatrics', 'ethics'],
      likes: 15,
      replies: 7,
      views: 124,
      timeAgo: '6 hours ago',
      isLiked: true,
      isBookmarked: false
    }
  ];

  const mockReplies: Reply[] = [
    {
      id: '1',
      content: 'I agree with your concerns about the control group. It would be interesting to see a more diverse demographic representation.',
      author: {
        name: 'Dr. James Liu',
        avatar: '👨‍💻',
        role: 'Research Scientist'
      },
      timeAgo: '1 hour ago',
      likes: 3,
      isLiked: false
    },
    {
      id: '2',
      content: 'The methodology seems sound to me. Have you considered the statistical power analysis they provided in the supplementary materials?',
      author: {
        name: 'Prof. Anna Kowalski',
        avatar: '👩‍🏫',
        role: 'Professor'
      },
      timeAgo: '45 minutes ago',
      likes: 2,
      isLiked: false,
      parentId: '1'
    }
  ];

  // Fetch discussions for the specific article
  const fetchDiscussions = async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, use mock data. In production, this would call the API:
      // const response = await fetch(`/api/discussions?articleId=${articleId}&limit=10`);
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = getMockDiscussions();
      setDiscussions(mockData);
    } catch (err) {
      console.error('Error fetching discussions:', err);
      setError('Failed to load discussions');
      // Fallback to mock data
      setDiscussions(getMockDiscussions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && articleId) {
      fetchDiscussions();
    }
  }, [isOpen, articleId]);

  const handleLike = (discussionId: string) => {
    setDiscussions(prev => prev.map(d => 
      d.id === discussionId 
        ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 }
        : d
    ));
  };

  const handleReply = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setReplies(mockReplies);
  };

  const submitReply = async () => {
    if (!newReply.trim()) return;
    
    const reply: Reply = {
      id: Date.now().toString(),
      content: newReply,
      author: {
        name: 'You',
        avatar: '👤',
        role: 'Researcher'
      },
      timeAgo: 'Just now',
      likes: 0,
      isLiked: false
    };
    
    setReplies(prev => [...prev, reply]);
    setNewReply('');
    
    // Update reply count in discussions
    if (selectedDiscussion) {
      setDiscussions(prev => prev.map(d => 
        d.id === selectedDiscussion.id 
          ? { ...d, replies: d.replies + 1 }
          : d
      ));
    }
  };

  const createDiscussion = async () => {
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim()) return;

    const newDiscussion: Discussion = {
      id: `${articleId}-${Date.now()}`,
      title: newDiscussionTitle,
      content: newDiscussionContent,
      author: {
        name: 'You',
        avatar: '👤',
        role: 'Researcher',
        verified: false
      },
      category: 'General Discussion',
      tags: ['discussion'],
      likes: 0,
      replies: 0,
      views: 1,
      timeAgo: 'Just now',
      isLiked: false,
      isBookmarked: false
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setNewDiscussionTitle('');
    setNewDiscussionContent('');
    setShowCreateForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Research Discussion</h2>
            <span className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full">
              {discussions.length} discussions
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {!selectedDiscussion ? (
            // Discussion List
            <div className="flex-1 overflow-y-auto p-6">
              {/* Create Discussion Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Start New Discussion</span>
                </button>
              </div>

              {/* Create Discussion Form */}
              {showCreateForm && (
                <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h3 className="text-lg font-semibold text-white mb-4">Start a New Discussion</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Discussion title..."
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="What would you like to discuss about this article?"
                      value={newDiscussionContent}
                      onChange={(e) => setNewDiscussionContent(e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={createDiscussion}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Post Discussion
                      </button>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-3 text-slate-400">Loading discussions...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-200">{error}</p>
                  <button
                    onClick={fetchDiscussions}
                    className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Discussions List */}
              {!loading && (
                <div className="space-y-4">
                  {discussions.length > 0 ? (
                    discussions.map((discussion) => (
                      <div key={discussion.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{discussion.author.avatar}</span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-white">{discussion.author.name}</span>
                                {discussion.author.verified && (
                                  <CheckBadgeIcon className="h-4 w-4 text-blue-400" />
                                )}
                                <span className="text-slate-400 text-sm">{discussion.author.role}</span>
                              </div>
                              <span className="text-slate-400 text-sm">{discussion.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">{discussion.title}</h3>
                        <p className="text-slate-300 mb-4">{discussion.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <button
                              onClick={() => handleLike(discussion.id)}
                              className={`flex items-center space-x-1 hover:text-white transition-colors ${
                                discussion.isLiked ? 'text-red-400' : ''
                              }`}
                            >
                              {discussion.isLiked ? (
                                <HeartIconSolid className="h-4 w-4" />
                              ) : (
                                <HeartIcon className="h-4 w-4" />
                              )}
                              <span>{discussion.likes}</span>
                            </button>
                            <span className="flex items-center space-x-1">
                              <ChatBubbleLeftRightIcon className="h-4 w-4" />
                              <span>{discussion.replies}</span>
                            </span>
                          </div>
                          <button
                            onClick={() => handleReply(discussion)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                          >
                            View Replies
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    !loading && (
                      <div className="text-center py-12">
                        <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">No discussions yet</h3>
                        <p className="text-slate-500">Be the first to start a discussion about this article!</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            // Discussion Detail with Replies
            <div className="flex-1 overflow-y-auto p-6">
              <button
                onClick={() => setSelectedDiscussion(null)}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6"
              >
                <ArrowUturnLeftIcon className="h-4 w-4" />
                <span>Back to discussions</span>
              </button>
              
              {/* Main Discussion */}
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedDiscussion.author.avatar}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{selectedDiscussion.author.name}</span>
                        {selectedDiscussion.author.verified && (
                          <CheckBadgeIcon className="h-4 w-4 text-blue-400" />
                        )}
                        <span className="text-slate-400 text-sm">{selectedDiscussion.author.role}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{selectedDiscussion.timeAgo}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{selectedDiscussion.title}</h3>
                <p className="text-slate-300 mb-4">{selectedDiscussion.content}</p>
              </div>

              {/* Replies */}
              <div className="space-y-4 mb-6">
                {replies.map((reply) => (
                  <div key={reply.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 ml-8">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{reply.author.avatar}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{reply.author.name}</span>
                            <span className="text-slate-400 text-sm">{reply.author.role}</span>
                          </div>
                          <span className="text-slate-400 text-sm">{reply.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300">{reply.content}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h4 className="text-lg font-semibold text-white mb-4">Add a Reply</h4>
                <textarea
                  placeholder="Write your reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                />
                <button
                  onClick={submitReply}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPanel;
