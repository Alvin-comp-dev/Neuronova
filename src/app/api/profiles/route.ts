import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Import models
import UserProfile from '../../../../server/models/UserProfile';
import User from '../../../../server/models/User';

// Database connection
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova');
      console.log('✅ Connected to MongoDB for profiles API');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
}

// Authentication middleware
function authenticateUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET /api/profiles - Get user profiles (public profiles or search)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const expertise = searchParams.get('expertise');
    const verified = searchParams.get('verified') === 'true';

    let query: any = {};

    // Get specific user profile
    if (userId) {
      const profile = await UserProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('userId', 'name email createdAt')
        .lean();

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        );
      }

      // Check privacy settings
      const requestingUserId = authenticateUser(request);
      if (profile.profileVisibility === 'private' && requestingUserId !== userId) {
        return NextResponse.json(
          { success: false, error: 'Profile is private' },
          { status: 403 }
        );
      }

      if (profile.profileVisibility === 'followers' && requestingUserId !== userId) {
        // Check if requesting user is a follower
        if (!profile.followers.includes(new mongoose.Types.ObjectId(requestingUserId))) {
          return NextResponse.json(
            { success: false, error: 'Profile is restricted to followers' },
            { status: 403 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: profile
      });
    }

    // Search profiles
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { 'researchInterests.field': { $regex: search, $options: 'i' } },
        { expertiseAreas: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by expertise area
    if (expertise) {
      query.expertiseAreas = { $in: [expertise] };
    }

    // Filter by verification status
    if (verified) {
      query.isVerifiedExpert = true;
    }

    // Only show public profiles in search results
    query.profileVisibility = 'public';

    const profiles = await UserProfile.find(query)
      .populate('userId', 'name email')
      .sort({ reputationScore: -1, 'activityStats.lastActiveDate': -1 })
      .limit(limit)
      .lean();

    console.log(`📊 Found ${profiles.length} profiles`);

    return NextResponse.json({
      success: true,
      data: profiles
    });

  } catch (error) {
    console.error('❌ Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

// POST /api/profiles - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = authenticateUser(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      displayName,
      bio,
      location,
      website,
      currentInstitution,
      position,
      academicDegrees,
      researchInterests,
      publications,
      orcidId,
      googleScholarUrl,
      researchGateUrl,
      profileVisibility,
      emailNotifications
    } = body;

    // Validate required fields
    if (displayName && displayName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Display name cannot be empty' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Bio cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (displayName !== undefined) updateData.displayName = displayName.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (currentInstitution !== undefined) updateData.currentInstitution = currentInstitution;
    if (position !== undefined) updateData.position = position;
    if (academicDegrees !== undefined) updateData.academicDegrees = academicDegrees;
    if (researchInterests !== undefined) updateData.researchInterests = researchInterests;
    if (publications !== undefined) updateData.publications = publications;
    if (orcidId !== undefined) updateData.orcidId = orcidId;
    if (googleScholarUrl !== undefined) updateData.googleScholarUrl = googleScholarUrl;
    if (researchGateUrl !== undefined) updateData.researchGateUrl = researchGateUrl;
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;

    // Create or update profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { upsert: true, new: true, runValidators: true }
    ).populate('userId', 'name email');

    console.log(`✅ Updated profile for user: ${userId}`);

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 