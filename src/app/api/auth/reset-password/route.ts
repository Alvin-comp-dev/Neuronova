import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide token and new password' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user by reset token
    const user = await UserModel.findByResetToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    await UserModel.updatePassword(user._id!.toString(), password);

    // Generate new JWT token for automatic login
    const jwtToken = jwt.sign(
      { id: user._id!.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return success with new token
    const publicUser = UserModel.toPublicUser(user);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      token: jwtToken,
      user: publicUser,
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    // Handle MongoDB connection errors gracefully
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 