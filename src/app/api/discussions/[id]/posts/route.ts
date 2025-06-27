import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Import models
import Discussion from '../../../../../../server/models/Discussion';
import UserProfile from '../../../../../../server/models/UserProfile';

// Import shared mock storage
import { addMockPost, getMockPosts } from '../../../../../lib/mockDiscussionStorage';

// Database connection
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova');
      console.log('✅ Connected to MongoDB for posts API');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
}

// Authentication middleware
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

// POST /api/discussions/[id]/posts - Add a new post/reply to discussion
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { content, parentId } = body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Content too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Find the discussion
    let discussion;
    try {
      discussion = await Discussion.findById(discussionId);
    } catch (error) {
      console.log('Discussion not found in database, checking for mock discussion:', discussionId);
    }
    
    // If discussion not found in database, handle as mock discussion
    if (!discussion) {
      // Handle mock discussions - for development purposes
      console.log('✅ Processing reply for mock discussion:', discussionId);
      
      // Create new mock post
      const newMockPost = {
        _id: `mock-post-${Date.now()}`,
        content: content.trim(),
        author: {
          _id: userId,
          name: 'Test User',
          email: 'ejialvtuke@gmail.com',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'Community Member',
            affiliation: 'NeuroNova Platform'
          }
        },
        parentId: parentId || null,
        reactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        isDeleted: false,
        moderationStatus: 'approved'
      };

      // Store the post in shared memory
      addMockPost(discussionId, newMockPost);
      
      return NextResponse.json({
        success: true,
        message: 'Reply added to mock discussion successfully',
        data: {
          post: newMockPost,
          mockDiscussion: true
        }
      });
    }

    // Check if discussion is locked
    if (discussion.isLocked) {
      return NextResponse.json(
        { success: false, error: 'Discussion is locked' },
        { status: 403 }
      );
    }

    // Validate parentId if provided (for replies)
    if (parentId) {
      const parentPost = discussion.posts.find(post => 
        post._id.toString() === parentId && !post.isDeleted
      );
      if (!parentPost) {
        return NextResponse.json(
          { success: false, error: 'Parent post not found' },
          { status: 400 }
        );
      }
    }

    // Create new post
    const newPost = {
      _id: new mongoose.Types.ObjectId(),
      content: content.trim(),
      author: new mongoose.Types.ObjectId(userId),
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : undefined,
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      moderationStatus: 'approved' as const
    };

    // Add post to discussion
    discussion.posts.push(newPost);
    await discussion.save();

    // Update user profile stats
    await UserProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { 
        $inc: { 'activityStats.postsCount': 1 },
        $set: { 'activityStats.lastActiveDate': new Date() }
      },
      { upsert: true }
    );

    // Check for achievements (first post)
    const userProfile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (userProfile && userProfile.activityStats.postsCount === 1) {
      userProfile.addAchievement({
        type: 'first_post',
        title: 'First Post',
        description: 'Made your first post in a discussion',
        icon: '💬',
        level: 'bronze'
      });
      await userProfile.save();
    }

    // Populate and return the updated discussion
    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate('author', 'name email')
      .populate('posts.author', 'name email');

    console.log(`✅ Added new post to discussion: ${discussion.title}`);

    return NextResponse.json({
      success: true,
      data: {
        discussion: updatedDiscussion,
        newPost: newPost
      }
    });

  } catch (error) {
    console.error('❌ Error adding post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add post' },
      { status: 500 }
    );
  }
}

// PUT /api/discussions/[id]/posts - Update a post (edit content)
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
    const { postId, content } = body;

    // Validate required fields
    if (!postId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post ID and content are required' },
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

    // Find the post
    const post = discussion.posts.find(p => p._id.toString() === postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own posts' },
        { status: 403 }
      );
    }

    // Check if post is too old to edit (24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (post.createdAt < dayAgo) {
      return NextResponse.json(
        { success: false, error: 'Posts can only be edited within 24 hours' },
        { status: 403 }
      );
    }

    // Update the post
    post.content = content.trim();
    post.updatedAt = new Date();
    post.isEdited = true;

    await discussion.save();

    console.log(`✅ Updated post in discussion: ${discussion.title}`);

    return NextResponse.json({
      success: true,
      data: { post }
    });

  } catch (error) {
    console.error('❌ Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/discussions/[id]/posts - Delete a post
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
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
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

    // Find the post
    const post = discussion.posts.find(p => p._id.toString() === postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check permissions (author or moderator)
    const userProfile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    const isAuthor = post.author.toString() === userId;
    const isModerator = userProfile?.isVerifiedExpert || discussion.moderators.includes(new mongoose.Types.ObjectId(userId));

    if (!isAuthor && !isModerator) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Soft delete the post
    post.isDeleted = true;
    post.deletedAt = new Date();

    await discussion.save();

    // Update user profile stats
    await UserProfile.findOneAndUpdate(
      { userId: post.author },
      { $inc: { 'activityStats.postsCount': -1 } }
    );

    console.log(`✅ Deleted post from discussion: ${discussion.title}`);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 