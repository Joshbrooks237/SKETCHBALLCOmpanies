import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateSecret, generateQRCode } from '@/lib/totp';
import { getUserByEmail, updateUserTotp } from '@/lib/db';
import type { User } from '@/types';

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = getUserByEmail.get(session.user.email) as User | undefined;
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.totp_enabled) {
      return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
    }

    // Generate new secret
    const secret = generateSecret();
    const qrCode = await generateQRCode(session.user.email, secret);

    // Store secret temporarily (not enabled yet)
    updateUserTotp.run(secret, 0, user.id);

    return NextResponse.json({ qrCode, secret });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 });
  }
}

