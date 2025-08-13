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
          _id: '6861a3da375c3d7dfe433a5a',
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
          _id: '6861a3da375c3d7dfe433a5b',
          title: "Machine Learning Predicts Alzheimer's Disease 10 Years Before Symptoms",
          abstract: "This study presents a novel artificial intelligence platform that integrates multi-omics data, molecular dynamics simulations, and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer's disease.",
          authors: [
            { name: 'Dr. Linda Chen', affiliation: 'Johns Hopkins University' },
            { name: 'Prof. Robert Johnson', affiliation: 'Harvard Medical School' }
          ],
          categories: ['ai', 'healthcare'],
          keywords: ['artificial intelligence', 'machine learning', "Alzheimer's"],
          source: { name: 'Nature Medicine', url: '', type: 'journal' },
          publicationDate: new Date('2024-02-15'),
          citationCount: 85,
          viewCount: 3890,
          bookmarkCount: 189,
          trendingScore: 96,
          status: 'published',
          metrics: {
            impactScore: 88,
            readabilityScore: 82,
            noveltyScore: 90
          }
        },
        {
          _id: '6861a3da375c3d7dfe433a5c',
          title: 'Stem Cell Therapy Restores Vision in Macular Degeneration Patients',
          abstract: 'Age-related macular degeneration (AMD) is a leading cause of blindness in older adults. This phase II clinical trial evaluated the safety and efficacy of embryonic stem cell-derived retinal pigment epithelium (RPE) transplantation in patients with advanced dry AMD.',
          authors: [
            { name: 'Prof. Catherine Wong', affiliation: 'University of Pennsylvania' },
            { name: 'Dr. Ahmed Hassan', affiliation: 'Broad Institute' }
          ],
          categories: ['biotechnology', 'medicine'],
          keywords: ['stem cell therapy', 'macular degeneration', 'vision restoration'],
          source: { name: 'The Lancet', url: '', type: 'journal' },
          publicationDate: new Date('2024-01-30'),
          citationCount: 67,
          viewCount: 4210,
          bookmarkCount: 156,
          trendingScore: 93,
          status: 'published',
          metrics: {
            impactScore: 92,
            readabilityScore: 75,
            noveltyScore: 96
          }
        },
        {
          _id: '6861a3da375c3d7dfe433a5d',
          title: 'Personalized Medicine Approach to Cancer Immunotherapy',
          abstract: 'Cancer immunotherapy has revolutionized treatment outcomes for many patients, but response rates vary significantly across individuals. This study presents a comprehensive personalized medicine framework that combines genomic profiling, immune phenotyping, and AI-driven prediction models to optimize immunotherapy selection.',
          authors: [
            { name: 'Dr. Kevin Zhang', affiliation: 'MIT' },
            { name: 'Prof. Isabella Rodriguez', affiliation: 'Stanford University' }
          ],
          categories: ['biotechnology', 'medicine'],
          keywords: ['personalized medicine', 'cancer immunotherapy', 'genomics'],
          source: { name: 'Nature Cancer', url: '', type: 'journal' },
          publicationDate: new Date('2024-02-05'),
          citationCount: 73,
          viewCount: 3567,
          bookmarkCount: 112,
          trendingScore: 90,
          status: 'published',
          metrics: {
            impactScore: 88,
            readabilityScore: 73,
            noveltyScore: 93
          }
        },
        {
          _id: '6861a3da375c3d7dfe433a5e',
          title: 'Neural Mechanisms of Memory Consolidation During Sleep',
          abstract: 'Sleep plays a crucial role in memory consolidation, with different sleep stages contributing to the stabilization of various types of memories. This study investigates the neural mechanisms underlying memory consolidation during slow-wave sleep and REM sleep phases.',
          authors: [
            { name: 'Dr. Sarah Chen', affiliation: 'Google Health' },
            { name: 'Prof. Michael Rodriguez', affiliation: 'Mayo Clinic' }
          ],
          categories: ['neuroscience', 'ai'],
          keywords: ['memory consolidation', 'sleep', 'EEG', 'hippocampus'],
          source: { name: 'Nature Neuroscience', url: '', type: 'journal' },
          publicationDate: new Date('2024-01-15'),
          citationCount: 45,
          viewCount: 2894,
          bookmarkCount: 89,
          trendingScore: 89,
          status: 'published',
          metrics: {
            impactScore: 85,
            readabilityScore: 78,
            noveltyScore: 92
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