import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';
import { ResearchModel } from '@/lib/models/Research';
import jwt from 'jsonwebtoken';

// Mock users data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Dr. Sarah Chen', email: 'sarah.chen@neuronova.com' },
  { id: '3', name: 'Admin User', email: 'admin@neuronova.com' },
  { id: '4', name: 'Test User', email: 'ejialvtuke@gmail.com' },
];

// Mock bookmark storage
const mockBookmarks: Record<string, string[]> = {
  '1': [],
  '2': [],
  '3': [],
  '4': [],
};

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded.id || decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET - Fetch user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if this is a mock user
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      const userBookmarks = mockBookmarks[userId] || [];
      return NextResponse.json({
        success: true,
        data: {
          bookmarks: userBookmarks,
          count: userBookmarks.length
        }
      });
    }

    // Real user - connect to database
    await connectMongoose();

    // Get user with bookmarks
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get bookmarked articles
    const bookmarks = [];
    if (user.bookmarks && user.bookmarks.length > 0) {
      for (const bookmarkId of user.bookmarks) {
        const article = await ResearchModel.findById(bookmarkId.toString());
        if (article) {
          bookmarks.push(article);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        bookmarks,
        count: bookmarks.length
      }
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

// POST - Add or remove bookmark
export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { articleId, action } = await request.json();

    if (!articleId || !action || !['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if this is a mock user
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      if (!mockBookmarks[userId]) {
        mockBookmarks[userId] = [];
      }

      let message = '';
      let isBookmarked = false;

      if (action === 'add') {
        // Check if already bookmarked
        const isAlreadyBookmarked = mockBookmarks[userId].includes(articleId);
        if (!isAlreadyBookmarked) {
          mockBookmarks[userId].push(articleId);
          message = 'Article bookmarked successfully';
          isBookmarked = true;
        } else {
          message = 'Article already bookmarked';
          isBookmarked = true;
        }
      } else if (action === 'remove') {
        // Remove bookmark
        const index = mockBookmarks[userId].indexOf(articleId);
        if (index > -1) {
          mockBookmarks[userId].splice(index, 1);
          message = 'Bookmark removed successfully';
          isBookmarked = false;
        } else {
          message = 'Article was not bookmarked';
          isBookmarked = false;
        }
      }

      return NextResponse.json({
        success: true,
        message,
        data: {
          isBookmarked,
          bookmarkCount: mockBookmarks[userId].length,
          articleBookmarkCount: 0 // Mock data
        }
      });
    }

    // Real user - connect to database
    await connectMongoose();

    // Verify article exists
    const article = await ResearchModel.findById(articleId);
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize bookmarks array if it doesn't exist
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    let message = '';
    let isBookmarked = false;

    if (action === 'add') {
      // Check if already bookmarked
      const isAlreadyBookmarked = user.bookmarks.some(id => id.toString() === articleId);
      if (!isAlreadyBookmarked) {
        user.bookmarks.push(articleId);
        
        // Update article bookmark count
        await ResearchModel.incrementBookmark(articleId);
        
        message = 'Article bookmarked successfully';
        isBookmarked = true;
      } else {
        message = 'Article already bookmarked';
        isBookmarked = true;
      }
    } else if (action === 'remove') {
      // Remove bookmark
      const index = user.bookmarks.findIndex(id => id.toString() === articleId);
      if (index > -1) {
        user.bookmarks.splice(index, 1);
        
        // Decrement bookmark count (we'll need to add this method)
        // await ResearchModel.decrementBookmark(articleId);
        
        message = 'Bookmark removed successfully';
        isBookmarked = false;
      } else {
        message = 'Article was not bookmarked';
        isBookmarked = false;
      }
    }

    // Save user
    await UserModel.update(userId, { bookmarks: user.bookmarks });

    return NextResponse.json({
      success: true,
      message,
      data: {
        isBookmarked,
        bookmarkCount: user.bookmarks.length,
        articleBookmarkCount: article.bookmarkCount || 0
      }
    });

  } catch (error) {
    console.error('Error managing bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to manage bookmark' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all bookmarks
export async function DELETE(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectMongoose();

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Clear bookmarks
    const bookmarkCount = user.bookmarks?.length || 0;
    await UserModel.update(userId, { bookmarks: [] });

    return NextResponse.json({
      success: true,
      message: `Cleared ${bookmarkCount} bookmarks`,
      data: {
        clearedCount: bookmarkCount
      }
    });

  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear bookmarks' },
      { status: 500 }
    );
  }
} 