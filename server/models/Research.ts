import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IResearch extends Document {
  _id: string;
  title: string;
  abstract: string;
  authors: {
    name: string;
    affiliation?: string;
    email?: string;
  }[];
  categories: string[];
  tags: string[];
  keywords: string[];
  source: {
    name: string;
    url: string;
    type: 'journal' | 'preprint' | 'conference' | 'patent';
  };
  doi?: string;
  pmid?: string;
  arxivId?: string;
  publicationDate: Date;
  citationCount: number;
  viewCount: number;
  bookmarkCount: number;
  trendingScore: number;
  status: 'published' | 'preprint' | 'under-review';
  language: string;
  metrics: {
    impactScore: number;
    readabilityScore: number;
    noveltyScore: number;
  };
  content?: string;
  figures?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IResearchModel extends Model<IResearch> {
  findByCategory(category: string): any;
  findTrending(limit?: number): any;
  search(query: string, options?: any): any;
  fullTextSearch(query: string, options?: any): any;
  advancedSearch(searchParams: any): any;
  getSearchSuggestions(query: string, limit?: number): any;
  getTrendingTopics(limit?: number): any;
}

const researchSchema = new Schema<IResearch>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [500, 'Title cannot exceed 500 characters'],
    index: 'text',
  },
  abstract: {
    type: String,
    required: [true, 'Abstract is required'],
    maxlength: [5000, 'Abstract cannot exceed 5000 characters'],
    index: 'text',
  },
  authors: [{
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    affiliation: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
  }],
  categories: [{
    type: String,
    enum: [
      'neuroscience',
      'healthcare',
      'biotech',
      'ai',
      'genetics',
      'pharmaceuticals',
      'medical-devices',
      'brain-computer-interface',
      'neuroimaging',
      'computational-neuroscience',
      'clinical-trials',
      'bioinformatics'
    ],
    required: true,
    index: true,
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true,
  }],
  keywords: [{
    type: String,
    trim: true,
    lowercase: true,
    index: 'text',
  }],
  source: {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['journal', 'preprint', 'conference', 'patent'],
      required: true,
      index: true,
    },
  },
  doi: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  pmid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  arxivId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  publicationDate: {
    type: Date,
    required: true,
    index: true,
  },
  citationCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true,
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true,
  },
  bookmarkCount: {
    type: Number,
    default: 0,
    min: 0,
    index: true,
  },
  trendingScore: {
    type: Number,
    default: 0,
    index: true,
  },
  status: {
    type: String,
    enum: ['published', 'preprint', 'under-review'],
    default: 'published',
    index: true,
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko'],
  },
  metrics: {
    impactScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },
    readabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    noveltyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  content: {
    type: String,
    text: true,
  },
  figures: [String],
}, {
  timestamps: true,
});

// Indexes for efficient querying
researchSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });
researchSchema.index({ categories: 1, publicationDate: -1 });
researchSchema.index({ trendingScore: -1, publicationDate: -1 });
researchSchema.index({ 'source.type': 1, status: 1 });
researchSchema.index({ citationCount: -1 });
researchSchema.index({ viewCount: -1 });

// Calculate trending score before saving
researchSchema.pre('save', function(next) {
  const daysSincePublication = Math.floor((Date.now() - this.publicationDate.getTime()) / (1000 * 60 * 60 * 24));
  const recencyWeight = Math.max(0, 30 - daysSincePublication) / 30; // Higher score for recent articles
  
  this.trendingScore = (
    (this.viewCount * 0.3) +
    (this.citationCount * 2) +
    (this.bookmarkCount * 1.5) +
    (this.metrics.impactScore * 0.5) +
    (recencyWeight * 10)
  );
  
  next();
});

// Static methods
researchSchema.statics.findByCategory = function(category: string) {
  return this.find({ categories: category }).sort({ publicationDate: -1 });
};

researchSchema.statics.findTrending = function(limit: number = 20) {
  return this.find({ status: 'published' })
    .sort({ trendingScore: -1, publicationDate: -1 })
    .limit(limit);
};

researchSchema.statics.search = function(query: string, options: any = {}) {
  const {
    categories = [],
    sources = [],
    dateRange = {},
    sortBy = 'relevance',
    limit = 20,
    skip = 0,
  } = options;

  let searchQuery: any = {
    $text: { $search: query },
    status: 'published',
  };

  if (categories.length > 0) {
    searchQuery.categories = { $in: categories };
  }

  if (sources.length > 0) {
    searchQuery['source.type'] = { $in: sources };
  }

  if (dateRange.from || dateRange.to) {
    searchQuery.publicationDate = {};
    if (dateRange.from) searchQuery.publicationDate.$gte = new Date(dateRange.from);
    if (dateRange.to) searchQuery.publicationDate.$lte = new Date(dateRange.to);
  }

  let sortOptions: any = {};
  switch (sortBy) {
    case 'date':
      sortOptions = { publicationDate: -1 };
      break;
    case 'citations':
      sortOptions = { citationCount: -1 };
      break;
    case 'trending':
      sortOptions = { trendingScore: -1 };
      break;
    default:
      sortOptions = { score: { $meta: 'textScore' }, publicationDate: -1 };
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

// Create compound text index for full-text search
researchSchema.index({
  title: 'text',
  abstract: 'text',
  keywords: 'text',
  content: 'text',
  'authors.name': 'text'
}, {
  weights: {
    title: 10,
    keywords: 8,
    abstract: 5,
    'authors.name': 3,
    content: 1
  },
  name: 'research_text_index'
});

// Create compound indexes for common query patterns
researchSchema.index({ categories: 1, publicationDate: -1 });
researchSchema.index({ trendingScore: -1, publicationDate: -1 });
researchSchema.index({ citationCount: -1, publicationDate: -1 });
researchSchema.index({ status: 1, categories: 1, publicationDate: -1 });

// Add static methods for advanced search
researchSchema.statics.fullTextSearch = function(query: string, options: any = {}) {
  const {
    categories = [],
    sources = [],
    dateRange = {},
    status = ['published'],
    limit = 20,
    skip = 0,
    sortBy = 'relevance'
  } = options;

  let searchQuery: any = {
    $text: { $search: query },
    status: { $in: status }
  };

  if (categories.length > 0) {
    searchQuery.categories = { $in: categories };
  }

  if (sources.length > 0) {
    searchQuery['source.name'] = { $in: sources };
  }

  if (dateRange.from || dateRange.to) {
    searchQuery.publicationDate = {};
    if (dateRange.from) {
      searchQuery.publicationDate.$gte = new Date(dateRange.from);
    }
    if (dateRange.to) {
      searchQuery.publicationDate.$lte = new Date(dateRange.to);
    }
  }

  let sortOptions: any = {};
  switch (sortBy) {
    case 'relevance':
      sortOptions = { score: { $meta: 'textScore' }, publicationDate: -1 };
      break;
    case 'date':
      sortOptions = { publicationDate: -1 };
      break;
    case 'citations':
      sortOptions = { citationCount: -1 };
      break;
    case 'impact':
      sortOptions = { 'metrics.impactScore': -1 };
      break;
    case 'trending':
      sortOptions = { trendingScore: -1 };
      break;
    default:
      sortOptions = { publicationDate: -1 };
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
};

researchSchema.statics.advancedSearch = function(searchParams: any) {
  const {
    query,
    categories = [],
    authors = [],
    sources = [],
    dateRange = {},
    citationRange = {},
    impactRange = {},
    status = ['published'],
    limit = 20,
    skip = 0,
    sortBy = 'relevance'
  } = searchParams;

  let searchQuery: any = {
    status: { $in: status }
  };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Category filter
  if (categories.length > 0) {
    searchQuery.categories = { $in: categories };
  }

  // Author filter
  if (authors.length > 0) {
    searchQuery['authors.name'] = { $in: authors };
  }

  // Source filter
  if (sources.length > 0) {
    searchQuery['source.name'] = { $in: sources };
  }

  // Date range filter
  if (dateRange.from || dateRange.to) {
    searchQuery.publicationDate = {};
    if (dateRange.from) {
      searchQuery.publicationDate.$gte = new Date(dateRange.from);
    }
    if (dateRange.to) {
      searchQuery.publicationDate.$lte = new Date(dateRange.to);
    }
  }

  // Citation range filter
  if (citationRange.min !== undefined || citationRange.max !== undefined) {
    searchQuery.citationCount = {};
    if (citationRange.min !== undefined) {
      searchQuery.citationCount.$gte = citationRange.min;
    }
    if (citationRange.max !== undefined) {
      searchQuery.citationCount.$lte = citationRange.max;
    }
  }

  // Impact score range filter
  if (impactRange.min !== undefined || impactRange.max !== undefined) {
    searchQuery['metrics.impactScore'] = {};
    if (impactRange.min !== undefined) {
      searchQuery['metrics.impactScore'].$gte = impactRange.min;
    }
    if (impactRange.max !== undefined) {
      searchQuery['metrics.impactScore'].$lte = impactRange.max;
    }
  }

  // Sort options
  let sortOptions: any = {};
  switch (sortBy) {
    case 'relevance':
      sortOptions = query ? { score: { $meta: 'textScore' }, publicationDate: -1 } : { publicationDate: -1 };
      break;
    case 'date':
      sortOptions = { publicationDate: -1 };
      break;
    case 'citations':
      sortOptions = { citationCount: -1 };
      break;
    case 'impact':
      sortOptions = { 'metrics.impactScore': -1 };
      break;
    case 'trending':
      sortOptions = { trendingScore: -1 };
      break;
    default:
      sortOptions = { publicationDate: -1 };
  }

  const projection = query ? { score: { $meta: 'textScore' } } : {};

  return this.find(searchQuery, projection)
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
};

// Add method for search suggestions/autocomplete
researchSchema.statics.getSearchSuggestions = function(query: string, limit: number = 10) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { keywords: { $regex: query, $options: 'i' } },
          { 'authors.name': { $regex: query, $options: 'i' } }
        ]
      }
    },
    {
      $project: {
        suggestion: '$title',
        type: 'title',
        _id: 0
      }
    },
    { $limit: limit }
  ]);
};

// Add method for getting trending searches
researchSchema.statics.getTrendingTopics = function(limit: number = 10) {
  return this.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$keywords' },
    {
      $group: {
        _id: '$keywords',
        count: { $sum: 1 },
        avgTrendingScore: { $avg: '$trendingScore' }
      }
    },
    { $sort: { avgTrendingScore: -1, count: -1 } },
    { $limit: limit },
    {
      $project: {
        topic: '$_id',
        count: 1,
        trendingScore: '$avgTrendingScore',
        _id: 0
      }
    }
  ]);
};

// Create model with proper error handling
let Research: any;

try {
  Research = mongoose.model('Research');
} catch {
  Research = mongoose.model('Research', researchSchema);
}

export default Research; 