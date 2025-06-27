import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';

// Import the backend Research model
let Research: any;

async function getResearchModel() {
  if (!Research) {
    const { default: BackendResearch } = await import('../../../../../server/models/Research');
    Research = BackendResearch;
  }
  return Research;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const timeframe = searchParams.get('timeframe') || '30d'; // '7d', '30d', '90d', 'all'
  const type = searchParams.get('type') || 'all'; // 'keywords', 'categories', 'authors', 'all'

  try {
    await connectMongoose();
    const ResearchModel = await getResearchModel();

    // Calculate date filter based on timeframe
    let dateFilter: any = {};
    const now = new Date();
    
    switch (timeframe) {
      case '7d':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
        break;
      default:
        dateFilter = {}; // All time
    }

    let trendingData: any = {};

    if (type === 'all' || type === 'keywords') {
      // Get trending keywords
      const trendingKeywords = await ResearchModel.aggregate([
        {
          $match: {
            status: 'published',
            ...(Object.keys(dateFilter).length > 0 && { publicationDate: dateFilter })
          }
        },
        { $unwind: '$keywords' },
        {
          $group: {
            _id: '$keywords',
            count: { $sum: 1 },
            avgTrendingScore: { $avg: '$trendingScore' },
            avgCitationCount: { $avg: '$citationCount' },
            avgImpactScore: { $avg: '$metrics.impactScore' }
          }
        },
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ['$avgTrendingScore', 0.4] },
                { $multiply: ['$count', 0.3] },
                { $multiply: ['$avgCitationCount', 0.2] },
                { $multiply: ['$avgImpactScore', 0.1] }
              ]
            }
          }
        },
        { $sort: { trendingScore: -1 } },
        { $limit: limit },
        {
          $project: {
            keyword: '$_id',
            count: 1,
            trendingScore: 1,
            avgCitationCount: 1,
            avgImpactScore: 1,
            _id: 0
          }
        }
      ]);
      trendingData.keywords = trendingKeywords;
    }

    if (type === 'all' || type === 'categories') {
      // Get trending categories
      const trendingCategories = await ResearchModel.aggregate([
        {
          $match: {
            status: 'published',
            ...(Object.keys(dateFilter).length > 0 && { publicationDate: dateFilter })
          }
        },
        { $unwind: '$categories' },
        {
          $group: {
            _id: '$categories',
            count: { $sum: 1 },
            avgTrendingScore: { $avg: '$trendingScore' },
            avgCitationCount: { $avg: '$citationCount' },
            recentCount: {
              $sum: {
                $cond: [
                  { $gte: ['$publicationDate', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ['$avgTrendingScore', 0.3] },
                { $multiply: ['$count', 0.3] },
                { $multiply: ['$recentCount', 0.4] }
              ]
            }
          }
        },
        { $sort: { trendingScore: -1 } },
        { $limit: limit },
        {
          $project: {
            category: '$_id',
            count: 1,
            recentCount: 1,
            trendingScore: 1,
            _id: 0
          }
        }
      ]);
      trendingData.categories = trendingCategories;
    }

    if (type === 'all' || type === 'authors') {
      // Get trending authors
      const trendingAuthors = await ResearchModel.aggregate([
        {
          $match: {
            status: 'published',
            ...(Object.keys(dateFilter).length > 0 && { publicationDate: dateFilter })
          }
        },
        { $unwind: '$authors' },
        {
          $group: {
            _id: '$authors.name',
            affiliation: { $first: '$authors.affiliation' },
            publicationCount: { $sum: 1 },
            totalCitations: { $sum: '$citationCount' },
            avgImpactScore: { $avg: '$metrics.impactScore' },
            avgTrendingScore: { $avg: '$trendingScore' }
          }
        },
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ['$avgTrendingScore', 0.3] },
                { $multiply: ['$publicationCount', 0.3] },
                { $multiply: ['$totalCitations', 0.2] },
                { $multiply: ['$avgImpactScore', 0.2] }
              ]
            }
          }
        },
        { $sort: { trendingScore: -1 } },
        { $limit: limit },
        {
          $project: {
            name: '$_id',
            affiliation: 1,
            publicationCount: 1,
            totalCitations: 1,
            avgImpactScore: 1,
            trendingScore: 1,
            _id: 0
          }
        }
      ]);
      trendingData.authors = trendingAuthors;
    }

    // Get trending articles for context
    const trendingArticles = await ResearchModel.find({
      status: 'published',
      ...(Object.keys(dateFilter).length > 0 && { publicationDate: dateFilter })
    })
    .sort({ trendingScore: -1 })
    .limit(5)
    .select('title trendingScore citationCount viewCount categories')
    .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...trendingData,
        articles: trendingArticles.map(article => ({
          title: article.title,
          trendingScore: article.trendingScore,
          citationCount: article.citationCount,
          viewCount: article.viewCount,
          categories: article.categories
        }))
      },
      meta: {
        timeframe,
        limit,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Trending topics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get trending topics',
      data: {}
    }, { status: 500 });
  }
} 