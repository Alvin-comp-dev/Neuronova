import { Request, Response, NextFunction } from 'express';
import Expert, { IExpert } from '../models/Expert';
import { AuthRequest } from '../middleware/auth';
import mongoose, { Types } from 'mongoose';

// @desc    Get all experts with filtering and pagination
// @route   GET /api/experts
// @access  Public
export const getExperts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      expertise = '',
      institution = '',
      verified = 'true',
      availability = '',
      sortBy = 'reputation',
    } = req.query;

    const filters: any = {
      'preferences.publicProfile': true,
    };

    // Filter by expertise
    if (expertise && typeof expertise === 'string') {
      filters['expertise.primary'] = expertise;
    }

    // Filter by institution
    if (institution && typeof institution === 'string') {
      filters['affiliations.current.institution'] = { $regex: institution, $options: 'i' };
    }

    // Filter by verification status
    if (verified === 'true') {
      filters.isVerified = true;
    }

    // Filter by availability
    if (availability && typeof availability === 'string') {
      const availTypes = availability.split(',');
      availTypes.forEach(type => {
        if (['mentoring', 'collaboration', 'speaking', 'consulting', 'reviewing'].includes(type)) {
          filters[`availability.${type}`] = true;
        }
      });
    }

    // Sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'citations':
        sortOptions = { 'research.citationCount': -1 };
        break;
      case 'followers':
        sortOptions = { 'engagement.followers': -1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'alphabetical':
        sortOptions = { 'user.name': 1 };
        break;
      default: // 'reputation'
        sortOptions = { 'engagement.reputation': -1 };
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [experts, total] = await Promise.all([
      Expert.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email avatar createdAt')
        .populate('research.publications', 'title publicationDate citationCount')
        .lean(),
      Expert.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: experts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        expertise: expertise || null,
        institution: institution || null,
        verified: verified === 'true',
        availability: availability || null,
        sortBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search experts
// @route   GET /api/experts/search
// @access  Public
export const searchExperts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      q: query,
      page = 1,
      limit = 20,
      expertise = '',
      verified = 'true',
      availability = '',
      sortBy = 'reputation',
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

    // Build search filters
    const searchFilters: any = {
      'preferences.publicProfile': true,
    };

    if (verified === 'true') {
      searchFilters.isVerified = true;
    }

    if (expertise && typeof expertise === 'string') {
      searchFilters['expertise.primary'] = expertise;
    }

    if (availability && typeof availability === 'string') {
      const availTypes = availability.split(',');
      availTypes.forEach(type => {
        if (['mentoring', 'collaboration', 'speaking', 'consulting', 'reviewing'].includes(type)) {
          searchFilters[`availability.${type}`] = true;
        }
      });
    }

    // Text search across multiple fields
    const searchRegex = new RegExp(query.trim(), 'i');
    const textSearchFilter = {
      $or: [
        { 'expertise.keywords': searchRegex },
        { 'expertise.primary': searchRegex },
        { 'expertise.secondary': searchRegex },
        { 'affiliations.current.institution': searchRegex },
        { 'affiliations.current.position': searchRegex },
        { 'research.areas': searchRegex },
      ],
    };

    const combinedFilter = {
      $and: [searchFilters, textSearchFilter],
    };

    // Sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case 'citations':
        sortOptions = { 'research.citationCount': -1 };
        break;
      case 'followers':
        sortOptions = { 'engagement.followers': -1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      default: // 'reputation'
        sortOptions = { 'engagement.reputation': -1 };
    }

    const skip = (pageNum - 1) * limitNum;

    const [experts, total] = await Promise.all([
      Expert.find(combinedFilter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email avatar')
        .populate('research.publications', 'title publicationDate citationCount')
        .lean(),
      Expert.countDocuments(combinedFilter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: experts,
      query: query.trim(),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        expertise: expertise || null,
        verified: verified === 'true',
        availability: availability || null,
        sortBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expert profile
// @route   GET /api/experts/:id
// @access  Public
export const getExpert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expert = await Expert.findById(req.params.id)
      .populate('user', 'name email avatar createdAt')
      .populate('research.publications', 'title abstract authors publicationDate citationCount journal doi')
      .populate('engagement.followers', 'name avatar')
      .populate('engagement.following', 'name avatar')
      .lean();

    if (!expert) {
      res.status(404).json({
        success: false,
        error: 'Expert not found',
      });
    return;
    }

    // Check if profile is public
    if (!expert.preferences.publicProfile) {
      res.status(403).json({
        success: false,
        error: 'This profile is private',
      });
    return;
    }

    // Increment profile view count
    await Expert.findByIdAndUpdate(req.params.id, { 
      $inc: { 
        'stats.profileViews': 1,
        'stats.monthlyViews': 1,
        'stats.yearlyViews': 1,
      }
    });

    res.status(200).json({
      success: true,
      data: expert,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      res.status(404).json({
        success: false,
        error: 'Expert not found',
      });
      return;
    }
    next(error);
  }
};

// @desc    Get current user's expert profile
// @route   GET /api/experts/me
// @access  Private
export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expert = await Expert.findOne({ user: req.user!._id })
      .populate('user', 'name email avatar createdAt')
      .populate('research.publications', 'title abstract authors publicationDate citationCount journal doi')
      .populate('engagement.followers', 'name avatar')
      .populate('engagement.following', 'name avatar');

    if (!expert) {
      res.status(404).json({
        success: false,
        error: 'Expert profile not found. Please create your profile first.',
      });
    return;
    }

    res.status(200).json({
      success: true,
      data: expert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update expert profile
// @route   POST /api/experts/profile
// @access  Private
export const createOrUpdateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;

    let expert = await Expert.findOne({ user: userId });

    const profileData = {
      ...req.body,
      user: userId,
    };

    if (expert) {
      // Update existing profile
      expert = await Expert.findOneAndUpdate(
        { user: userId },
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      expert = await Expert.create(profileData);
    }

    await expert?.populate('user', 'name email avatar');

    res.status(200).json({
      success: true,
      data: expert,
      message: expert ? 'Profile updated successfully' : 'Profile created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add insight to expert profile
// @route   POST /api/experts/insights
// @access  Private
export const addInsight = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        error: 'User ID not found'
      });
      return;
    }

    const expert = await Expert.findOne({ user: req.user._id });

    if (!expert) {
      res.status(404).json({
        success: false,
        error: 'Expert profile not found',
      });
      return;
    }

    const insight = {
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      content: req.body.content,
      type: req.body.type || 'insight',
      category: req.body.category,
      tags: req.body.tags || [],
      likes: 0,
      views: 0,
      createdAt: new Date(),
    };

    expert.insights = expert.insights || [];
    expert.insights.unshift(insight);
    await expert.save();

    res.status(201).json({
      success: true,
      data: insight,
      message: 'Insight added successfully',
    });
  } catch (error) {
    next(error);
  }
};

interface ExpertEngagement {
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

// @desc    Follow/unfollow expert
// @route   POST /api/experts/:id/follow
// @access  Private
export const followExpert = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        error: 'User ID not found'
      });
      return;
    }

    const userId = new Types.ObjectId(req.user?.id || req.user?._id);
    const expertId = new Types.ObjectId(req.params.id);

    const expertToFollow = await Expert.findById(expertId);
    const currentUserExpert = await Expert.findOne({ user: userId });

    if (!expertToFollow) {
      res.status(404).json({
        success: false,
        error: 'Expert not found'
      });
      return;
    }

    if (!currentUserExpert) {
      res.status(404).json({
        success: false,
        error: 'Your expert profile not found. Please create your profile first.'
      });
      return;
    }

    // Initialize engagement if not exists
    expertToFollow.engagement = expertToFollow.engagement || { followers: [], following: [] };
    currentUserExpert.engagement = currentUserExpert.engagement || { followers: [], following: [] };

    const isFollowing = expertToFollow.engagement.followers.some(
      id => id.toString() === userId.toString()
    );

    if (isFollowing) {
      // Unfollow
      expertToFollow.engagement.followers = expertToFollow.engagement.followers.filter(
        id => id.toString() !== userId.toString()
      );
      currentUserExpert.engagement.following = currentUserExpert.engagement.following.filter(
        id => id.toString() !== expertId.toString()
      );
    } else {
      // Follow
      expertToFollow.engagement.followers.push(userId);
      currentUserExpert.engagement.following.push(expertId);
    }

    await Promise.all([
      expertToFollow.save(),
      currentUserExpert.save(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        following: !isFollowing,
        followersCount: expertToFollow.engagement.followers.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top experts by expertise
// @route   GET /api/experts/top/:expertise
// @access  Public
export const getTopExpertsByExpertise = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { expertise } = req.params;
    const { limit = 10 } = req.query;

    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));

    // Use regular find instead of findByExpertise method
    const experts = await Expert.find({ 'expertise.areas': expertise })
      .limit(limitNum)
      .populate('user', 'name avatar')
      .lean();

    res.status(200).json({
      success: true,
      data: experts,
      expertise,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expert statistics
// @route   GET /api/experts/stats
// @access  Public
export const getExpertStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalExperts,
      verifiedExperts,
      totalPublications,
      totalCitations,
      expertsByExpertise,
      topInstitutions,
    ] = await Promise.all([
      Expert.countDocuments({ 'preferences.publicProfile': true }),
      Expert.countDocuments({ isVerified: true, 'preferences.publicProfile': true }),
      Expert.aggregate([
        { $project: { publicationCount: { $size: '$research.publications' } } },
        { $group: { _id: null, total: { $sum: '$publicationCount' } } },
      ]),
      Expert.aggregate([
        { $group: { _id: null, total: { $sum: '$research.citationCount' } } },
      ]),
      Expert.aggregate([
        { $unwind: '$expertise.primary' },
        { $group: { _id: '$expertise.primary', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Expert.aggregate([
        { $unwind: '$affiliations.current' },
        { $group: { _id: '$affiliations.current.institution', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalExperts,
        verifiedExperts,
        totalPublications: totalPublications[0]?.total || 0,
        totalCitations: totalCitations[0]?.total || 0,
        expertsByExpertise,
        topInstitutions,
        verificationRate: totalExperts > 0 ? Math.round((verifiedExperts / totalExperts) * 100) : 0,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
}; 