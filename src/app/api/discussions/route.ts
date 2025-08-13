import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Try to fetch from backend first
    try {
      const backendUrl = `${BACKEND_URL}/api/discussions?${searchParams.toString()}`;
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
      console.log('Backend discussions API not available, using mock data:', backendError);
    }

    // Fallback to mock data for development
    const mockDiscussions = [
      {
        _id: '6759e1a123456789',
        title: 'Neural Interface Breakthrough: New Findings',
        content: 'Recent research has shown promising results in brain-computer interface technology...',
        category: 'neuroscience',
        author: {
          _id: 'mock-author-1',
          name: 'Dr. Sarah Mitchell',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'Senior Neuroscientist',
            affiliation: 'NeuroUniversity Research Center'
          }
        },
        tags: ['neuroscience', 'BCI', 'research'],
        likes: 24,
        replies: 8,
        views: 156,
        isPinned: false,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '6759e1b987654321',
        title: 'CRISPR Applications in Neurological Disorders',
        content: 'Exploring the potential of gene editing technology in treating neurological conditions...',
        category: 'gene-therapy',
        author: {
          _id: 'mock-author-2',
          name: 'Prof. Michael Rodriguez',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'Gene Therapy Expert',
            affiliation: 'Johns Hopkins University'
          }
        },
        tags: ['CRISPR', 'gene-therapy', 'neurology'],
        likes: 18,
        replies: 12,
        views: 203,
        isPinned: true,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '6759e1c456789012',
        title: 'AI-Powered Drug Discovery: Latest Developments',
        content: 'Machine learning algorithms are revolutionizing pharmaceutical research...',
        category: 'ai-research',
        author: {
          _id: 'mock-author-3',
          name: 'Dr. Lisa Wang',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'AI Healthcare Lead',
            affiliation: 'Google DeepMind'
          }
        },
        tags: ['AI', 'drug-discovery', 'machine-learning'],
        likes: 31,
        replies: 15,
        views: 287,
        isPinned: false,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      discussions: mockDiscussions
    });

  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to forward to backend
    try {
      const backendUrl = `${BACKEND_URL}/api/discussions`;
      const response = await fetch(backendUrl, {
        method: 'POST',
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
      console.log('Backend discussion creation not available:', backendError);
    }

    // Mock response for development
    return NextResponse.json({
      success: false,
      error: 'Discussion creation not available in development mode'
    }, { status: 501 });

  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
