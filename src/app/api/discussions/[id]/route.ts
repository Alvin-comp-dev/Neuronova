import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to generate mock discussion data
function generateMockDiscussion(discussionId: string) {
  const mockPosts = [
    {
      _id: `post-${discussionId.slice(-4)}-1`,
      content: "Great topic! I've been researching similar neural pathways in my lab. The methodology you described aligns well with current best practices in the field.",
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
      content: "Could you share more details about your experimental methodology? I'm particularly interested in the statistical analysis approach you used.",
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
    },
    {
      _id: `post-${discussionId.slice(-4)}-3`,
      content: "This research has significant implications for clinical applications. Have you considered the potential therapeutic applications?",
      author: {
        _id: 'mock-author-4',
        name: 'Dr. Alex Thompson',
        email: 'alex.thompson@neurouniversity.edu',
        profile: {
          avatar: '/api/placeholder/40/40',
          title: 'Clinical Researcher',
          affiliation: 'NeuroUniversity Medical Center'
        }
      },
      parentId: null,
      reactions: [],
      createdAt: new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      isEdited: false,
      isDeleted: false,
      moderationStatus: 'approved'
    }
  ];

  return {
    _id: discussionId,
    title: `Research Discussion: ${discussionId.slice(-8)}`,
    content: `This is an active discussion about cutting-edge neuroscience research. The community is exploring various aspects of the methodology, results, and implications of recent findings.

**Discussion Topics:**
- Experimental design and methodology
- Statistical analysis approaches
- Clinical applications and therapeutic potential
- Future research directions
- Collaborative opportunities

This discussion demonstrates the collaborative nature of our research community, where experts from various institutions share insights and build upon each other's work.

Feel free to join the conversation by sharing your thoughts, asking questions, or providing additional insights based on your research experience.`,
    category: 'general',
    author: {
      _id: 'mock-author-1',
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@neurouniversity.edu',
      profile: {
        avatar: '/api/placeholder/40/40',
        title: 'Senior Neuroscientist',
        affiliation: 'NeuroUniversity Research Center'
      }
    },
    tags: ['neuroscience', 'research', 'methodology', 'collaboration'],
    views: Math.floor(Math.random() * 200) + 50,
    likes: Math.floor(Math.random() * 30) + 5,
    replies: mockPosts.length,
    isBookmarked: false,
    isPinned: false,
    isLiked: false,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    moderationStatus: 'approved' as const,
    posts: mockPosts
  };
}

// GET /api/discussions/[id] - Get individual discussion with posts
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    // Try to fetch from backend first
    try {
      const backendUrl = `${BACKEND_URL}/api/discussions/${discussionId}`;
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') && {
            'Authorization': request.headers.get('authorization')!
          })
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log('Backend discussion API not available, using mock data:', backendError);
    }

    // Fallback to mock data for development
    const mockDiscussion = generateMockDiscussion(discussionId);

    console.log(`✅ Serving mock discussion: ${mockDiscussion.title}`);

    return NextResponse.json({
      success: true,
      data: mockDiscussion
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
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;
    const body = await request.json();

    // Try to forward to backend
    try {
      const backendUrl = `${BACKEND_URL}/api/discussions/${discussionId}`;
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') && {
            'Authorization': request.headers.get('authorization')!
          })
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }

      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    } catch (backendError) {
      console.log('Backend discussion update not available:', backendError);
    }

    // Mock response for development
    return NextResponse.json({
      success: false,
      error: 'Discussion update not available in development mode'
    }, { status: 501 });

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
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    // Try to forward to backend
    try {
      const backendUrl = `${BACKEND_URL}/api/discussions/${discussionId}`;
      const response = await fetch(backendUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') && {
            'Authorization': request.headers.get('authorization')!
          })
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }

      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    } catch (backendError) {
      console.log('Backend discussion delete not available:', backendError);
    }

    // Mock response for development
    return NextResponse.json({
      success: false,
      error: 'Discussion deletion not available in development mode'
    }, { status: 501 });

  } catch (error) {
    console.error('❌ Error deleting discussion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete discussion' },
      { status: 500 }
    );
  }
} 