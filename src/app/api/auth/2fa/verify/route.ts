import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { verifyToken } from '@/lib/totp';
import { getUserByEmail, updateUserTotp } from '@/lib/db';
import type { User } from '@/types';

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const user = getUserByEmail.get(session.user.email) as User | undefined;
    
    if (!user || !user.totp_secret) {
      return NextResponse.json({ error: 'No 2FA setup found' }, { status: 400 });
    }

    const isValid = verifyToken(user.totp_secret, token);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Enable 2FA
    updateUserTotp.run(user.totp_secret, 1, user.id);

    return NextResponse.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return NextResponse.json({ error: 'Failed to verify 2FA' }, { status: 500 });
  }
}

