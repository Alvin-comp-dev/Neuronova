import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { UserModel } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please provide an email address' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to database
    await UserModel.setResetToken(email, resetToken, resetTokenExpiry);

    // In a real application, you would send an email here
    // For now, we'll return the token for testing purposes
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Remove this in production - only for testing
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Handle MongoDB connection errors gracefully
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 