import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToMongoDB, getUser, getResearch } from '@/lib/models';

// Mock users data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Dr. Sarah Chen', email: 'sarah.chen@neuronova.com' },
  { id: '3', name: 'Admin User', email: 'admin@neuronova.com' },
  { id: '4', name: 'Test User', email: 'ejialvtuke@gmail.com' },
];

// Mock likes storage
const mockLikes: Record<string, string[]> = {
  '1': [],
  '2': [],
  '3': [],
  '4': [],
};

// Mock article like counts
const mockArticleLikes: Record<string, number> = {};

// Verify JWT token
function verifyToken(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded.userId || decoded.id;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// GET - Check if user has liked specific articles
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const articleIds = searchParams.get('articleIds')?.split(',') || [];

    // Check if this is a mock user
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      const userLikes = mockLikes[userId] || [];
      const likeStatus = articleIds.reduce((acc: any, id: string) => {
        acc[id] = userLikes.includes(id);
        return acc;
      }, {});

      return NextResponse.json({
        success: true,
        data: {
          likes: likeStatus,
          totalLikes: userLikes.length
        }
      });
    }

    // Real user - connect to database
    await connectToMongoDB();
    const User = getUser();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userLikes = user.likes || [];
    const likeStatus = articleIds.reduce((acc: any, id: string) => {
      acc[id] = userLikes.includes(id);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        likes: likeStatus,
        totalLikes: userLikes.length
      }
    });

  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

// POST - Add or remove like
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
      if (!mockLikes[userId]) {
        mockLikes[userId] = [];
      }

      let message = '';
      let isLiked = false;
      let newLikeCount = mockArticleLikes[articleId] || 0;

      if (action === 'add') {
        // Check if already liked
        const isAlreadyLiked = mockLikes[userId].includes(articleId);
        if (!isAlreadyLiked) {
          mockLikes[userId].push(articleId);
          newLikeCount += 1;
          mockArticleLikes[articleId] = newLikeCount;
          
          message = 'Article liked successfully';
          isLiked = true;
        } else {
          message = 'Article already liked';
          isLiked = true;
        }
      } else if (action === 'remove') {
        // Remove like
        const index = mockLikes[userId].indexOf(articleId);
        if (index > -1) {
          mockLikes[userId].splice(index, 1);
          newLikeCount = Math.max(0, newLikeCount - 1);
          mockArticleLikes[articleId] = newLikeCount;
          
          message = 'Like removed successfully';
          isLiked = false;
        } else {
          message = 'Article was not liked';
          isLiked = false;
        }
      }

      return NextResponse.json({
        success: true,
        message,
        data: {
          isLiked,
          userLikesCount: mockLikes[userId].length,
          articleLikeCount: newLikeCount
        }
      });
    }

    // Real user - connect to database
    await connectToMongoDB();
    const User = getUser();
    const Research = getResearch();

    // Verify article exists
    const article = await Research.findById(articleId);
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize likes array if it doesn't exist
    if (!user.likes) {
      user.likes = [];
    }

    let message = '';
    let isLiked = false;
    let newLikeCount = article.likeCount || 0;

    if (action === 'add') {
      // Check if already liked
      const isAlreadyLiked = user.likes.includes(articleId);
      if (!isAlreadyLiked) {
        user.likes.push(articleId);
        newLikeCount += 1;
        
        // Update article like count
        await Research.findByIdAndUpdate(articleId, { 
          $inc: { likeCount: 1 } 
        });
        
        message = 'Article liked successfully';
        isLiked = true;
      } else {
        message = 'Article already liked';
        isLiked = true;
      }
    } else if (action === 'remove') {
      // Remove like
      const index = user.likes.indexOf(articleId);
      if (index > -1) {
        user.likes.splice(index, 1);
        newLikeCount = Math.max(0, newLikeCount - 1);
        
        // Update article like count
        await Research.findByIdAndUpdate(articleId, { 
          $inc: { likeCount: -1 } 
        });
        
        message = 'Like removed successfully';
        isLiked = false;
      } else {
        message = 'Article was not liked';
        isLiked = false;
      }
    }

    // Save user
    await User.findByIdAndUpdate(userId, { likes: user.likes });

    return NextResponse.json({
      success: true,
      message,
      data: {
        isLiked,
        userLikesCount: user.likes.length,
        articleLikeCount: newLikeCount
      }
    });

  } catch (error) {
    console.error('Error managing like:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to manage like' },
      { status: 500 }
    );
  }
} 