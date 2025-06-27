import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Import models
import Discussion from '../../../../../server/models/Discussion';
import UserProfile from '../../../../../server/models/UserProfile';

// Import shared mock storage
import { getMockPosts } from '../../../../lib/mockDiscussionStorage';

// Helper function to get all posts for a discussion (default + stored)
function getAllPostsForDiscussion(discussionId: string) {
  const defaultPosts = [
    {
      _id: `post-${discussionId.slice(-4)}-1`,
      content: "Great topic! I've been researching similar neural pathways in my lab.",
      author: {
        _id: 'mock-author-2',
        name: 'Dr. James Chen',
        email: 'james.chen@neurouniversity.edu',
        profile: {
          avatar: '/api/placeholder/40/40',
          title: 'Research Fellow',
          affiliation: 'NeuroUniversity Research Center'
        }
      },
      parentId: null,
      reactions: [],
      createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      isEdited: false,
      isDeleted: false,
      moderationStatus: 'approved'
    },
    {
      _id: `post-${discussionId.slice(-4)}-2`,
      content: "Could you share more details about your experimental methodology?",
      author: {
        _id: 'mock-author-3',
        name: 'Dr. Maria Rodriguez',
        email: 'maria.rodriguez@neurouniversity.edu',
        profile: {
          avatar: '/api/placeholder/40/40',
          title: 'Professor of Neuroscience',
          affiliation: 'NeuroUniversity Research Center'
        }
      },
      parentId: null,
      reactions: [],
      createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000).toISOString(),
      isEdited: false,
      isDeleted: false,
      moderationStatus: 'approved'
    }
  ];

  // Add stored posts for this discussion
  const storedPosts = getMockPosts(discussionId);
  
  // Combine and sort by creation date
  return [...defaultPosts, ...storedPosts].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

// Database connection
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova');
      console.log('✅ Connected to MongoDB for discussion API');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
}

// Authentication middleware (optional for GET)
function authenticateUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024') as any;
    // Handle both 'id' and 'userId' formats for compatibility
    return decoded.userId || decoded.id;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// GET /api/discussions/[id] - Get individual discussion with posts
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const discussionId = resolvedParams.id;
    const userId = authenticateUser(request);

    // For development, create mock data for simple numeric IDs
    if (!mongoose.Types.ObjectId.isValid(discussionId)) {
      // Return mock discussion data for development
      const mockDiscussion = {
        _id: discussionId,
        title: `Mock Discussion ${discussionId}`,
        content: `This is a mock discussion for development purposes. Discussion ID: ${discussionId}

**Sample Content:**
This discussion demonstrates the full functionality of our community platform. Users can engage in meaningful conversations about neuroscience research, share insights, and collaborate on various topics.

Feel free to explore the discussion features including:
- Viewing replies and nested comments
- Adding your own thoughts and responses
- Bookmarking interesting discussions
- Following expert contributors

This is mock content that will be replaced with real database content once the discussion system is fully integrated.`,
        category: 'general',
        author: {
          _id: 'mock-author-id',
          name: 'Dr. Sarah Mitchell',
          email: 'sarah.mitchell@neurouniversity.edu',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'Senior Neuroscientist',
            affiliation: 'NeuroUniversity Research Center'
          }
        },
        tags: ['development', 'community', 'neuroscience'],
        views: Math.floor(Math.random() * 100) + 10,
        likes: Math.floor(Math.random() * 20) + 1,
        replies: Math.floor(Math.random() * 15) + 1,
        isBookmarked: false,
        isPinned: false,
        isLiked: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        moderationStatus: 'approved' as const,
        posts: getAllPostsForDiscussion(discussionId)
      };

      console.log(`✅ Serving mock discussion: ${mockDiscussion.title}`);

      return NextResponse.json({
        success: true,
        data: mockDiscussion
      });
    }

    // Find the discussion with populated data
    const discussion = await Discussion.findById(discussionId)
      .populate('author', 'name email profile.avatar profile.title profile.affiliation')
      .populate('posts.author', 'name email profile.avatar profile.title profile.affiliation')
      .lean();

    if (!discussion) {
      // If discussion not found in database, return mock data for development
      const mockDiscussion = {
        _id: discussionId,
        title: `Mock Discussion ${discussionId.slice(-4)}`,
        content: `This is a mock discussion for development purposes. Discussion ID: ${discussionId}\n\n**Sample Content:**\nThis discussion demonstrates the full functionality of our community platform. Users can engage in meaningful conversations about neuroscience research, share insights, and collaborate on various topics.\n\nFeel free to explore the discussion features including:\n- Viewing replies and nested comments\n- Adding your own thoughts and responses\n- Bookmarking interesting discussions\n- Following expert contributors\n\nThis is mock content that will be replaced with real database content once the discussion system is fully integrated.`,
        category: 'general',
        author: {
          _id: 'mock-author-id',
          name: 'Dr. Sarah Mitchell',
          email: 'sarah.mitchell@neurouniversity.edu',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'Senior Neuroscientist',
            affiliation: 'NeuroUniversity Research Center'
          }
        },
        tags: ['development', 'community', 'neuroscience'],
        views: Math.floor(Math.random() * 150) + 50,
        likes: Math.floor(Math.random() * 25) + 5,
        replies: Math.floor(Math.random() * 20) + 3,
        isBookmarked: false,
        isPinned: false,
        isLiked: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        moderationStatus: 'approved',
        posts: getAllPostsForDiscussion(discussionId)
      };

      console.log(`✅ Serving mock discussion for ObjectId: ${discussionId.slice(-8)}`);

      return NextResponse.json({
        success: true,
        data: mockDiscussion
      });
    }

    // Increment view count
    await Discussion.findByIdAndUpdate(discussionId, { $inc: { views: 1 } });

    // Filter out deleted posts for non-moderators
    const filteredPosts = discussion.posts.filter(post => !post.isDeleted);

    // Check if user has liked/bookmarked this discussion
    let userInteractions = {
      isLiked: false,
      isBookmarked: false
    };

    if (userId) {
      // Check user interactions (you can expand this based on your UserProfile schema)
      const userProfile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (userProfile) {
        userInteractions.isLiked = userProfile.likedDiscussions?.includes(discussionId) || false;
        userInteractions.isBookmarked = userProfile.bookmarkedDiscussions?.includes(discussionId) || false;
      }
    }

    const responseData = {
      ...discussion,
      posts: filteredPosts,
      ...userInteractions,
      views: discussion.views + 1 // Include the incremented view count
    };

    console.log(`✅ Fetched discussion: ${discussion.title}`);

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ Error fetching discussion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussion' },
      { status: 500 }
    );
  }
}

// PUT /api/discussions/[id] - Update discussion (author only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const userId = authenticateUser(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const discussionId = resolvedParams.id;
    const body = await request.json();
    const { title, content, category, tags } = body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(discussionId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid discussion ID' },
        { status: 400 }
      );
    }

    // Find the discussion
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (discussion.author.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'Only the author can edit this discussion' },
        { status: 403 }
      );
    }

    // Update discussion
    const updates: any = {};
    if (title && title.trim()) updates.title = title.trim();
    if (content && content.trim()) updates.content = content.trim();
    if (category) updates.category = category;
    if (tags) updates.tags = tags;
    updates.updatedAt = new Date();

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      discussionId,
      updates,
      { new: true }
    ).populate('author', 'name email profile.avatar profile.title profile.affiliation');

    console.log(`✅ Updated discussion: ${updatedDiscussion.title}`);

    return NextResponse.json({
      success: true,
      data: updatedDiscussion
    });

  } catch (error) {
    console.error('❌ Error updating discussion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update discussion' },
      { status: 500 }
    );
  }
}

// DELETE /api/discussions/[id] - Delete discussion (author only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const userId = authenticateUser(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(discussionId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid discussion ID' },
        { status: 400 }
      );
    }

    // Find the discussion
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (discussion.author.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'Only the author can delete this discussion' },
        { status: 403 }
      );
    }

    // Delete the discussion
    await Discussion.findByIdAndDelete(discussionId);

    console.log(`✅ Deleted discussion: ${discussion.title}`);

    return NextResponse.json({
      success: true,
      message: 'Discussion deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting discussion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete discussion' },
      { status: 500 }
    );
  }
} 