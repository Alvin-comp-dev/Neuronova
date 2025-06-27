import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectMongoose } from '@/lib/mongodb';

// Mock activity data for demo purposes
const generateActivities = (limit: number, includeFollowing: boolean) => {
  const activities = [
    {
      _id: '674e5a1b2f8a9c0123456789',
      type: 'expert_join',
      user: {
        _id: '674e5a1b2f8a9c0123456701',
        name: 'Dr. Sarah Chen',
        profileImage: null,
        isVerifiedExpert: true
      },
      metadata: { 
        expertise: 'Neurotechnology',
        specialization: 'Brain-Computer Interfaces'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      isLive: true
    },
    {
      _id: '674e5a1b2f8a9c0123456788',
      type: 'discussion',
      user: {
        _id: '674e5a1b2f8a9c0123456702',
        name: 'Alex Martinez',
        profileImage: null,
        isVerifiedExpert: false
      },
      target: {
        _id: '674e5a1b2f8a9c0123456001',
        title: 'Novel Brain-Computer Interface Breakthrough in Paralysis Treatment',
        type: 'article'
      },
      metadata: { 
        discussionType: 'question',
        category: 'Neurotech'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456787',
      type: 'achievement',
      user: {
        _id: '674e5a1b2f8a9c0123456703',
        name: 'Jamie Wong',
        profileImage: null,
        isVerifiedExpert: false
      },
      metadata: { 
        achievementType: 'First Discussion',
        points: 10,
        level: 1
      },
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456786',
      type: 'bookmark',
      user: {
        _id: '674e5a1b2f8a9c0123456704',
        name: 'Dr. Michael Thompson',
        profileImage: null,
        isVerifiedExpert: true
      },
      target: {
        _id: '674e5a1b2f8a9c0123456002',
        title: 'CRISPR Gene Therapy Shows Promise for Neurodegenerative Diseases',
        type: 'article'
      },
      metadata: { 
        category: 'Gene Therapy',
        reason: 'clinical_relevance'
      },
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456785',
      type: 'publication',
      user: {
        _id: '674e5a1b2f8a9c0123456705',
        name: 'Dr. Lisa Park',
        profileImage: null,
        isVerifiedExpert: true
      },
      target: {
        _id: '674e5a1b2f8a9c0123456003',
        title: 'Machine Learning Accelerates Drug Discovery for Alzheimer\'s Disease',
        type: 'article'
      },
      metadata: { 
        journal: 'Nature Machine Intelligence',
        impactFactor: 8.5,
        category: 'AI in Healthcare'
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456784',
      type: 'like',
      user: {
        _id: '674e5a1b2f8a9c0123456706',
        name: 'Elena Rodriguez',
        profileImage: null,
        isVerifiedExpert: false
      },
      target: {
        _id: '674e5a1b2f8a9c0123456004',
        title: 'Breakthrough in Optogenetics for Vision Restoration',
        type: 'article'
      },
      metadata: { 
        reactionType: 'insightful',
        category: 'Biotech'
      },
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456783',
      type: 'follow',
      user: {
        _id: '674e5a1b2f8a9c0123456707',
        name: 'Dr. Kevin Zhang',
        profileImage: null,
        isVerifiedExpert: true
      },
      target: {
        _id: '674e5a1b2f8a9c0123456701',
        title: 'Dr. Sarah Chen',
        type: 'user'
      },
      metadata: { 
        followType: 'expert',
        sharedInterests: ['Neurotechnology', 'Brain Interfaces']
      },
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(), // 22 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456782',
      type: 'comment',
      user: {
        _id: '674e5a1b2f8a9c0123456708',
        name: 'Dr. Amanda Foster',
        profileImage: null,
        isVerifiedExpert: true
      },
      target: {
        _id: '674e5a1b2f8a9c0123456005',
        title: 'Innovative Biomarkers for Early Parkinson\'s Detection',
        type: 'article'
      },
      metadata: { 
        commentType: 'technical_question',
        engagement: 'high',
        category: 'Diagnostics'
      },
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456781',
      type: 'achievement',
      user: {
        _id: '674e5a1b2f8a9c0123456709',
        name: 'Marcus Johnson',
        profileImage: null,
        isVerifiedExpert: false
      },
      metadata: { 
        achievementType: 'Research Reader',
        points: 25,
        level: 2,
        milestone: 'Read 10 articles'
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      isLive: false
    },
    {
      _id: '674e5a1b2f8a9c0123456780',
      type: 'expert_join',
      user: {
        _id: '674e5a1b2f8a9c0123456710',
        name: 'Dr. Raj Patel',
        profileImage: null,
        isVerifiedExpert: true
      },
      metadata: { 
        expertise: 'Computational Biology',
        specialization: 'Protein Folding',
        institution: 'MIT'
      },
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
      isLive: false
    }
  ];

  // Filter activities based on user preferences
  let filteredActivities = activities;
  
  if (includeFollowing) {
    // In a real implementation, this would filter based on who the user follows
    // For demo, we'll include all activities
    filteredActivities = activities;
  }

  return filteredActivities.slice(0, limit);
};

export async function GET(request: Request) {
  try {
    // Connect to database
    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeFollowing = searchParams.get('includeFollowing') === 'true';
    const sinceTimestamp = searchParams.get('since');

    // Get user from token (optional)
    let user = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        user = decoded;
      } catch (error) {
        // Token invalid, continue without user context
        console.log('Invalid token for activity feed');
      }
    }

    // Generate activities (in real implementation, fetch from database)
    const activities = generateActivities(limit, includeFollowing);

    // Filter by timestamp if provided
    let filteredActivities = activities;
    if (sinceTimestamp) {
      const sinceDate = new Date(sinceTimestamp);
      filteredActivities = activities.filter(activity => 
        new Date(activity.timestamp) > sinceDate
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredActivities,
      meta: {
        total: filteredActivities.length,
        limit,
        hasMore: activities.length >= limit,
        includeFollowing,
        userAuthenticated: !!user,
        lastUpdate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Activity API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch activities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for creating new activities (for real-time updates)
export async function POST(request: Request) {
  try {
    await connectMongoose();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    let user;
    try {
      const token = authHeader.substring(7);
      user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, targetId, targetType, metadata = {} } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Activity type is required' },
        { status: 400 }
      );
    }

    // Create activity object
    const activity = {
      _id: new Date().getTime().toString(), // Simple ID generation for demo
      type,
      user: {
        _id: user.userId,
        name: user.name || 'Unknown User',
        profileImage: user.profileImage || null,
        isVerifiedExpert: user.isVerifiedExpert || false
      },
      target: targetId ? {
        _id: targetId,
        title: metadata.targetTitle || 'Unknown Target',
        type: targetType || 'article'
      } : undefined,
      metadata,
      timestamp: new Date().toISOString(),
      isLive: true
    };

    // In a real implementation, save to database and emit to WebSocket
    console.log('New activity created:', activity);

    return NextResponse.json({
      success: true,
      data: activity,
      message: 'Activity created successfully'
    });

  } catch (error) {
    console.error('Create Activity Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create activity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 