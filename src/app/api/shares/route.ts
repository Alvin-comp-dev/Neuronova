import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToMongoDB, getResearch, getShare } from '@/lib/models';

// Verify JWT token (optional for shares)
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
    return null;
  }
}

// GET - Get share statistics for an article
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    const Research = getResearch();
    const Share = getShare();

    // Get article share count
    const article = await Research.findById(articleId);
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get share breakdown by type
    const shareBreakdown = await Share.aggregate([
      { $match: { articleId } },
      { $group: { _id: '$shareType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalShares = shareBreakdown.reduce((sum, item) => sum + item.count, 0);

    return NextResponse.json({
      success: true,
      data: {
        articleId,
        totalShares,
        shareBreakdown: shareBreakdown.reduce((acc: any, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        articleShareCount: article.shareCount || 0
      }
    });

  } catch (error) {
    console.error('Error fetching share stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch share statistics' },
      { status: 500 }
    );
  }
}

// POST - Record a share and generate share content
export async function POST(request: NextRequest) {
  try {
    const { articleId, shareType, platform } = await request.json();

    if (!articleId || !shareType) {
      return NextResponse.json(
        { success: false, error: 'Article ID and share type are required' },
        { status: 400 }
      );
    }

    const validShareTypes = ['link', 'email', 'twitter', 'linkedin', 'facebook', 'whatsapp'];
    if (!validShareTypes.includes(shareType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid share type' },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    const Research = getResearch();
    const Share = getShare();

    // Verify article exists
    const article = await Research.findById(articleId);
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get user ID if authenticated
    const userId = verifyToken(request);

    // Record the share
    const shareRecord = new Share({
      articleId,
      userId,
      shareType,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    });

    await shareRecord.save();

    // Update article share count
    await Research.findByIdAndUpdate(articleId, { 
      $inc: { shareCount: 1 } 
    });

    // Generate share content based on platform
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const articleUrl = `${baseUrl}/research/${articleId}`;
    const title = article.title;
    const description = article.abstract.substring(0, 150) + '...';
    
    let shareUrl = '';
    let shareContent = {
      url: articleUrl,
      title,
      description,
      shareUrl: ''
    };

    switch (shareType) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}&hashtags=neuronova,research`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${articleUrl}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Research: ${title}`)}&body=${encodeURIComponent(`Check out this research: ${title}\n\n${description}\n\nRead more: ${articleUrl}`)}`;
        break;
      case 'link':
      default:
        shareUrl = articleUrl;
        break;
    }

    shareContent.shareUrl = shareUrl;

    return NextResponse.json({
      success: true,
      message: 'Share recorded successfully',
      data: {
        ...shareContent,
        newShareCount: (article.shareCount || 0) + 1,
        shareType
      }
    });

  } catch (error) {
    console.error('Error recording share:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record share' },
      { status: 500 }
    );
  }
} 