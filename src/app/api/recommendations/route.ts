import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Import the same connection method used by the main research API
async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova';
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Use the same Research schema as the main research API
const researchSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  authors: [Object],
  categories: [String],
  tags: [String],
  keywords: [String],
  source: Object,
  doi: String,
  publicationDate: Date,
  citationCount: Number,
  viewCount: Number,
  bookmarkCount: Number,
  trendingScore: Number,
  status: String,
  metrics: Object,
}, { timestamps: true });

let Research: any;
try {
  Research = mongoose.model('Research');
} catch {
  Research = mongoose.model('Research', researchSchema);
}

// Mock user behavior data for recommendation algorithms
interface UserInteraction {
  userId: string;
  articleId: string;
  interactionType: 'view' | 'bookmark' | 'share' | 'discuss' | 'like';
  duration?: number; // reading time in seconds
  timestamp: Date;
  category: string;
  keywords: string[];
}

interface UserProfile {
  userId: string;
  researchInterests: string[];
  readingHistory: string[];
  bookmarkedCategories: string[];
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredSources: string[];
}

interface RecommendationScore {
  articleId: string;
  score: number;
  reasons: string[];
  confidence: number;
  algorithmUsed: string;
}

// Simulated user interaction data
const mockUserInteractions: UserInteraction[] = [
  {
    userId: 'user1',
    articleId: 'art1',
    interactionType: 'view',
    duration: 480,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Neurotech',
    keywords: ['brain-computer interface', 'neural implants', 'paralysis']
  },
  {
    userId: 'user1',
    articleId: 'art2',
    interactionType: 'bookmark',
    duration: 720,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: 'AI in Healthcare',
    keywords: ['machine learning', 'medical diagnosis', 'AI algorithms']
  },
  {
    userId: 'user1',
    articleId: 'art3',
    interactionType: 'discuss',
    duration: 300,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: 'Gene Therapy',
    keywords: ['CRISPR', 'genetic engineering', 'gene editing']
  }
];

// Mock user profiles
const mockUserProfiles: UserProfile[] = [
  {
    userId: 'user1',
    researchInterests: ['neuroscience', 'AI in Healthcare', 'Brain-Computer Interfaces'],
    readingHistory: ['art1', 'art2', 'art3'],
    bookmarkedCategories: ['neuroscience', 'AI in Healthcare'],
    expertiseLevel: 'intermediate',
    preferredSources: ['Nature', 'Science', 'PubMed']
  }
];

class RecommendationEngine {
  /**
   * Content-based filtering: Recommend articles similar to user's reading history
   */
  static contentBasedRecommendations(userProfile: UserProfile, articles: any[]): RecommendationScore[] {
    const recommendations: RecommendationScore[] = [];
    
    articles.forEach(article => {
      if (userProfile.readingHistory.includes(article._id.toString())) {
        return; // Skip already read articles
      }
      
      let score = 0;
      const reasons: string[] = [];
      
      // Interest matching
      const categoryMatch = userProfile.researchInterests.some(interest => 
        article.categories.includes(interest)
      );
      if (categoryMatch) {
        score += 40;
        reasons.push('Matches your research interests');
      }
      
      // Source preference
      if (userProfile.preferredSources.includes(article.source.name)) {
        score += 15;
        reasons.push('From your preferred journal');
      }
      
      // Recency boost
      const daysSincePublication = (Date.now() - new Date(article.publicationDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublication <= 7) {
        score += 20;
        reasons.push('Recently published');
      }
      
      // Quality metrics
      score += (article.metrics.impactScore * 0.2);
      score += (article.metrics.noveltyScore * 0.15);
      
      if (score > 30) {
        recommendations.push({
          articleId: article._id.toString(),
          score,
          reasons,
          confidence: Math.min(score / 100, 1),
          algorithmUsed: 'content-based'
        });
      }
    });
    
    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Collaborative filtering: Recommend based on similar users' behavior
   */
  static collaborativeFiltering(userId: string, interactions: UserInteraction[], articles: any[]): RecommendationScore[] {
    const recommendations: RecommendationScore[] = [];
    
    // Find users with similar interaction patterns
    const userInteractions = interactions.filter(i => i.userId === userId);
    const userCategories = [...new Set(userInteractions.map(i => i.category))];
    
    // Find articles liked by similar users
    const similarUserInteractions = interactions.filter(i => 
      i.userId !== userId && 
      userCategories.some(cat => i.category === cat) &&
      (i.interactionType === 'bookmark' || i.interactionType === 'like')
    );
    
    articles.forEach(article => {
      const articleInteractions = similarUserInteractions.filter(i => i.articleId === article._id.toString());
      
      if (articleInteractions.length > 0) {
        let score = articleInteractions.length * 25; // Base score from user interactions
        const reasons: string[] = [];
        
        // Boost score based on interaction types
        const bookmarks = articleInteractions.filter(i => i.interactionType === 'bookmark').length;
        const likes = articleInteractions.filter(i => i.interactionType === 'like').length;
        
        if (bookmarks > 0) {
          score += bookmarks * 10;
          reasons.push('Bookmarked by similar researchers');
        }
        
        if (likes > 0) {
          score += likes * 5;
          reasons.push('Liked by users with similar interests');
        }
        
        // Category relevance
        const categoryMatch = userCategories.some(cat => article.categories.includes(cat));
        if (categoryMatch) {
          score += 15;
          reasons.push('Popular in your research area');
        }
        
        if (score > 20) {
          recommendations.push({
            articleId: article._id.toString(),
            score,
            reasons,
            confidence: Math.min(score / 80, 1),
            algorithmUsed: 'collaborative'
          });
        }
      }
    });
    
    return recommendations.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Trending-based recommendations: Popular articles in user's fields
   */
  static trendingRecommendations(userProfile: UserProfile, articles: any[]): RecommendationScore[] {
    const recommendations: RecommendationScore[] = [];
    
    articles.forEach(article => {
      if (userProfile.readingHistory.includes(article._id.toString())) {
        return;
      }
      
      let score = 0;
      const reasons: string[] = [];
      
      // High trending score
      if (article.trendingScore > 80) {
        score += article.trendingScore * 0.5;
        reasons.push('Currently trending in the community');
      }
      
      // High engagement
      const engagementScore = (article.viewCount * 0.01) + (article.bookmarkCount * 0.5) + (article.citationCount * 2);
      score += Math.min(engagementScore, 30);
      
      if (engagementScore > 50) {
        reasons.push('High community engagement');
      }
      
      // Category relevance
      const relevantCategory = userProfile.researchInterests.some(interest => 
        article.categories.includes(interest)
      );
      if (relevantCategory) {
        score += 20;
        reasons.push('Trending in your field of interest');
      }
      
      if (score > 25) {
        recommendations.push({
          articleId: article._id.toString(),
          score,
          reasons,
          confidence: Math.min(score / 100, 1),
          algorithmUsed: 'trending'
        });
      }
    });
    
    return recommendations.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Hybrid recommendation system combining multiple algorithms
   */
  static hybridRecommendations(
    userId: string, 
    userProfile: UserProfile, 
    interactions: UserInteraction[], 
    articles: any[]
  ): RecommendationScore[] {
    const contentBased = this.contentBasedRecommendations(userProfile, articles);
    const collaborative = this.collaborativeFiltering(userId, interactions, articles);
    const trending = this.trendingRecommendations(userProfile, articles);
    
    // Combine scores with different weights
    const hybridScores = new Map<string, RecommendationScore>();
    
    // Content-based (40% weight)
    contentBased.forEach(rec => {
      hybridScores.set(rec.articleId, {
        ...rec,
        score: rec.score * 0.4,
        algorithmUsed: 'hybrid'
      });
    });
    
    // Collaborative (35% weight)
    collaborative.forEach(rec => {
      const existing = hybridScores.get(rec.articleId);
      if (existing) {
        existing.score += rec.score * 0.35;
        existing.reasons = [...existing.reasons, ...rec.reasons];
      } else {
        hybridScores.set(rec.articleId, {
          ...rec,
          score: rec.score * 0.35,
          algorithmUsed: 'hybrid'
        });
      }
    });
    
    // Trending (25% weight)
    trending.forEach(rec => {
      const existing = hybridScores.get(rec.articleId);
      if (existing) {
        existing.score += rec.score * 0.25;
        existing.reasons = [...existing.reasons, ...rec.reasons];
      } else {
        hybridScores.set(rec.articleId, {
          ...rec,
          score: rec.score * 0.25,
          algorithmUsed: 'hybrid'
        });
      }
    });
    
    // Remove duplicate reasons and calculate final confidence
    hybridScores.forEach(rec => {
      rec.reasons = [...new Set(rec.reasons)];
      rec.confidence = Math.min(rec.score / 80, 1);
    });
    
    return Array.from(hybridScores.values()).sort((a, b) => b.score - a.score);
  }
}

export async function GET(request: Request) {
  try {
    await connectToMongoDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const algorithm = searchParams.get('algorithm') || 'hybrid';
    const userId = searchParams.get('userId') || 'user1'; // Default user for demo
    
    // Get user from token (optional)
    let authenticatedUser = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        authenticatedUser = decoded;
      } catch (error) {
        console.log('Invalid token for recommendations');
      }
    }
    
    // Fetch articles from the main research API to ensure consistent IDs
    const requestUrl = new URL(request.url);
    const apiUrl = `${requestUrl.origin}/api/research?limit=50`;
    
    console.log('🔍 Fetching articles from main research API:', apiUrl);
    const response = await fetch(apiUrl);
    const researchData = await response.json();
    
    if (!researchData.success || !researchData.data) {
      console.error('❌ Failed to fetch articles from main research API');
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch articles for recommendations'
      }, { status: 500 });
    }
    
    const realArticles = researchData.data;
    console.log(`📊 Found ${realArticles.length} articles for recommendations`);
    
    // Get user profile (in real implementation, fetch from database)
    const userProfile = mockUserProfiles.find(p => p.userId === userId) || mockUserProfiles[0];
    
    let recommendations: RecommendationScore[] = [];
    
    switch (algorithm) {
      case 'content-based':
        recommendations = RecommendationEngine.contentBasedRecommendations(userProfile, realArticles);
        break;
      case 'collaborative':
        recommendations = RecommendationEngine.collaborativeFiltering(userId, mockUserInteractions, realArticles);
        break;
      case 'trending':
        recommendations = RecommendationEngine.trendingRecommendations(userProfile, realArticles);
        break;
      case 'hybrid':
      default:
        recommendations = RecommendationEngine.hybridRecommendations(userId, userProfile, mockUserInteractions, realArticles);
        break;
    }
    
    // Get full article details for top recommendations
    const topRecommendations = recommendations.slice(0, limit);
    const articlesWithDetails = topRecommendations.map(rec => {
      const article = realArticles.find(a => a._id.toString() === rec.articleId);
      return {
        ...article,
        recommendationScore: rec.score,
        recommendationReasons: rec.reasons,
        confidence: rec.confidence,
        algorithmUsed: rec.algorithmUsed
      };
    }).filter(Boolean);
    
    return NextResponse.json({
      success: true,
      data: articlesWithDetails,
      meta: {
        total: recommendations.length,
        limit,
        algorithm,
        userId,
        userAuthenticated: !!authenticatedUser,
        generated: new Date().toISOString(),
        averageConfidence: recommendations.length > 0 ? 
          recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length : 0
      }
    });
    
  } catch (error) {
    console.error('Recommendations API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 