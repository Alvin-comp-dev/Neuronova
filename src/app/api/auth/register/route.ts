import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { z } from 'zod';

const client = new MongoClient(process.env.MONGODB_URI!);

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  institution: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
  academicLevel: z.enum(['undergraduate', 'graduate', 'postdoc', 'professor', 'researcher', 'other']).optional(),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    await client.connect();
    const users = client.db().collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create user with enhanced profile
    const newUser = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      provider: 'credentials',
      verified: false,
      role: 'user',
      createdAt: new Date(),
      lastLoginAt: null,
      profile: {
        bio: '',
        institution: validatedData.institution || '',
        researchInterests: validatedData.researchInterests || [],
        academicLevel: validatedData.academicLevel || '',
        orcid: '',
        website: '',
        twitter: '',
        linkedin: '',
        googleScholar: '',
        profileImage: '',
        coverImage: '',
        location: '',
        timezone: '',
      },
      settings: {
        emailNotifications: true,
        profileVisibility: 'public',
        twoFactorEnabled: false,
        newsletterSubscribed: true,
        researchAlerts: true,
        discussionNotifications: true,
        followNotifications: true,
        theme: 'system',
        language: 'en',
      },
      stats: {
        articlesViewed: 0,
        bookmarksCount: 0,
        discussionsStarted: 0,
        commentsPosted: 0,
        followersCount: 0,
        followingCount: 0,
        reputation: 0,
        joinedDate: new Date(),
      },
      achievements: [],
      verificationToken: generateVerificationToken(),
      agreedToTermsAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    // Send verification email (placeholder for now)
    // await sendVerificationEmail(validatedData.email, newUser.verificationToken);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      userId: result.insertedId,
      requiresVerification: true,
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Placeholder for email verification
async function sendVerificationEmail(email: string, token: string) {
  // TODO: Implement email sending logic
  console.log(`Verification email would be sent to ${email} with token ${token}`);
} 