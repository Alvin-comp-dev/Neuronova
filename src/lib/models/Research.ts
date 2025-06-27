import { ObjectId } from 'mongodb';
import { getCollection, isMongoDBAvailable } from '../mongodb';

export interface Research {
  _id?: ObjectId;
  id?: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publishedDate: Date;
  doi?: string;
  url?: string;
  categories: string[];
  tags: string[];
  citationCount: number;
  readCount: number;
  bookmarkCount: number;
  shareCount: number;
  impactScore: number;
  isOpenAccess: boolean;
  pdfUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedBy?: ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: ObjectId;
  moderatedAt?: Date;
}

export interface ResearchStats {
  totalArticles: number;
  totalCitations: number;
  totalReads: number;
  totalBookmarks: number;
  categoriesCount: Record<string, number>;
  recentGrowth: {
    articles: number;
    citations: number;
    reads: number;
  };
}

export class ResearchModel {
  static async getCollection() {
    const collection = await getCollection('research');
    if (!collection) {
      throw new Error('MongoDB not available - falling back to mock data');
    }
    return collection;
  }

  static async create(researchData: Partial<Research>): Promise<Research> {
    if (!isMongoDBAvailable()) {
      throw new Error('MongoDB not available - cannot create research');
    }

    const collection = await this.getCollection();
    
    const now = new Date();
    const research: Partial<Research> = {
      ...researchData,
      citationCount: 0,
      readCount: 0,
      bookmarkCount: 0,
      shareCount: 0,
      impactScore: 0,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(research);
    const createdResearch = await collection.findOne({ _id: result.insertedId });
    
    if (!createdResearch) {
      throw new Error('Failed to create research');
    }

    return createdResearch as Research;
  }

  static async findById(id: string): Promise<Research | null> {
    if (!isMongoDBAvailable()) {
      throw new Error('MongoDB not available - falling back to mock data');
    }

    const collection = await this.getCollection();
    const research = await collection.findOne({ _id: new ObjectId(id) });
    return research as Research | null;
  }

  static async findMany(options: {
    limit?: number;
    skip?: number;
    sortBy?: 'date' | 'citations' | 'reads' | 'impact';
    category?: string;
    status?: string;
    search?: string;
  } = {}): Promise<Research[]> {
    try {
      if (!isMongoDBAvailable()) {
        // Try to connect first
        const { connectMongoose } = await import('../mongodb');
        await connectMongoose();
      }
      
      if (!isMongoDBAvailable()) {
        console.log('MongoDB not available, returning mock data');
        return this.getMockResearch(options);
      }
    } catch (error) {
      console.error('Database connection error, returning mock data:', error);
      return this.getMockResearch(options);
    }

    const collection = await this.getCollection();
    
    const {
      limit = 12,
      skip = 0,
      sortBy = 'date',
      category,
      status = 'approved',
      search
    } = options;

    // Build query
    const query: any = { status };
    
    if (category) {
      query.categories = { $in: [category] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'citations':
        sort = { citationCount: -1 };
        break;
      case 'reads':
        sort = { readCount: -1 };
        break;
      case 'impact':
        sort = { impactScore: -1 };
        break;
      default:
        sort = { publishedDate: -1 };
    }

    const research = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return research as Research[];
  }

  static async getStats(): Promise<ResearchStats> {
    if (!isMongoDBAvailable()) {
      // Return mock stats immediately instead of throwing error
      return this.getMockStats();
    }

    const collection = await this.getCollection();
    
    // Get basic counts
    const totalArticles = await collection.countDocuments({ status: 'approved' });
    
    // Get aggregated stats
    const statsAgg = await collection.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          totalCitations: { $sum: '$citationCount' },
          totalReads: { $sum: '$readCount' },
          totalBookmarks: { $sum: '$bookmarkCount' }
        }
      }
    ]).toArray();

    // Get categories count
    const categoriesAgg = await collection.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get recent growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentGrowthAgg = await collection.aggregate([
      { 
        $match: { 
          status: 'approved',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          articles: { $sum: 1 },
          citations: { $sum: '$citationCount' },
          reads: { $sum: '$readCount' }
        }
      }
    ]).toArray();

    const stats = statsAgg[0] || { totalCitations: 0, totalReads: 0, totalBookmarks: 0 };
    const recentGrowth = recentGrowthAgg[0] || { articles: 0, citations: 0, reads: 0 };
    
    const categoriesCount: Record<string, number> = {};
    categoriesAgg.forEach(cat => {
      categoriesCount[cat._id] = cat.count;
    });

    return {
      totalArticles,
      totalCitations: stats.totalCitations,
      totalReads: stats.totalReads,
      totalBookmarks: stats.totalBookmarks,
      categoriesCount,
      recentGrowth: {
        articles: recentGrowth.articles,
        citations: recentGrowth.citations,
        reads: recentGrowth.reads,
      }
    };
  }

  static async incrementRead(id: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { readCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  static async incrementBookmark(id: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { bookmarkCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  static async incrementShare(id: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { shareCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  static async updateImpactScore(id: string, score: number): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          impactScore: score,
          updatedAt: new Date()
        }
      }
    );
  }

  static async fullTextSearch(query: string, options: {
    limit?: number;
    skip?: number;
    categories?: string[];
    sortBy?: string;
  } = {}): Promise<Research[]> {
    if (!isMongoDBAvailable()) {
      console.log('MongoDB not available, returning mock data for search');
      return this.getMockResearch({ search: query, ...options });
    }

    const collection = await this.getCollection();
    
    const {
      limit = 50,
      skip = 0,
      categories = [],
      sortBy = 'relevance'
    } = options;

    // Build search query
    const searchQuery: any = {
      status: 'approved',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { abstract: { $regex: query, $options: 'i' } },
        { authors: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { journal: { $regex: query, $options: 'i' } }
      ]
    };

    // Add category filter if provided
    if (categories.length > 0) {
      searchQuery.categories = { $in: categories };
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'date':
        sort = { publishedDate: -1 };
        break;
      case 'citations':
        sort = { citationCount: -1 };
        break;
      case 'impact':
        sort = { impactScore: -1 };
        break;
      default: // relevance
        sort = { impactScore: -1, citationCount: -1 };
    }

    const results = await collection
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return results as Research[];
  }

  static async advancedSearch(options: {
    categories?: string[];
    authors?: string[];
    sources?: string[];
    dateRange?: { start?: Date; end?: Date };
    limit?: number;
    skip?: number;
    sortBy?: string;
  } = {}): Promise<Research[]> {
    if (!isMongoDBAvailable()) {
      console.log('MongoDB not available, returning mock data for advanced search');
      return this.getMockResearch(options);
    }

    const collection = await this.getCollection();
    
    const {
      categories = [],
      authors = [],
      sources = [],
      dateRange,
      limit = 50,
      skip = 0,
      sortBy = 'date'
    } = options;

    // Build advanced search query
    const searchQuery: any = { status: 'approved' };

    if (categories.length > 0) {
      searchQuery.categories = { $in: categories };
    }

    if (authors.length > 0) {
      searchQuery.authors = { $in: authors.map(author => new RegExp(author, 'i')) };
    }

    if (sources.length > 0) {
      searchQuery.journal = { $in: sources.map(source => new RegExp(source, 'i')) };
    }

    if (dateRange) {
      searchQuery.publishedDate = {};
      if (dateRange.start) {
        searchQuery.publishedDate.$gte = dateRange.start;
      }
      if (dateRange.end) {
        searchQuery.publishedDate.$lte = dateRange.end;
      }
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'citations':
        sort = { citationCount: -1 };
        break;
      case 'impact':
        sort = { impactScore: -1 };
        break;
      case 'relevance':
        sort = { impactScore: -1, citationCount: -1 };
        break;
      default: // date
        sort = { publishedDate: -1 };
    }

    const results = await collection
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return results as Research[];
  }

  static toPublicResearch(research: Research) {
    return {
      ...research,
      id: research._id?.toString(),
    };
  }

  // Mock data methods for development without MongoDB
  private static getMockResearch(options: any = {}): Research[] {
    const { limit = 12, sortBy = 'date', search, categories = [] } = options;
    
    const mockData = [
      {
        _id: new ObjectId(),
        title: 'Neural Plasticity in Adult Brains: New Discoveries',
        abstract: 'Recent studies reveal unprecedented levels of neuroplasticity in adult human brains.',
        authors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez'],
        journal: 'Nature Neuroscience',
        publishedDate: new Date('2024-01-15'),
        categories: ['neuroscience', 'research'],
        tags: ['neuroplasticity', 'adult brain'],
        citationCount: 127,
        readCount: 2341,
        bookmarkCount: 89,
        shareCount: 45,
        impactScore: 8.7,
        isOpenAccess: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'approved' as const,
      },
      {
        _id: new ObjectId(),
        title: 'CRISPR Gene Therapy Shows Promise for Alzheimer\'s Treatment',
        abstract: 'A breakthrough study demonstrates CRISPR-Cas9 technology targeting Alzheimer\'s genes.',
        authors: ['Dr. James Thompson', 'Dr. Maria Garcia'],
        journal: 'Cell',
        publishedDate: new Date('2024-01-12'),
        categories: ['genetics', 'healthcare'],
        tags: ['CRISPR', 'Alzheimer\'s'],
        citationCount: 89,
        readCount: 1876,
        bookmarkCount: 67,
        shareCount: 32,
        impactScore: 9.2,
        isOpenAccess: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'approved' as const,
      },
      {
        _id: new ObjectId(),
        title: 'AI-Powered Drug Discovery Accelerates Medicine Development',
        abstract: 'Machine learning algorithms significantly reduce time and cost in pharmaceutical research.',
        authors: ['Dr. Lisa Wang', 'Dr. Robert Kim'],
        journal: 'Science',
        publishedDate: new Date('2024-01-10'),
        categories: ['ai-ml', 'healthcare'],
        tags: ['artificial intelligence', 'drug discovery', 'machine learning'],
        citationCount: 156,
        readCount: 3245,
        bookmarkCount: 123,
        shareCount: 78,
        impactScore: 8.9,
        isOpenAccess: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'approved' as const,
      },
      {
        _id: new ObjectId(),
        title: 'Quantum Computing Breakthrough in Cryptography',
        abstract: 'New quantum algorithms demonstrate potential for breaking current encryption methods.',
        authors: ['Dr. Alex Chen', 'Dr. Sarah Johnson'],
        journal: 'Nature Physics',
        publishedDate: new Date('2024-01-08'),
        categories: ['quantum', 'technology'],
        tags: ['quantum computing', 'cryptography', 'algorithms'],
        citationCount: 203,
        readCount: 2876,
        bookmarkCount: 98,
        shareCount: 65,
        impactScore: 9.5,
        isOpenAccess: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'approved' as const,
      },
    ];

    // Filter by categories if provided
    let filteredData = mockData;
    if (categories.length > 0) {
      filteredData = mockData.filter(item => 
        item.categories.some(cat => categories.includes(cat))
      );
    }

    // Filter by search query if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.abstract.toLowerCase().includes(searchLower) ||
        item.authors.some(author => author.toLowerCase().includes(searchLower)) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        item.journal.toLowerCase().includes(searchLower)
      );
    }

    // Sort the filtered data
    switch (sortBy) {
      case 'citations':
        filteredData.sort((a, b) => b.citationCount - a.citationCount);
        break;
      case 'impact':
        filteredData.sort((a, b) => b.impactScore - a.impactScore);
        break;
      case 'relevance':
        filteredData.sort((a, b) => (b.impactScore * b.citationCount) - (a.impactScore * a.citationCount));
        break;
      default: // date
        filteredData.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
    }

    return filteredData.slice(0, limit);
  }

  private static getMockStats(): ResearchStats {
    return {
      totalArticles: 156,
      totalCitations: 3420,
      totalReads: 28450,
      totalBookmarks: 1230,
      categoriesCount: {
        'neuroscience': 45,
        'genetics': 32,
        'ai': 28,
        'healthcare': 51,
      },
      recentGrowth: {
        articles: 12,
        citations: 234,
        reads: 1890,
      },
    };
  }
} 