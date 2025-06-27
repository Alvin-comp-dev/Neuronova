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
        .populate('relatedArticles', 'title authors publicationDate')
        .lean(),
      Research.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: articles,
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

    const [articles, totalQuery] = await Promise.all([
      Research.search(query.trim(), searchOptions),
      Research.search(query.trim(), { ...searchOptions, limit: 0, skip: 0 }),
    ]);

    const total = await totalQuery.countDocuments();
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: articles,
      query: query.trim(),
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
        dateRange: { from: dateFrom || null, to: dateTo || null },
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

    let query = Research.find({ status: 'published' });

    // Filter by categories if provided
    if (categories && typeof categories === 'string') {
      const categoryArray = categories.split(',').filter((cat: string) => cat.trim());
      if (categoryArray.length > 0) {
        query = query.where('categories').in(categoryArray);
      }
    }

    const articles = await query
      .sort({ trendingScore: -1, publicationDate: -1 })
      .limit(limitNum)
      .populate('relatedArticles', 'title authors publicationDate')
      .lean();

    res.status(200).json({
      success: true,
      data: articles,
      count: articles.length,
      filters: {
        categories: categories || null,
      },
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
    const article = await Research.findById(req.params.id)
      .populate('relatedArticles', 'title authors publicationDate categories citationCount')
      .lean();

    if (!article) {
      res.status(404).json({
        success: false,
        error: 'Research article not found',
      });
      return;
    }

    // Increment view count
    await Research.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(404).json({
        success: false,
        error: 'Research article not found',
      });
      return;
    }
    next(error);
  }
};

// @desc    Get research categories
// @route   GET /api/research/categories
// @access  Public
export const getResearchCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Research.distinct('categories');
    
    // Get category counts
    const categoryCounts = await Research.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoriesWithCounts = categoryCounts.map((cat: { _id: string; count: number }) => ({
      name: cat._id,
      count: cat.count,
    }));

    res.status(200).json({
      success: true,
      data: categoriesWithCounts,
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
      preprintArticles,
      totalCitations,
      categoriesCount,
      recentArticles,
    ] = await Promise.all([
      Research.countDocuments(),
      Research.countDocuments({ status: 'published' }),
      Research.countDocuments({ status: 'preprint' }),
      Research.aggregate([
        { $group: { _id: null, total: { $sum: '$citationCount' } } },
      ]),
      Research.distinct('categories').then((cats: string[]) => cats.length),
      Research.countDocuments({
        publicationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        preprintArticles,
        totalCitations: totalCitations[0]?.total || 0,
        categoriesCount,
        recentArticles,
        lastUpdated: new Date(),
      },
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
    const article = await Research.findById(req.params.id);

    if (!article) {
      res.status(404).json({
        success: false,
        error: 'Research article not found',
      });
      return;
    }

    // This would typically involve updating user's bookmarks
    // For now, just increment the bookmark count
    article.bookmarkCount += 1;
    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article bookmarked successfully',
      data: {
        id: article._id,
        bookmarkCount: article.bookmarkCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new research article (Admin only)
// @route   POST /api/research
// @access  Private/Admin
export const createResearch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const researchData = {
      ...req.body,
      submittedDate: new Date(),
    };

    const article = await Research.create(researchData);

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
}; 