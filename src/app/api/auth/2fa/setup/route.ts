import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized or invalid session' }, { status: 401 });
    }

    await connectToDatabase();

    // Generate a secret for the user
    const secret = speakeasy.generateSecret({
      name: `Neuronova (${session.user.email})`,
      issuer: 'Neuronova Research Platform',
      length: 32,
    });

    if (!secret?.otpauth_url) {
      throw new Error('Failed to generate 2FA secret');
    }

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store the secret temporarily (not enabled yet)
    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        'security.twoFactorSecret': secret.base32,
        'security.twoFactorEnabled': false,
        'security.twoFactorBackupCodes': generateBackupCodes(),
      }
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeUrl,
      secret: secret.base32,
      manualEntryKey: secret.base32,
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
}
