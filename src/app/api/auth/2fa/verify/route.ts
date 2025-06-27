import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import speakeasy from 'speakeasy';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    
    if (!user?.security?.twoFactorSecret) {
      return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.security.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow some time drift
    });

    if (verified) {
      // Enable 2FA for the user
      await User.findByIdAndUpdate(session.user.id, {
        $set: {
          'security.twoFactorEnabled': true,
        }
      });

      return NextResponse.json({
        success: true,
        message: '2FA enabled successfully',
        backupCodes: user.security.twoFactorBackupCodes,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify 2FA' },
      { status: 500 }
    );
  }
}
