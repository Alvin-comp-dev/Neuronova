import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Research schema
const researchSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  authors: [{ name: String, affiliation: String }],
  categories: [String],
  tags: [String],
  keywords: [String],
  source: {
    name: String,
    url: String,
    type: String
  },
  doi: String,
  publicationDate: Date,
  citationCount: Number,
  viewCount: Number,
  bookmarkCount: Number,
  trendingScore: Number,
  status: String,
  metrics: {
    impactScore: Number,
    readabilityScore: Number,
    noveltyScore: Number
  }
}, { timestamps: true });

let Research: any;
try {
  Research = mongoose.model('Research');
} catch {
  Research = mongoose.model('Research', researchSchema);
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'published';
    const sortBy = url.searchParams.get('sortBy') || 'date';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const categories = url.searchParams.get('categories')?.split(',').filter(Boolean);

    // Connect to MongoDB
    await connectMongoose();

    // Build query
    const query: any = { status };
    if (categories?.length) {
      query.categories = { $in: categories };
    }

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'citations':
        sortOptions = { citationCount: -1, publicationDate: -1 };
        break;
      case 'trending':
        sortOptions = { trendingScore: -1, publicationDate: -1 };
        break;
      case 'views':
        sortOptions = { viewCount: -1, publicationDate: -1 };
        break;
      default: // 'date'
        sortOptions = { publicationDate: -1 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [articles, total] = await Promise.all([
      Research.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Research.countDocuments(query)
    ]);

    // If no articles found, return mock data
    if (!articles.length) {
      const mockArticles = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms',
          abstract: 'Brain-computer interfaces (BCIs) hold tremendous promise for restoring motor function in paralyzed individuals. This study reports the development and clinical testing of a high-resolution BCI system that enables tetraplegic patients to control robotic arms with unprecedented precision.',
          authors: [
            { name: 'Prof. Elena Vasquez', affiliation: 'Stanford University' },
            { name: 'Dr. Marcus Johnson', affiliation: 'MIT' }
          ],
          categories: ['neuroscience', 'medical-devices'],
          keywords: ['brain-computer interface', 'paralysis', 'neural engineering'],
          source: { name: 'Nature Medicine', url: '', type: 'journal' },
          publicationDate: new Date('2024-02-12'),
          citationCount: 91,
          viewCount: 4500,
          bookmarkCount: 267,
          trendingScore: 98,
          status: 'published',
          metrics: {
            impactScore: 95,
            readabilityScore: 88,
            noveltyScore: 92
          }
        },
        {
          _id: '507f1f77bcf86cd799439012',
          title: "AI-Powered Drug Discovery Identifies Novel Alzheimer\u2019s Therapeutics",
          abstract: "This study presents a novel artificial intelligence platform that integrates multi-omics data, molecular dynamics simulations, and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer\u2019s disease.",
          authors: [
            { name: 'Dr. Jennifer Liu', affiliation: 'Stanford University' },
            { name: 'Prof. Alexander Petrov', affiliation: 'MIT' }
          ],
          categories: ['ai', 'healthcare'],
          keywords: ['artificial intelligence', 'drug discovery', "Alzheimer\u2019s"],
          source: { name: 'Science Translational Medicine', url: '', type: 'journal' },
          publicationDate: new Date('2024-01-28'),
          citationCount: 62,
          viewCount: 3200,
          bookmarkCount: 189,
          trendingScore: 87,
          status: 'published',
          metrics: {
            impactScore: 88,
            readabilityScore: 82,
            noveltyScore: 90
          }
        }
      ];

      return NextResponse.json({
        success: true,
        data: mockArticles,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalResults: mockArticles.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: skip + articles.length < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch research articles'
    }, { status: 500 });
  }
} 