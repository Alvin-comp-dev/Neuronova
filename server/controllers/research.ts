import { Request, Response, NextFunction } from 'express';
import Research, { IResearch } from '../models/Research';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all research articles with filtering and pagination
// @route   GET /api/research
// @access  Public
export const getResearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      categories = '',
      sources = '',
      sortBy = 'date',
      status = 'published',
      dateFrom,
      dateTo,
    } = req.query;

    const filters: any = { status };

    // Filter by categories
    if (categories && typeof categories === 'string') {
      const categoryArray = categories.split(',').filter((cat: string) => cat.trim());
      if (categoryArray.length > 0) {
        filters.categories = { $in: categoryArray };
      }
    }

    // Filter by source types
    if (sources && typeof sources === 'string') {
      const sourceArray = sources.split(',').filter(src => src.trim());
      if (sourceArray.length > 0) {
        filters['source.type'] = { $in: sourceArray };
      }
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      filters.publicationDate = {};
      if (dateFrom) filters.publicationDate.$gte = new Date(dateFrom as string);
      if (dateTo) filters.publicationDate.$lte = new Date(dateTo as string);
    }

    // Sort options
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
      case 'title':
        sortOptions = { title: 1 };
        break;
      default: // 'date'
        sortOptions = { publicationDate: -1 };
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Research.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Research.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // Format articles for frontend compatibility
    const formattedArticles = articles.map(article => ({
      ...article,
      _id: article._id.toString(),
      publicationDate: article.publicationDate.toISOString(),
      likeCount: Math.floor(Math.random() * 100), // Temporary until we implement likes
      shareCount: Math.floor(Math.random() * 50)  // Temporary until we implement shares
    }));

    res.status(200).json({
      success: true,
      data: formattedArticles,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        categories: categories || null,
        sources: sources || null,
        sortBy,
        status,
        dateRange: { from: dateFrom || null, to: dateTo || null },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get research statistics
// @route   GET /api/research/stats
// @access  Public
export const getResearchStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalArticles,
      publishedArticles,
      categoriesCount,
      recentArticles
    ] = await Promise.all([
      Research.countDocuments(),
      Research.countDocuments({ status: 'published' }),
      Research.distinct('categories').then(cats => cats.length),
      Research.countDocuments({ 
        publicationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        categoriesCount,
        recentArticles
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search research articles
// @route   GET /api/research/search
// @access  Public
export const searchResearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      q: query,
      page = 1,
      limit = 20,
      categories = '',
      sources = '',
      sortBy = 'relevance',
      dateFrom,
      dateTo,
    } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
      return;
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const searchOptions = {
      categories: categories ? (categories as string).split(',').filter(c => c.trim()) : [],
      sources: sources ? (sources as string).split(',').filter(s => s.trim()) : [],
      dateRange: {
        from: dateFrom as string,
        to: dateTo as string,
      },
      sortBy: sortBy as string,
      limit: limitNum,
      skip,
    };

    // Build search filters
    const searchFilters: any = {
      $text: { $search: query.trim() },
      status: 'published'
    };

    // Add category filter
    if (searchOptions.categories.length > 0) {
      searchFilters.categories = { $in: searchOptions.categories };
    }

    // Add source filter
    if (searchOptions.sources.length > 0) {
      searchFilters['source.type'] = { $in: searchOptions.sources };
    }

    // Add date range filter
    if (searchOptions.dateRange.from || searchOptions.dateRange.to) {
      searchFilters.publicationDate = {};
      if (searchOptions.dateRange.from) {
        searchFilters.publicationDate.$gte = new Date(searchOptions.dateRange.from);
      }
      if (searchOptions.dateRange.to) {
        searchFilters.publicationDate.$lte = new Date(searchOptions.dateRange.to);
      }
    }

    // Sort options
    let sortOptions: any = { score: { $meta: 'textScore' } };
    if (sortBy === 'date') {
      sortOptions = { publicationDate: -1 };
    } else if (sortBy === 'citations') {
      sortOptions = { citationCount: -1 };
    } else if (sortBy === 'trending') {
      sortOptions = { trendingScore: -1 };
    }

    const [articles, total] = await Promise.all([
      Research.find(searchFilters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Research.countDocuments(searchFilters),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // Format articles for frontend compatibility
    const formattedArticles = articles.map(article => ({
      ...article,
      _id: article._id.toString(),
      publicationDate: article.publicationDate.toISOString(),
      likeCount: Math.floor(Math.random() * 100),
      shareCount: Math.floor(Math.random() * 50)
    }));

    res.status(200).json({
      success: true,
      data: formattedArticles,
      query: query.trim(),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        categories: searchOptions.categories,
        sources: searchOptions.sources,
        dateRange: searchOptions.dateRange,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending research articles
// @route   GET /api/research/trending
// @access  Public
export const getTrendingResearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 20, categories = '' } = req.query;
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));

    let filters: any = { status: 'published' };

    // Filter by categories if provided
    if (categories && typeof categories === 'string') {
      const categoryArray = categories.split(',').filter((cat: string) => cat.trim());
      if (categoryArray.length > 0) {
        filters.categories = { $in: categoryArray };
      }
    }

    const articles = await Research.find(filters)
      .sort({ trendingScore: -1, publicationDate: -1 })
      .limit(limitNum)
      .lean();

    // Format articles for frontend compatibility
    const formattedArticles = articles.map(article => ({
      ...article,
      _id: article._id.toString(),
      publicationDate: article.publicationDate.toISOString(),
      likeCount: Math.floor(Math.random() * 100),
      shareCount: Math.floor(Math.random() * 50)
    }));

    res.status(200).json({
      success: true,
      data: formattedArticles,
      count: formattedArticles.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get research categories
// @route   GET /api/research/categories
// @access  Public
export const getResearchCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Research.distinct('categories');
    
    res.status(200).json({
      success: true,
      data: categories.sort(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single research article
// @route   GET /api/research/:id
// @access  Public
export const getResearchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const article = await Research.findById(id).lean();

    if (!article) {
      res.status(404).json({
        success: false,
        error: 'Research article not found',
      });
      return;
    }

    // Increment view count
    await Research.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    // Format article for frontend compatibility
    const formattedArticle = {
      ...article,
      _id: article._id.toString(),
      publicationDate: article.publicationDate.toISOString(),
      likeCount: Math.floor(Math.random() * 100),
      shareCount: Math.floor(Math.random() * 50)
    };

    res.status(200).json({
      success: true,
      data: formattedArticle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark research article
// @route   POST /api/research/:id/bookmark
// @access  Private
export const bookmarkResearch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const article = await Research.findById(id);
    if (!article) {
      res.status(404).json({
        success: false,
        error: 'Research article not found',
      });
      return;
    }

    // For now, just return success - we'll implement user bookmarks later
    res.status(200).json({
      success: true,
      message: 'Article bookmarked successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create research article (Admin only)
// @route   POST /api/research
// @access  Private/Admin
export const createResearch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const researchData = req.body;

    const research = await Research.create(researchData);

    res.status(201).json({
      success: true,
      data: research,
    });
  } catch (error) {
    next(error);
  }
};