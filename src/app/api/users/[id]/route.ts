import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { z } from 'zod';

const client = new MongoClient(process.env.MONGODB_URI!);

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  institution: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
  academicLevel: z.enum(['undergraduate', 'graduate', 'postdoc', 'professor', 'researcher', 'other']).optional(),
  orcid: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  googleScholar: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
});

const settingsUpdateSchema = z.object({
  emailNotifications: z.boolean().optional(),
  profileVisibility: z.enum(['public', 'private', 'researchers-only']).optional(),
  newsletterSubscribed: z.boolean().optional(),
  researchAlerts: z.boolean().optional(),
  discussionNotifications: z.boolean().optional(),
  followNotifications: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = params.id;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await client.connect();
    const users = client.db().collection('users');

    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0,
          verificationToken: 0,
          ...(session?.user?.id !== userId && { 
            email: 0,
            settings: 0,
          })
        }
      }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check privacy settings
    if (user.settings?.profileVisibility === 'private' && session?.user?.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Profile is private' },
        { status: 403 }
      );
    }

    if (user.settings?.profileVisibility === 'researchers-only' && 
        session?.user?.id !== userId && 
        !session?.user?.verified) {
      return NextResponse.json(
        { success: false, error: 'Profile is only visible to verified researchers' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: session?.user?.id === userId ? user.email : undefined,
        image: user.image || user.profile?.profileImage,
        verified: user.verified,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        achievements: user.achievements,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        settings: session?.user?.id === userId ? user.settings : undefined,
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = params.id;

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to update this profile' },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { profile, settings, ...otherFields } = body;

    const updateData: any = {};

    // Validate and update profile fields
    if (profile) {
      const validatedProfile = profileUpdateSchema.parse(profile);
      Object.keys(validatedProfile).forEach(key => {
        updateData[`profile.${key}`] = validatedProfile[key as keyof typeof validatedProfile];
      });
    }

    // Validate and update settings
    if (settings) {
      const validatedSettings = settingsUpdateSchema.parse(settings);
      Object.keys(validatedSettings).forEach(key => {
        updateData[`settings.${key}`] = validatedSettings[key as keyof typeof validatedSettings];
      });
    }

    // Update basic fields
    if (otherFields.name) {
      updateData.name = otherFields.name;
    }

    updateData.updatedAt = new Date();

    await client.connect();
    const users = client.db().collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch updated user
    const updatedUser = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0, verificationToken: 0 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser!._id.toString(),
        name: updatedUser!.name,
        email: updatedUser!.email,
        image: updatedUser!.image || updatedUser!.profile?.profileImage,
        verified: updatedUser!.verified,
        role: updatedUser!.role,
        profile: updatedUser!.profile,
        stats: updatedUser!.stats,
        achievements: updatedUser!.achievements,
        settings: updatedUser!.settings,
        updatedAt: updatedUser!.updatedAt,
      }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 