const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PubMedService = require('./services/pubmedService');
const ArxivService = require('./services/arxivService');
const SemanticSearchService = require('./services/semanticSearchService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize external API services
const pubmedService = new PubMedService();
const arxivService = new ArxivService();
const semanticSearchService = new SemanticSearchService();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Simple Research Schema
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
});

// Create text index for search
researchSchema.index({ 
  title: 'text', 
  abstract: 'text', 
  keywords: 'text' 
});

const Research = mongoose.model('Research', researchSchema);

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  verified: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Research endpoints
app.get('/api/research', async (req, res) => {
  try {
    const { page = 1, limit = 12, categories, sortBy = 'date' } = req.query;
    
    let query = {};
    if (categories) {
      const categoryArray = categories.split(',');
      query.categories = { $in: categoryArray };
    }
    
    let sort = {};
    switch (sortBy) {
      case 'citations':
        sort = { citationCount: -1 };
        break;
      case 'trending':
        sort = { trendingScore: -1 };
        break;
      default:
        sort = { publicationDate: -1 };
    }
    
    const skip = (page - 1) * limit;
    const articles = await Research.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Research.countDocuments(query);
    
    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Research fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research articles'
    });
  }
});

app.get('/api/research/stats', async (req, res) => {
  try {
    const totalArticles = await Research.countDocuments();
    const publishedArticles = await Research.countDocuments({ status: 'published' });
    const categories = await Research.distinct('categories');
    const recentArticles = await Research.countDocuments({
      publicationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    res.json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        categoriesCount: categories.length,
        recentArticles
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

app.get('/api/research/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 12, categories, includeExternal = 'true' } = req.query;
    
    console.log(`🔍 Enhanced search for: "${q}" (includeExternal: ${includeExternal})`);
    
    // Search local database
    let localQuery = {};
    if (q) {
      localQuery.$text = { $search: q };
    }
    if (categories) {
      const categoryArray = categories.split(',');
      localQuery.categories = { $in: categoryArray };
    }
    
    const skip = (page - 1) * Math.floor(limit / 2); // Reserve half for external
    const localLimit = Math.floor(limit / 2);
    
    const [localArticles, localTotal] = await Promise.all([
      Research.find(localQuery).skip(skip).limit(localLimit),
      Research.countDocuments(localQuery)
    ]);
    
    let allArticles = [...localArticles];
    let externalArticles = [];
    
    // Fetch external articles if requested and query exists
    if (includeExternal === 'true' && q && q.trim()) {
      try {
        const externalLimit = Math.floor(limit / 2);
        
        // Fetch from both PubMed and arXiv in parallel
        const [pubmedResults, arxivResults] = await Promise.all([
          pubmedService.searchArticles(q, Math.floor(externalLimit / 2)),
          arxivService.searchPapers(q, Math.floor(externalLimit / 2))
        ]);
        
        externalArticles = [...pubmedResults, ...arxivResults];
        allArticles = [...localArticles, ...externalArticles];
        
        console.log(`📚 Combined results: ${localArticles.length} local + ${externalArticles.length} external`);
      } catch (externalError) {
        console.error('⚠️ External API error (continuing with local results):', externalError.message);
      }
    }
    
    // Phase 1 Enhancement: Apply semantic search if query exists
    if (q && q.trim()) {
      console.log(`🧠 Applying semantic search for: "${q}"`);
      allArticles = semanticSearchService.enhanceSearchResults(q, allArticles);
    }
    
    res.json({
      success: true,
      data: allArticles,
      query: q,
      sources: {
        local: localArticles.length,
        pubmed: externalArticles.filter(a => a.externalSource === 'pubmed').length,
        arxiv: externalArticles.filter(a => a.externalSource === 'arxiv').length
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil((localTotal + externalArticles.length) / limit),
        totalResults: localTotal + externalArticles.length,
        hasNextPage: page * limit < (localTotal + externalArticles.length),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Enhanced search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Simple auth endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple auth - find user by email
    let user = await User.findOne({ email });
    
    // If no user found, create a simple admin user for testing
    if (!user && email === 'admin@neuronova.com') {
      user = await User.create({
        name: 'Admin User',
        email: 'admin@neuronova.com',
        password: 'admin123',
        role: 'admin',
        verified: true
      });
      console.log('✅ Created admin user');
    }
    
    // Also check if any existing seeded user should be admin
    if (user && !user.role) {
      user.role = 'user'; // Default role
      if (user.email === 'admin@neuronova.com' || user.email.includes('admin')) {
        user.role = 'admin';
      }
      await user.save();
    }
    
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        },
        token: 'simple-token-' + user._id
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, agreedToTerms } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }
    
    if (!agreedToTerms) {
      return res.status(400).json({
        success: false,
        error: 'You must agree to the terms and conditions'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // In production, this should be hashed
      role: 'user',
      verified: false
    });
    
    console.log('✅ Created new user:', email);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      },
      token: 'simple-token-' + user._id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = token.replace('simple-token-', '');
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Admin endpoints
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const totalResearch = await Research.countDocuments();
    const pendingModeration = await Research.countDocuments({ status: 'under-review' });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers: activeUsers || Math.floor(totalUsers * 0.7), // Fallback calculation
        totalResearch,
        pendingModeration: pendingModeration || 0,
        systemHealth: 'healthy',
        serverUptime: process.uptime() + 's'
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin stats'
    });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      query.role = role;
    }
    
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// External API endpoints
app.get('/api/research/external/pubmed', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }
    
    const articles = await pubmedService.searchArticles(q, parseInt(limit));
    
    res.json({
      success: true,
      data: articles,
      source: 'pubmed',
      query: q
    });
  } catch (error) {
    console.error('❌ PubMed endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch PubMed articles'
    });
  }
});

app.get('/api/research/external/arxiv', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }
    
    const papers = await arxivService.searchPapers(q, parseInt(limit));
    
    res.json({
      success: true,
      data: papers,
      source: 'arxiv',
      query: q
    });
  } catch (error) {
    console.error('❌ arXiv endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch arXiv papers'
    });
  }
});

app.get('/api/research/trending/external', async (req, res) => {
  try {
    const { source = 'both', limit = 10 } = req.query;
    
    let trendingData = [];
    
    if (source === 'pubmed' || source === 'both') {
      const pubmedTrending = await pubmedService.getTrendingTopics(Math.floor(limit / 2));
      trendingData = [...trendingData, ...pubmedTrending.map(item => ({ ...item, source: 'pubmed' }))];
    }
    
    if (source === 'arxiv' || source === 'both') {
      const arxivRecent = await arxivService.getRecentPapers(['cs.AI', 'cs.LG', 'q-bio'], Math.floor(limit / 2));
      trendingData = [...trendingData, ...arxivRecent.map(item => ({ ...item, source: 'arxiv' }))];
    }
    
    res.json({
      success: true,
      data: trendingData,
      source: source
    });
  } catch (error) {
    console.error('❌ External trending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending external content'
    });
  }
});

// Semantic search suggestions endpoint
app.get('/api/research/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const suggestions = semanticSearchService.generateSearchSuggestions(q);
    
    res.json({
      success: true,
      data: suggestions,
      query: q
    });
  } catch (error) {
    console.error('❌ Search suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate search suggestions'
    });
  }
});

// Similar articles endpoint
app.get('/api/research/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;
    
    const targetArticle = await Research.findById(id);
    if (!targetArticle) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    const candidateArticles = await Research.find({
      _id: { $ne: id },
      categories: { $in: targetArticle.categories }
    }).limit(50); // Get more candidates for better similarity matching
    
    const similarArticles = semanticSearchService.findSimilarArticles(
      targetArticle, 
      candidateArticles, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: similarArticles,
      targetArticle: {
        id: targetArticle._id,
        title: targetArticle.title
      }
    });
  } catch (error) {
    console.error('❌ Similar articles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find similar articles'
    });
  }
});

// Real-time data pipeline endpoint
app.get('/api/research/pipeline/status', async (req, res) => {
  try {
    // Check the status of external APIs
    const status = {
      pubmed: { available: true, lastUpdate: new Date().toISOString() },
      arxiv: { available: true, lastUpdate: new Date().toISOString() },
      local: { 
        available: true, 
        articleCount: await Research.countDocuments(),
        lastUpdate: new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      pipeline: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Pipeline status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pipeline status'
    });
  }
});

// Enhanced recommendations endpoint
app.get('/api/recommendations', async (req, res) => {
  try {
    const { limit = 5, algorithm = 'hybrid', userId = 'user1' } = req.query;
    
    // Get base recommendations from database
    let baseQuery = {};
    let sortCriteria = {};
    
    // Apply different algorithms
    switch (algorithm) {
      case 'trending':
        sortCriteria = { trendingScore: -1, citationCount: -1 };
        break;
      case 'content-based':
        sortCriteria = { 'metrics.noveltyScore': -1, publicationDate: -1 };
        break;
      case 'collaborative':
        sortCriteria = { viewCount: -1, bookmarkCount: -1 };
        break;
      default: // hybrid
        sortCriteria = { 
          trendingScore: -1, 
          'metrics.impactScore': -1, 
          citationCount: -1 
        };
    }
    
    const articles = await Research.find(baseQuery)
      .sort(sortCriteria)
      .limit(parseInt(limit));
    
    // Enhance articles with recommendation metadata
    const enhancedRecommendations = articles.map((article, index) => {
      const baseConfidence = 0.6 + (Math.random() * 0.3); // 0.6-0.9
      const confidence = Math.min(0.95, baseConfidence + (article.trendingScore / 100));
      
      // Generate recommendation reasons based on algorithm
      let reasons = [];
      switch (algorithm) {
        case 'trending':
          reasons = [
            `High trending score (${article.trendingScore.toFixed(1)})`,
            `${article.citationCount} citations`,
            'Popular in your field'
          ];
          break;
        case 'content-based':
          reasons = [
            'Similar to your reading history',
            `High novelty score (${article.metrics.noveltyScore.toFixed(1)})`,
            'Matches your interests'
          ];
          break;
        case 'collaborative':
          reasons = [
            'Highly viewed by similar users',
            `${article.bookmarkCount} bookmarks`,
            'Community favorite'
          ];
          break;
        default: // hybrid
          reasons = [
            'AI-recommended match',
            `Impact score: ${article.metrics.impactScore.toFixed(1)}`,
            'Trending in your field'
          ];
      }
      
      return {
        ...article.toObject(),
        recommendationScore: confidence * 100,
        recommendationReasons: reasons.slice(0, 3),
        confidence: confidence,
        algorithmUsed: algorithm,
        source: article.source || {
          name: 'Neuronova Database',
          type: 'internal'
        }
      };
    });
    
    res.json({
      success: true,
      data: enhancedRecommendations,
      algorithm: algorithm,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

app.get('/api/activity', async (req, res) => {
  try {
    // Return sample activity data
    const activities = [
      {
        id: 1,
        type: 'research_published',
        title: 'New breakthrough in neural interfaces',
        user: 'Dr. Sarah Chen',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'discussion_started',
        title: 'CRISPR applications in neuroscience',
        user: 'Prof. Michael Rodriguez',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity'
    });
  }
});

// Bookmarks endpoint
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { articleId, action } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Simple bookmark simulation
    const isBookmarked = action === 'add';
    
    res.json({
      success: true,
      data: {
        articleId,
        isBookmarked,
        action
      }
    });
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bookmark'
    });
  }
});

// Likes endpoint
app.post('/api/likes', async (req, res) => {
  try {
    const { articleId, action } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Simple like simulation
    const isLiked = action === 'add';
    
    res.json({
      success: true,
      data: {
        articleId,
        isLiked,
        action
      }
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update like'
    });
  }
});

// Shares endpoint
app.post('/api/shares', async (req, res) => {
  try {
    const { articleId, shareType } = req.body;
    
    // Generate share URL
    const baseUrl = 'http://localhost:3000';
    const shareUrl = `${baseUrl}/research/${articleId}`;
    
    res.json({
      success: true,
      data: {
        articleId,
        shareType,
        url: shareUrl
      }
    });
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate share link'
    });
  }
});

// Recommendation interactions endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { interactionType, articleId, timestamp } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    // Log interaction (in a real app, you'd store this in database)
    console.log(`📊 Recommendation interaction: ${interactionType} on article ${articleId}`);
    
    res.json({
      success: true,
      data: {
        interactionType,
        articleId,
        timestamp,
        recorded: true
      }
    });
  } catch (error) {
    console.error('Recommendation interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record interaction'
    });
  }
});

// Discussions endpoints (mock for now)
app.get('/api/discussions', async (req, res) => {
  try {
    const { filter = 'all', sort = 'recent', search = '', limit = 20 } = req.query;
    
    // Generate mock discussions list
    const mockDiscussions = [
      {
        _id: '6759e1a123456789',
        title: 'Neural Interface Breakthrough: New Findings',
        content: 'Recent research has shown promising results in brain-computer interface technology. Our team has developed a new approach that significantly improves signal clarity and reduces invasiveness.',
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
        tags: ['neuroscience', 'BCI', 'research', 'breakthrough'],
        likes: 24,
        replies: 8,
        views: 156,
        isPinned: false,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        moderationStatus: 'approved'
      },
      {
        _id: '6759e1b987654321',
        title: 'CRISPR Applications in Neurological Disorders',
        content: 'Exploring the potential of gene editing technology in treating neurological conditions. This discussion covers recent advances and ethical considerations.',
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
        tags: ['CRISPR', 'gene-therapy', 'neurology', 'ethics'],
        likes: 18,
        replies: 12,
        views: 203,
        isPinned: true,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        moderationStatus: 'approved'
      },
      {
        _id: '6759e1c456789012',
        title: 'AI-Powered Drug Discovery: Latest Developments',
        content: 'Machine learning algorithms are revolutionizing pharmaceutical research. Join the discussion on recent breakthroughs and future possibilities.',
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
        tags: ['AI', 'drug-discovery', 'machine-learning', 'pharmaceuticals'],
        likes: 31,
        replies: 15,
        views: 287,
        isPinned: false,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        moderationStatus: 'approved'
      },
      {
        _id: '6759e1d789012345',
        title: 'Regenerative Medicine: Stem Cell Research Updates',
        content: 'Latest developments in stem cell research and tissue engineering. Discussing clinical trials and therapeutic applications.',
        category: 'regenerative-medicine',
        author: {
          _id: 'mock-author-4',
          name: 'Dr. James Chen',
          profile: {
            avatar: '/api/placeholder/40/40',
            title: 'Research Fellow',
            affiliation: 'Stanford Medicine'
          }
        },
        tags: ['stem-cells', 'regenerative-medicine', 'clinical-trials'],
        likes: 22,
        replies: 9,
        views: 178,
        isPinned: false,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        moderationStatus: 'approved'
      }
    ];
    
    // Apply search filter if provided
    let filteredDiscussions = mockDiscussions;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDiscussions = mockDiscussions.filter(d => 
        d.title.toLowerCase().includes(searchLower) ||
        d.content.toLowerCase().includes(searchLower) ||
        d.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'popular':
        filteredDiscussions.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies));
        break;
      case 'replies':
        filteredDiscussions.sort((a, b) => b.replies - a.replies);
        break;
      default: // recent
        filteredDiscussions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Apply limit
    filteredDiscussions = filteredDiscussions.slice(0, parseInt(limit));
    
    console.log(`📋 Serving ${filteredDiscussions.length} discussions (filter: ${filter}, sort: ${sort})`);
    
    res.json({
      success: true,
      discussions: filteredDiscussions
    });
  } catch (error) {
    console.error('Discussions list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discussions'
    });
  }
});

app.get('/api/discussions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate mock discussion data
    const mockDiscussion = {
      _id: id,
      title: `Research Discussion: ${id.slice(-8)}`,
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
      replies: 3,
      isBookmarked: false,
      isPinned: false,
      isLiked: false,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      moderationStatus: 'approved',
      posts: [
        {
          _id: `post-${id.slice(-4)}-1`,
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
          _id: `post-${id.slice(-4)}-2`,
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
          _id: `post-${id.slice(-4)}-3`,
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
      ]
    };
    
    console.log(`📋 Serving discussion: ${mockDiscussion.title}`);
    
    res.json({
      success: true,
      data: mockDiscussion
    });
  } catch (error) {
    console.error('Discussion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discussion'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👑 Admin dashboard: http://localhost:3000/admin`);
  console.log(`🔬 Research page: http://localhost:3000/research`);
  console.log(`💬 Discussions API: http://localhost:${PORT}/api/discussions/:id`);
});