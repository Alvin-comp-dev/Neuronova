'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Heart, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked?: boolean;
  initialCount?: number;
  variant?: 'default' | 'compact' | 'heart';
  showCount?: boolean;
  onBookmarkChange?: (isBookmarked: boolean, count: number) => void;
}

export default function BookmarkButton({
  articleId,
  initialBookmarked = false,
  initialCount = 0,
  variant = 'default',
  showCount = true,
  onBookmarkChange
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { user, token } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Load bookmark status on mount
  useEffect(() => {
    if (isAuthenticated && articleId) {
      checkBookmarkStatus();
    }
  }, [articleId, isAuthenticated]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const bookmarked = data.data.bookmarks.some((bookmark: any) => 
            bookmark._id === articleId
          );
          setIsBookmarked(bookmarked);
        }
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      // Show login prompt or redirect
      alert('Please log in to bookmark articles');
      return;
    }

    if (loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      const action = isBookmarked ? 'remove' : 'add';
      
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId,
          action
        })
      });

      const data = await response.json();

      if (data.success) {
        const newBookmarked = data.data.isBookmarked;
        const newCount = data.data.articleBookmarkCount;
        
        setIsBookmarked(newBookmarked);
        setBookmarkCount(newCount);
        
        // Callback for parent component
        onBookmarkChange?.(newBookmarked, newCount);

        // Show success feedback
        if (newBookmarked) {
          showToast('Article bookmarked!', 'success');
        } else {
          showToast('Bookmark removed', 'info');
        }
      } else {
        showToast(data.error || 'Failed to update bookmark', 'error');
      }
    } catch (error) {
      console.error('Error managing bookmark:', error);
      showToast('Failed to update bookmark', 'error');
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    // Simple toast notification - you can replace with your preferred toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-green-600' : 
      type === 'error' ? 'bg-red-600' : 'bg-blue-600'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const getIcon = () => {
    if (loading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    if (variant === 'heart') {
      return isBookmarked ? 
        <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : 
        <Heart className="h-4 w-4" />;
    }

    return isBookmarked ? 
      <BookmarkCheck className="h-4 w-4 fill-blue-500 text-blue-500" /> : 
      <Bookmark className="h-4 w-4" />;
  };

  const getButtonClasses = () => {
    const baseClasses = "flex items-center space-x-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800";
    
    if (variant === 'compact') {
      return `${baseClasses} p-1 rounded hover:bg-slate-700 ${
        isBookmarked ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
      } ${animating ? 'scale-110' : ''}`;
    }

    if (variant === 'heart') {
      return `${baseClasses} p-2 rounded-full hover:bg-slate-700 ${
        isBookmarked ? 'text-red-400' : 'text-slate-400 hover:text-slate-300'
      } ${animating ? 'scale-110' : ''}`;
    }

    return `${baseClasses} px-3 py-2 rounded-lg border transition-colors ${
      isBookmarked 
        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
        : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600 hover:border-slate-500'
    } ${animating ? 'scale-105' : ''}`;
  };

  const getButtonText = () => {
    if (variant === 'compact' || variant === 'heart') {
      return null;
    }

    if (loading) {
      return isBookmarked ? 'Removing...' : 'Bookmarking...';
    }

    return isBookmarked ? 'Bookmarked' : 'Bookmark';
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading || !isAuthenticated}
      className={getButtonClasses()}
      title={
        !isAuthenticated ? 'Login to bookmark' :
        isBookmarked ? 'Remove bookmark' : 'Add bookmark'
      }
    >
      {getIcon()}
      
      {getButtonText() && (
        <span className="text-sm font-medium">
          {getButtonText()}
        </span>
      )}
      
      {showCount && bookmarkCount > 0 && (
        <span className={`text-xs ${
          variant === 'compact' ? 'text-slate-400' : 
          isBookmarked ? 'text-blue-200' : 'text-slate-400'
        }`}>
          {bookmarkCount}
        </span>
      )}
    </button>
  );
} 