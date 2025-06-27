import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Discussion from '../../../../server/models/Discussion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'recent';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectToDatabase();

    let query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortQuery: any = {};
    switch (sort) {
      case 'popular':
        sortQuery = { likes: -1, replies: -1 };
        break;
      case 'replies':
        sortQuery = { replies: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'name profile')
      .sort(sortQuery)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      discussions: discussions.map(d => ({
        ...d,
        isLiked: false,
        isBookmarked: false,
      })),
    });

  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, category, tags } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const discussion = new Discussion({
      title: title.trim(),
      content: content.trim(),
      category: category || 'General Discussion',
      tags: tags || [],
      author: session.user.id,
      likes: 0,
      replies: 0,
      views: 0,
      isPinned: false,
    });

    await discussion.save();
    await discussion.populate('author', 'name profile');

    return NextResponse.json({
      success: true,
      discussion,
    });

  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
