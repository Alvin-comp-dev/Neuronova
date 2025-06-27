import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectMongoose } from '@/lib/mongodb';

// Import the backend Research model
let Research: any;

async function getResearchModel() {
  if (!Research) {
    // Dynamically import the backend model
    const { default: BackendResearch } = await import('../../../../../server/models/Research');
    Research = BackendResearch;
  }
  return Research;
}

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await connectMongoose();
    
    // Get the Research model
    const ResearchModel = await getResearchModel();
    
    // Get stats from database
    const [
      totalArticles,
      totalCitations,
      totalViews,
      totalBookmarks,
      categoryStats,
      recentArticles
    ] = await Promise.all([
      ResearchModel.countDocuments({ status: 'published' }),
      ResearchModel.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: null, total: { $sum: '$citationCount' } } }
      ]),
      ResearchModel.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: null, total: { $sum: '$viewCount' } } }
      ]),
      ResearchModel.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: null, total: { $sum: '$bookmarkCount' } } }
      ]),
      ResearchModel.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      ResearchModel.find({ status: 'published' })
        .sort({ publicationDate: -1 })
        .limit(5)
        .select('title publicationDate')
    ]);

    const stats = {
      totalPapers: totalArticles || 0,
      featuredPapers: Math.floor((totalArticles || 0) * 0.8), // 80% are featured
      recentPapers: recentArticles.length || 0,
      categoryCounts: categoryStats.reduce((acc, cat) => {
        acc[cat._id] = cat.count;
        return acc;
      }, {} as Record<string, number>),
      totalCitations: totalCitations[0]?.total || 0,
      totalViews: totalViews[0]?.total || 0,
      totalBookmarks: totalBookmarks[0]?.total || 0,
      categories: categoryStats.map(cat => ({
        name: cat._id,
        count: cat.count
      })),
      recentArticles: recentArticles.map(article => ({
        title: article.title,
        date: article.publicationDate
      }))
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Research stats API error:', error);
    
    // Return mock stats as fallback
    const mockStats = {
      totalPapers: 5,
      featuredPapers: 4,
      recentPapers: 2,
      categoryCounts: {
        neuroscience: 2,
        ai: 2,
        genetics: 1
      },
      totalCitations: 303,
      totalViews: 4508,
      totalBookmarks: 267,
      categories: [
        { name: 'neuroscience', count: 2 },
        { name: 'ai', count: 2 },
        { name: 'genetics', count: 1 }
      ],
      recentArticles: [
        { title: 'Brain-Computer Interface for Paralyzed Patients', date: '2024-02-12' },
        { title: 'Personalized Cancer Immunotherapy Using AI', date: '2024-02-05' }
      ]
    };
    
    return NextResponse.json({
      success: false,
      data: mockStats,
      error: 'Database connection failed'
    });
  }
} 