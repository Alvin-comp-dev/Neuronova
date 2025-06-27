import { Request, Response, NextFunction } from 'express';
import Discussion, { IDiscussion } from '../models/Community';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// @desc    Get all discussions with filtering and pagination
// @route   GET /api/community/discussions
// @access  Public
export const getDiscussions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      category = '',
      type = '',
      status = 'open',
      sortBy = 'recent',
      featured = false,
      pinned = false,
    } = req.query;

    const filters: any = {};

    // Filter by category
    if (category && typeof category === 'string') {
      filters.category = category;
    }

    // Filter by type
    if (type && typeof type === 'string') {
      filters.type = type;
    }

    // Filter by status
    if (status !== 'all') {
      filters.status = status;
    }

    // Filter featured discussions
    if (featured === 'true') {
      filters.isFeatured = true;
    }

    // Filter pinned discussions
    if (pinned === 'true') {
      filters.isPinned = true;
    }

    // Sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { likes: -1, views: -1, createdAt: -1 };
        break;
      case 'views':
        sortOptions = { views: -1, createdAt: -1 };
        break;
      case 'replies':
        sortOptions = { replies: -1, createdAt: -1 };
        break;
      case 'unanswered':
        filters.type = 'question';
        filters.acceptedAnswer = { $exists: false };
        sortOptions = { createdAt: -1 };
        break;
      default: // 'recent'
        sortOptions = { isPinned: -1, createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [discussions, total] = await Promise.all([
      Discussion.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('author._id', 'name avatar')
        .populate('relatedResearch', 'title authors')
        .lean(),
      Discussion.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: discussions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        category: category || null,
        type: type || null,
        status,
        sortBy,
        featured,
        pinned,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search discussions
// @route   GET /api/community/discussions/search
// @access  Public
export const searchDiscussions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      q: query,
      page = 1,
      limit = 20,
      category = '',
      type = '',
      status = 'open',
      sortBy = 'relevance',
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
      categories: category ? [category as string] : [],
      types: type ? [type as string] : [],
      status: status as string,
      sortBy: sortBy as string,
      limit: limitNum,
      skip,
    };

    // Use find with $text search instead of non-existent search method
    const searchQuery = {
      $text: { $search: query.trim() },
      ...(searchOptions.categories?.length > 0 && { category: { $in: searchOptions.categories } }),
      ...(searchOptions.types?.length > 0 && { type: { $in: searchOptions.types } }),
      ...(searchOptions.status !== 'all' && { status: searchOptions.status }),
    };
    
    const discussions = await Discussion.find(searchQuery)
      .populate('author._id', 'name avatar expertise verified')
      .sort({ createdAt: -1 })
      .limit(searchOptions.limit || 10)
      .skip(searchOptions.skip || 0);
      
    const total = await Discussion.countDocuments(searchQuery);
    
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: discussions,
      query: query.trim(),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        category: category || null,
        type: type || null,
        status,
        sortBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single discussion
// @route   GET /api/community/discussions/:id
// @access  Public
export const getDiscussion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author._id', 'name avatar email')
      .populate('replies.author._id', 'name avatar email')
      .populate('relatedResearch', 'title authors publicationDate citationCount')
      .lean();

    if (!discussion) {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }

    // Increment view count
    await Discussion.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }
    next(error);
  }
};

// @desc    Create new discussion
// @route   POST /api/community/discussions
// @access  Private
export const createDiscussion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const discussionData = {
      ...req.body,
      author: {
        _id: req.user!._id,
        name: req.user!.name,
        avatar: req.user!.avatar,
        expertise: (req.user! as any).expertise || [],
        verified: req.user!.isVerified || false,
      },
    };

    const discussion = await Discussion.create(discussionData);

    res.status(201).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update discussion
// @route   PUT /api/community/discussions/:id
// @access  Private (Author or Admin)
export const updateDiscussion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }

    // Check if user is author or admin
    if ((discussion.author._id as any).toString() !== (req.user!._id as any).toString() && req.user!.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this discussion',
      });
    return;
    }

    discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply to discussion
// @route   POST /api/community/discussions/:id/reply
// @access  Private
export const addReply = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }

    const reply: IDiscussion['replies'][0] = {
      _id: new mongoose.Types.ObjectId(),
      content: req.body.content,
      author: {
        _id: req.user!._id as mongoose.Types.ObjectId,
        name: req.user!.name,
        avatar: req.user!.avatar,
        expertise: (req.user! as any).expertise || [],
        verified: req.user!.isVerified || false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      likedBy: [],
      isAcceptedAnswer: false,
    };

    discussion.replies.push(reply);
    await discussion.save();

    res.status(201).json({
      success: true,
      data: reply,
      message: 'Reply added successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like discussion
// @route   POST /api/community/discussions/:id/like
// @access  Private
export const likeDiscussion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }

    const userId = req.user!._id as mongoose.Types.ObjectId;
    const isLiked = discussion.likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      discussion.likedBy = discussion.likedBy.filter(id => id.toString() !== (userId as any).toString());
      discussion.likes = Math.max(0, discussion.likes - 1);
    } else {
      // Like
      discussion.likedBy.push(userId);
      discussion.likes += 1;
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      data: {
        liked: !isLiked,
        likes: discussion.likes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark discussion
// @route   POST /api/community/discussions/:id/bookmark
// @access  Private
export const bookmarkDiscussion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }

    const userId = req.user!._id as mongoose.Types.ObjectId;
    const isBookmarked = discussion.bookmarkedBy.includes(userId);

    if (isBookmarked) {
      // Remove bookmark
      discussion.bookmarkedBy = discussion.bookmarkedBy.filter(id => id.toString() !== (userId as any).toString());
      discussion.bookmarks = Math.max(0, discussion.bookmarks - 1);
    } else {
      // Add bookmark
      discussion.bookmarkedBy.push(userId);
      discussion.bookmarks += 1;
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      data: {
        bookmarked: !isBookmarked,
        bookmarks: discussion.bookmarks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept answer for question
// @route   POST /api/community/discussions/:id/accept/:replyId
// @access  Private (Author only)
export const acceptAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      res.status(404).json({
        success: false,
        error: 'Discussion not found',
      });
    return;
    }

    // Check if user is the author
    if ((discussion.author._id as any).toString() !== (req.user!._id as any).toString()) {
      res.status(403).json({
        success: false,
        error: 'Only the question author can accept answers',
      });
    return;
    }

    // Check if it's a question
    if (discussion.type !== 'question') {
      res.status(400).json({
        success: false,
        error: 'Can only accept answers for questions',
      });
    return;
    }

    const replyId = req.params.replyId;
    const reply = discussion.replies.find(r => r._id.toString() === replyId);

    if (!reply) {
      res.status(404).json({
        success: false,
        error: 'Reply not found',
      });
    return;
    }

    // Remove previous accepted answer
    discussion.replies.forEach(r => {
      r.isAcceptedAnswer = false;
    });

    // Set new accepted answer
    reply.isAcceptedAnswer = true;
    discussion.acceptedAnswer = reply._id;
    discussion.status = 'solved';

    await discussion.save();

    res.status(200).json({
      success: true,
      message: 'Answer accepted successfully',
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get community statistics
// @route   GET /api/community/stats
// @access  Public
export const getCommunityStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalDiscussions,
      totalQuestions,
      solvedQuestions,
      totalReplies,
      activeUsers,
      recentActivity,
    ] = await Promise.all([
      Discussion.countDocuments(),
      Discussion.countDocuments({ type: 'question' }),
      Discussion.countDocuments({ type: 'question', status: 'solved' }),
      Discussion.aggregate([
        { $project: { replyCount: { $size: '$replies' } } },
        { $group: { _id: null, total: { $sum: '$replyCount' } } },
      ]),
      Discussion.distinct('author._id').then(ids => ids.length),
      Discussion.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDiscussions,
        totalQuestions,
        solvedQuestions,
        totalReplies: totalReplies[0]?.total || 0,
        activeUsers,
        recentActivity,
        solveRate: totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
}; 