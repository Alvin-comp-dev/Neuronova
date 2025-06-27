'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { 
  ArrowLeft,
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Clock,
  Star,
  MoreVertical,
  Reply,
  Edit,
  Trash2,
  Flag,
  Share2,
  Bookmark,
  Send,
  Calendar,
  User
} from 'lucide-react';

interface Author {
  _id: string;
  name: string;
  email: string;
  profile?: {
    avatar?: string;
    title?: string;
    affiliation?: string;
  };
}

interface Post {
  _id: string;
  content: string;
  author: Author;
  parentId?: string;
  reactions: any[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  moderationStatus: 'approved' | 'pending' | 'rejected';
}

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: Author;
  category: string;
  tags: string[];
  posts: Post[];
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

export default function DiscussionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const discussionId = params.id as string;

  useEffect(() => {
    fetchDiscussion();
  }, [params.id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/discussions/${discussionId}`, {
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch discussion');
      }

      if (data.success) {
        setDiscussion(data.data);
        setIsLiked(data.data.isLiked || false);
        setIsBookmarked(data.data.isBookmarked || false);
        setLikeCount(data.data.likes || 0);
        setBookmarkCount(data.data.bookmarks || 0);
      } else {
        throw new Error(data.error || 'Failed to fetch discussion');
      }
    } catch (error) {
      console.error('Error fetching discussion:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      alert('Please enter a reply before submitting.');
      return;
    }

    if (!token) {
      alert('You must be signed in to post replies. Please sign in and try again.');
      router.push('/auth/login');
      return;
    }

    try {
      setSubmittingReply(true);

      const response = await fetch(`/api/discussions/${discussionId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentId: replyingTo?._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert('Your session has expired. Please sign in again to continue.');
          router.push('/auth/login');
          return;
        }
        throw new Error(data.error || 'Failed to submit reply');
      }

      if (data.success) {
        // Refresh the discussion to get updated posts
        await fetchDiscussion();
        setReplyContent('');
        setReplyingTo(null);
        
        // Show success message
        alert('Reply posted successfully!');
      } else {
        throw new Error(data.error || 'Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit reply';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLike = async () => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    try {
      const action = isLiked ? 'remove' : 'add';
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId: discussionId,
          action
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsLiked(data.data.isLiked);
          setLikeCount(data.data.articleLikeCount);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    try {
      const action = isBookmarked ? 'remove' : 'add';
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId: discussionId,
          action
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsBookmarked(data.data.isBookmarked);
          setBookmarkCount(data.data.articleBookmarkCount);
        }
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/community/${discussionId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: discussion?.title || 'Discussion',
          text: discussion?.content?.substring(0, 100) + '...',
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
          articleId: discussionId,
          shareType: 'link'
        })
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Q&A': return 'bg-green-600 text-green-100';
      case 'Discussion': return 'bg-blue-600 text-blue-100';
      case 'Research Review': return 'bg-purple-600 text-purple-100';
      case 'News': return 'bg-orange-600 text-orange-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const renderPost = (post: Post, isReply: boolean = false) => (
    <div 
      key={post._id} 
      className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${isReply ? 'ml-8 mt-4' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={post.author.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author.name}`}
            alt={post.author.name}
            className="w-10 h-10 rounded-full bg-slate-600"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-white">{post.author.name}</h4>
              {post.author.profile?.title && (
                <span className="text-sm text-blue-400">{post.author.profile.title}</span>
              )}
            </div>
            <div className="text-sm text-slate-400">
              {post.author.profile?.affiliation && `${post.author.profile.affiliation} • `}
              {formatDate(post.createdAt)}
              {post.isEdited && ' (edited)'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {user && (
            <button 
              onClick={() => setReplyingTo(post)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              title="Reply"
            >
              <Reply className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="text-slate-300 whitespace-pre-wrap mb-4">
        {post.content}
      </div>

      <div className="flex items-center space-x-4 text-sm text-slate-400">
        <button className="flex items-center hover:text-blue-400 transition-colors">
          <ThumbsUp className="h-4 w-4 mr-1" />
          {post.reactions.length}
        </button>
        {user && !discussion.isLocked ? (
          <button 
            onClick={() => setReplyingTo(post)}
            className="flex items-center hover:text-blue-400 transition-colors"
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </button>
        ) : discussion.isLocked ? (
          <span className="flex items-center text-slate-500 cursor-not-allowed">
            <Reply className="h-4 w-4 mr-1" />
            Reply (Locked)
          </span>
        ) : (
          <button 
            onClick={() => router.push('/auth/login')}
            className="flex items-center hover:text-blue-400 transition-colors"
            title="Sign in to reply"
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply (Sign in)
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-400">Loading discussion...</div>
        </div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Error: {error || 'Discussion not found'}</div>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Back Button and User Status */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.push('/community')}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Community
          </button>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Signed in as {user.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-slate-400">Not signed in</span>
                <span className="text-slate-500">•</span>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Discussion Header */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 text-xs rounded-full ${getCategoryColor(discussion.category)}`}>
                  {discussion.category}
                </span>
                {discussion.isPinned && (
                  <Star className="h-5 w-5 text-yellow-400" />
                )}
                {discussion.isLocked && (
                  <div className="text-red-400 text-sm">🔒 Locked</div>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">{discussion.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {discussion.author.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(discussion.createdAt)}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {discussion.views} views
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {discussion.replies} replies
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="h-5 w-5 text-slate-400" />
              </button>
              <button 
                onClick={handleBookmark}
                className={`p-2 hover:bg-slate-700 rounded-lg transition-colors ${
                  isBookmarked ? 'text-blue-400' : ''
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="text-slate-300 whitespace-pre-wrap mb-4">
            {discussion.content}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {discussion.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <button 
                onClick={handleLike}
                className={`flex items-center transition-colors ${
                  isLiked ? 'text-blue-400' : 'text-slate-400 hover:text-blue-400'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likeCount}
              </button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {user && !discussion.isLocked ? (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {replyingTo ? 'Reply to Post' : 'Add Reply'}
            </h3>
            
            {replyingTo && (
              <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">Replying to:</div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Cancel Reply
                </button>
              </div>
            )}
            
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full h-32 px-4 py-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-400">
                {replyContent.length}/5000 characters
              </div>
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || submittingReply}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
              >
                {submittingReply ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Reply
                  </>
                )}
              </button>
            </div>
          </div>
        ) : discussion.isLocked ? (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-2">🔒 Discussion Locked</div>
              <div className="text-slate-400">This discussion has been locked and no longer accepts new replies.</div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
            <div className="text-center">
              <div className="text-slate-300 text-lg mb-4">
                <User className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                Join the Discussion
              </div>
              <div className="text-slate-400 mb-6">
                You must be signed in to participate in discussions and add replies.
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="px-6 py-2 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts/Replies */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Replies ({discussion.posts.length})
          </h3>
          
          {discussion.posts.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
              <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <div className="text-slate-400">No replies yet. Be the first to reply!</div>
            </div>
          ) : (
            discussion.posts.map((post) => renderPost(post))
          )}
        </div>
      </div>
    </div>
  );
}
